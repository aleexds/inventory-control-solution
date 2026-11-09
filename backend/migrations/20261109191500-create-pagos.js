'use strict';

const { DataTypes } = require('sequelize');
const { createTableIfMissing, dropTableIfPresent } = require('../migrationHelpers');

module.exports = {
  async up(queryInterface) {
    await createTableIfMissing(queryInterface, 'pagos', {
      id: { type: DataTypes.INTEGER, allowNull: false, autoIncrement: true, primaryKey: true },
      factura_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'facturas', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      fecha_pago: { type: DataTypes.DATEONLY, allowNull: false },
      monto_pagado: { type: DataTypes.DECIMAL(14, 2), allowNull: false },
      referencia_bancaria: { type: DataTypes.STRING(150), allowNull: true },
      created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
      updated_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW }
    });
  },

  async down(queryInterface) {
    await dropTableIfPresent(queryInterface, 'pagos');
  }
};
