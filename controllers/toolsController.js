const fs = require('fs').promises;
const path = require('path');
const vm = require('vm');
const crypto = require('crypto');
const { execFile } = require('child_process');
const db = require('../models');
const { GameSession, ChatSession, AccessVisit } = db;
const { Op, QueryTypes } = require('sequelize');
const SETTINGS_FILE = path.join(__dirname, '../config/settings.json');
const UPLOAD_DIR = path.join(__dirname, '../public/uploads');
const PROJECT_ROOT = path.resolve(path.join(__dirname, '..'));
const DEVTOOL_REVISION_DIR = path.join(PROJECT_ROOT, '.devtool-revisions');
const DEVTOOL_AUDIT_FILE = path.join(PROJECT_ROOT, 'logs', 'devtool-audit.log');

const DEV_ALLOWED_EXTENSIONS = new Set([
  '.js', '.cjs', '.mjs', '.json', '.ejs', '.html', '.css', '.md', '.txt', '.yml', '.yaml'
]);

const DEV_BLOCKED_SEGMENTS = new Set([
  'node_modules', '.git', '.vscode', 'public/uploads'
]);

const IP_GEO_CACHE_MS = 6 * 60 * 60 * 1000;
const ipGeoCache = new Map();

function parseCsvEnv(value) {
  return String(value || '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

function getDevtoolAllowedConfig() {
  const usernames = parseCsvEnv(process.env.DEVTOOL_ALLOWED_USERNAMES).map((x) => x.toLowerCase());
  const ids = parseCsvEnv(process.env.DEVTOOL_ALLOWED_USER_IDS)
    .map((x) => Number.parseInt(x, 10))
    .filter((x) => Number.isFinite(x) && x > 0);
  return {
    usernames,
    ids
  };
}

function getActor(req) {
  const user = req.user || req.session?.user || {};
  return {
    id: Number(user.id || 0) || null,
    username: String(user.username || '').trim(),
    role: String(user.role || '').trim(),
    full_name: String(user.full_name || '').trim()
  };
}

function isDevtoolAllowedForActor(actor) {
  const cfg = getDevtoolAllowedConfig();
  const usernameLower = String(actor.username || '').toLowerCase();

  if (cfg.usernames.length > 0 && cfg.usernames.includes(usernameLower)) return true;
  if (cfg.ids.length > 0 && cfg.ids.includes(Number(actor.id || 0))) return true;

  // If no explicit allowlist is configured, allow all admin users by default.
  if (cfg.usernames.length === 0 && cfg.ids.length === 0) return true;

  return false;
}

function ensureDevtoolAccess(req) {
  const actor = getActor(req);
  if (!actor || actor.role !== 'admin') {
    const err = new Error('Chỉ admin mới được truy cập DevTool.');
    err.statusCode = 403;
    throw err;
  }
  if (!isDevtoolAllowedForActor(actor)) {
    const err = new Error('Tài khoản của bạn chưa được cấp quyền DevTool.');
    err.statusCode = 403;
    throw err;
  }
  return actor;
}

function hashContent(content) {
  return crypto.createHash('sha1').update(String(content || ''), 'utf8').digest('hex');
}

async function appendDevtoolAudit(entry) {
  try {
    const row = {
      at: new Date().toISOString(),
      ...entry
    };
    await fs.mkdir(path.dirname(DEVTOOL_AUDIT_FILE), { recursive: true });
    await fs.appendFile(DEVTOOL_AUDIT_FILE, `${JSON.stringify(row)}\n`, 'utf8');
  } catch (err) {
    // Audit is best-effort; never block core DevTool operations.
    console.warn('[DevTool] audit write failed:', err?.message || err);
  }
}

async function readAuditRows(limit = 120) {
  const maxRows = Math.max(1, Math.min(500, Number(limit) || 120));
  const content = await fs.readFile(DEVTOOL_AUDIT_FILE, 'utf8').catch(() => '');
  const lines = content.split('\n').map((x) => x.trim()).filter(Boolean);
  const parsed = lines.map((line) => {
    try { return JSON.parse(line); } catch (_) { return null; }
  }).filter(Boolean);
  return parsed.slice(-maxRows).reverse();
}

async function createRevisionBackup(relativePath, previousContent) {
  const ts = Date.now();
  const revisionRel = `${relativePath}.${ts}.bak`;
  const revisionAbs = path.join(DEVTOOL_REVISION_DIR, revisionRel);
  await fs.mkdir(path.dirname(revisionAbs), { recursive: true });
  await fs.writeFile(revisionAbs, String(previousContent || ''), 'utf8');
  return {
    revision_path: revisionRel.replace(/\\/g, '/'),
    created_at: new Date(ts).toISOString()
  };
}

async function listRevisionsForPath(relativePath, maxRows = 40) {
  const safeLimit = Math.max(1, Math.min(120, Number(maxRows) || 40));
  const dirRel = path.dirname(relativePath);
  const baseName = path.basename(relativePath);
  const revisionDir = path.join(DEVTOOL_REVISION_DIR, dirRel === '.' ? '' : dirRel);
  const entries = await fs.readdir(revisionDir, { withFileTypes: true }).catch(() => []);

  const revisions = [];
  for (const entry of entries) {
    if (!entry.isFile()) continue;
    if (!entry.name.startsWith(`${baseName}.`) || !entry.name.endsWith('.bak')) continue;
    const absPath = path.join(revisionDir, entry.name);
    const stat = await fs.stat(absPath).catch(() => null);
    if (!stat) continue;
    const relPath = path.relative(DEVTOOL_REVISION_DIR, absPath).replace(/\\/g, '/');
    revisions.push({
      revision_path: relPath,
      file_path: relativePath,
      size: stat.size,
      modified_at: stat.mtime
    });
  }

  revisions.sort((a, b) => new Date(b.modified_at) - new Date(a.modified_at));
  return revisions.slice(0, safeLimit);
}

function resolveRevisionPath(revisionRelativePath) {
  const rel = normalizeRelativeInput(revisionRelativePath);
  if (!rel) {
    const err = new Error('Thiếu đường dẫn phiên bản rollback.');
    err.statusCode = 400;
    throw err;
  }
  const abs = path.resolve(DEVTOOL_REVISION_DIR, rel);
  if (!abs.startsWith(DEVTOOL_REVISION_DIR)) {
    const err = new Error('Đường dẫn rollback không hợp lệ.');
    err.statusCode = 403;
    throw err;
  }
  return {
    revisionPath: rel,
    absolutePath: abs
  };
}

function normalizeRelativeInput(raw) {
  const input = String(raw || '').replace(/\\/g, '/').trim();
  const cleaned = input.replace(/^\/+/, '');
  if (!cleaned) return '';
  if (cleaned.includes('..')) return null;
  return cleaned;
}

function isBlockedRelativePath(rel) {
  const normalized = String(rel || '').replace(/\\/g, '/');
  for (const segment of DEV_BLOCKED_SEGMENTS) {
    if (normalized === segment || normalized.startsWith(`${segment}/`)) return true;
  }
  return false;
}

function resolveDevPath(raw, options = {}) {
  const { expectFile = false, expectDirectory = false } = options;
  const rel = normalizeRelativeInput(raw);
  if (rel === null) {
    const err = new Error('Đường dẫn không hợp lệ.');
    err.statusCode = 400;
    throw err;
  }

  const relativePath = rel || '.';
  if (isBlockedRelativePath(relativePath)) {
    const err = new Error('Đường dẫn này bị chặn để bảo mật.');
    err.statusCode = 403;
    throw err;
  }

  const absolutePath = path.resolve(PROJECT_ROOT, relativePath);
  if (!absolutePath.startsWith(PROJECT_ROOT)) {
    const err = new Error('Đường dẫn nằm ngoài phạm vi dự án.');
    err.statusCode = 403;
    throw err;
  }

  const ext = path.extname(absolutePath).toLowerCase();
  if (expectFile && ext && !DEV_ALLOWED_EXTENSIONS.has(ext)) {
    const err = new Error(`Định dạng file ${ext} chưa được hỗ trợ trong DevTool.`);
    err.statusCode = 400;
    throw err;
  }

  return {
    absolutePath,
    relativePath: relativePath === '.' ? '' : relativePath,
    extension: ext
  };
}

async function collectDevTree(relativeDir = '', depth = 0, maxDepth = 2) {
  const { absolutePath, relativePath } = resolveDevPath(relativeDir, { expectDirectory: true });
  const rootStat = await fs.stat(absolutePath).catch(() => null);
  if (!rootStat || !rootStat.isDirectory()) {
    const err = new Error('Đường dẫn thư mục không hợp lệ.');
    err.statusCode = 400;
    throw err;
  }
  const entries = await fs.readdir(absolutePath, { withFileTypes: true });
  const rows = [];

  for (const entry of entries) {
    const childRel = relativePath ? `${relativePath}/${entry.name}` : entry.name;
    if (isBlockedRelativePath(childRel)) continue;

    const childAbs = path.resolve(PROJECT_ROOT, childRel);
    const stat = await fs.stat(childAbs).catch(() => null);
    if (!stat) continue;

    if (entry.isDirectory()) {
      const dirNode = {
        type: 'directory',
        name: entry.name,
        path: childRel,
        modified_at: stat.mtime,
        children: []
      };

      if (depth < maxDepth) {
        try {
          dirNode.children = await collectDevTree(childRel, depth + 1, maxDepth);
        } catch (_) {
          // Keep listing resilient: skip malformed/inaccessible nested directories.
          dirNode.children = [];
        }
      }
      rows.push(dirNode);
      continue;
    }

    const ext = path.extname(entry.name).toLowerCase();
    if (!DEV_ALLOWED_EXTENSIONS.has(ext)) continue;
    rows.push({
      type: 'file',
      name: entry.name,
      path: childRel,
      extension: ext,
      size: stat.size,
      modified_at: stat.mtime
    });
  }

  rows.sort((a, b) => {
    if (a.type !== b.type) return a.type === 'directory' ? -1 : 1;
    return String(a.name || '').localeCompare(String(b.name || ''), 'vi');
  });

  return rows;
}

function runSyntaxCheckByExtension(content, extension, relativePath) {
  const ext = String(extension || '').toLowerCase();
  if (ext === '.json') {
    JSON.parse(content);
    return { ok: true, checker: 'json.parse' };
  }

  if (['.js', '.cjs', '.mjs'].includes(ext)) {
    new vm.Script(content, { filename: relativePath || 'inline.js' });
    return { ok: true, checker: 'vm.Script' };
  }

  return { ok: true, checker: 'basic' };
}

function normalizeIpAddress(rawIp) {
  const raw = String(rawIp || '').trim();
  if (!raw) return '';
  const first = raw.split(',')[0].trim().replace(/^::ffff:/i, '').replace(/^\[|\]$/g, '');
  return first;
}

function isPrivateIpAddress(ip) {
  const value = String(ip || '').trim().toLowerCase();
  if (!value) return true;
  if (value === '127.0.0.1' || value === 'localhost' || value === '::1') return true;
  if (value.startsWith('10.')) return true;
  if (value.startsWith('192.168.')) return true;
  if (/^172\.(1[6-9]|2\d|3[0-1])\./.test(value)) return true;
  if (value.startsWith('fc') || value.startsWith('fd')) return true;
  return false;
}

async function resolveIpGeo(ip) {
  const normalized = normalizeIpAddress(ip);
  if (!normalized) {
    return {
      address: 'Không xác định',
      country: '',
      region: '',
      city: '',
      isp: ''
    };
  }

  if (isPrivateIpAddress(normalized)) {
    return {
      address: 'Mạng nội bộ / riêng tư',
      country: '',
      region: '',
      city: '',
      isp: 'Local/Private'
    };
  }

  const now = Date.now();
  const cached = ipGeoCache.get(normalized);
  if (cached && (now - cached.at) < IP_GEO_CACHE_MS) {
    return cached.data;
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 2500);
  try {
    const geoUrl = `http://ip-api.com/json/${encodeURIComponent(normalized)}?fields=status,country,regionName,city,query,isp`;
    const rs = await fetch(geoUrl, { signal: controller.signal });
    const payload = await rs.json().catch(() => ({}));

    const country = String(payload?.country || '').trim();
    const region = String(payload?.regionName || '').trim();
    const city = String(payload?.city || '').trim();
    const isp = String(payload?.isp || '').trim();
    const address = [city, region, country].filter(Boolean).join(', ') || 'Không xác định';
    const data = { address, country, region, city, isp };

    ipGeoCache.set(normalized, { at: now, data });
    return data;
  } catch (_) {
    const fallback = {
      address: 'Không tra cứu được',
      country: '',
      region: '',
      city: '',
      isp: ''
    };
    ipGeoCache.set(normalized, { at: now, data: fallback });
    return fallback;
  } finally {
    clearTimeout(timeout);
  }
}

async function runCleanup(req, res) {
  try {
    const settings = JSON.parse(await fs.readFile(SETTINGS_FILE, 'utf8'));
    const days = parseInt(settings.autoDeleteDays || 15, 10);
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);

    const deleted = await GameSession.destroy({ where: { created_at: { [Op.lt]: cutoff } } }).catch(e=>{console.warn(e); return 0});

    res.json({ success: true, message: `Cleanup executed, deleted approximately ${deleted} sessions` });
  } catch (err) {
    console.error('Cleanup error:', err);
    res.status(500).json({ success: false, message: 'Cleanup failed', error: err.message });
  }
}

async function downloadBackup(req, res) {
  try {
    // Create a simple JSON backup: settings + file list
    const settings = JSON.parse(await fs.readFile(SETTINGS_FILE, 'utf8'));
    const files = await fs.readdir(UPLOAD_DIR).catch(()=>[]);
    const backup = { generated_at: new Date(), settings, files };
    const payload = JSON.stringify(backup, null, 2);
    res.setHeader('Content-Disposition', `attachment; filename=giftbox-backup-${Date.now()}.json`);
    res.setHeader('Content-Type', 'application/json');
    res.send(payload);
  } catch (err) {
    console.error('Backup error:', err);
    res.status(500).json({ success: false, message: 'Backup failed' });
  }
}

async function restoreBackup(req, res) {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });
    const content = req.file.buffer.toString('utf8');
    const parsed = JSON.parse(content);
    if (parsed.settings) {
      await fs.writeFile(SETTINGS_FILE, JSON.stringify(parsed.settings, null, 2));
    }
    res.json({ success: true, message: 'Restore completed' });
  } catch (err) {
    console.error('Restore error:', err);
    res.status(500).json({ success: false, message: 'Restore failed', error: err.message });
  }
}

