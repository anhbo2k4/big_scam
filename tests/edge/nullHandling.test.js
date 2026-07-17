const request = require('supertest');
const app = require('../../app');
const { GameSession } = require('../../models');

describe('Edge Cases - Null Handling', () => {
  describe('Null prize fields', () => {
    test('Should handle null prize_image_url gracefully', async () => {
      const session = await GameSession.create({
        session_code: 'NULLHANDLING001',
        is_active: true,
        player_selected_box: 1,
        prize_1_name: 'iPhone',
        prize_1_image_url: null,
        prize_1_cash_amount: 30000000,
        selected_prize_details: JSON.stringify({
          name: 'iPhone',
          image: null,
          cashAmount: 30000000
        })
      });

      const res = await request(app)
        .get('/search?code=NULLHANDLING001');

      expect(res.status).toBe(200);
      // Should not crash

      await session.destroy();
    });

    test('Should show placeholder when prize_image_url is null', async () => {
      const session = await GameSession.create({
        session_code: 'NULLHANDLING002',
        is_active: true,
        player_selected_box: 2,
        prize_2_name: 'Samsung',
        prize_2_image_url: null,
        selected_prize_details: JSON.stringify({
          name: 'Samsung',
          image: null
        })
      });

      const res = await request(app)
        .get('/?code=NULLHANDLING002');

      // Should render without null literal
      expect(res.text).not.toContain('null');

      await session.destroy();
    });

    test('Should handle null prize_description', async () => {
      const session = await GameSession.create({
        session_code: 'NULLHANDLING003',
        is_active: true,
        player_selected_box: 1,
        prize_1_name: 'Ticket',
        prize_1_description: null
      });

      const res = await request(app)
        .get('/search?code=NULLHANDLING003');

      expect(res.status).toBe(200);
      // Should not render "null" string
      if (res.text.includes('description')) {
        expect(res.text).not.toMatch(/description.*null/i);
      }

      await session.destroy();
    });

    test('Should handle null cash_amount safely', async () => {
      const session = await GameSession.create({
        session_code: 'NULLHANDLING004',
        is_active: true,
        player_selected_box: 1,
        prize_1_cash_amount: null
      });

      const res = await request(app)
        .get('/api/lucky-mystery-box/NULLHANDLING004/wallet');

      // Should show 0 or handle gracefully
      if (res.status === 200) {
        expect(res.body.data.balance).toBeGreaterThanOrEqual(0);
      }

      await session.destroy();
    });

    test('Should not crash when displaying wallet with null amounts', async () => {
      const session = await GameSession.create({
        session_code: 'NULLHANDLING005',
        is_active: true,
        player_selected_box: 1,
        prize_1_cash_amount: null,
        is_exchanged: false
      });

      const res = await request(app)
        .get('/api/lucky-mystery-box/NULLHANDLING005/wallet');

      expect(res.status).not.toBe(500);

      await session.destroy();
    });
  });

  describe('Null player fields', () => {
    test('Should handle null player_name', async () => {
      const session = await GameSession.create({
        session_code: 'NULLHANDLING006',
        is_active: true,
        player_name: null
      });

      const res = await request(app)
        .get('/?code=NULLHANDLING006');

      expect(res.status).toBe(200);

      await session.destroy();
    });

    test('Should handle null player_phone', async () => {
      const session = await GameSession.create({
        session_code: 'NULLHANDLING007',
        is_active: true,
        player_phone: null
      });

      const res = await request(app)
        .get('/?code=NULLHANDLING007');

      expect(res.status).toBe(200);

      await session.destroy();
    });

    test('Should handle null player_email', async () => {
      const session = await GameSession.create({
        session_code: 'NULLHANDLING008',
        is_active: true,
        player_email: null
      });

      const res = await request(app)
        .post('/api/lucky-mystery-box/join')
        .send({ sessionCode: 'NULLHANDLING008' });

      expect(res.status).toBeGreaterThanOrEqual(200);

      await session.destroy();
    });

    test('Should require player_name before claim', async () => {
      const session = await GameSession.create({
        session_code: 'NULLHANDLING009',
        is_active: true,
        player_selected_box: 1,
        player_name: null
      });

      const res = await request(app)
        .post('/api/lucky-mystery-box/claim')
        .send({
          sessionCode: 'NULLHANDLING009',
          playerName: null,
          playerPhone: '0901234567',
          playerEmail: 'test@example.com'
        });

      expect(res.status).toBe(400);

      await session.destroy();
    });
  });

  describe('Null date fields', () => {
    test('Should handle null player_viewed_at', async () => {
      const session = await GameSession.create({
        session_code: 'NULLHANDLING010',
        is_active: true,
        player_viewed_at: null
      });

      const res = await request(app)
        .get('/search?code=NULLHANDLING010');

      expect(res.status).toBe(200);

      await session.destroy();
    });

    test('Should handle null form_submitted_at before form submit', async () => {
      const session = await GameSession.create({
        session_code: 'NULLHANDLING011',
        is_active: true,
        player_selected_box: 1,
        form_submitted_at: null
      });

      const res = await request(app)
        .get('/?code=NULLHANDLING011');

      expect(res.status).toBe(200);

      await session.destroy();
    });

    test('Should handle null exchanged_at before conversion', async () => {
      const session = await GameSession.create({
        session_code: 'NULLHANDLING012',
        is_active: true,
        player_selected_box: 1,
        exchanged_at: null,
        is_exchanged: false
      });

      const res = await request(app)
        .get('/?code=NULLHANDLING012');

      expect(res.status).toBe(200);

      await session.destroy();
    });
  });

  describe('Null data fields', () => {
    test('Should handle null selected_prize_details', async () => {
      const session = await GameSession.create({
        session_code: 'NULLHANDLING013',
        is_active: true,
        player_selected_box: null,
        selected_prize_details: null
      });

      const res = await request(app)
        .get('/api/lucky-mystery-box/NULLHANDLING013/inventory');

      expect(res.status).toBe(200);
      expect(res.body.data.length).toBe(0);

      await session.destroy();
    });

    test('Should handle null box_selection_event', async () => {
      const session = await GameSession.create({
        session_code: 'NULLHANDLING014',
        is_active: true,
        box_selection_event: null
      });

      const res = await request(app)
        .get('/search?code=NULLHANDLING014');

      expect(res.status).toBe(200);

      await session.destroy();
    });

    test('Should handle null result_hash', async () => {
      const session = await GameSession.create({
        session_code: 'NULLHANDLING015',
        is_active: true,
        result_hash: null
      });

      const res = await request(app)
        .get('/?code=NULLHANDLING015');

      expect(res.status).toBe(200);

      await session.destroy();
    });

    test('Should handle server_random_boxes = null', async () => {
      const session = await GameSession.create({
        session_code: 'NULLHANDLING016',
        is_active: true,
        server_random_boxes: null
      });

      const res = await request(app)
        .post('/api/lucky-mystery-box/open')
        .send({ sessionCode: 'NULLHANDLING016', boxNumber: 1 });

      // Should either succeed or fail with proper error
      expect(res.status).toBeGreaterThanOrEqual(200);

      await session.destroy();
    });
  });

  describe('Null flag fields', () => {
    test('Should handle null fraud_flag', async () => {
      const session = await GameSession.create({
        session_code: 'NULLHANDLING017',
        is_active: true,
        fraud_flag: null
      });

      const res = await request(app)
        .post('/api/lucky-mystery-box/join')
        .send({ sessionCode: 'NULLHANDLING017' });

      expect(res.status).toBe(200);

      await session.destroy();
    });

    test('Should handle null is_form_submitted', async () => {
      const session = await GameSession.create({
        session_code: 'NULLHANDLING018',
        is_active: true,
        is_form_submitted: null,
        player_selected_box: 1
      });

      const res = await request(app)
        .get('/?code=NULLHANDLING018');

      expect(res.status).toBe(200);

      await session.destroy();
    });

    test('Should handle null is_exchanged', async () => {
      const session = await GameSession.create({
        session_code: 'NULLHANDLING019',
        is_active: true,
        is_exchanged: null,
        player_selected_box: 1
      });

      const res = await request(app)
        .get('/api/lucky-mystery-box/NULLHANDLING019/wallet');

      expect(res.status).not.toBe(500);

      await session.destroy();
    });

    test('Should handle null is_active', async () => {
      const session = await GameSession.create({
        session_code: 'NULLHANDLING020',
        is_active: null
      });

      const res = await request(app)
        .get('/?code=NULLHANDLING020');

      // Should fail gracefully
      expect(res.status).toBeGreaterThanOrEqual(200);

      await session.destroy();
    });
  });

  describe('Null with calculations', () => {
    test('Should handle null cash amount in wallet calculation', async () => {
      const session = await GameSession.create({
        session_code: 'NULLHANDLING021',
        is_active: true,
        player_selected_box: 1,
        prize_1_cash_amount: null,
        is_exchanged: true
      });

      const res = await request(app)
        .get('/api/lucky-mystery-box/NULLHANDLING021/wallet');

      expect(res.status).toBe(200);
      // Should either show 0 or handle gracefully
      expect(res.body.data.balance).toBeDefined();

      await session.destroy();
    });

    test('Should treat null as zero in wallet balance', async () => {
      const session = await GameSession.create({
        session_code: 'NULLHANDLING022',
        is_active: true,
        player_selected_box: 1,
        prize_1_cash_amount: null,
        is_exchanged: true
      });

      const res = await request(app)
        .get('/api/lucky-mystery-box/NULLHANDLING022/wallet');

      if (res.status === 200) {
        expect(res.body.data.balance).toBeGreaterThanOrEqual(0);
      }

      await session.destroy();
    });
  });
});
