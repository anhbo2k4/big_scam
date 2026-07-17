const request = require('supertest');
const app = require('../../app');
const { GameSession, GiftExchange } = require('../../models');

describe('GET /api/lucky-mystery-box/:sessionCode/inventory', () => {
  let testSession;

  beforeEach(async () => {
    await GiftExchange.destroy({ where: { session_code: ['INVENTORY001', 'INVENTORY002', 'INVENTORY003'] } });

    testSession = await GameSession.create({
      session_code: 'INVENTORY001',
      is_active: true,
      player_selected_box: 1,
      selected_prize_details: JSON.stringify({
        name: 'iPhone 16 Pro Max',
        image: 'https://example.com/iphone.jpg'
      }),
      is_form_submitted: true,
      player_name: 'Nguyen Van A',
      player_phone: '0901234567'
    });
  });

  afterEach(async () => {
    if (testSession) await testSession.destroy();
    await GiftExchange.destroy({ where: { session_code: ['INVENTORY001', 'INVENTORY002', 'INVENTORY003'] } });
  });

  describe('Empty inventory', () => {
    test('Should show empty state when player_selected_box IS NULL', async () => {
      const noBox = await GameSession.create({
        session_code: 'INVENTORY002',
        is_active: true,
        player_selected_box: null
      });

      const res = await request(app)
        .get('/api/lucky-mystery-box/INVENTORY002/inventory')
        .expect(200);

      expect(res.body.data.length).toBe(0);

      await noBox.destroy();
    });
  });

  describe('Inventory items', () => {
    test('Should list GiftExchange records for session', async () => {
      await GiftExchange.create({
        session_code: 'INVENTORY001',
        selected_box_number: 1,
        prize_name: 'iPhone 16 Pro Max',
        recipient_name: 'Nguyen Van A',
        phone: '0901234567',
        address: '123 Main St',
        status: 'pending'
      });

      const res = await request(app)
        .get('/api/lucky-mystery-box/INVENTORY001/inventory')
        .expect(200);

      expect(res.body.data.length).toBeGreaterThan(0);
      expect(res.body.data[0].prizeName).toBe('iPhone 16 Pro Max');
    });

    test('Should show prize name in inventory', async () => {
      await GiftExchange.create({
        session_code: 'INVENTORY001',
        selected_box_number: 1,
        prize_name: 'iPhone 16 Pro Max',
        recipient_name: 'Nguyen Van A',
        status: 'pending'
      });

      const res = await request(app)
        .get('/api/lucky-mystery-box/INVENTORY001/inventory')
        .expect(200);

      expect(res.body.data[0].prizeName).toBe('iPhone 16 Pro Max');
    });

    test('Should show recipient name', async () => {
      await GiftExchange.create({
        session_code: 'INVENTORY001',
        selected_box_number: 1,
        prize_name: 'iPhone 16 Pro Max',
        recipient_name: 'Nguyen Van A',
        status: 'pending'
      });

      const res = await request(app)
        .get('/api/lucky-mystery-box/INVENTORY001/inventory')
        .expect(200);

      expect(res.body.data[0].recipientName).toBe('Nguyen Van A');
    });

    test('Should show status field', async () => {
      await GiftExchange.create({
        session_code: 'INVENTORY001',
        selected_box_number: 1,
        prize_name: 'iPhone 16 Pro Max',
        recipient_name: 'Nguyen Van A',
        status: 'pending'
      });

      const res = await request(app)
        .get('/api/lucky-mystery-box/INVENTORY001/inventory')
        .expect(200);

      expect(res.body.data[0].status).toBe('pending');
    });

    test('Should show phone number', async () => {
      await GiftExchange.create({
        session_code: 'INVENTORY001',
        selected_box_number: 1,
        prize_name: 'iPhone 16 Pro Max',
        recipient_name: 'Nguyen Van A',
        phone: '0987654321',
        status: 'pending'
      });

      const res = await request(app)
        .get('/api/lucky-mystery-box/INVENTORY001/inventory')
        .expect(200);

      expect(res.body.data[0].phone).toBe('0987654321');
    });

    test('Should show address', async () => {
      await GiftExchange.create({
        session_code: 'INVENTORY001',
        selected_box_number: 1,
        prize_name: 'iPhone 16 Pro Max',
        recipient_name: 'Nguyen Van A',
        address: '456 Side Street',
        status: 'pending'
      });

      const res = await request(app)
        .get('/api/lucky-mystery-box/INVENTORY001/inventory')
        .expect(200);

      expect(res.body.data[0].address).toBe('456 Side Street');
    });

    test('Should show box number', async () => {
      await GiftExchange.create({
        session_code: 'INVENTORY001',
        selected_box_number: 1,
        prize_name: 'iPhone 16 Pro Max',
        recipient_name: 'Nguyen Van A',
        status: 'pending'
      });

      const res = await request(app)
        .get('/api/lucky-mystery-box/INVENTORY001/inventory')
        .expect(200);

      expect(res.body.data[0].boxNumber).toBe(1);
    });
  });

  describe('Response format', () => {
    test('Should return success = true', async () => {
      const res = await request(app)
        .get('/api/lucky-mystery-box/INVENTORY001/inventory')
        .expect(200);

      expect(res.body.success).toBe(true);
    });

    test('Should return total count', async () => {
      await GiftExchange.create({
        session_code: 'INVENTORY001',
        selected_box_number: 1,
        prize_name: 'iPhone 16 Pro Max',
        recipient_name: 'Nguyen Van A',
        status: 'pending'
      });

      const res = await request(app)
        .get('/api/lucky-mystery-box/INVENTORY001/inventory')
        .expect(200);

      expect(res.body.total).toBe(1);
    });

    test('Should return data as array', async () => {
      const res = await request(app)
        .get('/api/lucky-mystery-box/INVENTORY001/inventory')
        .expect(200);

      expect(Array.isArray(res.body.data)).toBe(true);
    });
  });

  describe('Error cases', () => {
    test('Should return 404 when session_code not found', async () => {
      const res = await request(app)
        .get('/api/lucky-mystery-box/NOTFOUND/inventory');

      expect(res.status).toBe(404);
    });

    test('Should return 404 when is_active = 0', async () => {
      const inactive = await GameSession.create({
        session_code: 'INVENTORY003',
        is_active: false
      });

      const res = await request(app)
        .get('/api/lucky-mystery-box/INVENTORY003/inventory');

      expect(res.status).toBe(404);

      await inactive.destroy();
    });
  });

  describe('Multiple items', () => {
    test('Should return all gift exchanges for session', async () => {
      for (let i = 1; i <= 3; i++) {
        await GiftExchange.create({
          session_code: 'INVENTORY001',
          selected_box_number: i,
          prize_name: `Prize ${i}`,
          recipient_name: `Person ${i}`,
          status: 'pending'
        });
      }

      const res = await request(app)
        .get('/api/lucky-mystery-box/INVENTORY001/inventory')
        .expect(200);

      expect(res.body.data.length).toBe(3);
      expect(res.body.total).toBe(3);
    });
  });
});
