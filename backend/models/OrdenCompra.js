'use strict';

module.exports = (sequelize, DataTypes) => {
  const OrdenCompra = sequelize.define('OrdenCompra', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    proveedor_id: { type: DataTypes.INTEGER, allowNull: false },
    centro_costo_id: DataTypes.INTEGER,
    estado_aprobacion: {
      type: DataTypes.ENUM('pendiente', 'aprobada', 'rechazada', 'recibida', 'cancelada'),
      allowNull: false,
      defaultValue: 'pendiente'
    },
    fecha_emision: { type: DataTypes.DATEONLY, allowNull: false },
    monto_total: { type: DataTypes.DECIMAL(14, 2), allowNull: false, defaultValue: 0 }
  }, { tableName: 'ordenes_compra', underscored: true });

  OrdenCompra.associate = (db) => {
    OrdenCompra.belongsTo(db.Proveedor, { foreignKey: 'proveedor_id', as: 'proveedor' });
    OrdenCompra.belongsTo(db.CentroDeCosto, { foreignKey: 'centro_costo_id', as: 'centro_costo' });
    OrdenCompra.hasMany(db.DetalleOrdenCompra, { foreignKey: 'orden_compra_id', as: 'detalles' });
    OrdenCompra.hasMany(db.Factura, { foreignKey: 'orden_compra_id', as: 'facturas' });
    OrdenCompra.hasMany(db.Alerta, { foreignKey: 'orden_compra_id', as: 'alertas' });
  };

  return OrdenCompra;
};
