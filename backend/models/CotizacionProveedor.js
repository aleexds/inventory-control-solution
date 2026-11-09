'use strict';

module.exports = (sequelize, DataTypes) => {
  const CotizacionProveedor = sequelize.define('CotizacionProveedor', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    proveedor_id: { type: DataTypes.INTEGER, allowNull: false },
    material_id: { type: DataTypes.INTEGER, allowNull: false },
    precio_cotizado: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
    fecha_cotizacion: { type: DataTypes.DATEONLY, allowNull: false },
    fecha_vigencia: { type: DataTypes.DATEONLY, allowNull: false }
  }, { tableName: 'cotizaciones_proveedores', underscored: true });

  CotizacionProveedor.associate = (db) => {
    CotizacionProveedor.belongsTo(db.Proveedor, { foreignKey: 'proveedor_id', as: 'proveedor' });
    CotizacionProveedor.belongsTo(db.Material, { foreignKey: 'material_id', as: 'material' });
  };

  return CotizacionProveedor;
};
