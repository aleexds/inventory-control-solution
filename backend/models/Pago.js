'use strict';

module.exports = (sequelize, DataTypes) => {
  const Pago = sequelize.define('Pago', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    factura_id: { type: DataTypes.INTEGER, allowNull: false },
    fecha_pago: { type: DataTypes.DATEONLY, allowNull: false },
    monto_pagado: { type: DataTypes.DECIMAL(14, 2), allowNull: false },
    referencia_bancaria: DataTypes.STRING(150)
  }, { tableName: 'pagos', underscored: true });

  Pago.associate = (db) => {
    Pago.belongsTo(db.Factura, { foreignKey: 'factura_id', as: 'factura' });
  };

  return Pago;
};
