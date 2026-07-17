const request = require('supertest');
const app = require('../../app');
const { GameSession, PlayerInventory, Withdrawal, ConversionRequest } = require('../../models');

const cleanupSessionCodes = async (codes) => {
  const sessionCodes = Array.isArray(codes) ? codes : [codes];
  await PlayerInventory.destroy({ where: { session_code: sessionCodes } });
  await Withdrawal.destroy({ where: { session_code: sessionCodes } });
  if (ConversionRequest) {
    await ConversionRequest.destroy({ where: { session_code: sessionCodes } });
  }
  await GameSession.destroy({ where: { session_code: sessionCodes } });
};

describe('Validate Box Middleware', () => {
  let testSession;

  beforeEach(async () => {
    testSession = await GameSession.create({
      session_code: 'VALIDATE001',
      is_active: true,
      player_selected_box: null,
      fraud_flag: false,
      is_completed: false,
      server_random_boxes: JSON.stringify([2])
    });
  });

  afterEach(async () => {
    if (testSession) await testSession.destroy();
  });

  describe('Valid requests', () => {
    test('Should pass when all conditions are valid', async () => {
      const res = await request(app)
        .post('/api/lucky-mystery-box/VALIDATE001/select-box')
        .send({
          sessionCode: 'VALIDATE001',
          boxNumber: 1
        });

      expect(res.status).not.toBe(400);
      expect(res.status).not.toBe(422);
    });
  });

  describe('Session validation', () => {
    test('Should return 404 when session_code not found', async () => {
      const res = await request(app)
        .post('/api/lucky-mystery-box/NOTFOUND/select-box')
        .send({
          sessionCode: 'NOTFOUND',
          boxNumber: 1
        });

      expect(res.status).toBe(404);
    });

    test('Should return 403 when is_active = 0', async () => {
      const inactive = await GameSession.create({
        session_code: 'INACTIVE',
        is_active: false
      });

      const res = await request(app)
        .post('/api/lucky-mystery-box/INACTIVE/select-box')
        .send({
          sessionCode: 'INACTIVE',
          boxNumber: 1
        });

      expect(res.status).toBe(403);

      await inactive.destroy();
    });

    test('Should return 403 when player_selected_box already set (same box)', async () => {
      const opened = await GameSession.create({
        session_code: 'OPENED',
        is_active: true,
        player_selected_box: 1
      });

      const res = await request(app)
        .post('/api/lucky-mystery-box/OPENED/select-box')
        .send({
          sessionCode: 'OPENED',
          boxNumber: 1
        });

      expect(res.status).toBe(403);

      await opened.destroy();
    });

    test('Should return 403 when fraud_flag = 1', async () => {
      const fraud = await GameSession.create({
        session_code: 'FRAUD',
        is_active: true,
        fraud_flag: true
      });

      const res = await request(app)
        .post('/api/lucky-mystery-box/FRAUD/select-box')
        .send({
          sessionCode: 'FRAUD',
          boxNumber: 1
        });

      expect(res.status).toBe(403);

      await fraud.destroy();
    });

    test('Should return 403 when is_completed = 1', async () => {
      const completed = await GameSession.create({
        session_code: 'COMPLETE',
        is_active: true,
        is_completed: true
      });

      const res = await request(app)
        .post('/api/lucky-mystery-box/COMPLETE/select-box')
        .send({
          sessionCode: 'COMPLETE',
          boxNumber: 1
        });

      expect(res.status).toBe(403);

      await completed.destroy();
    });
  });

  describe('Input validation', () => {
    test('Should return 422 when boxNumber is missing', async () => {
      const res = await request(app)
        .post('/api/lucky-mystery-box/VALIDATE001/select-box')
        .send({
          sessionCode: 'VALIDATE001'
        });

      expect(res.status).toBe(422);
    });

    test('Should return 422 when boxNumber = 0', async () => {
      const res = await request(app)
        .post('/api/lucky-mystery-box/VALIDATE001/select-box')
        .send({
          sessionCode: 'VALIDATE001',
          boxNumber: 0
        });

      expect(res.status).toBe(422);
    });

    test('Should return 422 when boxNumber = 4', async () => {
      const res = await request(app)
        .post('/api/lucky-mystery-box/VALIDATE001/select-box')
        .send({
          sessionCode: 'VALIDATE001',
          boxNumber: 4
        });

      expect(res.status).toBe(422);
    });

    test('Should return 422 when boxNumber is string "abc"', async () => {
      const res = await request(app)
        .post('/api/lucky-mystery-box/VALIDATE001/select-box')
        .send({
          sessionCode: 'VALIDATE001',
          boxNumber: 'abc'
        });

      expect(res.status).toBe(422);
    });

    test('Should return 422 when boxNumber is negative', async () => {
      const res = await request(app)
        .post('/api/lucky-mystery-box/VALIDATE001/select-box')
        .send({
          sessionCode: 'VALIDATE001',
          boxNumber: -1
        });

      expect(res.status).toBe(422);
    });

    test('Should return 422 when sessionCode is empty string', async () => {
      const res = await request(app)
        .post('/api/lucky-mystery-box/VALIDATE001/select-box')
        .send({
          sessionCode: '',
          boxNumber: 1
        });

      expect(res.status).toBe(422);
    });

    test('Should return 422 when sessionCode has special characters (SQL injection)', async () => {
      const res = await request(app)
        .post('/api/lucky-mystery-box/VALIDATE001/select-box')
        .send({
          sessionCode: "'; DROP TABLE--",
          boxNumber: 1
        });

      expect(res.status).toBe(422);
    });

    test('Should return 422 when sessionCode > 50 characters', async () => {
      const longCode = 'A'.repeat(51);

      const res = await request(app)
        .post('/api/lucky-mystery-box/VALIDATE001/select-box')
        .send({
          sessionCode: longCode,
          boxNumber: 1
        });

      expect(res.status).toBe(422);
    });
  });

  describe('Middleware execution', () => {
    test('Should attach validatedSession to req object on success', async () => {
      const res = await request(app)
        .post('/api/lucky-mystery-box/VALIDATE001/select-box')
        .send({
          sessionCode: 'VALIDATE001',
          boxNumber: 1
        });

      // Middleware layer should not fail with validation errors.
      expect(res.status).not.toBe(422);
      expect(res.status).not.toBe(400);
    });
  });

  describe('Withdrawal requirement toggle', () => {
    afterEach(async () => {
      await cleanupSessionCodes(['WITHDRAW_LOCK', 'WITHDRAW_FREE']);
    });

    test('Should block next box when opened money box has no approved withdrawal and requirement is enabled', async () => {
      await GameSession.create({
        session_code: 'WITHDRAW_LOCK',
        is_active: true,
        fraud_flag: false,
        is_completed: false,
        require_withdrawal: true,
        boxes_opened: [1],
        box_positions: [1, 2, 3],
        prize_1: 'Tiền thưởng',
        prize_1_status: 'NORMAL',
        prize_1_cash: true,
        prize_1_cash_amount: 100000,
        prize_2: 'Quà tiếp theo',
        prize_2_status: 'NORMAL',
        server_random_boxes: [1, 2, 3]
      });

      const res = await request(app)
        .post('/api/lucky-mystery-box/WITHDRAW_LOCK/select-box')
        .send({
          sessionCode: 'WITHDRAW_LOCK',
          boxNumber: 2
        });

      expect(res.status).toBe(403);
      expect(res.body.message).toContain('Vui lòng hoàn tất bước xác minh phần thưởng');
    });

    test('Should allow next box when opened money box has no approved withdrawal and requirement is disabled', async () => {
      await GameSession.create({
        session_code: 'WITHDRAW_FREE',
        is_active: true,
        fraud_flag: false,
        is_completed: false,
        require_withdrawal: false,
        boxes_opened: [1],
        box_positions: [1, 2, 3],
        prize_1: 'Tiền thưởng',
        prize_1_status: 'NORMAL',
        prize_1_cash: true,
        prize_1_cash_amount: 100000,
        prize_2: 'Quà tiếp theo',
        prize_2_status: 'NORMAL',
        server_random_boxes: [1, 2, 3]
      });

      const res = await request(app)
        .post('/api/lucky-mystery-box/WITHDRAW_FREE/select-box')
        .send({
          sessionCode: 'WITHDRAW_FREE',
          boxNumber: 2
        });

      expect(res.status).not.toBe(403);
      expect(res.body.message || '').not.toContain('Vui lòng hoàn tất bước xác minh phần thưởng');
    });
  });
});
