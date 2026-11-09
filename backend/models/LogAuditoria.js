'use strict';

module.exports = (sequelize, DataTypes) => {
  const LogAuditoria = sequelize.define('LogAuditoria', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    usuario_id: DataTypes.INTEGER,
    accion: { type: DataTypes.STRING(100), allowNull: false },
    tabla_afectada: { type: DataTypes.STRING(100), allowNull: false },
    registro_id: DataTypes.INTEGER,
    timestamp: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW }
  }, { tableName: 'log_auditoria', underscored: true });

  LogAuditoria.associate = (db) => {
    LogAuditoria.belongsTo(db.Usuario, { foreignKey: 'usuario_id', as: 'usuario' });
  };

  return LogAuditoria;
};
