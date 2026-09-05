jest.mock('../../models', () => ({ ChatSession: { findOne: jest.fn() } }));

const db = require('../../models');
const { requirePermission, requireChatSessionAccess, requireChatBodySessionAccess } = require('../../middleware/permissionMiddleware');

function response() {
  return {
    statusCode: 200,
    body: null,
    status(code) { this.statusCode = code; return this; },
    json(body) { this.body = body; return this; }
  };
}

describe('permission middleware', () => {
  beforeEach(() => jest.clearAllMocks());

  test('rejects missing session', () => {
    const res = response();
    requirePermission('chat.view')({ session: {} }, res, jest.fn());
    expect(res.statusCode).toBe(401);
  });

  test('rejects cross-agent session', async () => {
    db.ChatSession.findOne.mockResolvedValue({ support_agent_id: 20 });
    const res = response();
    await requireChatSessionAccess({ params: { sessionCode: 'CHAT_1' }, user: { id: 10, role: 'user' } }, res, jest.fn());
    expect(res.statusCode).toBe(403);
  });

  test('allows assigned agent body session', async () => {
    db.ChatSession.findOne.mockResolvedValue({ support_agent_id: 10 });
    const next = jest.fn();
    await requireChatBodySessionAccess({ body: { session_code: 'CHAT_1' }, user: { id: 10, role: 'user' } }, response(), next);
    expect(next).toHaveBeenCalledTimes(1);
  });

  test('allows admin without lookup', async () => {
    const next = jest.fn();
    await requireChatSessionAccess({ params: { sessionCode: 'CHAT_1' }, user: { id: 1, role: 'admin' } }, response(), next);
    expect(next).toHaveBeenCalledTimes(1);
    expect(db.ChatSession.findOne).not.toHaveBeenCalled();
  });
});
