/**
 * Browser Fingerprinting - Client Side
 * Generates a unique fingerprint for the browser/device
 * Used to prevent session hijacking
 */

let fingerprintDataCache = null;
let fingerprintApiCache = null;
let fingerprintInitPromise = null;
let webglCanvasSingleton = null;
let webglContextSingleton = null;
let webglFingerprintCache = null;

class BrowserFingerprint {
  /**
   * Get canvas fingerprint (hardware acceleration)
   */
  static getCanvasFingerprint() {
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return 'no-canvas';
      
      ctx.textBaseline = 'top';
      ctx.font = '14px Arial';
      ctx.textBaseline = 'alphabetic';
      ctx.fillStyle = '#f0f0f0';
      ctx.fillRect(125, 1, 62, 20);
      ctx.fillStyle = '#000000';
      ctx.fillText('🎮 Browser Fingerprint', 2, 15);
      ctx.fillStyle = 'rgba(102, 204, 0, 0.7)';
      ctx.fillText('🎮 Browser Fingerprint', 4, 17);
      
      return canvas.toDataURL().substring(0, 50);
    } catch (e) {
      return 'canvas-error';
    }
  }

  /**
   * Get WebGL fingerprint
   */
  static getWebGLContext() {
    if (webglContextSingleton) return webglContextSingleton;

    webglCanvasSingleton = webglCanvasSingleton || document.createElement('canvas');
    webglContextSingleton =
      webglCanvasSingleton.getContext('webgl', { preserveDrawingBuffer: false })
      || webglCanvasSingleton.getContext('experimental-webgl', { preserveDrawingBuffer: false });

    return webglContextSingleton;
  }

  static getWebGLFingerprint() {
    try {
      if (webglFingerprintCache) return webglFingerprintCache;

      const gl = this.getWebGLContext();
      if (!gl) return 'no-webgl';
      
      const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
      if (!debugInfo) return 'no-debug-info';
      
      const vendor = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL);
      const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
      
      webglFingerprintCache = `${vendor}-${renderer}`.substring(0, 50);
      return webglFingerprintCache;
    } catch (e) {
      return 'webgl-error';
    }
  }

  /**
   * Get screen fingerprint
   */
  static getScreenFingerprint() {
    const screen = window.screen;
    return {
      width: screen.width,
      height: screen.height,
      colorDepth: screen.colorDepth,
      pixelDepth: screen.pixelDepth,
      availWidth: screen.availWidth,
      availHeight: screen.availHeight,
      devicePixelRatio: window.devicePixelRatio
    };
  }

  /**
   * Get browser fingerprint
   */
  static getBrowserFingerprint() {
    return {
      userAgent: navigator.userAgent,
      language: navigator.language || navigator.userLanguage,
      platform: navigator.platform,
      hardwareConcurrency: navigator.hardwareConcurrency,
      deviceMemory: navigator.deviceMemory,
      maxTouchPoints: navigator.maxTouchPoints,
      vendor: navigator.vendor,
      cookieEnabled: navigator.cookieEnabled,
      doNotTrack: navigator.doNotTrack,
      onLine: navigator.onLine
    };
  }

  /**
   * Get timezone fingerprint
   */
  static getTimezoneFingerprint() {
    const now = new Date();
    return {
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      utcOffset: -now.getTimezoneOffset()
    };
  }

  /**
   * Get plugin fingerprint (if available)
   */
  static getPluginFingerprint() {
    try {
      if (!navigator.plugins) return 'no-plugins-api';
      
      const plugins = [];
      for (let i = 0; i < navigator.plugins.length; i++) {
        plugins.push(navigator.plugins[i].name);
      }
      return plugins.join(',');
    } catch (e) {
      return 'plugins-error';
    }
  }

  /**
   * Get font fingerprint
   */
  static getFontFingerprint() {
    const testFonts = ['Arial', 'Verdana', 'Times New Roman', 'Courier New', 'Georgia'];
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    const getTextWidth = (text, font) => {
      ctx.font = `16px ${font}`;
      return ctx.measureText(text).width;
    };
    
    const baseFonts = ['monospace', 'sans-serif', 'serif'];
    const testString = 'mmmmmmmmmmlli';
    
    const baseWidths = {};
    baseFonts.forEach(font => {
      baseWidths[font] = getTextWidth(testString, font);
    });
    
    const presentFonts = [];
    testFonts.forEach(font => {
      baseFonts.forEach(baseFont => {
        const width = getTextWidth(testString, `'${font}', ${baseFont}`);
        if (width !== baseWidths[baseFont]) {
          presentFonts.push(font);
        }
      });
    });
    
    return presentFonts.join(',');
  }

  /**
   * Generate complete fingerprint
   */
  static generate() {
    if (fingerprintDataCache) return fingerprintDataCache;

    fingerprintDataCache = {
      screen: this.getScreenFingerprint(),
      browser: this.getBrowserFingerprint(),
      timezone: this.getTimezoneFingerprint(),
      fonts: this.getFontFingerprint(),
      canvas: this.getCanvasFingerprint(),
      webgl: this.getWebGLFingerprint(),
      plugins: this.getPluginFingerprint(),
      generatedAt: new Date().toISOString()
    };

    return fingerprintDataCache;
  }

  /**
   * Generate hash of fingerprint
   */
  static generateHash() {
    try {
      const fingerprint = JSON.stringify(this.generate());
      // Convert to simple hash (not cryptographically secure but good for client-side)
      let hash = 0;
      for (let i = 0; i < fingerprint.length; i++) {
        const char = fingerprint.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32-bit integer
      }
      return Math.abs(hash).toString(16).padStart(16, '0');
    } catch (e) {
      console.error('Error generating fingerprint hash:', e);
      return 'error-' + Date.now();
    }
  }

  /**
   * Get fingerprint and add to form/request
   */
  static addToForm(formSelector) {
    try {
      const form = document.querySelector(formSelector);
      if (!form) {
        console.warn(`Form not found: ${formSelector}`);
        return;
      }
      
      const fingerprint = this.generate();
      const hash = this.generateHash();
      
      // Create hidden inputs
      let fpInput = form.querySelector('input[name="browserFingerprint"]');
      if (!fpInput) {
        fpInput = document.createElement('input');
        fpInput.type = 'hidden';
        fpInput.name = 'browserFingerprint';
        form.appendChild(fpInput);
      }
      fpInput.value = JSON.stringify(fingerprint);
      
      let hashInput = form.querySelector('input[name="fingerprintHash"]');
      if (!hashInput) {
        hashInput = document.createElement('input');
        hashInput.type = 'hidden';
        hashInput.name = 'fingerprintHash';
        form.appendChild(hashInput);
      }
      hashInput.value = hash;
      
      console.log('✅ Browser fingerprint added to form');
    } catch (e) {
      console.error('Error adding fingerprint to form:', e);
    }
  }

  /**
   * Get fingerprint for API request
   */
  static getForAPI() {
    try {
      if (fingerprintApiCache) return fingerprintApiCache;

      const fingerprint = this.generate();
      const hash = this.generateHash();

      fingerprintApiCache = {
        browserFingerprint: JSON.stringify(fingerprint),
        fingerprintHash: hash
      };

      return fingerprintApiCache;
    } catch (e) {
      console.error('Error getting fingerprint for API:', e);
      return {
        browserFingerprint: 'error',
        fingerprintHash: 'error'
      };
    }
  }

  /**
   * Add fingerprint to API request headers
   */
  static addToHeaders(headers = {}) {
    const fp = this.getForAPI();
    return {
      ...headers,
      'X-Browser-Fingerprint': fp.fingerprintHash,
      'X-Fingerprint-Data': fp.browserFingerprint
    };
  }

  static async getForAPIAsync() {
    return this.getForAPI();
  }

  static async initializeCache() {
    if (fingerprintApiCache) return fingerprintApiCache;
    if (fingerprintInitPromise) return fingerprintInitPromise;

    fingerprintInitPromise = Promise.resolve().then(() => this.getForAPI());
    return fingerprintInitPromise;
  }
}

// Auto-generate on page load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    if (typeof requestIdleCallback === 'function') {
      requestIdleCallback(() => { BrowserFingerprint.initializeCache().catch(() => {}); }, { timeout: 1000 });
    } else {
      setTimeout(() => { BrowserFingerprint.initializeCache().catch(() => {}); }, 0);
    }
    console.log('🔐 Browser Fingerprint initialized');
  });
} else {
  if (typeof requestIdleCallback === 'function') {
    requestIdleCallback(() => { BrowserFingerprint.initializeCache().catch(() => {}); }, { timeout: 1000 });
  } else {
    setTimeout(() => { BrowserFingerprint.initializeCache().catch(() => {}); }, 0);
  }
  console.log('🔐 Browser Fingerprint available');
}
