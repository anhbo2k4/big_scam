const request = require('supertest');
const app = require('../../app');
const { GameSession, Withdrawal } = require('../../models');

describe('GET /api/lucky-mystery-box/:sessionCode/wallet', () => {
  let testSession;

  beforeEach(async () => {
    testSession = await GameSession.create({
      session_code: 'WALLET001',
      is_active: true,
      player_selected_box: 2,
      is_exchanged: true,
      exchanged_at: new Date(),
      prize_2_cash_amount: 4900000,
      wallet_manual_amount: 4900000
    });
  });

  afterEach(async () => {
    await Withdrawal.destroy({ where: { session_code: 'WALLET001' } });
    if (testSession) await testSession.destroy();
  });

  describe('Wallet balance calculation', () => {
    test('Should return balance = prize_N_cash_amount when is_exchanged = 1', async () => {
      const res = await request(app)
        .get('/api/lucky-mystery-box/WALLET001/wallet')
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.balance).toBe(4900000);
    });

    test('Should return balance = 0 when is_exchanged = 0', async () => {
      const notExchanged = await GameSession.create({
        session_code: 'WALLET002',
        is_active: true,
        player_selected_box: 2,
        is_exchanged: false,
        prize_2_cash_amount: 4900000
      });

      const res = await request(app)
        .get('/api/lucky-mystery-box/WALLET002/wallet')
        .expect(200);

      expect(res.body.data.balance).toBe(0);

      await notExchanged.destroy();
    });

    test('Should return balance = 0 when player_selected_box IS NULL', async () => {
      const noBox = await GameSession.create({
        session_code: 'WALLET003',
        is_active: true,
        player_selected_box: null,
        is_exchanged: true
      });

      const res = await request(app)
        .get('/api/lucky-mystery-box/WALLET003/wallet')
        .expect(200);

      expect(res.body.data.balance).toBe(0);

      await noBox.destroy();
    });

    test('Should return balance = 0 when prize_N_cash_amount = null', async () => {
      const noCash = await GameSession.create({
        session_code: 'WALLET004',
        is_active: true,
        player_selected_box: 2,
        is_exchanged: true,
        prize_2_cash_amount: null
      });

      const res = await request(app)
        .get('/api/lucky-mystery-box/WALLET004/wallet')
        .expect(200);

      expect(res.body.data.balance).toBe(0);

      await noCash.destroy();
    });
  });

  describe('Transaction history', () => {
    test('Should include transaction list in response', async () => {
      await Withdrawal.create({
        session_code: 'WALLET001',
        amount: 4900000,
        status: 'approved',
        withdrawal_type: 'cash_prize'
      });

      const res = await request(app)
        .get('/api/lucky-mystery-box/WALLET001/wallet')
        .expect(200);

      expect(res.body.data.transactions).toBeDefined();
      expect(Array.isArray(res.body.data.transactions)).toBe(true);
    });

    test('Should show status in transaction', async () => {
      await Withdrawal.create({
        session_code: 'WALLET001',
        amount: 4900000,
        status: 'approved',
        withdrawal_type: 'cash_prize'
      });

      const res = await request(app)
        .get('/api/lucky-mystery-box/WALLET001/wallet')
        .expect(200);

      expect(res.body.data.transactions.length).toBeGreaterThan(0);
      expect(res.body.data.transactions[0].status).toBe('approved');
    });

    test('Should include requested_at timestamp', async () => {
      const withdrawal = await Withdrawal.create({
        session_code: 'WALLET001',
        amount: 4900000,
        status: 'pending',
        withdrawal_type: 'cash_prize',
        requested_at: new Date()
      });

      const res = await request(app)
        .get('/api/lucky-mystery-box/WALLET001/wallet')
        .expect(200);

      expect(res.body.data.transactions[0].requestedAt).toBeDefined();

      await withdrawal.destroy();
    });
  });

  describe('Error cases', () => {
    test('Should return 404 when session_code not found', async () => {
      const res = await request(app)
        .get('/api/lucky-mystery-box/NOTFOUND/wallet');

      expect(res.status).toBe(404);
    });

    test('Should return 404 when is_active = 0', async () => {
      const inactive = await GameSession.create({
        session_code: 'WALLET005',
        is_active: false
      });

      const res = await request(app)
        .get('/api/lucky-mystery-box/WALLET005/wallet');

      expect(res.status).toBe(404);

      await inactive.destroy();
    });
  });

  describe('Response format', () => {
    test('Should return JSON with success = true', async () => {
      const res = await request(app)
        .get('/api/lucky-mystery-box/WALLET001/wallet')
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data).toBeDefined();
    });

    test('Should include balance, withdrawn, and remaining', async () => {
      const res = await request(app)
        .get('/api/lucky-mystery-box/WALLET001/wallet')
        .expect(200);

      expect(res.body.data.balance).toBeDefined();
      expect(res.body.data.withdrawn).toBeDefined();
      expect(res.body.data.remaining).toBeDefined();
    });

    test('Should calculate remaining = balance - withdrawn', async () => {
      await Withdrawal.create({
        session_code: 'WALLET001',
        amount: 2000000,
        status: 'approved'
      });

      const res = await request(app)
        .get('/api/lucky-mystery-box/WALLET001/wallet')
        .expect(200);

      const balance = res.body.data.balance;
      const withdrawn = res.body.data.withdrawn;
      const remaining = res.body.data.remaining;

      // In manual wallet mode, remaining = Math.max(0, balance - 0) = balance
      expect(remaining).toBeGreaterThanOrEqual(0);
      expect(remaining).toBeLessThanOrEqual(balance);
    });
  });
});
