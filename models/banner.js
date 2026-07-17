'use strict';
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Banner = sequelize.define('Banner', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    text: { type: DataTypes.TEXT, allowNull: true },
    image_url: { type: DataTypes.STRING(512), allowNull: true },
    link_url: { type: DataTypes.STRING(512), allowNull: true },
    link_target: {
      type: DataTypes.ENUM('_blank', '_self'),
      allowNull: false,
      defaultValue: '_blank'
    },
    location: {
      type: DataTypes.ENUM('game', 'home', 'both'),
      allowNull: false,
      defaultValue: 'both'
    },
    display_type: {
      type: DataTypes.ENUM('bar', 'popup', 'both'),
      allowNull: false,
      defaultValue: 'bar'
    },
    aspect_ratio: { type: DataTypes.STRING(16), allowNull: false, defaultValue: '16:9' },
    popup_width: { type: DataTypes.STRING(16), allowNull: true, defaultValue: null },
    popup_height: { type: DataTypes.STRING(16), allowNull: true, defaultValue: null },
    popup_delay_ms: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 800 },
    popup_frequency: {
      type: DataTypes.ENUM('always', 'session', 'daily'),
      allowNull: false,
      defaultValue: 'session'
    },
    show_animation: { type: DataTypes.STRING(32), allowNull: false, defaultValue: 'zoom' },
    hide_animation: { type: DataTypes.STRING(32), allowNull: false, defaultValue: 'fade' },
    auto_close_ms: { type: DataTypes.INTEGER, allowNull: true, defaultValue: null },
    start_at: { type: DataTypes.DATE, allowNull: true, defaultValue: null },
    end_at: { type: DataTypes.DATE, allowNull: true, defaultValue: null },
    popup_dismissible: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    bg_color: { type: DataTypes.STRING(32), allowNull: true },
    text_color: { type: DataTypes.STRING(32), allowNull: true },
    cta_text: { type: DataTypes.STRING(120), allowNull: true },
    cta_bg_color: { type: DataTypes.STRING(32), allowNull: true },
    cta_text_color: { type: DataTypes.STRING(32), allowNull: true },
    design_json: { type: DataTypes.TEXT('long'), allowNull: true },
    design_html: { type: DataTypes.TEXT('long'), allowNull: true },
    design_css: { type: DataTypes.TEXT('long'), allowNull: true },
    is_active: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    sort_order: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    created_by: { type: DataTypes.STRING(64), allowNull: true }
  }, {
    tableName: 'banners',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  return Banner;
};
