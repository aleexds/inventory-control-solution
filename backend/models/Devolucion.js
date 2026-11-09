'use strict';

module.exports = (sequelize, DataTypes) => {
  const Devolucion = sequelize.define('Devolucion', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    material_id: { type: DataTypes.INTEGER, allowNull: false },
    ubicacion_id: { type: DataTypes.INTEGER, allowNull: false },
    proveedor_id: DataTypes.INTEGER,
    lote_id: DataTypes.INTEGER,
    movimiento_id: DataTypes.INTEGER,
    cantidad: { type: DataTypes.DECIMAL(12, 3), allowNull: false },
    motivo: { type: DataTypes.TEXT, allowNull: false },
    fecha: { type: DataTypes.DATE, allowNull: false }
  }, { tableName: 'devoluciones', underscored: true });

  Devolucion.associate = (db) => {
    Devolucion.belongsTo(db.Material, { foreignKey: 'material_id', as: 'material' });
    Devolucion.belongsTo(db.Ubicacion, { foreignKey: 'ubicacion_id', as: 'ubicacion' });
    Devolucion.belongsTo(db.Proveedor, { foreignKey: 'proveedor_id', as: 'proveedor' });
    Devolucion.belongsTo(db.Lote, { foreignKey: 'lote_id', as: 'lote' });
    Devolucion.belongsTo(db.Movimiento, { foreignKey: 'movimiento_id', as: 'movimiento' });
  };

  return Devolucion;
};
