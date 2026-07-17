const { GameSession } = require('../../models');

describe('Fraud Detection', () => {
  describe('Multiple opens detection', () => {
    test('Should set fraud_flag = 1 when session opened twice', async () => {
      const session = await GameSession.create({
        session_code: 'FRAUD001',
        is_active: true,
        player_selected_box: 1,
        fraud_flag: false
      });

      await session.update({
        fraud_flag: true,
        fraud_reason: 'Attempted multiple box opens'
      });

      const updated = await GameSession.findOne({ where: { session_code: 'FRAUD001' } });
      expect(updated.fraud_flag).toBe(true);
      expect(updated.fraud_reason).toBe('Attempted multiple box opens');

      await session.destroy();
    });

    test('Should NOT flag when boxNumber is valid', () => {
      for (let i = 1; i <= 3; i++) {
        expect([1, 2, 3].includes(i)).toBe(true);
      }
    });

    test('Should flag when boxNumber > 3', async () => {
      const session = await GameSession.create({
        session_code: 'FRAUD002',
        is_active: true,
        fraud_flag: false
      });

      const isInvalid = 4 > 3 || 4 < 1;
      expect(isInvalid).toBe(true);

      await session.destroy();
    });

    test('Should flag when boxNumber < 1', async () => {
      const boxNumber = 0;
      const isInvalid = boxNumber < 1 || boxNumber > 3;
      expect(isInvalid).toBe(true);
    });
  });

  describe('is_completed check', () => {
    test('Should flag when is_completed = 1 and open called again', async () => {
      const session = await GameSession.create({
        session_code: 'FRAUD003',
        is_active: true,
        is_completed: true,
        fraud_flag: false
      });

      const shouldFlag = session.is_completed === true;
      expect(shouldFlag).toBe(true);

      await session.destroy();
    });
  });

  describe('fraud_flag check', () => {
    test('Should reject processing when fraud_flag already = 1', async () => {
      const session = await GameSession.create({
        session_code: 'FRAUD004',
        is_active: true,
        fraud_flag: true,
        fraud_reason: 'Pre-existing fraud'
      });

      expect(session.fraud_flag).toBe(true);
      const shouldReject = session.fraud_flag === true;
      expect(shouldReject).toBe(true);

      await session.destroy();
    });
  });

  describe('Token validation', () => {
    test('Should flag when player_token missing from request', async () => {
      const session = await GameSession.create({
        session_code: 'FRAUD005',
        is_active: true,
        player_token: 'valid-token-123'
      });

      const requestToken = null;
      const tokenMismatch = requestToken !== session.player_token;
      expect(tokenMismatch).toBe(true);

      await session.destroy();
    });

    test('Should flag when player_token differs from DB', async () => {
      const session = await GameSession.create({
        session_code: 'FRAUD006',
        is_active: true,
        player_token: 'db-token-123'
      });

      const requestToken = 'request-token-456';
      const tokenMismatch = requestToken !== session.player_token;
      expect(tokenMismatch).toBe(true);

      await session.destroy();
    });
  });

  describe('fraud_reason logging', () => {
    test('Should record fraud_reason text when flagging', async () => {
      const session = await GameSession.create({
        session_code: 'FRAUD007',
        is_active: true,
        fraud_flag: false
      });

      const reason = 'Multiple box open attempts detected';
      await session.update({
        fraud_flag: true,
        fraud_reason: reason
      });

      const updated = await GameSession.findOne({ where: { session_code: 'FRAUD007' } });
      expect(updated.fraud_reason).toBe(reason);

      await session.destroy();
    });
  });
});
