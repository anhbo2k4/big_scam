const db = require('../models');

const runMigrations = async () => {
    try {
        const columns = await db.sequelize.queryInterface.describeTable('game_sessions');
        
        const fieldsToAdd = [
            { name: 'prize_1_cash', type: 'BOOLEAN', defaultValue: 0 },
            { name: 'prize_2_cash', type: 'BOOLEAN', defaultValue: 0 },
            { name: 'prize_3_cash', type: 'BOOLEAN', defaultValue: 0 },
            { name: 'prize_1_cash_amount', type: 'BIGINT', defaultValue: null },
            { name: 'prize_2_cash_amount', type: 'BIGINT', defaultValue: null },
            { name: 'prize_3_cash_amount', type: 'BIGINT', defaultValue: null },
            { name: 'prize_1_image_url', type: 'TEXT', defaultValue: null },
            { name: 'prize_2_image_url', type: 'TEXT', defaultValue: null },
            { name: 'prize_3_image_url', type: 'TEXT', defaultValue: null },
            { name: 'is_exchanged', type: 'BOOLEAN', defaultValue: false },
            { name: 'exchanged_at', type: 'DATE', defaultValue: null },
            { name: 'created_at', type: 'DATETIME', defaultValue: null },
            { name: 'updated_at', type: 'DATETIME', defaultValue: null },
            // Security fields (Week 1)
            { name: 'server_random_boxes', type: 'JSON', defaultValue: null },
            { name: 'player_token', type: 'STRING', defaultValue: null },
            { name: 'result_hash', type: 'STRING', defaultValue: null },
            { name: 'server_random_seed', type: 'STRING', defaultValue: null },
            // Game type and configuration
            { name: 'game_type', type: 'STRING', defaultValue: 'boxes' },
            { name: 'box_count', type: 'INTEGER', defaultValue: 3 },
            { name: 'result_event_count', type: 'INTEGER', defaultValue: 0 },
            // Fraud detection fields
            { name: 'fraud_flag', type: 'BOOLEAN', defaultValue: false },
            { name: 'fraud_reason', type: 'STRING', defaultValue: null },
            // Lucky box tracking - multiple boxes opening (max 3)
            { name: 'boxes_opened', type: 'JSON', defaultValue: '[]' },
            // Player tracking fields (historically in 002_add_player_tracking_fields)
            { name: 'player_selected_box', type: 'INTEGER', defaultValue: null },
            { name: 'player_selected_at', type: 'DATE', defaultValue: null },
            { name: 'player_name', type: 'STRING', defaultValue: null },
            { name: 'player_phone', type: 'STRING', defaultValue: null },
            { name: 'player_email', type: 'STRING', defaultValue: null },
            { name: 'player_viewed_at', type: 'DATE', defaultValue: null },
            { name: 'selected_prize_details', type: 'JSON', defaultValue: null },
            { name: 'box_selection_event', type: 'JSON', defaultValue: null },
            { name: 'is_form_submitted', type: 'BOOLEAN', defaultValue: false },
            { name: 'form_submitted_at', type: 'DATE', defaultValue: null },
            // Prize selection fields (historically in 008_add_selected_prize_field)
            { name: 'selected_prize', type: 'STRING', defaultValue: null },
            { name: 'selected_box_number', type: 'INTEGER', defaultValue: null },
            { name: 'prize_accepted_at', type: 'DATE', defaultValue: null },
            // Security fingerprinting fields (025_add_browser_fingerprint is broken — handled here)
            { name: 'browser_fingerprint', type: 'STRING', defaultValue: null },
            { name: 'last_activity_ip', type: 'STRING', defaultValue: null },
            { name: 'session_validated', type: 'BOOLEAN', defaultValue: false },
            { name: 'suspicious_activity', type: 'JSON', defaultValue: null }
        ];

        for (const field of fieldsToAdd) {
            if (!columns[field.name]) {
                console.log(`⏳ Adding column: ${field.name}`);
                
                let columnType = db.Sequelize.DataTypes[field.type];
                if (!columnType) {
                    // Handle special types not in DataTypes
                    if (field.type === 'DATETIME') {
                        columnType = db.Sequelize.DATE;
                    } else if (field.type === 'JSON') {
                        columnType = db.Sequelize.JSON;
                    } else {
                        columnType = db.Sequelize.STRING;
                    }
                }
                
                await db.sequelize.queryInterface.addColumn('game_sessions', field.name, {
                    type: columnType,
                    allowNull: true,
                    defaultValue: field.defaultValue
                });
                console.log(`✓ Column ${field.name} added successfully`);
            }
        }

        // Create prize_exchanges table if it doesn't exist
        const tables = await db.sequelize.queryInterface.showAllTables();
        if (!tables.includes('prize_exchanges')) {
            console.log('⏳ Creating prize_exchanges table...');
            await db.sequelize.queryInterface.createTable('prize_exchanges', {
                id: {
                    type: db.Sequelize.INTEGER,
                    primaryKey: true,
                    autoIncrement: true
                },
                session_code: {
                    type: db.Sequelize.STRING,
                    allowNull: false,
                    unique: true
                },
                customer_name: {
                    type: db.Sequelize.STRING,
                    allowNull: false
                },
                customer_phone: {
                    type: db.Sequelize.STRING,
                    allowNull: false
                },
                bank_name: {
                    type: db.Sequelize.STRING,
                    allowNull: false
                },
                bank_account: {
                    type: db.Sequelize.STRING,
                    allowNull: false
                },
                prize_name: {
                    type: db.Sequelize.STRING,
                    allowNull: true
                },
                prize_amount: {
                    type: db.Sequelize.INTEGER,
                    defaultValue: 0
                },
                status: {
                    type: db.Sequelize.ENUM('PENDING', 'APPROVED', 'COMPLETED', 'REJECTED'),
                    defaultValue: 'PENDING'
                },
                approved_at: {
                    type: db.Sequelize.DATE,
                    defaultValue: null
                },
                completed_at: {
                    type: db.Sequelize.DATE,
                    defaultValue: null
                },
                notes: {
                    type: db.Sequelize.TEXT,
                    defaultValue: null
                },
                created_at: {
                    type: db.Sequelize.DATE,
                    defaultValue: db.Sequelize.NOW
                },
                updated_at: {
                    type: db.Sequelize.DATE,
                    defaultValue: db.Sequelize.NOW
                }
            });
            console.log('✓ prize_exchanges table created successfully');
        }

        console.log('✓ All migrations completed successfully!\n');
        
        // Run admin account migration
        try {
            const adminMigration = require('./001_create_admin_account');
            await adminMigration.up(db);
        } catch (adminError) {
            console.error('Admin migration error:', adminError.message);
        }

        // Run Phase 2 migration (box tracking for withdrawals and gifts)
        try {
            const migration003 = require('./003_add_box_tracking_to_withdrawals_gifts');
            await migration003.up(db.sequelize.getQueryInterface(), db.Sequelize);
        } catch (m003Error) {
            const msg = String(m003Error && m003Error.message || '');
            if (!msg.includes('Duplicate column') && !msg.includes('already exists') && !msg.includes('ER_DUP_FIELDNAME')) {
                console.error('Migration 003 error:', msg);
            }
        }

        // Migration 005 — add notes + rejection_reason to withdrawals
        try {
            const migration005 = require('./005_add_missing_withdrawal_columns');
            await migration005.up(db.sequelize.getQueryInterface(), db.Sequelize);
        } catch (m005Error) {
            const msg = String(m005Error && m005Error.message || '');
            if (!msg.includes('Duplicate column') && !msg.includes('already exists') && !msg.includes('ER_DUP_FIELDNAME')) {
                console.error('Migration 005 error:', msg);
            }
        }

        // Migration 006 — add prize_info JSON to gift_exchanges
        try {
            const migration006 = require('./006_add_missing_gift_exchange_columns');
            await migration006.up(db.sequelize.getQueryInterface(), db.Sequelize);
        } catch (m006Error) {
            const msg = String(m006Error && m006Error.message || '');
            if (!msg.includes('Duplicate column') && !msg.includes('already exists') && !msg.includes('ER_DUP_FIELDNAME')) {
                console.error('Migration 006 error:', msg);
            }
        }

        // Run Phase 1 migration (real-time tracking in game sessions)
        try {
            const migration004 = require('./004_add_phase1_tracking_to_game_sessions');
            await migration004.up(db.sequelize.getQueryInterface(), db.Sequelize);
        } catch (m004Error) {
            const msg = String(m004Error && m004Error.message || '');
            if (!msg.includes('Duplicate column') && !msg.includes('already exists') && !msg.includes('ER_DUP_FIELDNAME')) {
                console.error('Migration 004 error:', msg);
            }
        }

        // Run migration 010 (add missing chat columns)
        try {
            const migration010 = require('./010_add_missing_chat_columns');
            await migration010.up(db.sequelize.getQueryInterface(), db.Sequelize);
        } catch (m010Error) {
            const msg = String(m010Error && m010Error.message || '');
            if (!msg.includes('Duplicate column') && !msg.includes('already exists') && !msg.includes('ER_DUP_FIELDNAME')) {
                console.error('Migration 010 error:', msg);
            }
        }

        try {
            const migration011 = require('./011_add_customer_tracking_fields');
            await migration011.up(db);
        } catch (m011Error) {
            const msg = String(m011Error && m011Error.message || '');
            if (!msg.includes('Duplicate column') && !msg.includes('already exists') && !msg.includes('ER_DUP_FIELDNAME')) {
                console.error('Migration 011 error:', msg);
            }
        }

        // Run migration 012 (add withdrawal tracking fields)
        try {
            const migration012 = require('./012_add_withdrawal_tracking_fields');
            await migration012.up(db.sequelize.getQueryInterface(), db.Sequelize);
        } catch (m012Error) {
            const msg = String(m012Error && m012Error.message || '');
            if (!msg.includes('Duplicate column') && !msg.includes('already exists') && !msg.includes('ER_DUP_FIELDNAME')) {
                console.error('Migration 012 error:', msg);
            }
        }

        // Run migration 013 (add customer info fields to withdrawals)
        try {
            const migration013 = require('./013_add_customer_info_fields_to_withdrawals');
            await migration013.up(db.sequelize.getQueryInterface(), db.Sequelize);
        } catch (m013Error) {
            const msg = String(m013Error && m013Error.message || '');
            if (!msg.includes('Duplicate column') && !msg.includes('already exists') && !msg.includes('ER_DUP_FIELDNAME')) {
                console.error('Migration 013 error:', msg);
            }
        }

        // Run migration 014 (add security and fraud detection fields)
        try {
            const migration014 = require('./014_add_security_fields');
            await migration014.up(db.sequelize.getQueryInterface(), db.Sequelize);
        } catch (m014Error) {
            const msg = String(m014Error && m014Error.message || '');
            if (!msg.includes('Duplicate column') && !msg.includes('already exists') && !msg.includes('ER_DUP_FIELDNAME')) {
                console.error('Migration 014 error:', msg);
            }
        }

        // Run migration 015 (add Week 2 rarity, color, and game type fields)
        try {
            const migration015 = require('./015_add_week2_fields');
            await migration015.up(db.sequelize.getQueryInterface(), db.Sequelize);
        } catch (m015Error) {
            const msg = String(m015Error && m015Error.message || '');
            if (!msg.includes('Duplicate column') && !msg.includes('already exists') && !msg.includes('ER_DUP_FIELDNAME')) {
                console.error('Migration 015 error:', msg);
            }
        }

        // Run migration 016 (add final remaining columns)
        try {
            const migration016 = require('./016_add_final_columns');
            await migration016.up(db.sequelize.getQueryInterface(), db.Sequelize);
        } catch (m016Error) {
            const msg = String(m016Error && m016Error.message || '');
            if (!msg.includes('Duplicate column') && !msg.includes('already exists') && !msg.includes('ER_DUP_FIELDNAME')) {
                console.error('Migration 016 error:', msg);
            }
        }

        // Run migration 017 (create user game history table)
        try {
            const migration017 = require('./017_create_user_game_history');
            await migration017.up(db.sequelize.getQueryInterface(), db.Sequelize);
            console.log('✅ Migration 017 completed: Created user_game_histories table');
        } catch (m017Error) {
            console.error('Migration 017 error:', m017Error.message);
        }

        // Run migration 018 (create prize redemption history table)
        try {
            const migration018 = require('./018_create_prize_redemption_history');
            await migration018.up(db.sequelize.getQueryInterface(), db.Sequelize);
            console.log('✅ Migration 018 completed: Created prize_redemption_histories table');
        } catch (m018Error) {
            console.error('Migration 018 error:', m018Error.message);
        }

        // Run migration 019 (add missing withdrawal columns)
        try {
            const migration019 = require('./019_add_withdrawal_columns');
            await migration019.up(db.sequelize.getQueryInterface(), db.Sequelize);
            console.log('✅ Migration 019 completed: Added withdrawal columns');
        } catch (m019Error) {
            console.error('Migration 019 error:', m019Error.message);
        }

        // Run migration 022 (create player inventory table)
        try {
            const migration022 = require('./022_create_player_inventory_table');
            await migration022.up(db.sequelize.getQueryInterface(), db.Sequelize);
            console.log('✅ Migration 022 completed: Created player_inventory table');
        } catch (m022Error) {
            if (!m022Error.message.includes('already exists')) {
                console.error('Migration 022 error:', m022Error.message);
            } else {
                console.log('✅ Player inventory table already exists');
            }
        }

        // Run migration 023 (drop withdrawal user_id foreign key)
        try {
            const migration023 = require('./023_drop_withdrawal_user_fk');
            await migration023.up(db.sequelize.getQueryInterface(), db.Sequelize);
            console.log('✅ Migration 023 completed: Removed withdrawal user_id foreign key');
        } catch (m023Error) {
            if (!m023Error.message.includes('1091') && !m023Error.message.includes('does not exist')) {
                console.error('Migration 023 error:', m023Error.message);
            } else {
                console.log('✅ Withdrawal foreign key constraint already removed');
            }
        }

        // Run migration 024 (add status column to game_sessions)
        try {
            const migration024 = require('./024_add_status_to_game_sessions');
            await migration024.up(db.sequelize.getQueryInterface(), db.Sequelize);
            console.log('✅ Migration 024 completed: Added status column to game_sessions');
        } catch (m024Error) {
            if (!m024Error.message.includes('already exists') && !m024Error.message.includes('Duplicate column')) {
                console.error('Migration 024 error:', m024Error.message);
            } else {
                console.log('✅ Status column already exists');
            }
        }

        // Run migration 025-028 (fix gift exchanges foreign keys)
        const fkMigrations = [
            { num: 25, file: './025_fix_gift_exchanges_foreign_keys' },
            { num: 26, file: './026_fix_gift_exchanges_fk_raw_sql' },
            { num: 27, file: './027_fix_gift_exchanges_fk_final' },
            { num: 28, file: './028_fix_gift_exchanges_fk_aggressive' }
        ];

        for (const mig of fkMigrations) {
            try {
                const migration = require(mig.file);
                await migration.up(db.sequelize.getQueryInterface(), db.Sequelize);
                console.log(`✅ Migration ${mig.num} completed: Fixed gift_exchanges foreign keys`);
            } catch (err) {
                // These are fixing migrations, so they may fail gracefully
                console.log(`⏳ Migration ${mig.num} skipped (likely already applied)`);
            }
        }

        // Run migration 029 (make gift_exchanges user_id nullable)
        try {
            const migration029 = require('./029_make_gift_exchanges_user_id_nullable');
            await migration029.up(db.sequelize.getQueryInterface(), db.Sequelize);
        } catch (m029Error) {
        }

        // Run migration 030 (initialize boxes_opened field)
        try {
            const migration030 = require('./030_initialize_boxes_opened');
            await migration030.up(db.sequelize.getQueryInterface(), db.Sequelize);
        } catch (m030Error) {
            console.log('⏳ Migration 030 skipped (likely already applied)');
        }

        // Run migration 031 (trust_score + session manual wallet amount)
        try {
            const migration031 = require('./031_add_trust_score_and_session_wallet_manual');
            await migration031.up(db.sequelize.getQueryInterface(), db.Sequelize);
            console.log('✅ Migration 031 completed: Added trust_score and wallet_manual_amount');
        } catch (m031Error) {
            if (!m031Error.message.includes('already exists') && !m031Error.message.includes('Duplicate column')) {
                console.error('Migration 031 error:', m031Error.message);
            } else {
                console.log('✅ Migration 031 columns already exist');
            }
        }

        // Run migration 032 (session-level trust_score)
        try {
            const migration032 = require('./032_add_trust_score_to_game_sessions');
            await migration032.up(db.sequelize.getQueryInterface(), db.Sequelize);
            console.log('✅ Migration 032 completed: Added trust_score to game_sessions');
        } catch (m032Error) {
            if (!m032Error.message.includes('already exists') && !m032Error.message.includes('Duplicate column')) {
                console.error('Migration 032 error:', m032Error.message);
            } else {
                console.log('✅ Migration 032 column already exists');
            }
        }

        // Run migration 033 (create conversion requests table)
        try {
            const migration033 = require('./033_create_conversion_requests_table');
            await migration033.up(db.sequelize.getQueryInterface(), db.Sequelize);
            console.log('✅ Migration 033 completed: Created conversion_requests table');
        } catch (m033Error) {
            if (!m033Error.message.includes('already exists')) {
                console.error('Migration 033 error:', m033Error.message);
            } else {
                console.log('✅ conversion_requests table already exists');
            }
        }

        // Run migration 034 (add admin audit fields)
        try {
            const migration034 = require('./034_add_admin_audit_fields');
            await migration034.up();
            console.log('✅ Migration 034 completed: Added admin audit fields');
        } catch (m034Error) {
            console.error('Migration 034 error:', m034Error.message);
        }

        // Run migration 035 (add currency support fields)
        try {
            const migration035 = require('./035_add_currency_fields');
            await migration035.up(db.sequelize.getQueryInterface(), db.Sequelize);
            console.log('✅ Migration 035 completed: Added currency fields');
        } catch (m035Error) {
            if (!m035Error.message.includes('already exists') && !m035Error.message.includes('Duplicate column')) {
                console.error('Migration 035 error:', m035Error.message);
            } else {
                console.log('✅ Migration 035 columns already exist');
            }
        }

        // Run migration 036 (add session currency)
        try {
            const migration036 = require('./036_add_session_currency');
            await migration036.up(db.sequelize.getQueryInterface(), db.Sequelize);
            console.log('✅ Migration 036 completed: Added session currency');
        } catch (m036Error) {
            if (!m036Error.message.includes('already exists') && !m036Error.message.includes('Duplicate column')) {
                console.error('Migration 036 error:', m036Error.message);
            } else {
                console.log('✅ Migration 036 column already exists');
            }
        }

        // Run unexecuted table migrations conditionally (safe for existing hosted DB)
        const qi = db.sequelize.getQueryInterface();
        const normTableName = (t) => {
            if (typeof t === 'string') return t.toLowerCase();
            if (t && typeof t === 'object') {
                if (t.tableName) return String(t.tableName).toLowerCase();
                if (t.name) return String(t.name).toLowerCase();
            }
            return String(t || '').toLowerCase();
        };
        const refreshTableSet = async () => {
            const tableList = await qi.showAllTables();
            return new Set((tableList || []).map(normTableName));
        };

        let tableSet = await refreshTableSet();
        const hasTable = (name) => tableSet.has(String(name).toLowerCase());

        const runCreateIfMissing = async (tableName, migrationFile, mode = 'qi') => {
            if (hasTable(tableName)) {
                console.log(`✅ ${tableName} already exists`);
                return;
            }
            try {
                const migration = require(migrationFile);
                if (mode === 'sequelize') {
                    await migration.up(db.sequelize, db.Sequelize);
                } else {
                    await migration.up(db.sequelize.getQueryInterface(), db.Sequelize);
                }
                tableSet = await refreshTableSet();
                console.log(`✅ Created missing table: ${tableName}`);
            } catch (err) {
                const msg = String(err && err.message || '');
                if (msg.includes('already exists') || msg.includes('Table') && msg.includes('exists')) {
                    tableSet = await refreshTableSet();
                    console.log(`✅ ${tableName} already exists`);
                } else {
                    console.error(`Migration for ${tableName} error:`, msg);
                }
            }
        };

        await runCreateIfMissing('withdrawals', './002_create_withdrawals_table');
        await runCreateIfMissing('gift_exchanges', './003_create_gift_exchanges_table');
        await runCreateIfMissing('remember_tokens', './007_create_remember_tokens_table');
        // 009 uses sequelize object signature
        if (!hasTable('chat_sessions') || !hasTable('chat_messages')) {
            await runCreateIfMissing('chat_sessions', './009_create_chat_tables', 'sequelize');
        }
        await runCreateIfMissing('audit_logs', './015_create_audit_logs_table');
        await runCreateIfMissing('prizes', './017_create_prizes_table');
        await runCreateIfMissing('transaction_ledger', './019_create_transaction_ledger_table');
        if (!hasTable('leaderboards') || !hasTable('user_levels')) {
            await runCreateIfMissing('leaderboards', './020_create_gamification_tables');
            tableSet = await refreshTableSet();
        }
        if (!hasTable('risk_scores') || !hasTable('prize_inventories') || !hasTable('admin_configs')) {
            await runCreateIfMissing('risk_scores', './021_create_anticheat_inventory_config_tables');
            tableSet = await refreshTableSet();
        }
        await runCreateIfMissing('site_settings', './037_create_site_settings_table');

        // Migration 039 — banners (raw SQL IF NOT EXISTS, always safe to call)
        try {
            const migration039 = require('./039_create_banners_table');
            await migration039.up(db.sequelize.getQueryInterface(), db.Sequelize);
        } catch (m039Error) {
            console.error('Migration 039 error:', String(m039Error && m039Error.message || ''));
        }

        // Migration 040 — permissions, ui_customizations, prize_icons (raw SQL IF NOT EXISTS)
        try {
            const migration040 = require('./040_create_missing_tables');
            await migration040.up(db.sequelize.getQueryInterface(), db.Sequelize);
            tableSet = await refreshTableSet();
        } catch (m040Error) {
            console.error('Migration 040 error:', String(m040Error && m040Error.message || ''));
        }

        // Migration 041 — banners popup/design fields
        try {
            const migration041 = require('./041_add_banner_popup_and_design_fields');
            await migration041.up(db.sequelize.getQueryInterface(), db.Sequelize);
        } catch (m041Error) {
            const msg = String(m041Error && m041Error.message || '');
            if (!msg.includes('Duplicate column') && !msg.includes('already exists') && !msg.includes('ER_DUP_FIELDNAME')) {
                console.error('Migration 041 error:', msg);
            }
        }

        // Migration 042 — advanced popup fields + GrapesJS HTML/CSS storage
        try {
            const migration042 = require('./042_add_banner_advanced_popup_fields');
            await migration042.up(db.sequelize.getQueryInterface(), db.Sequelize);
        } catch (m042Error) {
            const msg = String(m042Error && m042Error.message || '');
            if (!msg.includes('Duplicate column') && !msg.includes('already exists') && !msg.includes('ER_DUP_FIELDNAME')) {
                console.error('Migration 042 error:', msg);
            }
        }

        // Migration 043 — banner schedule window
        try {
            const migration043 = require('./043_add_banner_schedule_fields');
            await migration043.up(db.sequelize.getQueryInterface(), db.Sequelize);
        } catch (m043Error) {
            const msg = String(m043Error && m043Error.message || '');
            if (!msg.includes('Duplicate column') && !msg.includes('already exists') && !msg.includes('ER_DUP_FIELDNAME')) {
                console.error('Migration 043 error:', msg);
            }
        }

        // Migration 044 — banner custom popup width/height
        try {
            const migration044 = require('./044_add_banner_popup_size_fields');
            await migration044.up(db.sequelize.getQueryInterface(), db.Sequelize);
        } catch (m044Error) {
            const msg = String(m044Error && m044Error.message || '');
            if (!msg.includes('Duplicate column') && !msg.includes('already exists') && !msg.includes('ER_DUP_FIELDNAME')) {
                console.error('Migration 044 error:', msg);
            }
        }

        // Migration 045 — access_visits table for site-wide IP page tracking
        try {
            const migration045 = require('./045_create_access_visits_table');
            await migration045.up(db.sequelize.getQueryInterface(), db.Sequelize);
            tableSet = await refreshTableSet();
        } catch (m045Error) {
            const msg = String(m045Error && m045Error.message || '');
            if (!msg.includes('already exists')) {
                console.error('Migration 045 error:', msg);
            }
        }

        // Migration 046 — access_visits browser/device signature fields
        try {
            const migration046 = require('./046_add_access_visit_client_signatures');
            await migration046.up(db.sequelize.getQueryInterface(), db.Sequelize);
        } catch (m046Error) {
            const msg = String(m046Error && m046Error.message || '');
            if (!msg.includes('Duplicate column') && !msg.includes('already exists') && !msg.includes('ER_DUP_FIELDNAME')) {
                console.error('Migration 046 error:', msg);
            }
        }

        // Migration 047 — expand cash amount columns to BIGINT (avoid int32 overflow)
        try {
            const migration047 = require('./047_expand_cash_amount_columns_to_bigint');
            await migration047.up(db.sequelize.getQueryInterface(), db.Sequelize);
        } catch (m047Error) {
            const msg = String(m047Error && m047Error.message || '');
            if (!msg.includes('already exists') && !msg.includes('Duplicate column') && !msg.includes('ER_DUP_FIELDNAME')) {
                console.error('Migration 047 error:', msg);
            }
        }

        // Wallets table (018_create_wallets_table.js) — was missing from auto-migration
        await runCreateIfMissing('wallets', './018_create_wallets_table');

        // Migration 048 — push subscriptions table for Web Push API (VAPID)
        // Up function takes (sequelize) not (qi, Sequelize)
        await runCreateIfMissing('push_subscriptions', './048_create_push_subscriptions', 'sequelize');

        // Migration 038 — random box opening mode + join tracking fields
        try {
            const migration038 = require('./038_add_random_box_mode_and_join_tracking');
            await migration038.up(db.sequelize.getQueryInterface(), db.Sequelize);
        } catch (m038Error) {
            const msg = String(m038Error && m038Error.message || '');
            if (!msg.includes('Duplicate column') && !msg.includes('already exists')) {
                console.error('Migration 038 error:', msg);
            }
        }

        // Expansion migration for audit_logs user tracking (depends on audit_logs existing)
        try {
            if (hasTable('audit_logs')) {
                const migration014x = require('./014_expand_audit_logs_for_user_tracking');
                await migration014x.up(db.sequelize, db.Sequelize);
                console.log('✅ Migration 014x completed: Expanded audit_logs tracking fields');
            }
        } catch (m014xError) {
            const msg = String(m014xError && m014xError.message || '');
            if (!msg.includes('Duplicate column') && !msg.includes('already exists')) {
                console.error('Migration 014x error:', msg);
            }
        }

        // Migration 049 — compound index on chat_messages (session_code, created_at)
        try {
            const migration049 = require('./049_add_chatmessage_compound_index');
            await migration049.up(db.sequelize.getQueryInterface(), db.Sequelize);
            console.log('✅ Migration 049 completed: Compound index on chat_messages');
        } catch (m049Error) {
            const msg = String(m049Error && m049Error.message || '');
            if (!msg.includes('already exists') && !msg.includes('Duplicate key name') && !msg.includes('ER_DUP_KEYNAME')) {
                console.error('Migration 049 error:', msg);
            }
        }
    } catch (error) {
        console.error('Migration error:', error);
    }
};

module.exports = runMigrations;
