const request = require('supertest');
const app = require('../../app');
const { GameSession, Withdrawal, PlayerInventory, ConversionRequest } = require('../../models');

describe('POST /api/lucky-mystery-box/:sessionCode/convert', () => {
  let testSession;

  beforeEach(async () => {
    testSession = await GameSession.create({
      session_code: 'EXCHANGE001',
      is_active: true,
      player_selected_box: 2,
      selected_prize_details: JSON.stringify({
        name: 'Sony WH-1000XM5',
        isCash: true,
        cashAmount: 4900000
      }),
      prize_2_cash: true,
      prize_2_cash_amount: 4900000,
      is_exchanged: false,
      is_form_submitted: false
    });
    await PlayerInventory.create({
      session_code: 'EXCHANGE001',
      box_number: 2,
      prize_name: 'Sony WH-1000XM5',
      status: 'obtained',
      is_cash: true,
      prize_value: 4900000
    });
  });

  afterEach(async () => {
    await PlayerInventory.destroy({ where: { session_code: 'EXCHANGE001' } });
    await ConversionRequest.destroy({ where: { session_code: 'EXCHANGE001' } });
    if (testSession) await testSession.destroy();
  });

  describe('Happy path', () => {
    test('Should set is_exchanged = 1 in DB', async () => {
      await request(app)
        .post('/api/lucky-mystery-box/EXCHANGE001/convert')
        .send({ boxNumber: 2 });

      const updated = await GameSession.findOne({ where: { session_code: 'EXCHANGE001' } });
      expect(updated.is_exchanged).toBe(true);
    });

    test('Should set exchanged_at timestamp', async () => {
      const before = Date.now();

      await request(app)
        .post('/api/lucky-mystery-box/EXCHANGE001/convert')
        .send({ boxNumber: 2 });

      const updated = await GameSession.findOne({ where: { session_code: 'EXCHANGE001' } });
      const after = Date.now();

      expect(updated.exchanged_at).toBeDefined();
      expect(updated.exchanged_at.getTime()).toBeGreaterThanOrEqual(before);
      expect(updated.exchanged_at.getTime()).toBeLessThanOrEqual(after);
    });

    test('Should return correct cash amount', async () => {
      const res = await request(app)
        .post('/api/lucky-mystery-box/EXCHANGE001/convert')
        .send({ boxNumber: 2 });

      expect(res.body.success).toBe(true);
      expect(res.body.cashAmount).toBe(4900000);
    });

    test('Should create ConversionRequest record', async () => {
      await request(app)
        .post('/api/lucky-mystery-box/EXCHANGE001/convert')
        .send({ boxNumber: 2 });

      const conversion = await ConversionRequest.findOne({ where: { session_code: 'EXCHANGE001' } });
      expect(conversion).toBeDefined();
      expect(conversion.amount).toBe(4900000);
      expect(conversion.status).toBe('approved');
    });

    test('Should return success message', async () => {
      const res = await request(app)
        .post('/api/lucky-mystery-box/EXCHANGE001/convert')
        .send({ boxNumber: 2 });

      expect(res.body.success).toBe(true);
      expect(res.body.message).toBeDefined();
      expect(res.status).toBe(200);
    });
  });

  describe('Rejections', () => {
    test('Should return 400 when player_selected_box IS NULL', async () => {
      const noBox = await GameSession.create({
        session_code: 'EXCHANGE002',
        is_active: true,
        player_selected_box: null
      });

      const res = await request(app)
        .post('/api/lucky-mystery-box/EXCHANGE002/convert')
        .send({});

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);

      await noBox.destroy();
    });

    test('Should return 400 when is_exchanged already = 1', async () => {
      const alreadyExchanged = await GameSession.create({
        session_code: 'EXCHANGE003',
        is_active: true,
        player_selected_box: 2,
        is_exchanged: true,
        prize_2_cash: true,
        prize_2_cash_amount: 4900000
      });

      const res = await request(app)
        .post('/api/lucky-mystery-box/EXCHANGE003/convert')
        .send({});

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);

      await alreadyExchanged.destroy();
    });

    test('Should return 400 when prize_N_cash = 0 (physical item only)', async () => {
      const physicalItem = await GameSession.create({
        session_code: 'EXCHANGE004',
        is_active: true,
        player_selected_box: 1,
        prize_1_cash: false,
        selected_prize_details: JSON.stringify({
          name: 'iPhone 16',
          isCash: false
        })
      });

      const res = await request(app)
        .post('/api/lucky-mystery-box/EXCHANGE004/convert')
        .send({});

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);

      await physicalItem.destroy();
    });

    test('Should return 404 when session not found', async () => {
      const res = await request(app)
        .post('/api/lucky-mystery-box/NOTFOUND/convert')
        .send({});

      expect(res.status).toBe(404);
    });

    test('Should return 400 when is_active = 0', async () => {
      const inactive = await GameSession.create({
        session_code: 'EXCHANGE005',
        is_active: false,
        player_selected_box: 2,
        prize_2_cash: true,
        prize_2_cash_amount: 4900000
      });

      const res = await request(app)
        .post('/api/lucky-mystery-box/EXCHANGE005/convert')
        .send({});

      expect(res.status).toBe(404);

      await inactive.destroy();
    });

    test('Should return 400 when prize_N_cash_amount = null', async () => {
      const noCash = await GameSession.create({
        session_code: 'EXCHANGE006',
        is_active: true,
        player_selected_box: 2,
        prize_2_cash: true,
        prize_2_cash_amount: null
      });

      const res = await request(app)
        .post('/api/lucky-mystery-box/EXCHANGE006/convert')
        .send({});

      expect(res.status).toBe(400);

      await noCash.destroy();
    });

    test('Should return 400 when prize_N_cash_amount <= 0', async () => {
      const zero = await GameSession.create({
        session_code: 'EXCHANGE007',
        is_active: true,
        player_selected_box: 2,
        prize_2_cash: true,
        prize_2_cash_amount: 0
      });

      const res = await request(app)
        .post('/api/lucky-mystery-box/EXCHANGE007/convert')
        .send({});

      expect(res.status).toBe(400);

      await zero.destroy();
    });
  });
});
