'use strict';

module.exports = (sequelize, DataTypes) => {
  const Usuario = sequelize.define('Usuario', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    nombre: { type: DataTypes.STRING(180), allowNull: false },
    correo: { type: DataTypes.STRING(180), allowNull: false, unique: true },
    rol: { type: DataTypes.STRING(80), allowNull: false },
    activo: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true }
  }, { tableName: 'usuarios', underscored: true });

  Usuario.associate = (db) => {
    Usuario.hasMany(db.Movimiento, { foreignKey: 'usuario_id', as: 'movimientos' });
    Usuario.hasMany(db.LogAuditoria, { foreignKey: 'usuario_id', as: 'eventos_auditoria' });
  };

  return Usuario;
};