async function devListFiles(req, res) {
  try {
    const actor = ensureDevtoolAccess(req);
    const dir = String(req.query?.dir || '').trim();
    const depthRaw = Number(req.query?.depth || 2);
    const depth = Math.max(0, Math.min(4, Number.isFinite(depthRaw) ? depthRaw : 2));
    const data = await collectDevTree(dir, 0, depth);
    await appendDevtoolAudit({ action: 'list', actor, dir: dir || '.', depth, total: Array.isArray(data) ? data.length : 0 });
    return res.json({ success: true, data });
  } catch (err) {
    return res.status(err.statusCode || 500).json({ success: false, message: err.message || 'Không thể tải danh sách file.' });
  }
}

async function devReadFile(req, res) {
  try {
    const actor = ensureDevtoolAccess(req);
    const requestedPath = String(req.query?.path || '').trim();
    if (!requestedPath) {
      return res.status(400).json({ success: false, message: 'Thiếu đường dẫn file.' });
    }

    const { absolutePath, relativePath, extension } = resolveDevPath(requestedPath, { expectFile: true });
    const stat = await fs.stat(absolutePath).catch(() => null);
    if (!stat || !stat.isFile()) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy file.' });
    }

    const maxBytes = 2 * 1024 * 1024;
    if (stat.size > maxBytes) {
      return res.status(413).json({ success: false, message: 'File quá lớn để chỉnh sửa trực tiếp trong DevTool.' });
    }

    const content = await fs.readFile(absolutePath, 'utf8');
    await appendDevtoolAudit({ action: 'read', actor, path: relativePath, size: stat.size });
    return res.json({
      success: true,
      data: {
        path: relativePath,
        extension,
        size: stat.size,
        modified_at: stat.mtime,
        content
      }
    });
  } catch (err) {
    return res.status(err.statusCode || 500).json({ success: false, message: err.message || 'Không thể đọc file.' });
  }
}

