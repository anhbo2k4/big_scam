/**
 * i18n middleware - detects language and injects translations into res.locals
 */
const { detectLanguage, getTranslations, SUPPORTED_LANGS, DEFAULT_LANG } = require('../utils/i18n');
const { buildCookieOptions } = require('../utils/requestSecurity');

function i18nMiddleware(req, res, next) {
  const lang = detectLanguage(req);

  // Set cookie for persistence (30 days)
  if (req.query && req.query.lang && SUPPORTED_LANGS.includes(req.query.lang)) {
    res.cookie('lang', req.query.lang, buildCookieOptions(req, {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      httpOnly: false,
      sameSite: 'lax'
    }));
  }

  // Inject into res.locals for EJS templates
  res.locals.lang = lang;
  res.locals.i18n = getTranslations(lang);
  res.locals.supportedLangs = SUPPORTED_LANGS;

  next();
}

module.exports = i18nMiddleware;
