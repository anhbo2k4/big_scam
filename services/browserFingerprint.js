/**
 * Browser Fingerprinting Service
 * Creates and validates browser/device fingerprints for session security
 */

const crypto = require('crypto');

/**
 * Generate a hash from fingerprint data
 */
function generateFingerprint(fingerprintData) {
  if (!fingerprintData) return null;
  
  const hash = crypto
    .createHash('sha256')
    .update(JSON.stringify(fingerprintData))
    .digest('hex');
  
  return hash;
}

/**
 * Extract device info from request headers
 */
function extractDeviceInfo(req) {
  const userAgent = req.get('user-agent') || '';
  const acceptLanguage = req.get('accept-language') || '';
  const acceptEncoding = req.get('accept-encoding') || '';
  
  return {
    userAgent,
    acceptLanguage,
    acceptEncoding
  };
}

/**
 * Get client IP from request
 * Handles proxies and various header formats
 */
function getClientIP(req) {
  // Check X-Forwarded-For (multiple proxies)
  let ip = req.get('x-forwarded-for');
  if (ip) {
    // X-Forwarded-For can contain multiple IPs, get the first one
    ip = ip.split(',')[0].trim();
    return ip;
  }
  
  // Check other proxy headers
  ip = req.get('x-real-ip');
  if (ip) return ip;
  
  ip = req.get('cf-connecting-ip'); // Cloudflare
  if (ip) return ip;
  
  // Fallback to connection remote address
  return req.connection.remoteAddress || 
         req.socket.remoteAddress || 
         req.ip || 
         'unknown';
}

/**
 * Create a complete session fingerprint
 */
function createSessionFingerprint(req, clientFingerprint) {
  const ip = getClientIP(req);
  const deviceInfo = extractDeviceInfo(req);
  
  const fingerprintData = {
    ip,
    deviceInfo,
    clientFingerprint,
    timestamp: new Date().toISOString()
  };
  
  const fingerprintHash = generateFingerprint(fingerprintData);
  
  return {
    fingerprintHash,
    fingerprintData,
    ip
  };
}

/**
 * Validate if current request matches stored fingerprint
 * Returns: { isValid: boolean, reason?: string }
 */
function validateSessionFingerprint(req, storedFingerprint, storedIP, strictMode = false) {
  try {
    const currentIP = getClientIP(req);
    const currentDeviceInfo = extractDeviceInfo(req);
    
    // Strict mode: must match exactly
    if (strictMode) {
      if (currentIP !== storedIP) {
        return {
          isValid: false,
          reason: 'IP mismatch (strict mode)'
        };
      }
      
      // Check device info
      if (currentDeviceInfo.userAgent !== storedDeviceInfo?.userAgent) {
        return {
          isValid: false,
          reason: 'User-Agent mismatch (strict mode)'
        };
      }
    } else {
      // Lenient mode: check IP only, allow some device variation
      if (currentIP !== storedIP) {
        // IP changed - could be proxy or mobile switching networks
        console.warn(`⚠️ IP mismatch for stored IP ${storedIP}, current IP ${currentIP}`);
      }
    }
    
    return { isValid: true };
  } catch (err) {
    console.error('❌ Error validating session fingerprint:', err);
    return {
      isValid: false,
      reason: 'Validation error'
    };
  }
}

/**
 * Check for suspicious behavior
 */
function checkSuspiciousActivity(req, sessionData) {
  const issues = [];
  
  const currentIP = getClientIP(req);
  
  // Check rapid IP changes (possible session hijacking)
  if (sessionData.player_ip && sessionData.player_ip !== currentIP) {
    issues.push({
      severity: 'medium',
      type: 'IP_CHANGE',
      message: `IP changed from ${sessionData.player_ip} to ${currentIP}`
    });
  }
  
  // Check user-agent changes
  const currentUA = req.get('user-agent') || '';
  if (sessionData.device_info) {
    try {
      const storedDevice = JSON.parse(sessionData.device_info);
      if (storedDevice.userAgent && storedDevice.userAgent !== currentUA) {
        issues.push({
          severity: 'low',
          type: 'UA_CHANGE',
          message: 'User-Agent changed'
        });
      }
    } catch (e) {
      // Ignore parse errors
    }
  }
  
  return issues;
}

module.exports = {
  generateFingerprint,
  extractDeviceInfo,
  getClientIP,
  createSessionFingerprint,
  validateSessionFingerprint,
  checkSuspiciousActivity
};
