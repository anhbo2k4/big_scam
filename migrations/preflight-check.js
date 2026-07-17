const db = require('../models');

function normTableName(t) {
  if (typeof t === 'string') return t.toLowerCase();
  if (t && typeof t === 'object') {
    if (t.tableName) return String(t.tableName).toLowerCase();
    if (t.name) return String(t.name).toLowerCase();
  }
  return String(t || '').toLowerCase();
}

async function hasTable(queryInterface, tableName) {
  try {
    await queryInterface.describeTable(tableName);
    return true;
  } catch (_) {
    return false;
  }
}

async function runPreflight() {
  const qi = db.sequelize.getQueryInterface();

  console.log('=== DB Preflight Check (hosting with old database) ===');

  try {
    await db.sequelize.authenticate();
  } catch (err) {
    console.error('FAIL: Cannot connect to database:', err.message);
    process.exit(2);
  }

  const rawTables = await qi.showAllTables();
  const tableSet = new Set((rawTables || []).map(normTableName));

  const requiredTables = [
    'users',
    'game_sessions',
    'withdrawals',
    'gift_exchanges',
    'chat_sessions',
    'chat_messages',
    'player_inventory',
    'audit_logs',
    'prizes',
    'transaction_ledger',
    'site_settings',
    'wallets',
    'permissions',
    'ui_customizations',
    'prize_icons',
    'banners',
    'conversion_requests',
    'remember_tokens',
    'leaderboards',
    'user_levels',
    'risk_scores',
    'prize_inventories',
    'admin_configs'
  ];

  const requiredColumns = {
    game_sessions: [
      'boxes_opened',
      'status',
      'trust_score',
      'currency',
      'player_selected_box',
      'player_selected_at',
      'player_name',
      'player_phone',
      'player_email',
      'player_viewed_at',
      'selected_prize',
      'selected_box_number',
      'prize_accepted_at',
      'created_at',
      'updated_at'
    ],
    withdrawals: [
      'amount',
      'status',
      'customer_name',
      'customer_phone'
    ],
    gift_exchanges: [
      'status',
      'prize_info'
    ],
    chat_sessions: ['status', 'customer_name', 'created_at'],
    chat_messages: ['sender_type', 'message', 'created_at'],
    player_inventory: ['currency', 'status'],
    site_settings: ['key', 'value']
  };

  const missingTables = requiredTables.filter((t) => !tableSet.has(t));

  const missingColumns = [];
  for (const [tableName, cols] of Object.entries(requiredColumns)) {
    if (!tableSet.has(tableName)) {
      missingColumns.push({ table: tableName, missing: cols.slice() });
      continue;
    }

    let desc;
    try {
      desc = await qi.describeTable(tableName);
    } catch (err) {
      missingColumns.push({ table: tableName, missing: cols.slice() });
      continue;
    }

    const miss = cols.filter((c) => !Object.prototype.hasOwnProperty.call(desc, c));
    if (miss.length > 0) {
      missingColumns.push({ table: tableName, missing: miss });
    }
  }

  // Optional extra checks to catch common migration drift
  const extras = {
    remember_tokens: await hasTable(qi, 'remember_tokens'),
    leaderboards: await hasTable(qi, 'leaderboards'),
    user_levels: await hasTable(qi, 'user_levels'),
    risk_scores: await hasTable(qi, 'risk_scores'),
    prize_inventories: await hasTable(qi, 'prize_inventories'),
    admin_configs: await hasTable(qi, 'admin_configs')
  };

  if (missingTables.length === 0) {
    console.log('PASS: All required tables exist.');
  } else {
    console.log('FAIL: Missing required tables:');
    missingTables.forEach((t) => console.log(`  - ${t}`));
  }

  if (missingColumns.length === 0) {
    console.log('PASS: Required columns are present.');
  } else {
    console.log('FAIL: Missing required columns:');
    missingColumns.forEach((x) => {
      console.log(`  - ${x.table}: ${x.missing.join(', ')}`);
    });
  }

  console.log('INFO: Optional tables status:');
  Object.entries(extras).forEach(([k, v]) => {
    console.log(`  - ${k}: ${v ? 'present' : 'missing'}`);
  });

  const ok = missingTables.length === 0 && missingColumns.length === 0;
  if (ok) {
    console.log('RESULT: READY for deploy to old hosting DB.');
    process.exit(0);
  }

  console.log('RESULT: NOT READY. Run migrations and re-check.');
  process.exit(1);
}

runPreflight().catch((err) => {
  console.error('Preflight error:', err.message || err);
  process.exit(2);
});
