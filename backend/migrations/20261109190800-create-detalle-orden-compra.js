'use strict';

const { DataTypes } = require('sequelize');
const { createTableIfMissing, dropTableIfPresent } = require('../migrationHelpers');

const reference = (table) => ({
  type: DataTypes.INTEGER,
  allowNull: false,
  references: { model: table, key: 'id' },
  onUpdate: 'CASCADE',
  onDelete: 'RESTRICT'
});

module.exports = {
  async up(queryInterface) {
    const created = await createTableIfMissing(queryInterface, 'detalle_orden_compra', {
      id: { type: DataTypes.INTEGER, allowNull: false, autoIncrement: true, primaryKey: true },
      orden_compra_id: reference('ordenes_compra'),
      material_id: reference('materiales'),
      cantidad: { type: DataTypes.DECIMAL(12, 3), allowNull: false },
      precio_unitario: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
      created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
      updated_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW }
    });

    if (created) {
      await queryInterface.addIndex('detalle_orden_compra', ['orden_compra_id']);
    }
  },

  async down(queryInterface) {
    await dropTableIfPresent(queryInterface, 'detalle_orden_compra');
  }
};
