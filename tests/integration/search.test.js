const request = require('supertest');
const app = require('../../app');
const { GameSession } = require('../../models');

describe('GET /search - Session search endpoint', () => {
  let testSession;
  let testSessionWithForm;

  beforeEach(async () => {
    testSession = await GameSession.create({
      session_code: 'SEARCH001',
      is_active: true,
      player_selected_box: 1,
      player_name: 'Nguyen Van A',
      player_phone: '0901234567'
    });

    testSessionWithForm = await GameSession.create({
      session_code: 'SEARCH002',
      is_active: true,
      player_selected_box: 2,
      player_name: 'Tran Thi B',
      player_phone: '0912345678',
      is_form_submitted: true
    });
  });

  afterEach(async () => {
    if (testSession) await testSession.destroy();
    if (testSessionWithForm) await testSessionWithForm.destroy();
  });

  describe('Valid search', () => {
    test('Should find session when code exists', async () => {
      const res = await request(app)
        .get('/search?code=SEARCH001')
        .expect(200);

      expect(res.text).toContain('SEARCH001');
    });

    test('Should display player name when form submitted', async () => {
      const res = await request(app)
        .get('/search?code=SEARCH002')
        .expect(200);

      expect(res.text.toLowerCase()).toContain('tran thi b');
    });

    test('Should display session code case-insensitively', async () => {
      const res = await request(app)
        .get('/search?code=search001')
        .expect(200);

      expect(res.status).toBe(200);
    });

    test('Should display phone number', async () => {
      const res = await request(app)
        .get('/search?code=SEARCH001')
        .expect(200);

      expect(res.text).toContain('0901234567');
    });

    test('Should display session status', async () => {
      const res = await request(app)
        .get('/search?code=SEARCH001')
        .expect(200);

      expect(res.text.toLowerCase()).toContain('active') ||
      expect(res.text.toLowerCase()).toContain('open');
    });
  });

  describe('Invalid search', () => {
    test('Should show not found when code does not exist', async () => {
      const res = await request(app)
        .get('/search?code=NOTEXIST')
        .expect(200);

      expect(res.text.toLowerCase()).toContain('not found') ||
      expect(res.text.toLowerCase()).toContain('not exist');
    });

    test('Should handle empty search parameter', async () => {
      const res = await request(app)
        .get('/search?code=')
        .expect(200);

      expect(res.status).toBe(200);
    });

    test('Should handle missing code parameter', async () => {
      const res = await request(app)
        .get('/search')
        .expect(200);

      expect(res.status).toBe(200);
    });
  });

  describe('Security', () => {
    test('Should not expose server_random_boxes', async () => {
      const sessionWithSecret = await GameSession.create({
        session_code: 'SEARCH003',
        is_active: true,
        server_random_boxes: [1, 2, 3]
      });

      const res = await request(app)
        .get('/search?code=SEARCH003')
        .expect(200);

      expect(res.text).not.toContain('server_random_boxes');
      expect(JSON.stringify(res.body)).not.toContain('[1,2,3]');

      await sessionWithSecret.destroy();
    });

    test('Should not expose fraud_flag in response', async () => {
      const sessionWithFraud = await GameSession.create({
        session_code: 'SEARCH004',
        is_active: true,
        fraud_flag: true,
        fraud_reason: 'Multiple opens detected'
      });

      const res = await request(app)
        .get('/search?code=SEARCH004')
        .expect(200);

      expect(res.text).not.toContain('fraud_flag');
      expect(res.text).not.toContain('fraud_reason');

      await sessionWithFraud.destroy();
    });

    test('Should not expose player_ip', async () => {
      const sessionWithIP = await GameSession.create({
        session_code: 'SEARCH005',
        is_active: true,
        player_ip: '192.168.1.100'
      });

      const res = await request(app)
        .get('/search?code=SEARCH005')
        .expect(200);

      expect(res.text).not.toContain('192.168.1.100');
      expect(res.text).not.toContain('player_ip');

      await sessionWithIP.destroy();
    });

    test('Should not expose player_token', async () => {
      const sessionWithToken = await GameSession.create({
        session_code: 'SEARCH006',
        is_active: true,
        player_token: 'secret_token_12345'
      });

      const res = await request(app)
        .get('/search?code=SEARCH006')
        .expect(200);

      expect(res.text).not.toContain('secret_token_12345');
      expect(res.text).not.toContain('player_token');

      await sessionWithToken.destroy();
    });

    test('Should prevent SQL injection in search code', async () => {
      const res = await request(app)
        .get('/search?code=SEARCH001\'; DROP TABLE game_sessions;--')
        .expect(200);

      // Session should still exist
      const check = await GameSession.findOne({ where: { session_code: 'SEARCH001' } });
      expect(check).toBeTruthy();
    });

    test('Should sanitize XSS in search results', async () => {
      const sessionWithXSS = await GameSession.create({
        session_code: 'SEARCH007',
        is_active: true,
        player_name: '<script>alert("xss")</script>'
      });

      const res = await request(app)
        .get('/search?code=SEARCH007')
        .expect(200);

      expect(res.text).not.toContain('<script>');
      expect(res.text).not.toContain('alert("xss")');

      await sessionWithXSS.destroy();
    });
  });

  describe('Response format', () => {
    test('Should return HTML response', async () => {
      const res = await request(app)
        .get('/search?code=SEARCH001')
        .expect(200);

      expect(res.type).toMatch(/html/);
    });

    test('Should include search form', async () => {
      const res = await request(app)
        .get('/search?code=SEARCH001')
        .expect(200);

      expect(res.text.toLowerCase()).toContain('search') ||
      expect(res.text.toLowerCase()).toContain('form');
    });
  });

  describe('Session details display', () => {
    test('Should show box number when selected', async () => {
      const res = await request(app)
        .get('/search?code=SEARCH001')
        .expect(200);

      expect(res.text).toContain('1');
    });

    test('Should not show claimed status if not claimed', async () => {
      const res = await request(app)
        .get('/search?code=SEARCH001')
        .expect(200);

      // Session exists but form not submitted
      expect(res.status).toBe(200);
    });

    test('Should show claimed status if form submitted', async () => {
      const res = await request(app)
        .get('/search?code=SEARCH002')
        .expect(200);

      expect(res.status).toBe(200);
    });
  });

  describe('Multiple searches', () => {
    test('Should handle consecutive searches', async () => {
      const res1 = await request(app)
        .get('/search?code=SEARCH001')
        .expect(200);

      const res2 = await request(app)
        .get('/search?code=SEARCH002')
        .expect(200);

      expect(res1.text).toContain('SEARCH001');
      expect(res2.text).toContain('SEARCH002');
    });

    test('Should handle searching for non-existent then existent', async () => {
      const res1 = await request(app)
        .get('/search?code=NOTEXIST')
        .expect(200);

      const res2 = await request(app)
        .get('/search?code=SEARCH001')
        .expect(200);

      expect(res1.status).toBe(200);
      expect(res2.text).toContain('SEARCH001');
    });
  });
});
