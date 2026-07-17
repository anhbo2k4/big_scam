const fs = require('fs').promises;
const { constants: fsConstants } = require('fs');
const os = require('os');
const path = require('path');

const DEFAULT_UPLOAD_DIR = process.env.UPLOAD_DIR
  ? path.resolve(process.env.UPLOAD_DIR)
  : path.join(__dirname, '../public/uploads');
const FALLBACK_UPLOAD_DIR = path.join(os.tmpdir(), 'giftbox-game-uploads');
let resolvedUploadDir = null;

async function resolveUploadDir() {
  if (resolvedUploadDir) return resolvedUploadDir;

  const candidates = [DEFAULT_UPLOAD_DIR, FALLBACK_UPLOAD_DIR];
  for (const candidate of candidates) {
    try {
      await fs.mkdir(candidate, { recursive: true });
      await fs.access(candidate, fsConstants.R_OK | fsConstants.W_OK);
      resolvedUploadDir = candidate;
      return resolvedUploadDir;
    } catch (_) {}
  }

  throw new Error('No writable upload directory available');
}

async function list(req, res) {
  try {
    const uploadDir = await resolveUploadDir();
    const files = await fs.readdir(uploadDir, { withFileTypes: true });
    
    const fileList = await Promise.all(
      files.map(async (file) => {
        if (!file.isFile()) return null;
        
        const filePath = path.join(uploadDir, file.name);
        const stats = await fs.stat(filePath);
        const ext = path.extname(file.name).toLowerCase();
        const isImage = ['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(ext);
        
        return {
          id: Buffer.from(file.name).toString('hex'),
          name: file.name,
          url: `/uploads/${file.name}`,
          size: formatFileSize(stats.size),
          type: getFileType(ext),
          uploadedAt: new Date(stats.birthtime).toLocaleString('vi-VN'),
          uploadedAtRaw: stats.birthtime,
          isImage: isImage,
          mimeType: getMimeType(ext),
          fullSize: stats.size
        };
      })
    );

    
    const validFiles = fileList.filter(f => f !== null);
    
    
    validFiles.sort((a, b) => new Date(b.uploadedAtRaw) - new Date(a.uploadedAtRaw));

    
    const stats = {
      totalFiles: validFiles.length,
      totalImages: validFiles.filter(f => f.isImage).length,
      totalSize: validFiles.reduce((sum, f) => sum + f.fullSize, 0),
      totalSizeFormatted: formatFileSize(validFiles.reduce((sum, f) => sum + f.fullSize, 0))
    };

    res.json({ 
      success: true, 
      data: validFiles,
      stats
    });
  } catch (err) {
    console.error('Error listing files:', err);
    res.status(500).json({ success: false, message: 'Unable to list files' });
  }
}

async function upload(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file provided' });
    }

    const uploadDir = await resolveUploadDir();

    const originalName = req.file.originalname || `file-${Date.now()}`;
    const fileName = `${Date.now()}-${originalName}`;
    const filePath = path.join(uploadDir, fileName);

    
    await fs.writeFile(filePath, req.file.buffer);

    const stats = await fs.stat(filePath);
    const ext = path.extname(fileName).toLowerCase();
    const isImage = ['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(ext);

    const fileData = {
      id: Buffer.from(fileName).toString('hex'),
      name: fileName,
      url: `/uploads/${fileName}`,
      size: formatFileSize(stats.size),
      type: getFileType(ext),
      uploadedAt: new Date(stats.birthtime).toLocaleString('vi-VN'),
      isImage: isImage,
      mimeType: getMimeType(ext),
      fullSize: stats.size
    };

    console.log('File uploaded:', fileData);

    res.json({ 
      success: true, 
      data: fileData,
      message: 'File uploaded successfully'
    });
  } catch (err) {
    console.error('Error uploading file:', err);
    res.status(500).json({ success: false, message: 'Upload failed' });
  }
}

async function remove(req, res) {
  try {
    const uploadDir = await resolveUploadDir();
    const fileName = req.params.name;
    
    
    if (fileName.includes('..') || fileName.includes('/') || fileName.includes('\\')) {
      return res.status(400).json({ success: false, message: 'Invalid file name' });
    }

    const filePath = path.join(uploadDir, fileName);

    
    const realPath = await fs.realpath(filePath);
    const realUploadDir = await fs.realpath(uploadDir);
    
    if (!realPath.startsWith(realUploadDir)) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    await fs.unlink(filePath);
    res.json({ success: true, message: 'File deleted successfully' });
  } catch (err) {
    console.error('Error deleting file:', err);
    res.status(500).json({ success: false, message: 'Delete failed' });
  }
}

function formatFileSize(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

function getFileType(ext) {
  const types = {
    '.jpg': 'Hình ảnh',
    '.jpeg': 'Hình ảnh',
    '.png': 'Hình ảnh',
    '.gif': 'Hình ảnh',
    '.webp': 'Hình ảnh',
    '.pdf': 'PDF',
    '.doc': 'Tài liệu',
    '.docx': 'Tài liệu',
    '.xls': 'Bảng tính',
    '.xlsx': 'Bảng tính',
    '.mp4': 'Video',
    '.avi': 'Video',
    '.mov': 'Video'
  };
  return types[ext] || 'Khác';
}

function getMimeType(ext) {
  const mimes = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.webp': 'image/webp',
    '.pdf': 'application/pdf',
    '.mp4': 'video/mp4',
    '.avi': 'video/x-msvideo',
    '.mov': 'video/quicktime'
  };
  return mimes[ext] || 'application/octet-stream';
}

module.exports = {
  list,
  upload,
  remove
};
