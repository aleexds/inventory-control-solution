'use strict';

module.exports = (sequelize, DataTypes) => {
  const Promocion = sequelize.define('Promocion', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    proveedor_id: { type: DataTypes.INTEGER, allowNull: false },
    codigo_promocion: { type: DataTypes.STRING(80), allowNull: false },
    tipo_descuento: { type: DataTypes.STRING(50), allowNull: false },
    valor: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
    vigencia_desde: { type: DataTypes.DATEONLY, allowNull: false },
    vigencia_hasta: { type: DataTypes.DATEONLY, allowNull: false }
  }, { tableName: 'promociones', underscored: true });

  Promocion.associate = (db) => {
    Promocion.belongsTo(db.Proveedor, { foreignKey: 'proveedor_id', as: 'proveedor' });
  };

  return Promocion;
};
