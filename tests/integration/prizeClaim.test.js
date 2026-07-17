const request = require('supertest');
const app = require('../../app');
const { GameSession, GiftExchange, PlayerInventory } = require('../../models');

describe('POST /api/lucky-mystery-box/:sessionCode/claim', () => {
  let testSession;

  beforeEach(async () => {
    testSession = await GameSession.create({
      session_code: 'CLAIM001',
      is_active: true,
      player_selected_box: 1,
      prize_1: 'iPhone 16 Pro Max',
      selected_prize_details: JSON.stringify({
        name: 'iPhone 16 Pro Max',
        isCash: false
      }),
      is_form_submitted: false,
      is_exchanged: false
    });
    await PlayerInventory.create({
      session_code: 'CLAIM001',
      box_number: 1,
      prize_name: 'iPhone 16 Pro Max',
      status: 'obtained',
      prize_value: 0,
      is_cash: false
    });
  });

  afterEach(async () => {
    await PlayerInventory.destroy({ where: { session_code: 'CLAIM001' } });
    await GiftExchange.destroy({ where: { session_code: 'CLAIM001' } });
    if (testSession) await testSession.destroy();
  });

  describe('Happy path', () => {
    test('Should set is_form_submitted = 1 in DB', async () => {
      await request(app)
        .post('/api/lucky-mystery-box/CLAIM001/claim')
        .send({
          name: 'Nguyen Van A',
          phone: '0901234567',
          address: '123 Main St',
          city: 'Hanoi'
        });

      const updated = await GameSession.findOne({ where: { session_code: 'CLAIM001' } });
      expect(updated.is_form_submitted).toBe(true);
    });

    test('Should set form_submitted_at timestamp', async () => {
      const before = Date.now();

      await request(app)
        .post('/api/lucky-mystery-box/CLAIM001/claim')
        .send({
          name: 'Nguyen Van A',
          phone: '0901234567',
          address: '123 Main St',
          city: 'Hanoi'
        });

      const updated = await GameSession.findOne({ where: { session_code: 'CLAIM001' } });
      const after = Date.now();

      expect(updated.form_submitted_at.getTime()).toBeGreaterThanOrEqual(before);
      expect(updated.form_submitted_at.getTime()).toBeLessThanOrEqual(after);
    });

    test('Should save player_name correctly', async () => {
      await request(app)
        .post('/api/lucky-mystery-box/CLAIM001/claim')
        .send({
          name: 'Nguyen Van A',
          phone: '0901234567',
          address: '123 Main St',
          city: 'Hanoi'
        });

      const updated = await GameSession.findOne({ where: { session_code: 'CLAIM001' } });
      expect(updated.player_name).toBe('Nguyen Van A');
    });

    test('Should save player_phone correctly', async () => {
      await request(app)
        .post('/api/lucky-mystery-box/CLAIM001/claim')
        .send({
          name: 'Nguyen Van A',
          phone: '0901234567',
          address: '123 Main St',
          city: 'Hanoi'
        });

      const updated = await GameSession.findOne({ where: { session_code: 'CLAIM001' } });
      expect(updated.player_phone).toBe('0901234567');
    });

    test('Should save player_email correctly', async () => {
      await request(app)
        .post('/api/lucky-mystery-box/CLAIM001/claim')
        .send({
          name: 'Nguyen Van A',
          phone: '0901234567',
          email: 'test@gmail.com',
          address: '123 Main St',
          city: 'Hanoi'
        });

      const updated = await GameSession.findOne({ where: { session_code: 'CLAIM001' } });
      expect(updated.player_email).toBe('test@gmail.com');
    });

    test('Should strip XSS from player_name before saving', async () => {
      await request(app)
        .post('/api/lucky-mystery-box/CLAIM001/claim')
        .send({
          name: '<script>alert(1)</script>Nguyen',
          phone: '0901234567',
          address: '123 Main St',
          city: 'Hanoi'
        });

      const updated = await GameSession.findOne({ where: { session_code: 'CLAIM001' } });
      expect(updated.player_name).not.toContain('<');
      expect(updated.player_name).not.toContain('>');
    });

    test('Should return success message', async () => {
      const res = await request(app)
        .post('/api/lucky-mystery-box/CLAIM001/claim')
        .send({
          name: 'Nguyen Van A',
          phone: '0901234567',
          address: '123 Main St',
          city: 'Hanoi'
        });

      expect(res.body.success).toBe(true);
      expect(res.body.message).toBeDefined();
    });

    test('Should create GiftExchange record', async () => {
      await request(app)
        .post('/api/lucky-mystery-box/CLAIM001/claim')
        .send({
          name: 'Nguyen Van A',
          phone: '0901234567',
          address: '123 Main St',
          city: 'Hanoi'
        });

      const exchange = await GiftExchange.findOne({ where: { session_code: 'CLAIM001' } });
      expect(exchange).toBeDefined();
      expect(exchange.recipient_name).toBe('Nguyen Van A');
    });
  });

  describe('Rejections', () => {
    test('Should return 400 when player_selected_box IS NULL', async () => {
      const noBox = await GameSession.create({
        session_code: 'CLAIM002',
        is_active: true,
        player_selected_box: null
      });

      const res = await request(app)
        .post('/api/lucky-mystery-box/CLAIM002/claim')
        .send({
          name: 'Nguyen Van A',
          phone: '0901234567',
          address: '123 Main St',
          city: 'Hanoi'
        });

      expect(res.status).toBe(400);

      await noBox.destroy();
    });

    test('Should return 400 when is_form_submitted already = 1', async () => {
      const alreadyClaimed = await GameSession.create({
        session_code: 'CLAIM003',
        is_active: true,
        player_selected_box: 1,
        is_form_submitted: true
      });
      await PlayerInventory.create({
        session_code: 'CLAIM003',
        box_number: 1,
        prize_name: 'iPhone 16 Pro Max',
        status: 'claimed',
        prize_value: 0,
        is_cash: false
      });

      const res = await request(app)
        .post('/api/lucky-mystery-box/CLAIM003/claim')
        .send({
          name: 'Nguyen Van B',
          phone: '0901234567',
          address: '456 Side St',
          city: 'HCM'
        });

      expect(res.status).toBe(400);

      await PlayerInventory.destroy({ where: { session_code: 'CLAIM003' } });
      await alreadyClaimed.destroy();
    });

    test('Should return 400 when is_exchanged = 1', async () => {
      const exchanged = await GameSession.create({
        session_code: 'CLAIM004',
        is_active: true,
        player_selected_box: 1,
        is_exchanged: true
      });
      await PlayerInventory.create({
        session_code: 'CLAIM004',
        box_number: 1,
        prize_name: 'iPhone 16 Pro Max',
        status: 'converted',
        prize_value: 0,
        is_cash: true
      });

      const res = await request(app)
        .post('/api/lucky-mystery-box/CLAIM004/claim')
        .send({
          name: 'Nguyen Van C',
          phone: '0901234567',
          address: '789 Long St',
          city: 'Da Nang'
        });

      expect(res.status).toBe(400);

      await PlayerInventory.destroy({ where: { session_code: 'CLAIM004' } });
      await exchanged.destroy();
    });

    test('Should return 404 when session not found', async () => {
      const res = await request(app)
        .post('/api/lucky-mystery-box/NOTFOUND/claim')
        .send({
          name: 'Nguyen Van A',
          phone: '0901234567',
          address: '123 Main St',
          city: 'Hanoi'
        });

      expect(res.status).toBe(404);
    });

    test('Should return 400 when name is empty', async () => {
      const res = await request(app)
        .post('/api/lucky-mystery-box/CLAIM001/claim')
        .send({
          name: '',
          phone: '0901234567',
          address: '123 Main St',
          city: 'Hanoi'
        });

      expect(res.status).toBe(400);
    });

    test('Should return 400 when phone is empty', async () => {
      const res = await request(app)
        .post('/api/lucky-mystery-box/CLAIM001/claim')
        .send({
          name: 'Nguyen Van A',
          phone: '',
          address: '123 Main St',
          city: 'Hanoi'
        });

      expect(res.status).toBe(400);
    });

    test('Should return 400 when address is missing', async () => {
      const res = await request(app)
        .post('/api/lucky-mystery-box/CLAIM001/claim')
        .send({
          name: 'Nguyen Van A',
          phone: '0901234567',
          city: 'Hanoi'
        });

      expect(res.status).toBe(400);
    });

    test('Should return 400 when city is missing', async () => {
      const res = await request(app)
        .post('/api/lucky-mystery-box/CLAIM001/claim')
        .send({
          name: 'Nguyen Van A',
          phone: '0901234567',
          address: '123 Main St'
        });

      expect(res.status).toBe(400);
    });
  });
});
