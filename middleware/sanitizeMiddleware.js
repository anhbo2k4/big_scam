const { body, validationResult } = require('express-validator');
const xss = require('xss');

// XSS whitelist - allow safe rich-text HTML tags from Tiptap editor
const xssWhitelist = {
  whiteList: {
    'b': ['style'],
    'i': ['style'],
    'u': ['style'],
    'em': ['style'],
    'strong': ['style'],
    'span': ['style'],
    'p': ['style'],
    'div': ['style'],
    'br': [],
    'ol': [], 'ul': [], 'li': []
  },
  stripIgnoreTag: true,
  stripLeadingAndTrailingWhitespace: true
};

/**
 * Sanitize all string inputs to prevent XSS
 */
function sanitizeInputs(req, res, next) {
  if (req.body) {
    Object.keys(req.body).forEach(key => {
      if (typeof req.body[key] === 'string') {
        // Remove script tags and dangerous HTML
        req.body[key] = xss(req.body[key], xssWhitelist);
        // Trim whitespace
        req.body[key] = req.body[key].trim();
      }
    });
  }

  if (req.query) {
    Object.keys(req.query).forEach(key => {
      if (typeof req.query[key] === 'string') {
        req.query[key] = xss(req.query[key], xssWhitelist).trim();
      }
    });
  }

  if (req.params) {
    Object.keys(req.params).forEach(key => {
      if (typeof req.params[key] === 'string') {
        req.params[key] = xss(req.params[key], xssWhitelist).trim();
      }
    });
  }

  next();
}

/**
 * Validate game session code format
 */
const validateSessionCode = () => [
  body('session_code')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Session code không hợp lệ'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    next();
  }
];

/**
 * Validate box selection input
 */
const validateBoxSelection = () => [
  body('box_number')
    .isInt({ min: 1, max: 100 })
    .withMessage('Số hộp không hợp lệ'),
  body('player_name')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Tên không hợp lệ'),
  body('player_email')
    .optional()
    .trim()
    .isEmail()
    .withMessage('Email không hợp lệ'),
  body('player_phone')
    .optional()
    .trim()
    .matches(/^[0-9\-\+\s\(\)]+$/)
    .withMessage('Số điện thoại không hợp lệ'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    next();
  }
];

/**
 * Validate game progress update
 */
const validateGameProgress = () => [
  body('isCompleted')
    .optional()
    .isBoolean()
    .withMessage('isCompleted phải là boolean'),
  body('boxesOpened')
    .optional()
    .isArray()
    .withMessage('boxesOpened phải là array'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    next();
  }
];

/**
 * Reject any suspicious input patterns
 */
function detectSuspiciousPatterns(req, res, next) {
  const patterns = [
    /union\s+select/i,
    /drop\s+table/i,
    /delete\s+from/i,
    /<script/i,
    /javascript:/i,
    /on\w+\s*=/i, // onclick=, onerror=, etc
    /eval\(/i,
    /expression\(/i,
    /import\s+/,
    /require\s*\(/
  ];

  const allInput = JSON.stringify({
    body: req.body,
    query: req.query,
    params: req.params
  }).toLowerCase();

  for (const pattern of patterns) {
    if (pattern.test(allInput)) {
      console.warn('🚨 Suspicious pattern detected:', pattern, 'from IP:', req.ip);
      return res.status(400).json({
        success: false,
        message: 'Dữ liệu đầu vào không hợp lệ'
      });
    }
  }

  next();
}

/**
 * Limit request body size to prevent DoS
 */
function validateRequestSize(req, res, next) {
  const maxSize = 10 * 1024; // 10KB
  let size = 0;

  req.on('data', (chunk) => {
    size += chunk.length;
    if (size > maxSize) {
      req.destroy();
      res.status(413).json({
        success: false,
        message: 'Request quá lớn'
      });
    }
  });

  next();
}

module.exports = {
  sanitizeInputs,
  validateSessionCode,
  validateBoxSelection,
  validateGameProgress,
  detectSuspiciousPatterns,
  validateRequestSize
};
