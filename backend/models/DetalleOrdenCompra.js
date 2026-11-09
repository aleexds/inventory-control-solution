'use strict';

module.exports = (sequelize, DataTypes) => {
  const DetalleOrdenCompra = sequelize.define('DetalleOrdenCompra', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    orden_compra_id: { type: DataTypes.INTEGER, allowNull: false },
    material_id: { type: DataTypes.INTEGER, allowNull: false },
    cantidad: { type: DataTypes.DECIMAL(12, 3), allowNull: false },
    precio_unitario: { type: DataTypes.DECIMAL(12, 2), allowNull: false }
  }, { tableName: 'detalle_orden_compra', underscored: true });

  DetalleOrdenCompra.associate = (db) => {
    DetalleOrdenCompra.belongsTo(db.OrdenCompra, { foreignKey: 'orden_compra_id', as: 'orden_compra' });
    DetalleOrdenCompra.belongsTo(db.Material, { foreignKey: 'material_id', as: 'material' });
    DetalleOrdenCompra.hasMany(db.Lote, { foreignKey: 'detalle_orden_compra_id', as: 'lotes' });
    DetalleOrdenCompra.hasMany(db.Movimiento, { foreignKey: 'detalle_orden_compra_id', as: 'movimientos' });
  };

  return DetalleOrdenCompra;
};
