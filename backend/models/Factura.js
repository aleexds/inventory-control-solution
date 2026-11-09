'use strict';

module.exports = (sequelize, DataTypes) => {
  const Factura = sequelize.define('Factura', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    orden_compra_id: { type: DataTypes.INTEGER, allowNull: false },
    numero_factura: { type: DataTypes.STRING(100), allowNull: false },
    monto_neto: { type: DataTypes.DECIMAL(14, 2), allowNull: false },
    impuesto: { type: DataTypes.DECIMAL(14, 2), allowNull: false, defaultValue: 0 },
    estado_match: { type: DataTypes.STRING(80), allowNull: false, defaultValue: 'pendiente' }
  }, { tableName: 'facturas', underscored: true });

  Factura.associate = (db) => {
    Factura.belongsTo(db.OrdenCompra, { foreignKey: 'orden_compra_id', as: 'orden_compra' });
    Factura.hasMany(db.Pago, { foreignKey: 'factura_id', as: 'pagos' });
  };

  return Factura;
};
