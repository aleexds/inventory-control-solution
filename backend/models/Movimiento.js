'use strict';

module.exports = (sequelize, DataTypes) => {
  const Movimiento = sequelize.define('Movimiento', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    material_id: { type: DataTypes.INTEGER, allowNull: false },
    lote_id: DataTypes.INTEGER,
    detalle_orden_compra_id: DataTypes.INTEGER,
    ubicacion_id: { type: DataTypes.INTEGER, allowNull: false },
    ubicacion_destino_id: DataTypes.INTEGER,
    centro_costo_id: DataTypes.INTEGER,
    tipo_movimiento: {
      type: DataTypes.ENUM('entrada', 'salida', 'traslado', 'ajuste'),
      allowNull: false
    },
    cantidad: { type: DataTypes.DECIMAL(12, 3), allowNull: false },
    documento_origen: DataTypes.STRING(150),
    usuario_id: { type: DataTypes.INTEGER, allowNull: false }
  }, { tableName: 'movimientos', underscored: true });

  Movimiento.associate = (db) => {
    Movimiento.belongsTo(db.Material, { foreignKey: 'material_id', as: 'material' });
    Movimiento.belongsTo(db.Lote, { foreignKey: 'lote_id', as: 'lote' });
    Movimiento.belongsTo(db.DetalleOrdenCompra, { foreignKey: 'detalle_orden_compra_id', as: 'detalle_orden_compra' });
    Movimiento.belongsTo(db.Ubicacion, { foreignKey: 'ubicacion_id', as: 'ubicacion_origen' });
    Movimiento.belongsTo(db.Ubicacion, { foreignKey: 'ubicacion_destino_id', as: 'ubicacion_destino' });
    Movimiento.belongsTo(db.CentroDeCosto, { foreignKey: 'centro_costo_id', as: 'centro_costo' });
    Movimiento.belongsTo(db.Usuario, { foreignKey: 'usuario_id', as: 'usuario' });
    Movimiento.hasMany(db.Devolucion, { foreignKey: 'movimiento_id', as: 'devoluciones' });
  };

  return Movimiento;
};
