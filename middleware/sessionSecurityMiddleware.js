/**
 * Session Security Middleware
 * Validates game sessions using IP + browser fingerprint
 */

const fingerprint = require('../services/browserFingerprint');

/**
 * Get session code from request (query or params)
 */
function getSessionCode(req) {
  return (
    req.query?.code
    || req.params?.code
    || req.params?.sessionCode
    || req.body?.sessionCode
    || ''
  ).toUpperCase();
}

/**
 * Validate session security
 * Checks IP, device fingerprint, and detects suspicious activities
 */
const validateSessionSecurity = async (req, res, next) => {
  try {
    const { GameSession } = require('../models');
    const sessionCode = getSessionCode(req);
    
    if (!sessionCode || sessionCode.length < 3) {
      return next(); // No session code, skip validation
    }
    
    // Get session from database
    const session = await GameSession.findOne({
      where: { session_code: sessionCode }
    });
    
    if (!session) {
      return next(); // Session doesn't exist yet, skip validation
    }
    
    // Get current request IP and device info
    const currentIP = fingerprint.getClientIP(req);
    const currentDeviceInfo = fingerprint.extractDeviceInfo(req);
    
    // Update last activity IP
    if (session.player_ip !== currentIP) {
      await session.update({
        last_activity_ip: currentIP
      });
    }
    
    // Check for suspicious activities
    const suspiciousActivities = fingerprint.checkSuspiciousActivity(req, session);
    
    // Store security info in request for later use
    req.sessionSecurity = {
      sessionCode,
      currentIP,
      currentDeviceInfo,
      sessionData: session,
      suspiciousActivities
    };
    
    // Log security events
    if (suspiciousActivities.length > 0) {
      console.warn(`⚠️ Suspicious activities detected for session ${sessionCode}:`, suspiciousActivities);
    }
    
    next();
  } catch (err) {
    console.error('❌ Session security validation error:', err);
    next(); // Don't block on validation errors
  }
};

/**
 * Strict session validation - rejects requests that don't match fingerprint
 */
const strictSessionValidation = async (req, res, next) => {
  try {
    const { GameSession } = require('../models');
    const sessionCode = getSessionCode(req);
    
    if (!sessionCode || sessionCode.length < 3) {
      return res.status(400).json({
        success: false,
        message: 'Session code required'
      });
    }
    
    // Get session from database
    const session = await GameSession.findOne({
      where: { session_code: sessionCode }
    });
    
    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found'
      });
    }
    
    // Get current request info
    const currentIP = fingerprint.getClientIP(req);
    
    // Verify IP matches (required)
    if (session.player_ip && session.player_ip !== currentIP) {
      console.log(`🚫 IP mismatch - Session: ${session.player_ip}, Current: ${currentIP}`);
      return res.status(403).json({
        success: false,
        message: 'Session validation failed - IP mismatch'
      });
    }
    
    // Verify browser fingerprint if present
    if (session.browser_fingerprint) {
      const clientFingerprint = req.body.browserFingerprint || req.query.browserFingerprint;
      const currentFingerprint = fingerprint.generateFingerprint({
        user_agent: req.get('user-agent'),
        accept_language: req.get('accept-language'),
        accept_encoding: req.get('accept-encoding'),
        client_fingerprint: clientFingerprint
      });
      
      if (currentFingerprint !== session.browser_fingerprint) {
        console.warn(`⚠️ Browser fingerprint mismatch for session ${sessionCode}`);
        // Don't reject on fingerprint mismatch (can change with browser updates)
        // But flag it
        session.suspicious_activity = session.suspicious_activity || [];
        session.suspicious_activity.push({
          type: 'FINGERPRINT_MISMATCH',
          timestamp: new Date().toISOString()
        });
        await session.save();
      }
    }
    
    // Store session security info in request
    req.sessionSecurity = {
      sessionCode,
      currentIP,
      sessionData: session,
      isValidated: true
    };
    
    next();
  } catch (err) {
    console.error('❌ Strict session validation error:', err);
    return res.status(500).json({
      success: false,
      message: 'Session validation error'
    });
  }
};

/**
 * Initialize session security - capture fingerprint on first access
 */
const initializeSessionSecurity = async (req, res, next) => {
  try {
    const { GameSession } = require('../models');
    const sessionCode = getSessionCode(req);
    
    if (!sessionCode || sessionCode.length < 3) {
      return next();
    }
    
    const session = await GameSession.findOne({
      where: { session_code: sessionCode }
    });
    
    if (!session) {
      return next();
    }
    
    // Initialize security fields on first access
    if (!session.player_ip) {
      const clientIP = fingerprint.getClientIP(req);
      const deviceInfo = fingerprint.extractDeviceInfo(req);
      const clientFingerprint = req.body.browserFingerprint || req.query.browserFingerprint;
      
      const sessionFingerprint = fingerprint.createSessionFingerprint(req, clientFingerprint);
      
      await session.update({
        player_ip: clientIP,
        server_random_boxes: session.server_random_boxes // Keep existing
      });
      
      // Store device info and fingerprint in JSON
      const devInfo = {
        userAgent: deviceInfo.userAgent,
        acceptLanguage: deviceInfo.acceptLanguage,
        acceptEncoding: deviceInfo.acceptEncoding,
        timestamp: new Date().toISOString()
      };
      
      await session.update({
        device_info: devInfo,
        browser_fingerprint: sessionFingerprint.fingerprintHash,
        last_activity_ip: clientIP,
        session_validated: true
      });
      
      console.log(`✅ Session security initialized for ${sessionCode} from IP ${clientIP}`);
    }
    
    next();
  } catch (err) {
    console.error('❌ Session security initialization error:', err);
    next();
  }
};

module.exports = {
  validateSessionSecurity,
  strictSessionValidation,
  initializeSessionSecurity,
  getSessionCode
};
