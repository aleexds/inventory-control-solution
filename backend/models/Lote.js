'use strict';

module.exports = (sequelize, DataTypes) => {
  const Lote = sequelize.define('Lote', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    material_id: { type: DataTypes.INTEGER, allowNull: false },
    proveedor_id: { type: DataTypes.INTEGER, allowNull: false },
    detalle_orden_compra_id: DataTypes.INTEGER,
    numero_lote: { type: DataTypes.STRING(100), allowNull: false },
    fecha_recepcion: { type: DataTypes.DATEONLY, allowNull: false }
  }, { tableName: 'lotes', underscored: true });

  Lote.associate = (db) => {
    Lote.belongsTo(db.Material, { foreignKey: 'material_id', as: 'material' });
    Lote.belongsTo(db.Proveedor, { foreignKey: 'proveedor_id', as: 'proveedor' });
    Lote.belongsTo(db.DetalleOrdenCompra, { foreignKey: 'detalle_orden_compra_id', as: 'detalle_orden_compra' });
    Lote.hasMany(db.Movimiento, { foreignKey: 'lote_id', as: 'movimientos' });
    Lote.hasMany(db.Devolucion, { foreignKey: 'lote_id', as: 'devoluciones' });
  };

  return Lote;
};