async function devCheckFile(req, res) {
  try {
    const actor = ensureDevtoolAccess(req);
    const requestedPath = String(req.body?.path || '').trim();
    const inlineContent = req.body?.content;
    if (!requestedPath) {
      return res.status(400).json({ success: false, message: 'Thiếu đường dẫn file.' });
    }

    const { absolutePath, relativePath, extension } = resolveDevPath(requestedPath, { expectFile: true });
    let content = typeof inlineContent === 'string' ? inlineContent : null;
    if (content === null) {
      content = await fs.readFile(absolutePath, 'utf8');
    }

    const result = runSyntaxCheckByExtension(content, extension, relativePath);
    await appendDevtoolAudit({ action: 'check', actor, path: relativePath, checker: result.checker, inline: typeof inlineContent === 'string' });
    return res.json({
      success: true,
      data: {
        path: relativePath,
        extension,
        checker: result.checker,
        valid: true,
        message: 'Không phát hiện lỗi cú pháp cơ bản.'
      }
    });
  } catch (err) {
    const detail = String(err?.message || 'Lỗi kiểm tra cú pháp');
    return res.status(400).json({
      success: false,
      message: detail,
      data: {
        valid: false,
        stack: String(err?.stack || '').split('\n').slice(0, 6).join('\n')
      }
    });
  }
}

