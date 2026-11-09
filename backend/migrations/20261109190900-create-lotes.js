'use strict';

const { DataTypes } = require('sequelize');
const { createTableIfMissing, dropTableIfPresent } = require('../migrationHelpers');

const reference = (table, allowNull = false, onDelete = 'RESTRICT') => ({
  type: DataTypes.INTEGER,
  allowNull,
  references: { model: table, key: 'id' },
  onUpdate: 'CASCADE',
  onDelete
});

module.exports = {
  async up(queryInterface) {
    const created = await createTableIfMissing(queryInterface, 'lotes', {
      id: { type: DataTypes.INTEGER, allowNull: false, autoIncrement: true, primaryKey: true },
      material_id: reference('materiales'),
      proveedor_id: reference('proveedores'),
      detalle_orden_compra_id: reference('detalle_orden_compra', true, 'SET NULL'),
      numero_lote: { type: DataTypes.STRING(100), allowNull: false },
      fecha_recepcion: { type: DataTypes.DATEONLY, allowNull: false },
      created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
      updated_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW }
    });

    if (created) {
      await queryInterface.addIndex('lotes', ['material_id', 'numero_lote']);
    }
  },

  async down(queryInterface) {
    await dropTableIfPresent(queryInterface, 'lotes');
  }
};
