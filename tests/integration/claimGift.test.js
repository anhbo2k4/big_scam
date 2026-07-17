const request = require('supertest');
const app = require('../../app');
const { GameSession, GiftExchange, PlayerInventory } = require('../../models');

describe('POST /api/lucky-mystery-box/:sessionCode/claim', () => {
  let sessionCode;
  beforeAll(async () => {
    // Create a test session with a special prize
    sessionCode = 'TESTCLAIM1';
    await GameSession.create({
      session_code: sessionCode,
      is_active: true,
      player_selected_box: 1,
      [`prize_1`]: 'Tai nghe Sony',
      [`prize_1_is_special`]: true,
      [`prize_1_created_at`]: new Date(),
      [`prize_1_cash`]: false,
      [`prize_1_cash_amount`]: 0,
      player_name: null,
      player_phone: null,
      player_email: null,
      is_form_submitted: false,
      is_exchanged: false
    });
    await PlayerInventory.create({
      session_code: sessionCode,
      box_number: 1,
      prize_name: 'Tai nghe Sony',
      is_special: true,
      status: 'obtained',
      prize_value: 0,
      is_cash: false
    });
  });

  afterAll(async () => {
    await GiftExchange.destroy({ where: { session_code: sessionCode } });
    await PlayerInventory.destroy({ where: { session_code: sessionCode } });
    await GameSession.destroy({ where: { session_code: sessionCode } });
  });

  it('should allow claiming a special prize and create GiftExchange with pending_approval', async () => {
    const res = await request(app)
      .post(`/api/lucky-mystery-box/${sessionCode}/claim`)
      .send({
        name: 'Nguyen Van Test',
        phone: '0901234567',
        address: '123 Test St',
        city: 'Hanoi',
        note: 'Test note'
      });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    // Check DB
    const gift = await GiftExchange.findOne({ where: { session_code: sessionCode } });
    expect(gift).toBeTruthy();
    expect(gift.status).toBe('pending_approval');
    expect(gift.prize_name).toBe('Tai nghe Sony');
    expect(gift.recipient_name).toBe('Nguyen Van Test');
  });
});