async function devWriteFile(req, res) {
  try {
    const actor = ensureDevtoolAccess(req);
    const requestedPath = String(req.body?.path || '').trim();
    const content = req.body?.content;
    if (!requestedPath) {
      return res.status(400).json({ success: false, message: 'Thiếu đường dẫn file.' });
    }
    if (typeof content !== 'string') {
      return res.status(400).json({ success: false, message: 'Nội dung file không hợp lệ.' });
    }

    const { absolutePath, relativePath, extension } = resolveDevPath(requestedPath, { expectFile: true });
    runSyntaxCheckByExtension(content, extension, relativePath);

    const previousContent = await fs.readFile(absolutePath, 'utf8').catch(() => '');
    const previousHash = hashContent(previousContent);
    const nextHash = hashContent(content);
    if (previousHash === nextHash) {
      return res.json({
        success: true,
        message: 'Không có thay đổi để lưu.',
        data: {
          path: relativePath,
          extension,
          unchanged: true
        }
      });
    }

    const contentBytes = Buffer.byteLength(content, 'utf8');
    const maxBytes = 2 * 1024 * 1024;
    if (contentBytes > maxBytes) {
      return res.status(413).json({ success: false, message: 'Nội dung quá lớn để lưu qua DevTool.' });
    }

    await fs.mkdir(path.dirname(absolutePath), { recursive: true });
    const revision = await createRevisionBackup(relativePath, previousContent);
    await fs.writeFile(absolutePath, content, 'utf8');
    const stat = await fs.stat(absolutePath);
    await appendDevtoolAudit({
      action: 'write',
      actor,
      path: relativePath,
      extension,
      size: stat.size,
      before_hash: previousHash,
      after_hash: nextHash,
      revision_path: revision.revision_path
    });
    return res.json({
      success: true,
      message: 'Đã lưu file thành công.',
      data: {
        path: relativePath,
        extension,
        size: stat.size,
        modified_at: stat.mtime,
        revision
      }
    });
  } catch (err) {
    return res.status(err.statusCode || 400).json({ success: false, message: err.message || 'Không thể lưu file.' });
  }
}

