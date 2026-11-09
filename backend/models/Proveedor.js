'use strict';

module.exports = (sequelize, DataTypes) => {
  const Proveedor = sequelize.define('Proveedor', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    nombre_fiscal: { type: DataTypes.STRING(180), allowNull: false },
    contacto: DataTypes.STRING(150),
    telefono: DataTypes.STRING(40),
    correo: DataTypes.STRING(180),
    calificacion_ponderada: DataTypes.DECIMAL(5, 2)
  }, { tableName: 'proveedores', underscored: true });

  Proveedor.associate = (db) => {
    Proveedor.hasMany(db.Promocion, { foreignKey: 'proveedor_id', as: 'promociones' });
    Proveedor.hasMany(db.Lote, { foreignKey: 'proveedor_id', as: 'lotes' });
    Proveedor.hasMany(db.CotizacionProveedor, { foreignKey: 'proveedor_id', as: 'cotizaciones' });
    Proveedor.hasMany(db.OrdenCompra, { foreignKey: 'proveedor_id', as: 'ordenes_compra' });
    Proveedor.hasMany(db.Devolucion, { foreignKey: 'proveedor_id', as: 'devoluciones' });
  };

  return Proveedor;
};
