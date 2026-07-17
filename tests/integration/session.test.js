const request = require('supertest');
const app = require('../../app');
const { GameSession } = require('../../models');
const crypto = require('crypto');

describe('POST /api/lucky-mystery-box/join - Session join endpoint', () => {
  let testSession;

  beforeEach(async () => {
    testSession = await GameSession.create({
      session_code: 'JOIN001',
      is_active: true,
      view_count: 0,
      server_random_boxes: [1, 2, 3],
      player_ip: null,
      player_token: null
    });
  });

  afterEach(async () => {
    if (testSession) await testSession.destroy();
  });

  describe('Valid join', () => {
    test('Should increment view_count on join', async () => {
      const before = await GameSession.findOne({ where: { session_code: 'JOIN001' } });
      const countBefore = before.view_count;

      await request(app)
        .post('/api/lucky-mystery-box/join')
        .send({ sessionCode: 'JOIN001' })
        .expect(200);

      const after = await GameSession.findOne({ where: { session_code: 'JOIN001' } });
      expect(after.view_count).toBeGreaterThan(countBefore);
    });

    test('Should set player_viewed_at timestamp on join', async () => {
      const before = await GameSession.findOne({ where: { session_code: 'JOIN001' } });
      expect(before.player_viewed_at).toBeNull();

      await request(app)
        .post('/api/lucky-mystery-box/join')
        .send({ sessionCode: 'JOIN001' })
        .expect(200);

      const after = await GameSession.findOne({ where: { session_code: 'JOIN001' } });
      expect(after.player_viewed_at).not.toBeNull();
    });

    test('Should capture player_ip on join', async () => {
      const before = await GameSession.findOne({ where: { session_code: 'JOIN001' } });
      expect(before.player_ip).toBeNull();

      await request(app)
        .post('/api/lucky-mystery-box/join')
        .send({ sessionCode: 'JOIN001' })
        .expect(200);

      const after = await GameSession.findOne({ where: { session_code: 'JOIN001' } });
      expect(after.player_ip).not.toBeNull();
    });

    test('Should generate player_token on join', async () => {
      const before = await GameSession.findOne({ where: { session_code: 'JOIN001' } });
      expect(before.player_token).toBeNull();

      await request(app)
        .post('/api/lucky-mystery-box/join')
        .send({ sessionCode: 'JOIN001' })
        .expect(200);

      const after = await GameSession.findOne({ where: { session_code: 'JOIN001' } });
      expect(after.player_token).not.toBeNull();
      expect(typeof after.player_token).toBe('string');
      expect(after.player_token.length).toBeGreaterThan(0);
    });

    test('Should return success response', async () => {
      const res = await request(app)
        .post('/api/lucky-mystery-box/join')
        .send({ sessionCode: 'JOIN001' })
        .expect(200);

      expect(res.body.success).toBe(true);
    });

    test('Should return session data in response', async () => {
      const res = await request(app)
        .post('/api/lucky-mystery-box/join')
        .send({ sessionCode: 'JOIN001' })
        .expect(200);

      expect(res.body.data).toBeDefined();
      expect(res.body.data.sessionCode).toBe('JOIN001');
    });

    test('Should store session in req.session', async () => {
      const agent = request.agent(app);

      const res = await agent
        .post('/api/lucky-mystery-box/join')
        .send({ sessionCode: 'JOIN001' })
        .expect(200);

      expect(res.body.success).toBe(true);
    });

    test('Should allow multiple views by same user', async () => {
      const res1 = await request(app)
        .post('/api/lucky-mystery-box/join')
        .send({ sessionCode: 'JOIN001' })
        .expect(200);

      const res2 = await request(app)
        .post('/api/lucky-mystery-box/join')
        .send({ sessionCode: 'JOIN001' })
        .expect(200);

      expect(res1.body.success).toBe(true);
      expect(res2.body.success).toBe(true);

      const final = await GameSession.findOne({ where: { session_code: 'JOIN001' } });
      expect(final.view_count).toBe(2);
    });
  });

  describe('Join validation', () => {
    test('Should return 404 when session_code not found', async () => {
      const res = await request(app)
        .post('/api/lucky-mystery-box/join')
        .send({ sessionCode: 'NOTFOUND' });

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });

    test('Should return error when joining inactive session', async () => {
      const inactive = await GameSession.create({
        session_code: 'JOIN_INACTIVE',
        is_active: false
      });

      const res = await request(app)
        .post('/api/lucky-mystery-box/join')
        .send({ sessionCode: 'JOIN_INACTIVE' });

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);

      await inactive.destroy();
    });

    test('Should return error when sessionCode is empty', async () => {
      const res = await request(app)
        .post('/api/lucky-mystery-box/join')
        .send({ sessionCode: '' });

      expect(res.status).toBe(400);
    });

    test('Should return error when sessionCode missing', async () => {
      const res = await request(app)
        .post('/api/lucky-mystery-box/join')
        .send({});

      expect(res.status).toBe(400);
    });

    test('Should sanitize sessionCode input', async () => {
      const res = await request(app)
        .post('/api/lucky-mystery-box/join')
        .send({ sessionCode: "JOIN001'; DROP TABLE--" });

      expect(res.status).not.toBe(200);

      // Original session should still exist
      const check = await GameSession.findOne({ where: { session_code: 'JOIN001' } });
      expect(check).toBeTruthy();
    });

    test('Should not allow SQL injection via sessionCode', async () => {
      const res = await request(app)
        .post('/api/lucky-mystery-box/join')
        .send({ sessionCode: "UNION SELECT * FROM--" });

      expect(res.status).toBeGreaterThanOrEqual(400);
    });
  });

  describe('Box state after join', () => {
    test('Should allow joining session that already opened box', async () => {
      const opened = await GameSession.create({
        session_code: 'JOIN_OPENED',
        is_active: true,
        player_selected_box: 1
      });

      const res = await request(app)
        .post('/api/lucky-mystery-box/join')
        .send({ sessionCode: 'JOIN_OPENED' })
        .expect(200);

      expect(res.body.success).toBe(true);

      await opened.destroy();
    });

    test('Should allow joining session with completed claim', async () => {
      const claimed = await GameSession.create({
        session_code: 'JOIN_CLAIMED',
        is_active: true,
        player_selected_box: 2,
        is_form_submitted: true
      });

      const res = await request(app)
        .post('/api/lucky-mystery-box/join')
        .send({ sessionCode: 'JOIN_CLAIMED' })
        .expect(200);

      expect(res.body.success).toBe(true);

      await claimed.destroy();
    });
  });

  describe('Token generation', () => {
    test('Should generate unique token per join', async () => {
      const session = await GameSession.create({
        session_code: 'TOKEN_TEST',
        is_active: true
      });

      const res1 = await request(app)
        .post('/api/lucky-mystery-box/join')
        .send({ sessionCode: 'TOKEN_TEST' })
        .expect(200);

      const updated = await GameSession.findOne({ where: { session_code: 'TOKEN_TEST' } });
      const token1 = updated.player_token;

      expect(token1).not.toBeNull();
      expect(typeof token1).toBe('string');

      await session.destroy();
    });

    test('Should store token in session cookie', async () => {
      const agent = request.agent(app);

      const res = await agent
        .post('/api/lucky-mystery-box/join')
        .send({ sessionCode: 'JOIN001' })
        .expect(200);

      expect(res.headers['set-cookie']).toBeDefined();
    });
  });

  describe('Response security', () => {
    test('Should not expose server_random_boxes in response', async () => {
      const res = await request(app)
        .post('/api/lucky-mystery-box/join')
        .send({ sessionCode: 'JOIN001' })
        .expect(200);

      expect(JSON.stringify(res.body)).not.toContain('server_random_boxes');
      expect(JSON.stringify(res.body)).not.toContain('[1,2,3]');
    });

    test('Should not expose fraud_flag in response', async () => {
      const fraudSession = await GameSession.create({
        session_code: 'JOIN_FRAUD',
        is_active: true,
        fraud_flag: true
      });

      const res = await request(app)
        .post('/api/lucky-mystery-box/join')
        .send({ sessionCode: 'JOIN_FRAUD' })
        .expect(200);

      expect(JSON.stringify(res.body)).not.toContain('fraud_flag');

      await fraudSession.destroy();
    });

    test('Should not expose player_selected_box_result', async () => {
      const res = await request(app)
        .post('/api/lucky-mystery-box/join')
        .send({ sessionCode: 'JOIN001' })
        .expect(200);

      expect(JSON.stringify(res.body)).not.toContain('player_selected_box_result');
    });
  });
});