async function devRuntimeStatus(req, res) {
  try {
    const actor = ensureDevtoolAccess(req);
    const memory = process.memoryUsage();
    const restartModeHint = 'Apache Passenger (tmp/restart.txt)';
    await appendDevtoolAudit({ action: 'runtime', actor });
    return res.json({
      success: true,
      data: {
        node: process.version,
        uptime_seconds: Math.floor(process.uptime()),
        pid: process.pid,
        memory,
        cwd: process.cwd(),
        project_root: PROJECT_ROOT,
        restart_mode_hint: restartModeHint
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Không thể lấy trạng thái runtime.' });
  }
}

async function devAuditLog(req, res) {
  try {
    ensureDevtoolAccess(req);
    const limit = Number(req.query?.limit || 120);
    const rows = await readAuditRows(limit);
    return res.json({ success: true, data: rows });
  } catch (err) {
    return res.status(err.statusCode || 500).json({ success: false, message: err.message || 'Không thể tải audit log.' });
  }
}

async function devListRevisions(req, res) {
  try {
    ensureDevtoolAccess(req);
    const requestedPath = String(req.query?.path || '').trim();
    if (!requestedPath) {
      return res.status(400).json({ success: false, message: 'Thiếu đường dẫn file cần xem lịch sử.' });
    }
    const { relativePath } = resolveDevPath(requestedPath, { expectFile: true });
    const revisions = await listRevisionsForPath(relativePath, Number(req.query?.limit || 40));
    return res.json({ success: true, data: revisions });
  } catch (err) {
    return res.status(err.statusCode || 500).json({ success: false, message: err.message || 'Không thể tải lịch sử phiên bản.' });
  }
}

async function devRollbackFile(req, res) {
  try {
    const actor = ensureDevtoolAccess(req);
    const requestedPath = String(req.body?.path || '').trim();
    const revisionPathRaw = String(req.body?.revision_path || '').trim();

    if (!requestedPath || !revisionPathRaw) {
      return res.status(400).json({ success: false, message: 'Thiếu thông tin rollback.' });
    }

    const { absolutePath, relativePath, extension } = resolveDevPath(requestedPath, { expectFile: true });
    const revision = resolveRevisionPath(revisionPathRaw);
    const revisionContent = await fs.readFile(revision.absolutePath, 'utf8').catch(() => null);
    if (revisionContent === null) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy phiên bản rollback.' });
    }

    runSyntaxCheckByExtension(revisionContent, extension, relativePath);

    const currentContent = await fs.readFile(absolutePath, 'utf8').catch(() => '');
    const safetyRevision = await createRevisionBackup(relativePath, currentContent);
    await fs.writeFile(absolutePath, revisionContent, 'utf8');
    const stat = await fs.stat(absolutePath);

    await appendDevtoolAudit({
      action: 'rollback',
      actor,
      path: relativePath,
      from_revision: revision.revisionPath,
      safety_revision: safetyRevision.revision_path,
      size: stat.size
    });

    return res.json({
      success: true,
      message: 'Rollback thành công.',
      data: {
        path: relativePath,
        size: stat.size,
        modified_at: stat.mtime,
        safety_revision: safetyRevision
      }
    });
  } catch (err) {
    return res.status(err.statusCode || 500).json({ success: false, message: err.message || 'Rollback thất bại.' });
  }
}

async function devListAccessIps(req, res) {
  try {
    const actor = ensureDevtoolAccess(req);
    const limitRaw = Number(req.query?.limit || 150);
    const limit = Math.max(10, Math.min(250, Number.isFinite(limitRaw) ? limitRaw : 150));

    const [gameRows, chatRows, accessRows] = await Promise.all([
      GameSession.findAll({
        attributes: ['session_code', 'player_ip', 'updated_at', 'created_at'],
        where: {
          player_ip: { [Op.not]: null }
        },
        order: [['updated_at', 'DESC']],
        limit: 800
      }).catch(() => []),
      ChatSession.findAll({
        attributes: ['session_code', 'customer_ip', 'updated_at', 'created_at'],
        where: {
          customer_ip: { [Op.not]: null }
        },
        order: [['updated_at', 'DESC']],
        limit: 800
      }).catch(() => []),
      AccessVisit.findAll({
        attributes: ['ip_address', 'hit_count', 'visited_paths', 'client_signatures', 'client_count', 'last_seen_at', 'updated_at', 'created_at'],
        where: {
          ip_address: { [Op.not]: null }
        },
        order: [['last_seen_at', 'DESC']],
        limit: 1200
      }).catch(() => [])
    ]);

    const isDisplayableVisitedPath = (value) => {
      const pathText = String(value || '').trim().toLowerCase();
      if (!pathText || !pathText.startsWith('/')) return false;
      if (pathText === '/wp-login.php' || pathText === '/xmlrpc.php') return false;
      if (pathText.startsWith('/wp-') || pathText.startsWith('/wordpress')) return false;
      if (pathText.startsWith('/phpmyadmin') || pathText.startsWith('/pma')) return false;
      if (pathText.startsWith('/.env') || pathText.startsWith('/.git') || pathText.startsWith('/cgi-bin')) return false;
      if (pathText.startsWith('/events') || pathText.startsWith('/ui/fragments')) return false;
      if (/\.(css|js|png|jpe?g|gif|svg|ico|webp|woff2?|ttf|map|txt|xml)$/i.test(pathText)) return false;
      return true;
    };

    const parseVisitedPaths = (raw) => {
      if (!raw) return [];
      try {
        const parsed = JSON.parse(String(raw));
        if (!Array.isArray(parsed)) return [];
        return parsed
          .map((item) => String(item || '').trim())
          .filter((item) => isDisplayableVisitedPath(item))
          .slice(0, 12);
      } catch (_) {
        return [];
      }
    };

    const parseClientSignatures = (raw) => {
      if (!raw) return [];
      try {
        const parsed = JSON.parse(String(raw));
        if (!Array.isArray(parsed)) return [];
        return parsed
          .map((item) => ({
            key: String(item?.key || '').trim(),
            browser: String(item?.browser || '').trim() || 'Unknown',
            os: String(item?.os || '').trim() || 'Unknown',
            device: String(item?.device || '').trim() || 'Unknown',
            count: Math.max(1, Number(item?.count || 1)),
            last_seen_at: String(item?.last_seen_at || '').trim() || null
          }))
          .filter((item) => item.key)
          .slice(0, 10);
      } catch (_) {
        return [];
      }
    };

    const ipMap = new Map();
    const upsertIp = (rawIp, source, at, sessionCode, meta = {}) => {
      const ip = normalizeIpAddress(rawIp);
      if (!ip) return;

      const ts = new Date(at || Date.now()).getTime();
      const visitCount = Math.max(1, Number(meta.count || 1));
      const existing = ipMap.get(ip) || {
        ip,
        count: 0,
        last_seen_ts: 0,
        sources: new Set(),
        sample_sessions: [],
        sample_paths: new Set(),
        clients: new Map()
      };

      existing.count += visitCount;
      if (Number.isFinite(ts) && ts > existing.last_seen_ts) existing.last_seen_ts = ts;
      existing.sources.add(source);
      if (sessionCode && existing.sample_sessions.length < 3 && !existing.sample_sessions.includes(sessionCode)) {
        existing.sample_sessions.push(sessionCode);
      }
      if (Array.isArray(meta.paths)) {
        meta.paths.forEach((pagePath) => {
          const safePath = String(pagePath || '').trim();
          if (safePath) existing.sample_paths.add(safePath);
        });
      }
      if (Array.isArray(meta.clients)) {
        meta.clients.forEach((client) => {
          const key = String(client?.key || '').trim();
          if (!key) return;
          const prev = existing.clients.get(key);
          const merged = {
            key,
            browser: String(client?.browser || prev?.browser || 'Unknown'),
            os: String(client?.os || prev?.os || 'Unknown'),
            device: String(client?.device || prev?.device || 'Unknown'),
            count: Math.max(1, Number(client?.count || prev?.count || 1)),
            last_seen_at: String(client?.last_seen_at || prev?.last_seen_at || '') || null
          };
          if (prev) {
            merged.count = Math.max(1, Number(prev.count || 1)) + Math.max(1, Number(client?.count || 1));
            const prevTs = new Date(prev.last_seen_at || 0).getTime();
            const nextTs = new Date(client?.last_seen_at || 0).getTime();
            if (Number.isFinite(prevTs) && prevTs >= nextTs) merged.last_seen_at = prev.last_seen_at;
          }
          existing.clients.set(key, merged);
        });
      }

      ipMap.set(ip, existing);
    };

    gameRows.forEach((row) => {
      upsertIp(row?.player_ip, 'game_session', row?.updated_at || row?.created_at, row?.session_code);
    });
    chatRows.forEach((row) => {
      upsertIp(row?.customer_ip, 'chat_session', row?.updated_at || row?.created_at, row?.session_code);
    });
    accessRows.forEach((row) => {
      upsertIp(
        row?.ip_address,
        'site_visit',
        row?.last_seen_at || row?.updated_at || row?.created_at,
        null,
        {
          count: row?.hit_count,
          paths: parseVisitedPaths(row?.visited_paths),
          clients: parseClientSignatures(row?.client_signatures)
        }
      );
    });

    const baseRows = Array.from(ipMap.values())
      .sort((a, b) => {
        if (b.last_seen_ts !== a.last_seen_ts) return b.last_seen_ts - a.last_seen_ts;
        return b.count - a.count;
      })
      .slice(0, limit);

    const withGeo = await Promise.all(baseRows.map(async (item) => {
      const geo = await resolveIpGeo(item.ip);
      return {
        ip: item.ip,
        address: geo.address,
        country: geo.country,
        region: geo.region,
        city: geo.city,
        isp: geo.isp,
        count: item.count,
        sources: Array.from(item.sources),
        pages: Array.from(item.sample_paths).slice(0, 12),
        clients: Array.from(item.clients.values())
          .sort((a, b) => {
            const bTs = new Date(b.last_seen_at || 0).getTime();
            const aTs = new Date(a.last_seen_at || 0).getTime();
            if (bTs !== aTs) return bTs - aTs;
            return Number(b.count || 0) - Number(a.count || 0);
          })
          .slice(0, 8),
        sample_sessions: item.sample_sessions,
        last_seen_at: item.last_seen_ts ? new Date(item.last_seen_ts).toISOString() : null
      };
    }));

    await appendDevtoolAudit({ action: 'ip_access_list', actor, total: withGeo.length });
    return res.json({
      success: true,
      data: withGeo,
      total: withGeo.length
    });
  } catch (err) {
    return res.status(err.statusCode || 500).json({ success: false, message: err.message || 'Không thể tải IP truy cập.' });
  }
}

function execFileAsync(command, args = [], options = {}) {
  return new Promise((resolve, reject) => {
    execFile(command, args, {
      timeout: Number(options.timeoutMs || 120000),
      windowsHide: true,
      maxBuffer: Number(options.maxBuffer || (128 * 1024 * 1024)),
      env: options.env || process.env
    }, (error, stdout, stderr) => {
      if (error) {
        const err = new Error(String(stderr || error.message || 'Command failed').trim());
        err.code = error.code;
        return reject(err);
      }
      return resolve({
        stdout: String(stdout || ''),
        stderr: String(stderr || '')
      });
    });
  });
}

function sanitizeFileNamePart(value, fallback = 'database') {
  const safe = String(value || '')
    .trim()
    .replace(/[^a-zA-Z0-9._-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
  return safe || fallback;
}

function getDbExportConfig() {
  return {
    dialect: String(process.env.DB_DIALECT || 'mysql').trim().toLowerCase(),
    name: String(process.env.DB_NAME || '').trim(),
    host: String(process.env.DB_HOST || '127.0.0.1').trim(),
    port: String(process.env.DB_PORT || '3306').trim(),
    user: String(process.env.DB_USER || '').trim(),
    pass: String(process.env.DB_PASS || '')
  };
}

async function tryMysqlDumpExport() {
  const dbConfig = getDbExportConfig();
  if (dbConfig.dialect !== 'mysql') {
    return {
      ok: false,
      reason: 'dialect_not_mysql',
      output: `Dialect ${dbConfig.dialect} không hỗ trợ mysqldump trực tiếp.`
    };
  }

  if (!dbConfig.name || !dbConfig.user) {
    return {
      ok: false,
      reason: 'missing_db_env',
      output: 'Thiếu DB_NAME hoặc DB_USER.'
    };
  }

  const maxBufferMb = Math.max(32, Math.min(512, Number(process.env.DEVTOOL_DB_EXPORT_MAX_BUFFER_MB || 128)));
  const maxBuffer = maxBufferMb * 1024 * 1024;
  const env = {
    ...process.env,
    MYSQL_PWD: dbConfig.pass
  };

  const commandCandidates = ['mysqldump', 'mysqldump.exe', 'mariadb-dump', 'mariadb-dump.exe'];
  const baseArgs = [
    `--host=${dbConfig.host}`,
    `--port=${dbConfig.port}`,
    `--user=${dbConfig.user}`,
    '--single-transaction',
    '--skip-lock-tables',
    '--quick',
    '--default-character-set=utf8mb4',
    '--hex-blob',
    '--skip-comments',
    '--triggers'
  ];
  const argVariants = [
    [...baseArgs, '--no-tablespaces', '--column-statistics=0', dbConfig.name],
    [...baseArgs, '--no-tablespaces', dbConfig.name],
    [...baseArgs, '--column-statistics=0', dbConfig.name],
    [...baseArgs, dbConfig.name]
  ];

  const attempts = [];
  for (const command of commandCandidates) {
    for (const args of argVariants) {
      try {
        const result = await execFileAsync(command, args, {
          env,
          timeoutMs: 180000,
          maxBuffer
        });
        const sql = String(result.stdout || '');
        if (!sql.trim()) {
          attempts.push(`${command} => empty output`);
          continue;
        }
        return {
          ok: true,
          exportType: 'sql',
          strategy: `${command} ${args.filter((arg) => !arg.startsWith('--user=')).join(' ')}`,
          buffer: Buffer.from(sql, 'utf8')
        };
      } catch (err) {
        attempts.push(`${command} => ${String(err?.message || err)}`);
      }
    }
  }

  return {
    ok: false,
    reason: 'mysqldump_failed',
    output: attempts.slice(0, 6).join(' | ')
  };
}

function normalizeTableName(rawTableName) {
  if (typeof rawTableName === 'string') return rawTableName;
  if (rawTableName && typeof rawTableName === 'object') {
    if (rawTableName.tableName) return String(rawTableName.tableName);
    const values = Object.values(rawTableName);
    if (values.length > 0) return String(values[0]);
  }
  return '';
}

async function buildJsonDatabaseExport() {
  const qi = db.sequelize.getQueryInterface();
  const rawTables = await qi.showAllTables();
  const tableNames = rawTables
    .map(normalizeTableName)
    .map((name) => String(name || '').trim())
    .filter(Boolean)
    .sort((a, b) => a.localeCompare(b, 'vi'));

  const tables = {};
  for (const tableName of tableNames) {
    let schema = {};
    try {
      schema = await qi.describeTable(tableName);
    } catch (_) {
      schema = {};
    }

    const quotedTable = qi.quoteTable(tableName);
    const rows = await db.sequelize.query(`SELECT * FROM ${quotedTable}`, {
      type: QueryTypes.SELECT,
      logging: false
    }).catch(() => []);

    tables[tableName] = {
      row_count: Array.isArray(rows) ? rows.length : 0,
      schema,
      rows: Array.isArray(rows) ? rows : []
    };
  }

  return {
    ok: true,
    exportType: 'json',
    strategy: 'sequelize-table-snapshot',
    buffer: Buffer.from(JSON.stringify({
      generated_at: new Date().toISOString(),
      dialect: String(process.env.DB_DIALECT || 'mysql').trim().toLowerCase(),
      database: String(process.env.DB_NAME || '').trim(),
      table_count: Object.keys(tables).length,
      tables
    }, null, 2), 'utf8')
  };
}

async function devExportDatabase(req, res) {
  try {
    const actor = ensureDevtoolAccess(req);
    const requestedFormat = String(req.query?.format || 'auto').trim().toLowerCase();
    const format = ['auto', 'sql', 'json'].includes(requestedFormat) ? requestedFormat : 'auto';

    let result = null;
    if (format !== 'json') {
      result = await tryMysqlDumpExport();
      if (!result.ok && format === 'sql') {
        await appendDevtoolAudit({
          action: 'db_export_failed',
          actor,
          format_requested: format,
          reason: result.reason,
          output: result.output
        });
        return res.status(500).json({
          success: false,
          message: 'Không thể export SQL trực tiếp trên hosting hiện tại.',
          data: {
            format_requested: format,
            reason: result.reason,
            output: result.output
          }
        });
      }
    }

    if (!result || !result.ok) {
      result = await buildJsonDatabaseExport();
    }

    const dbName = sanitizeFileNamePart(process.env.DB_NAME || 'giftbox', 'giftbox');
    const stamp = new Date().toISOString().replace(/[:.]/g, '-');
    const extension = result.exportType === 'sql' ? 'sql' : 'json';
    const filename = `${dbName}-backup-${stamp}.${extension}`;

    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Type', result.exportType === 'sql'
      ? 'application/sql; charset=utf-8'
      : 'application/json; charset=utf-8');

    await appendDevtoolAudit({
      action: 'db_export',
      actor,
      format_requested: format,
      export_type: result.exportType,
      strategy: result.strategy,
      size_bytes: Buffer.byteLength(result.buffer)
    });

    return res.send(result.buffer);
  } catch (err) {
    return res.status(err.statusCode || 500).json({
      success: false,
      message: err.message || 'Không thể export database.'
    });
  }
}

function runCommand(command, args = [], timeoutMs = 8000) {
  return new Promise((resolve, reject) => {
    execFile(command, args, { timeout: timeoutMs, windowsHide: true }, (error, stdout, stderr) => {
      if (error) {
        const err = new Error(String(stderr || error.message || 'Command failed').trim());
        err.code = error.code;
        return reject(err);
      }
      return resolve({ stdout: String(stdout || ''), stderr: String(stderr || '') });
    });
  });
}

async function tryRestartWithPm2() {
  const appName = String(process.env.PM2_APP_NAME || process.env.name || process.env.npm_package_name || 'giftbox-game').trim();
  const pmId = String(process.env.pm_id || '').trim();
  const commands = ['pm2', 'pm2.cmd'];
  const attempts = [];

  const argVariants = [];
  if (pmId) argVariants.push(['restart', pmId]);
  if (appName) argVariants.push(['restart', appName]);
  argVariants.push(['reload', path.join(PROJECT_ROOT, 'ecosystem.config.cjs'), '--only', appName || 'giftbox-game']);

  for (const cmd of commands) {
    for (const args of argVariants) {
      try {
        const result = await runCommand(cmd, args, 9000);
        return {
          ok: true,
          strategy: `pm2:${args.join(' ')}`,
          output: String(result.stdout || result.stderr || '').trim()
        };
      } catch (err) {
        attempts.push(`${cmd} ${args.join(' ')} => ${err.message}`);
      }
    }
  }

  return {
    ok: false,
    strategy: 'pm2-unavailable',
    output: attempts.slice(0, 4).join(' | ')
  };
}

async function tryRestartWithPassenger() {
  const restartDir = path.join(PROJECT_ROOT, 'tmp');
  const restartFile = path.join(restartDir, 'restart.txt');
  try {
    await fs.mkdir(restartDir, { recursive: true });
    await fs.writeFile(restartFile, `${new Date().toISOString()}\n`, 'utf8');
    return {
      ok: true,
      strategy: 'passenger:tmp/restart.txt',
      output: 'Touched tmp/restart.txt'
    };
  } catch (err) {
    return {
      ok: false,
      strategy: 'passenger-unavailable',
      output: String(err?.message || 'Cannot write tmp/restart.txt')
    };
  }
}

async function devRestartServer(req, res) {
  try {
    const actor = ensureDevtoolAccess(req);

    const passengerResult = await tryRestartWithPassenger();
    if (passengerResult.ok) {
      await appendDevtoolAudit({ action: 'restart', actor, strategy: passengerResult.strategy, output: passengerResult.output });
      return res.json({
        success: true,
        message: 'Đã gửi lệnh restart theo cơ chế Apache/Passenger (cPanel).',
        data: {
          strategy: passengerResult.strategy,
          output: passengerResult.output
        }
      });
    }

    const pm2Result = await tryRestartWithPm2();
    if (pm2Result.ok) {
      await appendDevtoolAudit({ action: 'restart', actor, strategy: pm2Result.strategy, output: pm2Result.output });
      return res.json({
        success: true,
        message: 'Đã gửi lệnh restart server qua PM2.',
        data: {
          strategy: pm2Result.strategy,
          output: pm2Result.output
        }
      });
    }

    const fallbackOutput = [passengerResult.output, pm2Result.output].filter(Boolean).join(' | ');
    await appendDevtoolAudit({ action: 'restart_failed', actor, strategy: 'none', output: fallbackOutput });
    return res.status(500).json({
      success: false,
      message: 'Không thể restart tự động. Hãy kiểm tra quyền ghi tmp/restart.txt hoặc cấu hình PM2.',
      data: {
        strategy: 'none',
        output: fallbackOutput
      }
    });
  } catch (err) {
    return res.status(err.statusCode || 500).json({ success: false, message: err.message || 'Không thể restart server.' });
  }
}

module.exports = {
  runCleanup,
  downloadBackup,
  restoreBackup,
  devListFiles,
  devReadFile,
  devCheckFile,
  devWriteFile,
  devRuntimeStatus,
  devAuditLog,
  devListRevisions,
  devRollbackFile,
  devListAccessIps,
  devExportDatabase,
  devRestartServer
};
