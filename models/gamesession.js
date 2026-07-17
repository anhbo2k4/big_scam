module.exports = (sequelize, DataTypes) => {
  return sequelize.define('GameSession', {
    session_code: { type: DataTypes.STRING, unique: true },

    prize_1: DataTypes.TEXT,
    prize_2: DataTypes.TEXT,
    prize_3: DataTypes.TEXT,

    prize_1_description: DataTypes.TEXT,
    prize_2_description: DataTypes.TEXT,
    prize_3_description: DataTypes.TEXT,

    prize_1_icon: { type: DataTypes.STRING, defaultValue: '🎁' },
    prize_2_icon: { type: DataTypes.STRING, defaultValue: '🎁' },
    prize_3_icon: { type: DataTypes.STRING, defaultValue: '🎁' },

    prize_1_status: { type: DataTypes.STRING, defaultValue: 'NORMAL' },
    prize_2_status: { type: DataTypes.STRING, defaultValue: 'NORMAL' },
    prize_3_status: { type: DataTypes.STRING, defaultValue: 'NORMAL' },

    prize_1_is_special: { type: DataTypes.BOOLEAN, defaultValue: false },
    prize_2_is_special: { type: DataTypes.BOOLEAN, defaultValue: false },
    prize_3_is_special: { type: DataTypes.BOOLEAN, defaultValue: false },

    prize_1_cash: { type: DataTypes.BOOLEAN, defaultValue: false },
    prize_2_cash: { type: DataTypes.BOOLEAN, defaultValue: false },
    prize_3_cash: { type: DataTypes.BOOLEAN, defaultValue: false },

    prize_1_cash_amount: DataTypes.BIGINT,
    prize_2_cash_amount: DataTypes.BIGINT,
    prize_3_cash_amount: DataTypes.BIGINT,

    prize_1_image_url: DataTypes.TEXT,
    prize_2_image_url: DataTypes.TEXT,
    prize_3_image_url: DataTypes.TEXT,

    currency: {
      type: DataTypes.STRING(10),
      defaultValue: 'VND',
      comment: 'Loại tiền tệ cho phiên: VND, USD, NDT'
    },

    prize_1_approved: { type: DataTypes.BOOLEAN, defaultValue: false },
    prize_2_approved: { type: DataTypes.BOOLEAN, defaultValue: false },
    prize_3_approved: { type: DataTypes.BOOLEAN, defaultValue: false },

    box_positions: { type: DataTypes.JSON, defaultValue: [1,2,3] },

    box_1_opened: { type: DataTypes.BOOLEAN, defaultValue: false },
    box_2_opened: { type: DataTypes.BOOLEAN, defaultValue: false },
    box_3_opened: { type: DataTypes.BOOLEAN, defaultValue: false },

    is_completed: { type: DataTypes.BOOLEAN, defaultValue: false },
    is_active: { type: DataTypes.BOOLEAN, defaultValue: true },
    status: { 
      type: DataTypes.ENUM('active', 'paused'), 
      defaultValue: 'active',
      comment: 'Session pause/resume status'
    },
    trust_score: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 100,
      comment: 'Điểm tín nhiệm theo phiên chơi (0-100)'
    },

    player_ip: DataTypes.STRING,

    // Security fingerprinting (added via migrations/index.js inline fieldsToAdd)
    browser_fingerprint: { type: DataTypes.STRING(256), allowNull: true },
    last_activity_ip: { type: DataTypes.STRING(45), allowNull: true },
    session_validated: { type: DataTypes.BOOLEAN, defaultValue: false, allowNull: true },
    suspicious_activity: { type: DataTypes.JSON, allowNull: true },

    special_prize_pending: { type: DataTypes.BOOLEAN, defaultValue: false },
    special_prize_approved: { type: DataTypes.BOOLEAN, defaultValue: false },
    pending_box_number: DataTypes.INTEGER,

    approved_by_admin_at: DataTypes.DATE,
    opened_at: DataTypes.DATE,

    created_by: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Admin nào tạo phiên này'
    },
    
    is_exchanged: { type: DataTypes.BOOLEAN, defaultValue: false },
    exchanged_at: DataTypes.DATE,
    wallet_manual_amount: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: true,
      defaultValue: null,
      comment: 'Manual wallet amount set by admin for this session'
    },

    
    player_selected_box: DataTypes.INTEGER,          
    player_selected_at: DataTypes.DATE,              
    player_name: DataTypes.STRING,                   
    player_phone: DataTypes.STRING,                  
    player_email: DataTypes.STRING,                  
    player_viewed_at: DataTypes.DATE,                
    player_joined_at: DataTypes.DATE,                
    player_user_agent: DataTypes.STRING,             
    require_withdrawal: { type: DataTypes.BOOLEAN, defaultValue: true, comment: 'Yêu cầu rút tiền trước khi mở hộp tiếp theo' },             
    selected_prize_details: DataTypes.JSON,          
    box_selection_event: DataTypes.JSON,             
    is_form_submitted: { type: DataTypes.BOOLEAN, defaultValue: false },
    form_submitted_at: DataTypes.DATE,

    // Security fields (Week 1)
    server_random_boxes: { 
      type: DataTypes.JSON, 
      defaultValue: [],
      comment: 'Server-determined box results - NEVER expose to client'
    },
    player_token: { 
      type: DataTypes.STRING(64), 
      unique: true,
      comment: 'Unique token per player session'
    },
    result_hash: { 
      type: DataTypes.STRING(64),
      comment: 'SHA256 hash of result for verification'
    },
    server_random_seed: { 
      type: DataTypes.STRING(128),
      comment: 'Seed for random generation'
    },
    
    // Game type and configuration
    game_type: {
      type: DataTypes.ENUM('boxes', 'wheel', 'scratch', 'mystery', 'gacha', 'dice', 'cards'),
      defaultValue: 'boxes'
    },
    box_count: {
      type: DataTypes.INTEGER,
      defaultValue: 3
    },
    
    // Fraud detection
    fraud_flag: { 
      type: DataTypes.BOOLEAN, 
      defaultValue: false 
    },
    fraud_reason: DataTypes.STRING(255),

    // Week 2: Rarity System
    prize_1_rarity: {
      type: DataTypes.ENUM('common', 'uncommon', 'rare', 'epic', 'legendary'),
      defaultValue: 'common'
    },
    prize_2_rarity: {
      type: DataTypes.ENUM('common', 'uncommon', 'rare', 'epic', 'legendary'),
      defaultValue: 'common'
    },
    prize_3_rarity: {
      type: DataTypes.ENUM('common', 'uncommon', 'rare', 'epic', 'legendary'),
      defaultValue: 'common'
    },

    // Week 2: Color System
    prize_1_color_hex: {
      type: DataTypes.STRING(7),
      defaultValue: '#666666'
    },
    prize_2_color_hex: {
      type: DataTypes.STRING(7),
      defaultValue: '#666666'
    },
    prize_3_color_hex: {
      type: DataTypes.STRING(7),
      defaultValue: '#666666'
    },

    // Week 2: Wheel Game Support
    wheel_segments: {
      type: DataTypes.JSON,
      allowNull: true,
      comment: 'Wheel segments for roulette game'
    },
    wheel_speed: {
      type: DataTypes.INTEGER,
      defaultValue: 20,
      comment: 'Wheel spin speed (1-100)'
    },

    // Week 2: Mystery Box Support
    mystery_enabled: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      comment: 'Enable mystery/blind box mode'
    },
    mystery_categories: {
      type: DataTypes.JSON,
      defaultValue: [],
      comment: 'Categories for mystery boxes'
    },

    // Week 2: Gacha System Support
    gacha_enabled: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      comment: 'Enable gacha system'
    },
    gacha_rates: {
      type: DataTypes.JSON,
      defaultValue: {
        'common': 0.60,
        'uncommon': 0.25,
        'rare': 0.10,
        'epic': 0.04,
        'legendary': 0.01
      },
      comment: 'Gacha pull rates'
    },
    gacha_pity_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      comment: 'Current pity count'
    },

    // Week 2: Analytics Fields
    view_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      comment: 'Number of times viewed'
    },
    result_event_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      comment: 'Number of box-open result events recorded'
    },
    share_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      comment: 'Number of times shared'
    },
    completion_time_seconds: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'How long it took to complete'
    },

    // ✅ NEW: Track multiple boxes opened (JSON array)
    boxes_opened: {
      type: DataTypes.JSON,
      defaultValue: [],
      allowNull: true,
      comment: 'Array of box numbers that have been opened (e.g., [1, 2])',
      get() {
        const value = this.getDataValue('boxes_opened');
        if (!value) return [];
        if (typeof value === 'string') {
          try {
            return JSON.parse(value);
          } catch (e) {
            return [];
          }
        }
        return Array.isArray(value) ? value : [];
      },
      set(value) {
        if (Array.isArray(value)) {
          this.setDataValue('boxes_opened', value);
        } else if (typeof value === 'string') {
          try {
            this.setDataValue('boxes_opened', JSON.parse(value));
          } catch (e) {
            this.setDataValue('boxes_opened', []);
          }
        } else {
          this.setDataValue('boxes_opened', []);
        }
      }
    }
  }, {
    tableName: 'game_sessions',
    underscored: true,
    timestamps: true,
    indexes: [
      { fields: ['session_code'] },
      { fields: ['is_completed'] }
    ]
  })
}
