const fs = require('fs');
const path = require('path');

describe('Admin dashboard withdrawal requirement toggle', () => {
  const dashboardPath = path.join(__dirname, '..', '..', 'views', 'admin', 'adminDashboard.ejs');
  let source;

  beforeAll(() => {
    source = fs.readFileSync(dashboardPath, 'utf8');
  });

  test('create and edit modals expose withdrawal requirement toggles', () => {
    expect(source).toContain('id="requireWithdrawalToggle"');
    expect(source).toContain('id="editRequireWithdrawalToggle"');
  });

  test('create and edit payloads persist require_withdrawal', () => {
    expect(source).toMatch(/require_withdrawal:\s*requireWithdrawal/);
    expect(source).toMatch(/require_withdrawal:\s*editRequireWithdrawal/);
  });

  test('edit modal loads saved require_withdrawal value', () => {
    expect(source).toContain('session.require_withdrawal !== false');
  });
});
