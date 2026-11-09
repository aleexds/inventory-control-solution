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
    await createTableIfMissing(queryInterface, 'devoluciones', {
      id: { type: DataTypes.INTEGER, allowNull: false, autoIncrement: true, primaryKey: true },
      material_id: reference('materiales'),
      ubicacion_id: reference('ubicaciones'),
      proveedor_id: reference('proveedores', true, 'SET NULL'),
      lote_id: reference('lotes', true, 'SET NULL'),
      movimiento_id: reference('movimientos', true, 'SET NULL'),
      cantidad: { type: DataTypes.DECIMAL(12, 3), allowNull: false },
      motivo: { type: DataTypes.TEXT, allowNull: false },
      fecha: { type: DataTypes.DATE, allowNull: false },
      created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
      updated_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW }
    });
  },

  async down(queryInterface) {
    await dropTableIfPresent(queryInterface, 'devoluciones');
  }
};
