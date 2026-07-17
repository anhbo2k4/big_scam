/**
 * Test Setup and Database Seeding
 * Provides utilities for running tests with a real test database
 */

const db = require('../models');

// 6 pre-defined test sessions with different game states
const seedTestData = {
  // TEST001: Fresh session, no box opened
  TEST001: {
    session_code: 'TEST001',
    is_active: true,
    view_count: 0,
    player_selected_box: null,
    server_random_boxes: [1, 2, 3],
    prize_1_name: 'iPhone 16 Pro Max',
    prize_1_image_url: 'https://example.com/iphone.jpg',
    prize_1_cash_amount: 30000000,
    prize_2_name: 'Samsung Galaxy S24',
    prize_2_image_url: 'https://example.com/samsung.jpg',
    prize_2_cash_amount: 20000000,
    prize_3_name: 'Lucky Draw Ticket',
    prize_3_image_url: 'https://example.com/ticket.jpg',
    prize_3_cash_amount: 5000000,
    result_event_count: 0
  },

  // TEST002: Already opened box 1, won prize
  TEST002: {
    session_code: 'TEST002',
    is_active: true,
    view_count: 1,
    player_selected_box: 1,
    prize_1_name: 'iPhone 16 Pro Max',
    prize_1_image_url: 'https://example.com/iphone.jpg',
    prize_1_cash_amount: 30000000,
    prize_2_name: 'Samsung Galaxy S24',
    prize_2_cash_amount: 20000000,
    prize_3_name: 'Ticket',
    prize_3_cash_amount: 5000000,
    result_event_count: 1,
    selected_prize_details: JSON.stringify({
      name: 'iPhone 16 Pro Max',
      image: 'https://example.com/iphone.jpg',
      cashAmount: 30000000
    })
  },

  // TEST003: Opened and exchanged to cash
  TEST003: {
    session_code: 'TEST003',
    is_active: true,
    player_selected_box: 2,
    is_exchanged: true,
    prize_2_cash_amount: 20000000,
    result_event_count: 1
  },

  // TEST004: Opened and claimed as item
  TEST004: {
    session_code: 'TEST004',
    is_active: true,
    player_selected_box: 2,
    is_form_submitted: true,
    player_name: 'Nguyen Van A',
    player_phone: '0901234567',
    player_email: 'test@example.com',
    result_event_count: 1
  },

  // TEST005: Expired session (is_active=0)
  TEST005: {
    session_code: 'TEST005',
    is_active: false,
    player_selected_box: null
  },

  // TEST006: Fraud flagged session
  TEST006: {
    session_code: 'TEST006',
    is_active: true,
    fraud_flag: true,
    fraud_reason: 'Multiple opens detected'
  },
  
  // TEST007: Lost (no prize / completed state)
  TEST007: {
    session_code: 'TEST007',
    is_active: true,
    player_selected_box: 3,
    result_event_count: 1
  },
  
  // TEST008: Special prize pending approval
  TEST008: {
    session_code: 'TEST008',
    is_active: true,
    player_selected_box: 1,
    is_form_submitted: true,
    player_name: 'Tran Thi B',
    player_phone: '0912345678',
    result_event_count: 1
  }
};

/**
 * Create a test session with custom overrides
 * @param {Object} overrides - Custom field values
 * @returns {Promise<GameSession>}
 */
async function createTestSession(overrides = {}) {
  const defaultSession = {
    is_active: true,
    view_count: 0,
    player_selected_box: null,
    result_event_count: 0,
    ...overrides
  };

  const session = await db.GameSession.create(defaultSession);
  return session;
}

/**
 * Seed all test data
 * @returns {Promise<void>}
 */
async function seedTestData_func() {
  try {
    for (const [code, data] of Object.entries(seedTestData)) {
      const existing = await db.GameSession.findByPk(code);
      if (existing) {
        await existing.destroy();
      }
      await db.GameSession.create(data);
    }
  } catch (err) {
    console.error('Error seeding test data:', err);
    throw err;
  }
}

/**
 * Clean up all test sessions
 * @returns {Promise<void>}
 */
async function cleanupTestSessions() {
  try {
    const testCodes = Object.keys(seedTestData);
    for (const code of testCodes) {
      const session = await db.GameSession.findByPk(code);
      if (session) {
        await session.destroy();
      }
    }
  } catch (err) {
    console.error('Error cleaning up test sessions:', err);
    throw err;
  }
}

module.exports = {
  createTestSession,
  seedTestData: seedTestData_func,
  cleanupTestSessions,
  testSessions: seedTestData
};
