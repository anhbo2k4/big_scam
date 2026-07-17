const sessionLocals = require('../../middleware/sessionLocals');
const { GameSession } = require('../../models');

describe('Session Locals Middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      params: {},
      query: {},
      session: {},
      ip: '127.0.0.1',
      connection: { remoteAddress: '127.0.0.1' }
    };

    res = {
      locals: {}
    };

    next = jest.fn();
  });

  describe('Session injection', () => {
    test('Should set res.locals.session correctly', async () => {
      await sessionLocals(req, res, next);

      expect(res.locals.session).toBeNull();
      expect(next).toHaveBeenCalled();
    });

    test('Should set res.locals.session = null when no session code provided', async () => {
      req.params.code = '';
      req.session.sessionCode = '';

      await sessionLocals(req, res, next);

      expect(res.locals.session).toBeNull();
    });

    test('Should fetch session when code in req.params.code', async () => {
      const testSession = await GameSession.create({
        session_code: 'LOCALS001',
        is_active: true
      });

      req.params.code = 'LOCALS001';

      await sessionLocals(req, res, next);

      expect(res.locals.session).toBeDefined();
      expect(res.locals.session.session_code).toBe('LOCALS001');
      expect(next).toHaveBeenCalled();

      await testSession.destroy();
    });

    test('Should fetch session when code in req.session.sessionCode', async () => {
      const testSession = await GameSession.create({
        session_code: 'LOCALS002',
        is_active: true
      });

      req.session.sessionCode = 'LOCALS002';

      await sessionLocals(req, res, next);

      expect(res.locals.session).toBeDefined();
      expect(res.locals.session.session_code).toBe('LOCALS002');

      await testSession.destroy();
    });

    test('req.params.code takes priority over req.session.sessionCode', async () => {
      const session1 = await GameSession.create({
        session_code: 'PRIORITY01',
        is_active: true
      });
      const session2 = await GameSession.create({
        session_code: 'PRIORITY02',
        is_active: true
      });

      req.params.code = 'PRIORITY01';
      req.session.sessionCode = 'PRIORITY02';

      await sessionLocals(req, res, next);

      expect(res.locals.session.session_code).toBe('PRIORITY01');

      await session1.destroy();
      await session2.destroy();
    });

    test('Should set session = null when is_active = 0', async () => {
      const testSession = await GameSession.create({
        session_code: 'INACTIVE01',
        is_active: false
      });

      req.params.code = 'INACTIVE01';

      await sessionLocals(req, res, next);

      expect(res.locals.session).toBeNull();

      await testSession.destroy();
    });

    test('Should set session = null when session not found', async () => {
      req.params.code = 'NOTFOUND999';

      await sessionLocals(req, res, next);

      expect(res.locals.session).toBeNull();
    });
  });

  describe('Wallet balance injection', () => {
    test('Should calculate walletBalance when is_exchanged = 1', async () => {
      const testSession = await GameSession.create({
        session_code: 'WALLET01',
        is_active: true,
        player_selected_box: 2,
        is_exchanged: true,
        prize_2_cash_amount: 4900000
      });

      req.params.code = 'WALLET01';

      await sessionLocals(req, res, next);

      expect(res.locals.walletBalance).toBe(4900000);

      await testSession.destroy();
    });

    test('Should set walletBalance = 0 when is_exchanged = 0', async () => {
      const testSession = await GameSession.create({
        session_code: 'WALLET02',
        is_active: true,
        player_selected_box: 2,
        is_exchanged: false,
        prize_2_cash_amount: 4900000
      });

      req.params.code = 'WALLET02';

      await sessionLocals(req, res, next);

      expect(res.locals.walletBalance).toBe(0);

      await testSession.destroy();
    });

    test('Should set walletBalance = 0 when player_selected_box = null', async () => {
      const testSession = await GameSession.create({
        session_code: 'WALLET03',
        is_active: true,
        player_selected_box: null,
        is_exchanged: true
      });

      req.params.code = 'WALLET03';

      await sessionLocals(req, res, next);

      expect(res.locals.walletBalance).toBe(0);

      await testSession.destroy();
    });

    test('Should set walletBalance = 0 when prize_N_cash_amount = null', async () => {
      const testSession = await GameSession.create({
        session_code: 'WALLET04',
        is_active: true,
        player_selected_box: 2,
        is_exchanged: true,
        prize_2_cash_amount: null
      });

      req.params.code = 'WALLET04';

      await sessionLocals(req, res, next);

      expect(res.locals.walletBalance).toBe(0);

      await testSession.destroy();
    });
  });

  describe('hasInventory flag', () => {
    test('Should set hasInventory = true when player_selected_box IS NOT NULL', async () => {
      const testSession = await GameSession.create({
        session_code: 'INV01',
        is_active: true,
        player_selected_box: 1
      });

      req.params.code = 'INV01';

      await sessionLocals(req, res, next);

      expect(res.locals.hasInventory).toBe(true);

      await testSession.destroy();
    });

    test('Should set hasInventory = false when player_selected_box IS NULL', async () => {
      const testSession = await GameSession.create({
        session_code: 'INV02',
        is_active: true,
        player_selected_box: null
      });

      req.params.code = 'INV02';

      await sessionLocals(req, res, next);

      expect(res.locals.hasInventory).toBe(false);

      await testSession.destroy();
    });
  });

  describe('Middleware chain', () => {
    test('Should always call next() in all cases', async () => {
      req.params.code = 'INVALID';

      await sessionLocals(req, res, next);

      expect(next).toHaveBeenCalled();
    });

    test('Should set all res.locals properties before calling next', async () => {
      const testSession = await GameSession.create({
        session_code: 'CHAIN01',
        is_active: true
      });

      req.params.code = 'CHAIN01';

      await sessionLocals(req, res, next);

      expect(res.locals.session).toBeDefined();
      expect(res.locals.walletBalance).toBeDefined();
      expect(res.locals.hasInventory).toBeDefined();
      expect(next).toHaveBeenCalled();

      await testSession.destroy();
    });
  });
});
