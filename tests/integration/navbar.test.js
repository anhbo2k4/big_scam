const request = require('supertest');
const app = require('../../app');
const { GameSession } = require('../../models');

describe('GET /play/:sessionCode - Navbar functionality', () => {
  let sessionOpened;
  let sessionNotOpened;
  let sessionWithClaim;

  beforeEach(async () => {
    // Session with box already opened
    sessionOpened = await GameSession.create({
      session_code: 'NAVBAR001',
      is_active: true,
      player_selected_box: 1,
      player_name: 'Nguyen Van A',
      player_phone: '0901234567',
      is_form_submitted: true
    });

    // Session without box opened
    sessionNotOpened = await GameSession.create({
      session_code: 'NAVBAR002',
      is_active: true,
      player_selected_box: null
    });

    // Session with box opened but not claimed
    sessionWithClaim = await GameSession.create({
      session_code: 'NAVBAR003',
      is_active: true,
      player_selected_box: 2,
      is_form_submitted: false
    });
  });

  afterEach(async () => {
    if (sessionOpened) await sessionOpened.destroy();
    if (sessionNotOpened) await sessionNotOpened.destroy();
    if (sessionWithClaim) await sessionWithClaim.destroy();
  });

  describe('Wallet button visibility', () => {
    test('Should show wallet button when session active', async () => {
      const res = await request(app)
        .get('/?code=NAVBAR001')
        .expect(200);

      expect(res.text).toContain('wallet');
    });

    test('Should show wallet button when box opened', async () => {
      const res = await request(app)
        .get('/?code=NAVBAR001')
        .expect(200);

      expect(res.text.toLowerCase()).toContain('wallet');
    });

    test('Should hide wallet button on root game page', async () => {
      const res = await request(app)
        .get('/')
        .expect(200);

      expect(res.text.toLowerCase()).not.toContain('/wallet');
    });
  });

  describe('Inventory icon visibility', () => {
    test('Should show inventory icon when box opened', async () => {
      const res = await request(app)
        .get('/?code=NAVBAR001')
        .expect(200);

      expect(res.text).toContain('data-has-inventory="1"');
    });

    test('Should NOT show inventory icon when box not opened', async () => {
      const res = await request(app)
        .get('/?code=NAVBAR002')
        .expect(200);

      expect(res.text).toContain('data-has-inventory="0"');
    });

    test('Should show inventory icon even if not claimed', async () => {
      const res = await request(app)
        .get('/?code=NAVBAR003')
        .expect(200);

      expect(res.text).toContain('data-has-inventory="1"');
    });
  });

  describe('Session badge', () => {
    test('Should display session code in badge', async () => {
      const res = await request(app)
        .get('/?code=NAVBAR001')
        .expect(200);

      expect(res.text).toContain('NAVBAR001');
    });

    test('Should display correct code for different session', async () => {
      const res = await request(app)
        .get('/?code=NAVBAR002')
        .expect(200);

      expect(res.text).toContain('NAVBAR002');
    });

    test('Should NOT show session code on root game page', async () => {
      const home = await request(app)
        .get('/')
        .expect(200);

      expect(home.text).not.toContain('NAVBAR001');
    });
  });

  describe('Player name display', () => {
    test('Should show player name when form submitted', async () => {
      const res = await request(app)
        .get('/?code=NAVBAR001')
        .expect(200);

      expect(res.text.toLowerCase()).toContain('nguyen van a');
    });

    test('Should not require player name if not submitted', async () => {
      const res = await request(app)
        .get('/?code=NAVBAR002')
        .expect(200);

      expect(res.status).toBe(200);
    });
  });

  describe('Navbar state consistency', () => {
    test('Navbar should persist across requests', async () => {
      const res1 = await request(app)
        .get('/?code=NAVBAR001')
        .expect(200);

      const res2 = await request(app)
        .get('/?code=NAVBAR001')
        .expect(200);

      expect(res1.text).toContain('NAVBAR001');
      expect(res2.text).toContain('NAVBAR001');
    });

    test('Navbar changes when switching sessions', async () => {
      const res1 = await request(app)
        .get('/?code=NAVBAR001')
        .expect(200);

      const res2 = await request(app)
        .get('/?code=NAVBAR002')
        .expect(200);

      expect(res1.text).toContain('NAVBAR001');
      expect(res2.text).toContain('NAVBAR002');
    });

    test('Should show all critical navbar elements together', async () => {
      const res = await request(app)
        .get('/?code=NAVBAR001')
        .expect(200);

      const html = res.text.toLowerCase();
      // Session badge
      expect(html).toContain('navbar001');
      // Navigation
      expect(html).toContain('home') || expect(html).toContain('play');
    });
  });

  describe('Inactive session navbar', () => {
    test('Should not show wallet for inactive session', async () => {
      const inactiveSession = await GameSession.create({
        session_code: 'NAVBAR_INACTIVE',
        is_active: false
      });

      const res = await request(app)
        .get('/?code=NAVBAR_INACTIVE');

      // Inactive sessions → page renders but without session context (no 404)
      expect(res.status).toBe(200);
      // Should not show wallet UI for inactive/missing session
      expect(res.text).not.toMatch(/NAVBAR_INACTIVE.*wallet/i);

      await inactiveSession.destroy();
    });
  });
});
