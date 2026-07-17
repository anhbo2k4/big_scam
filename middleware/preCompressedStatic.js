/**
 * Serve pre-compressed & minified static assets when available.
 *
 * For any request to a .js or .css file, this middleware checks whether a
 * minified + pre-compressed variant exists (.min.js.br, .min.js.gz, .min.js)
 * and serves it transparently — the URL stays the same for the browser.
 *
 * Must be mounted BEFORE express.static.
 *
 * Usage:
 *   const preCompressed = require('./middleware/preCompressedStatic');
 *   app.use('/js',  preCompressed(path.join(__dirname, 'public/js')));
 *   app.use('/css', preCompressed(path.join(__dirname, 'public/css')));
 */
'use strict';

const fs = require('fs');
const path = require('path');

const CONTENT_TYPES = {
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
};

module.exports = function preCompressedStatic(root) {
  // Build lookup set on startup (fast O(1) checks)
  const available = new Set();

  function scan(dir) {
    let entries;
    try { entries = fs.readdirSync(dir, { withFileTypes: true }); }
    catch { return; }
    for (const e of entries) {
      const full = path.join(dir, e.name);
      if (e.isDirectory()) { scan(full); continue; }
      if (/\.min\.(js|css)(\.(gz|br))?$/.test(e.name)) {
        available.add(path.relative(root, full).replace(/\\/g, '/'));
      }
    }
  }
  scan(root);

  return function preCompressedMiddleware(req, res, next) {
    if (req.method !== 'GET' && req.method !== 'HEAD') return next();

    const ext = path.extname(req.path);
    if (ext !== '.js' && ext !== '.css') return next();

    // Strip leading slash to match relative paths in the Set
    const rel = req.path.replace(/^\//, '');
    const minRel = rel.replace(/\.(js|css)$/, '.min.$1');

    const ae = String(req.headers['accept-encoding'] || '');

    // Try Brotli
    if (ae.includes('br') && available.has(minRel + '.br')) {
      res.setHeader('Content-Type', CONTENT_TYPES[ext]);
      res.setHeader('Content-Encoding', 'br');
      res.setHeader('Vary', 'Accept-Encoding');
      return res.sendFile(path.join(root, minRel + '.br'));
    }

    // Try Gzip
    if (ae.includes('gzip') && available.has(minRel + '.gz')) {
      res.setHeader('Content-Type', CONTENT_TYPES[ext]);
      res.setHeader('Content-Encoding', 'gzip');
      res.setHeader('Vary', 'Accept-Encoding');
      return res.sendFile(path.join(root, minRel + '.gz'));
    }

    // Try minified (no compression)
    if (available.has(minRel)) {
      res.setHeader('Content-Type', CONTENT_TYPES[ext]);
      return res.sendFile(path.join(root, minRel));
    }

    next();
  };
};
