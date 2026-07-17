const request = require('supertest');
const app = require('../../app');
const { GameSession, PlayerInventory } = require('../../models');
const { Op } = require('sequelize');
const crypto = require('crypto');

describe('POST /api/lucky-mystery-box/open - Box opening endpoint', () => {
  let testSession;
  let openedSession;

  beforeEach(async () => {
    testSession = await GameSession.create({
      session_code: 'BOXOPEN001',
      is_active: true,
      player_selected_box: null,
      server_random_boxes: [1, 2, 3],
      prize_1: 'iPhone 16 Pro Max',
      prize_1_image_url: 'https://example.com/iphone.jpg',
      prize_1_cash_amount: 30000000,
      prize_2: 'Samsung Galaxy S24',
      prize_2_image_url: 'https://example.com/samsung.jpg',
      prize_2_cash_amount: 20000000,
      prize_3: 'Lucky Draw Ticket',
      prize_3_image_url: 'https://example.com/ticket.jpg',
      prize_3_cash_amount: 5000000,
      view_count: 0,
      result_event_count: 0
    });

    openedSession = await GameSession.create({
      session_code: 'BOXOPEN_OPENED',
      is_active: true,
      player_selected_box: 1
    });
  });

  afterEach(async () => {
    await PlayerInventory.destroy({ where: { session_code: { [Op.in]: ['BOXOPEN001', 'BOXOPEN_OPENED'] } } });
    if (testSession) await testSession.destroy();
    if (openedSession) await openedSession.destroy();
  });

  describe('Happy path - winning', () => {
    test('Should select box and set player_selected_box', async () => {
      const res = await request(app)
        .post('/api/lucky-mystery-box/open')
        .send({ sessionCode: 'BOXOPEN001', boxNumber: 1 })
        .expect(200);

      expect(res.body.success).toBe(true);

      const updated = await GameSession.findOne({ where: { session_code: 'BOXOPEN001' } });
      expect(updated.player_selected_box).toBe(1);
    });

    test('Should set result_event_count to 1', async () => {
      const res = await request(app)
        .post('/api/lucky-mystery-box/open')
        .send({ sessionCode: 'BOXOPEN001', boxNumber: 1 })
        .expect(200);

      const updated = await GameSession.findOne({ where: { session_code: 'BOXOPEN001' } });
      expect(updated.result_event_count).toBe(1);
    });

    test('Should increment result_event_count', async () => {
      await request(app)
        .post('/api/lucky-mystery-box/open')
        .send({ sessionCode: 'BOXOPEN001', boxNumber: 1 })
        .expect(200);

      const after = await GameSession.findOne({ where: { session_code: 'BOXOPEN001' } });
      expect(after.result_event_count).toBeGreaterThan(0);
    });

    test('Should return selected_prize_details with name and image', async () => {
      const res = await request(app)
        .post('/api/lucky-mystery-box/open')
        .send({ sessionCode: 'BOXOPEN001', boxNumber: 1 })
        .expect(200);

      expect(res.body.prize).toBeDefined();
      expect(res.body.prize.name).toBe('iPhone 16 Pro Max');
      expect(res.body.prize.image).toBe('https://example.com/iphone.jpg');
    });

    test('Should calculate correct cash amount for won box', async () => {
      const res = await request(app)
        .post('/api/lucky-mystery-box/open')
        .send({ sessionCode: 'BOXOPEN001', boxNumber: 1 })
        .expect(200);

      expect(res.body.prize.value).toBe(30000000);
    });

    test('Should generate valid result event', async () => {
      const res = await request(app)
        .post('/api/lucky-mystery-box/open')
        .send({ sessionCode: 'BOXOPEN001', boxNumber: 1 })
        .expect(200);

      const updated = await GameSession.findOne({ where: { session_code: 'BOXOPEN001' } });
      expect(updated.box_selection_event).not.toBeNull();

      const event = JSON.parse(updated.box_selection_event);
      expect(event.selected_box).toBe(1);
      expect(typeof event.timestamp).toBe('number');
    });

    test('Should generate result_hash', async () => {
      const res = await request(app)
        .post('/api/lucky-mystery-box/open')
        .send({ sessionCode: 'BOXOPEN001', boxNumber: 1 })
        .expect(200);

      const updated = await GameSession.findOne({ where: { session_code: 'BOXOPEN001' } });
      expect(updated.result_hash).not.toBeNull();
      expect(updated.result_hash).toMatch(/^[a-f0-9]{64}$/);
    });

    test('Should return response with valid JSON', async () => {
      const res = await request(app)
        .post('/api/lucky-mystery-box/open')
        .send({ sessionCode: 'BOXOPEN001', boxNumber: 1 })
        .expect(200);

      expect(res.type).toMatch(/json/);
      expect(res.body.success).toBe(true);
      expect(typeof res.body).toBe('object');
    });
  });

  describe('Happy path - box 2', () => {
    let box2Session;
    beforeEach(async () => {
      box2Session = await GameSession.create({
        session_code: 'BOXOPEN_BOX2',
        is_active: true,
        boxes_opened: JSON.stringify([1]),
        prize_1: 'iPhone 16 Pro Max',
        prize_1_image_url: 'https://example.com/iphone.jpg',
        prize_1_cash_amount: 30000000,
        prize_2: 'Samsung Galaxy S24',
        prize_2_image_url: 'https://example.com/samsung.jpg',
        prize_2_cash_amount: 20000000,
        prize_3: 'Lucky Draw Ticket',
        prize_3_image_url: 'https://example.com/ticket.jpg',
        prize_3_cash_amount: 5000000
      });
    });
    afterEach(async () => {
      await PlayerInventory.destroy({ where: { session_code: 'BOXOPEN_BOX2' } });
      if (box2Session) await box2Session.destroy();
    });

    test('Should open box 2 and return Samsung prize', async () => {
      const res = await request(app)
        .post('/api/lucky-mystery-box/open')
        .send({ sessionCode: 'BOXOPEN_BOX2', boxNumber: 2 })
        .expect(200);

      expect(res.body.prize.name).toBe('Samsung Galaxy S24');
    });

    test('Should return correct cash for box 2', async () => {
      const res = await request(app)
        .post('/api/lucky-mystery-box/open')
        .send({ sessionCode: 'BOXOPEN_BOX2', boxNumber: 2 })
        .expect(200);

      expect(res.body.prize.value).toBe(20000000);
    });
  });

  describe('Happy path - box 3', () => {
    let box3Session;
    beforeEach(async () => {
      box3Session = await GameSession.create({
        session_code: 'BOXOPEN_BOX3',
        is_active: true,
        boxes_opened: JSON.stringify([1, 2]),
        prize_1: 'iPhone 16 Pro Max',
        prize_1_image_url: 'https://example.com/iphone.jpg',
        prize_1_cash_amount: 30000000,
        prize_2: 'Samsung Galaxy S24',
        prize_2_image_url: 'https://example.com/samsung.jpg',
        prize_2_cash_amount: 20000000,
        prize_3: 'Lucky Draw Ticket',
        prize_3_image_url: 'https://example.com/ticket.jpg',
        prize_3_cash_amount: 5000000
      });
    });
    afterEach(async () => {
      await PlayerInventory.destroy({ where: { session_code: 'BOXOPEN_BOX3' } });
      if (box3Session) await box3Session.destroy();
    });

    test('Should open box 3 and return ticket', async () => {
      const res = await request(app)
        .post('/api/lucky-mystery-box/open')
        .send({ sessionCode: 'BOXOPEN_BOX3', boxNumber: 3 })
        .expect(200);

      expect(res.body.prize.name).toBe('Lucky Draw Ticket');
    });

    test('Should return correct cash for box 3', async () => {
      const res = await request(app)
        .post('/api/lucky-mystery-box/open')
        .send({ sessionCode: 'BOXOPEN_BOX3', boxNumber: 3 })
        .expect(200);

      expect(res.body.prize.value).toBe(5000000);
    });
  });

  describe('Rejection - already opened', () => {
    test('Should return 403 when box already opened', async () => {
      const res = await request(app)
        .post('/api/lucky-mystery-box/open')
        .send({ sessionCode: 'BOXOPEN_OPENED', boxNumber: 1 });

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
    });

    test('Should show error message for already opened', async () => {
      const res = await request(app)
        .post('/api/lucky-mystery-box/open')
        .send({ sessionCode: 'BOXOPEN_OPENED', boxNumber: 1 });

      expect(res.body.message).toContain('đã');
    });
  });

  describe('Rejection - invalid input', () => {
    test('Should return 422 when boxNumber missing', async () => {
      const res = await request(app)
        .post('/api/lucky-mystery-box/open')
        .send({ sessionCode: 'BOXOPEN001' });

      expect(res.status).toBe(422);
    });

    test('Should return 422 when boxNumber invalid (0)', async () => {
      const res = await request(app)
        .post('/api/lucky-mystery-box/open')
        .send({ sessionCode: 'BOXOPEN001', boxNumber: 0 });

      expect(res.status).toBe(422);
    });

    test('Should return 422 when boxNumber invalid (4)', async () => {
      const res = await request(app)
        .post('/api/lucky-mystery-box/open')
        .send({ sessionCode: 'BOXOPEN001', boxNumber: 4 });

      expect(res.status).toBe(422);
    });

    test('Should return 422 when boxNumber is string', async () => {
      const res = await request(app)
        .post('/api/lucky-mystery-box/open')
        .send({ sessionCode: 'BOXOPEN001', boxNumber: 'abc' });

      expect(res.status).toBe(422);
    });

    test('Should return 422 when sessionCode empty', async () => {
      const res = await request(app)
        .post('/api/lucky-mystery-box/open')
        .send({ sessionCode: '', boxNumber: 1 });

      expect(res.status).toBe(422);
    });

    test('Should return 404 when sessionCode not found', async () => {
      const res = await request(app)
        .post('/api/lucky-mystery-box/open')
        .send({ sessionCode: 'NOTFOUND', boxNumber: 1 });

      expect(res.status).toBe(404);
    });
  });

  describe('Rejection - inactive session', () => {
    test('Should return 403 when session inactive', async () => {
      const inactive = await GameSession.create({
        session_code: 'BOXOPEN_INACTIVE',
        is_active: false
      });

      const res = await request(app)
        .post('/api/lucky-mystery-box/open')
        .send({ sessionCode: 'BOXOPEN_INACTIVE', boxNumber: 1 });

      expect(res.status).toBe(403);

      await inactive.destroy();
    });
  });

  describe('Security - no secret exposure', () => {
    test('Should not expose server_random_boxes in response', async () => {
      const res = await request(app)
        .post('/api/lucky-mystery-box/open')
        .send({ sessionCode: 'BOXOPEN001', boxNumber: 1 })
        .expect(200);

      expect(JSON.stringify(res.body)).not.toContain('server_random_boxes');
    });

    test('Should not expose fraud_flag', async () => {
      const fraudSession = await GameSession.create({
        session_code: 'BOXOPEN_FRAUD',
        is_active: true,
        fraud_flag: true
      });

      const res = await request(app)
        .post('/api/lucky-mystery-box/open')
        .send({ sessionCode: 'BOXOPEN_FRAUD', boxNumber: 1 })
        .expect(403);

      expect(JSON.stringify(res.body)).not.toContain('fraud_flag');

      await fraudSession.destroy();
    });

    test('Should not expose result seed in response', async () => {
      const res = await request(app)
        .post('/api/lucky-mystery-box/open')
        .send({ sessionCode: 'BOXOPEN001', boxNumber: 1 })
        .expect(200);

      expect(JSON.stringify(res.body)).not.toContain('seed');
    });

    test('Should not expose player_ip', async () => {
      const res = await request(app)
        .post('/api/lucky-mystery-box/open')
        .send({ sessionCode: 'BOXOPEN001', boxNumber: 1 })
        .expect(200);

      expect(JSON.stringify(res.body)).not.toContain('192.168') &&
      expect(JSON.stringify(res.body)).not.toContain('player_ip');
    });

    test('Should not expose player_token in response', async () => {
      const res = await request(app)
        .post('/api/lucky-mystery-box/open')
        .send({ sessionCode: 'BOXOPEN001', boxNumber: 1 })
        .expect(200);

      expect(JSON.stringify(res.body)).not.toContain('player_token');
    });
  });

  describe('Data integrity', () => {
    test('Should persist selected_prize_details as valid JSON', async () => {
      const res = await request(app)
        .post('/api/lucky-mystery-box/open')
        .send({ sessionCode: 'BOXOPEN001', boxNumber: 1 })
        .expect(200);

      const updated = await GameSession.findOne({ where: { session_code: 'BOXOPEN001' } });
      const details = JSON.parse(updated.selected_prize_details);
      expect(details.name).toBe('iPhone 16 Pro Max');
    });

    test('Should ensure result_hash is exactly 64 hex characters', async () => {
      const res = await request(app)
        .post('/api/lucky-mystery-box/open')
        .send({ sessionCode: 'BOXOPEN001', boxNumber: 1 })
        .expect(200);

      const updated = await GameSession.findOne({ where: { session_code: 'BOXOPEN001' } });
      expect(updated.result_hash.length).toBe(64);
      expect(updated.result_hash).toMatch(/^[a-f0-9]{64}$/);
    });

    test('Should ensure box_selection_event has timestamp', async () => {
      const res = await request(app)
        .post('/api/lucky-mystery-box/open')
        .send({ sessionCode: 'BOXOPEN001', boxNumber: 1 })
        .expect(200);

      const updated = await GameSession.findOne({ where: { session_code: 'BOXOPEN001' } });
      const event = JSON.parse(updated.box_selection_event);
      expect(event.timestamp).toBeDefined();
      expect(typeof event.timestamp).toBe('number');
    });
  });

  describe('Idempotency', () => {
    test('Should handle duplicate requests gracefully', async () => {
      const res1 = await request(app)
        .post('/api/lucky-mystery-box/open')
        .send({ sessionCode: 'BOXOPEN001', boxNumber: 1 })
        .expect(200);

      const res2 = await request(app)
        .post('/api/lucky-mystery-box/open')
        .send({ sessionCode: 'BOXOPEN001', boxNumber: 1 });

      expect(res1.body.success).toBe(true);
      expect(res2.status).toBe(403);
    });
  });

  describe('Response format', () => {
    test('Should return JSON response with success flag', async () => {
      const res = await request(app)
        .post('/api/lucky-mystery-box/open')
        .send({ sessionCode: 'BOXOPEN001', boxNumber: 1 })
        .expect(200);

      expect(res.type).toMatch(/json/);
      expect(res.body.success).toBe(true);
    });

    test('Should return prizeDetails with all fields', async () => {
      const res = await request(app)
        .post('/api/lucky-mystery-box/open')
        .send({ sessionCode: 'BOXOPEN001', boxNumber: 1 })
        .expect(200);

      const prize = res.body.prize;
      expect(prize.name).toBeDefined();
      expect(prize.image).toBeDefined();
      expect(prize.value).toBeDefined();
    });

    test('Should include boxNumber in response', async () => {
      const res = await request(app)
        .post('/api/lucky-mystery-box/open')
        .send({ sessionCode: 'BOXOPEN001', boxNumber: 1 })
        .expect(200);

      expect(res.body.openedBox).toBe(1);
    });
  });
});
