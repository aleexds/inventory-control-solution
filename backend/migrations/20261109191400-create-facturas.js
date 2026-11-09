'use strict';

const { DataTypes } = require('sequelize');
const { createTableIfMissing, dropTableIfPresent } = require('../migrationHelpers');

module.exports = {
  async up(queryInterface) {
    const created = await createTableIfMissing(queryInterface, 'facturas', {
      id: { type: DataTypes.INTEGER, allowNull: false, autoIncrement: true, primaryKey: true },
      orden_compra_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'ordenes_compra', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      numero_factura: { type: DataTypes.STRING(100), allowNull: false },
      monto_neto: { type: DataTypes.DECIMAL(14, 2), allowNull: false },
      impuesto: { type: DataTypes.DECIMAL(14, 2), allowNull: false, defaultValue: 0 },
      estado_match: { type: DataTypes.STRING(80), allowNull: false, defaultValue: 'pendiente' },
      created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
      updated_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW }
    });

    if (created) {
      await queryInterface.addIndex('facturas', ['orden_compra_id', 'numero_factura']);
    }
  },

  async down(queryInterface) {
    await dropTableIfPresent(queryInterface, 'facturas');
  }
};
