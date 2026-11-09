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
    const created = await createTableIfMissing(queryInterface, 'movimientos', {
      id: { type: DataTypes.INTEGER, allowNull: false, autoIncrement: true, primaryKey: true },
      material_id: reference('materiales'),
      lote_id: reference('lotes', true, 'SET NULL'),
      detalle_orden_compra_id: reference('detalle_orden_compra', true, 'SET NULL'),
      ubicacion_id: reference('ubicaciones'),
      ubicacion_destino_id: reference('ubicaciones', true, 'SET NULL'),
      centro_costo_id: reference('centros_de_costo', true, 'SET NULL'),
      tipo_movimiento: {
        type: DataTypes.ENUM('entrada', 'salida', 'traslado', 'ajuste'),
        allowNull: false
      },
      cantidad: { type: DataTypes.DECIMAL(12, 3), allowNull: false },
      documento_origen: { type: DataTypes.STRING(150), allowNull: true },
      usuario_id: reference('usuarios'),
      created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
      updated_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW }
    });

    if (created) {
      await queryInterface.addIndex('movimientos', ['material_id', 'ubicacion_id', 'created_at']);
      await queryInterface.addIndex('movimientos', ['lote_id']);
    }
  },

  async down(queryInterface) {
    await dropTableIfPresent(queryInterface, 'movimientos');
  }
};
