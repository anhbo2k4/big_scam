/**
 * Prize Inventory Model
 * Manages prize stocks, reserved amounts, and conversion system
 */

module.exports = (sequelize, DataTypes) => {
  return sequelize.define('PrizeInventory', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },

    prize_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
      references: {
        model: 'prizes',
        key: 'id'
      }
    },

    game_session_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'game_sessions',
        key: 'id'
      },
      comment: 'Which game session this prize is in'
    },

    // Stock tracking
    total_stock: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
      comment: 'Total quantity available'
    },

    remaining_stock: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
      comment: 'Available - not yet drawn'
    },

    reserved_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      comment: 'Reserved for orders/withdrawals'
    },

    drawn_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      comment: 'Already distributed'
    },

    // Prize type enumeration
    prize_type: {
      type: DataTypes.ENUM(
        'MONEY',           // Direct cash prize
        'PHYSICAL_ITEM',   // Item to be shipped
        'VOUCHER',         // Code/voucher  
        'DIGITAL',         // Digital item/account
        'EXPERIENCE',      // Bonus XP/multiplier
        'SPECIAL'          // Special, needs admin approval
      ),
      defaultValue: 'MONEY',
      comment: 'Type of prize'
    },

    // If physical/digital item
    item_sku: {
      type: DataTypes.STRING(50),
      comment: 'Inventory SKU if physical item'
    },

    // Conversion system
    can_convert_to_cash: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      comment: 'Whether player can convert this to money'
    },

    conversion_rate: {
      type: DataTypes.FLOAT,
      defaultValue: 1.0,
      comment: 'Conversion multiplier (0.5 = 50% of value)'
    },

    base_cash_value: {
      type: DataTypes.BIGINT,
      comment: 'Base cash value (if prize is convertible)'
    },

    converted_to_cash_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      comment: 'How many converted to cash'
    },

    // Supply management
    is_limited_stock: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      comment: 'Is this limited edition/'
    },

    restock_threshold: {
      type: DataTypes.INTEGER,
      comment: 'Auto-notify admin when stock reaches this'
    },

    auto_restock: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      comment: 'Auto-add stock if runs out'
    },

    // Cost tracking
    unit_cost: {
      type: DataTypes.BIGINT,
      comment: 'What the house paid for this prize'
    },

    total_cost: {
      type: DataTypes.BIGINT,
      comment: 'Total cost of all stock (auto: total_stock * unit_cost)'
    },

    // Profit calculation
    total_cash_distributed: {
      type: DataTypes.BIGINT,
      defaultValue: 0,
      comment: 'Total cash paid out for this prize'
    },

    profit_loss: {
      type: DataTypes.BIGINT,
      defaultValue: 0,
      comment: 'Revenue - Cost (negative = loss)'
    }
  }, {
    tableName: 'prize_inventories',
    underscored: true,
    timestamps: true,
    indexes: [
      { fields: ['prize_id'] },
      { fields: ['game_session_id'] },
      { fields: ['prize_type'] },
      { fields: ['remaining_stock'] },
      { fields: ['is_limited_stock'] }
    ]
  })
}
