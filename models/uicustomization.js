module.exports = (sequelize, DataTypes) => {
  return sequelize.define('UICustomization', {
    game_title: DataTypes.TEXT,
    game_subtitle: DataTypes.TEXT,
    button_text: DataTypes.TEXT,
    completion_message: DataTypes.TEXT,

    logo_url: DataTypes.TEXT,
    logo_height: DataTypes.INTEGER,
    favicon_url: DataTypes.TEXT,

    show_unlucky_popup: DataTypes.BOOLEAN,
    allow_reopen_result_popup: DataTypes.BOOLEAN,

    header_scripts: DataTypes.TEXT,
    body_scripts: DataTypes.TEXT,
    footer_scripts: DataTypes.TEXT
  }, {
    tableName: 'ui_customizations',
    underscored: true
  })
}
