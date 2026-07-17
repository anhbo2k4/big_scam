const fs = require('fs');
const path = require('path');

describe('runtime performance guards', () => {
  test('admin customer care does not block chat loading on visual settings', () => {
    const source = fs.readFileSync(
      path.join(__dirname, '../../public/js/admin-customer-care.js'),
      'utf8'
    );

    const initBodyMatch = source.match(/async function init\(\) \{([\s\S]*?)\n  \}/);
    expect(initBodyMatch).not.toBeNull();

    const initBody = initBodyMatch[1];
    expect(initBody).toContain('loadVisualSettings()');
    expect(initBody).not.toContain('await loadVisualSettings()');
    expect(initBody.indexOf('loadVisualSettings()')).toBeLessThan(initBody.indexOf('await loadSessions()'));
  });

  test('admin customer care loads emoji runtime from a local asset', () => {
    const partial = fs.readFileSync(
      path.join(__dirname, '../../views/admin/partials/dashboard-tabs/customer-care.ejs'),
      'utf8'
    );

    expect(partial).toContain("tag.src = '/vendor/emoji-mart/browser.js'");
    expect(partial).not.toContain('cdn.jsdelivr.net/npm/emoji-mart');
  });

  test('content security policy allows the configured Font Awesome stylesheet', () => {
    const { buildContentSecurityPolicy } = require('../../utils/requestSecurity');

    const policy = buildContentSecurityPolicy({ secureRequest: false });

    expect(policy).toContain("style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdnjs.cloudflare.com");
    expect(policy).toContain("font-src 'self' data: https://fonts.gstatic.com https://cdnjs.cloudflare.com");
  });

  test('database pool honours production env values above five connections', () => {
    const source = fs.readFileSync(
      path.join(__dirname, '../../models/index.js'),
      'utf8'
    );

    expect(source).not.toContain('Math.min(5, Number(process.env.DB_POOL_MAX');
    expect(source).toContain('DB_POOL_MAX_CAP');
    expect(source).toContain('max: configuredPoolMax');
  });

  test('settings DB reads have timeout fallback before serving API settings', () => {
    const source = fs.readFileSync(
      path.join(__dirname, '../../controllers/settingsController.js'),
      'utf8'
    );

    expect(source).toContain('SETTINGS_DB_QUERY_TIMEOUT_MS');
    expect(source).toContain('withTimeout(');
    expect(source).toContain('db.SiteSettings.findAll({ raw: true })');
  });
});
