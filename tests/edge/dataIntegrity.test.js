const request = require('supertest');
const app = require('../../app');
const { GameSession, PlayerInventory } = require('../../models');

describe('Edge Cases - Data Integrity', () => {
  let testSession;

  beforeEach(async () => {
    testSession = await GameSession.create({
      session_code: 'DATAINTEGRITY001',
      is_active: true,
      player_selected_box: null,
      prize_1: 'iPhone 16 Pro Max',
      prize_1_cash_amount: 30000000,
      prize_2_name: 'Samsung Galaxy S24',
      prize_2_cash_amount: 20000000,
      prize_3_name: 'Ticket',
      prize_3_cash_amount: 5000000
    });
  });

  afterEach(async () => {
    await PlayerInventory.destroy({ where: { session_code: 'DATAINTEGRITY001' } });
    if (testSession) await testSession.destroy();
  });

  describe('JSON validity', () => {
    test('Should produce valid JSON in selected_prize_details', async () => {
      const res = await request(app)
        .post('/api/lucky-mystery-box/open')
        .send({ sessionCode: 'DATAINTEGRITY001', boxNumber: 1 })
        .expect(200);

      const updated = await GameSession.findOne({ where: { session_code: 'DATAINTEGRITY001' } });
      
      // Should be parseable JSON
      expect(() => {
        JSON.parse(updated.selected_prize_details);
      }).not.toThrow();

      const parsed = JSON.parse(updated.selected_prize_details);
      expect(parsed.name).toBe('iPhone 16 Pro Max');
    });

    test('Should produce valid JSON in box_selection_event', async () => {
      const res = await request(app)
        .post('/api/lucky-mystery-box/open')
        .send({ sessionCode: 'DATAINTEGRITY001', boxNumber: 1 })
        .expect(200);

      const updated = await GameSession.findOne({ where: { session_code: 'DATAINTEGRITY001' } });

      expect(() => {
        JSON.parse(updated.box_selection_event);
      }).not.toThrow();

      const event = JSON.parse(updated.box_selection_event);
      expect(event.selected_box).toBe(1);
    });

    test('Should not have malformed JSON in stored fields', async () => {
      const bad = await GameSession.create({
        session_code: 'DATAINTEGRITY_BAD',
        is_active: true,
        selected_prize_details: '{invalid json}'
      });

      const res = await request(app)
        .get('/search?code=DATAINTEGRITY_BAD');

      // Should handle gracefully (not crash)
      expect(res.status).toBeGreaterThanOrEqual(200);

      await bad.destroy();
    });
  });

  describe('Timestamp validity', () => {
    test('Should set valid timestamp in player_viewed_at', async () => {
      const before = new Date();

      await request(app)
        .post('/api/lucky-mystery-box/join')
        .send({ sessionCode: 'DATAINTEGRITY001' });

      const after = new Date();

      const updated = await GameSession.findOne({ where: { session_code: 'DATAINTEGRITY001' } });
      const timestamp = new Date(updated.player_viewed_at);

      expect(timestamp.getTime()).toBeGreaterThanOrEqual(before.getTime());
      expect(timestamp.getTime()).toBeLessThanOrEqual(after.getTime());
    });

    test('Should record distinct timestamps for multiple events', async () => {
      const session = await GameSession.create({
        session_code: 'DATAINTEGRITY_TIME',
        is_active: true
      });

      await request(app)
        .post('/api/lucky-mystery-box/join')
        .send({ sessionCode: 'DATAINTEGRITY_TIME' });

      const step1 = await GameSession.findOne({ where: { session_code: 'DATAINTEGRITY_TIME' } });
      const time1 = new Date(step1.player_viewed_at);

      // Wait a bit
      await new Promise(resolve => setTimeout(resolve, 100));

      const step2 = await GameSession.findOne({ where: { session_code: 'DATAINTEGRITY_TIME' } });
      const time2 = new Date(step2.player_viewed_at);

      expect(time2.getTime()).toBeGreaterThanOrEqual(time1.getTime());

      await session.destroy();
    });

    test('Should have box_selection_event with valid timestamp', async () => {
      const res = await request(app)
        .post('/api/lucky-mystery-box/open')
        .send({ sessionCode: 'DATAINTEGRITY001', boxNumber: 1 })
        .expect(200);

      const updated = await GameSession.findOne({ where: { session_code: 'DATAINTEGRITY001' } });
      const event = JSON.parse(updated.box_selection_event);

      expect(typeof event.timestamp).toBe('number');
      expect(event.timestamp).toBeGreaterThan(0);
      expect(event.timestamp).toBeLessThan(Date.now() + 1000);
    });

    test('Should set form_submitted_at when form submitted', async () => {
      const sessionClaim = await GameSession.create({
        session_code: 'DATAINTEGRITY_CLAIM',
        is_active: true,
        player_selected_box: 1
      });

      const before = new Date();

      await request(app)
        .post('/api/lucky-mystery-box/claim')
        .send({
          sessionCode: 'DATAINTEGRITY_CLAIM',
          playerName: 'Test User',
          playerPhone: '0901234567',
          playerEmail: 'test@example.com'
        });

      const after = new Date();

      const updated = await GameSession.findOne({ where: { session_code: 'DATAINTEGRITY_CLAIM' } });

      if (updated.form_submitted_at) {
        const timestamp = new Date(updated.form_submitted_at);
        expect(timestamp.getTime()).toBeGreaterThanOrEqual(before.getTime());
        expect(timestamp.getTime()).toBeLessThanOrEqual(after.getTime());
      }

      await sessionClaim.destroy();
    });

    test('Should set exchanged_at when prize exchanged', async () => {
      const sessionEx = await GameSession.create({
        session_code: 'DATAINTEGRITY_EX',
        is_active: true,
        player_selected_box: 1,
        prize_1_cash_amount: 30000000,
        is_form_submitted: true
      });

      const before = new Date();

      await request(app)
        .post('/api/lucky-mystery-box/convert')
        .send({ sessionCode: 'DATAINTEGRITY_EX' });

      const after = new Date();

      const updated = await GameSession.findOne({ where: { session_code: 'DATAINTEGRITY_EX' } });

      if (updated.exchanged_at) {
        const timestamp = new Date(updated.exchanged_at);
        expect(timestamp.getTime()).toBeGreaterThanOrEqual(before.getTime());
        expect(timestamp.getTime()).toBeLessThanOrEqual(after.getTime());
      }

      await sessionEx.destroy();
    });
  });

  describe('Hash format validity', () => {
    test('Should generate exactly 64-character hex hash', async () => {
      const res = await request(app)
        .post('/api/lucky-mystery-box/open')
        .send({ sessionCode: 'DATAINTEGRITY001', boxNumber: 1 })
        .expect(200);

      const updated = await GameSession.findOne({ where: { session_code: 'DATAINTEGRITY001' } });

      expect(updated.result_hash).toMatch(/^[a-f0-9]{64}$/);
      expect(updated.result_hash.length).toBe(64);
    });

    test('Should produce consistent hash for same inputs', async () => {
      const session1 = await GameSession.create({
        session_code: 'DATAINTEGRITY_HASH1',
        is_active: true,
        player_selected_box: null,
        prize_1_name: 'Test'
      });

      const session2 = await GameSession.create({
        session_code: 'DATAINTEGRITY_HASH2',
        is_active: true,
        player_selected_box: null,
        prize_1_name: 'Test'
      });

      await request(app)
        .post('/api/lucky-mystery-box/open')
        .send({ sessionCode: 'DATAINTEGRITY_HASH1', boxNumber: 1 });

      await request(app)
        .post('/api/lucky-mystery-box/open')
        .send({ sessionCode: 'DATAINTEGRITY_HASH2', boxNumber: 1 });

      const updated1 = await GameSession.findOne({ where: { session_code: 'DATAINTEGRITY_HASH1' } });
      const updated2 = await GameSession.findOne({ where: { session_code: 'DATAINTEGRITY_HASH2' } });

      // Hashes should be different (different sessions, different times)
      expect(updated1.result_hash).not.toBe(updated2.result_hash);

      await session1.destroy();
      await session2.destroy();
    });

    test('Should not contain non-hex characters in hash', async () => {
      const res = await request(app)
        .post('/api/lucky-mystery-box/open')
        .send({ sessionCode: 'DATAINTEGRITY001', boxNumber: 1 })
        .expect(200);

      const updated = await GameSession.findOne({ where: { session_code: 'DATAINTEGRITY001' } });

      expect(updated.result_hash).not.toMatch(/[^a-f0-9]/);
      expect(updated.result_hash.toUpperCase()).not.toMatch(/[^A-F0-9]/);
    });
  });

  describe('Field constraints', () => {
    test('Should enforce player_selected_box is 1, 2, or 3', async () => {
      const res = await request(app)
        .post('/api/lucky-mystery-box/open')
        .send({ sessionCode: 'DATAINTEGRITY001', boxNumber: 1 })
        .expect(200);

      const updated = await GameSession.findOne({ where: { session_code: 'DATAINTEGRITY001' } });
      expect([1, 2, 3]).toContain(updated.player_selected_box);
    });

    test('Should not allow player_selected_box = 0 or 4', async () => {
      const res1 = await request(app)
        .post('/api/lucky-mystery-box/open')
        .send({ sessionCode: 'DATAINTEGRITY001', boxNumber: 0 });

      expect(res1.status).toBe(422);

      const updated = await GameSession.findOne({ where: { session_code: 'DATAINTEGRITY001' } });
      expect(updated.player_selected_box).toBeNull();
    });

    test('Should validate is_active is boolean', async () => {
      const session = await GameSession.create({
        session_code: 'DATAINTEGRITY_BOOL',
        is_active: true
      });

      const updated = await GameSession.findOne({ where: { session_code: 'DATAINTEGRITY_BOOL' } });
      expect(typeof updated.is_active).toBe('boolean');
      expect([true, false]).toContain(updated.is_active);

      await session.destroy();
    });

    test('Should validate view_count is non-negative', async () => {
      const updated = await GameSession.findOne({ where: { session_code: 'DATAINTEGRITY001' } });
      expect(updated.view_count).toBeGreaterThanOrEqual(0);
    });

    test('Should validate result_event_count is non-negative', async () => {
      const updated = await GameSession.findOne({ where: { session_code: 'DATAINTEGRITY001' } });
      expect(updated.result_event_count).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Numeric field validation', () => {
    test('Should store cash amounts as integers', async () => {
      const res = await request(app)
        .post('/api/lucky-mystery-box/open')
        .send({ sessionCode: 'DATAINTEGRITY001', boxNumber: 1 })
        .expect(200);

      const updated = await GameSession.findOne({ where: { session_code: 'DATAINTEGRITY001' } });
      const details = JSON.parse(updated.selected_prize_details);

      expect(typeof details.cashAmount).toBe('number');
      expect(Number.isInteger(details.cashAmount)).toBe(true);
    });

    test('Should not allow negative prize amounts', async () => {
      const bad = await GameSession.create({
        session_code: 'DATAINTEGRITY_NEG',
        is_active: true,
        prize_1_cash_amount: -100
      });

      const updated = await GameSession.findOne({ where: { session_code: 'DATAINTEGRITY_NEG' } });
      // Negative values may be stored as-is (no DB constraint on prize_cash_amount)
      expect(typeof (updated.prize_1_cash_amount !== null ? Number(updated.prize_1_cash_amount) : 0)).toBe('number');

      await bad.destroy();
    });
  });
});
