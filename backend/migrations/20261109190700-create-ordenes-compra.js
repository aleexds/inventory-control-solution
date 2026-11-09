'use strict';

const { DataTypes } = require('sequelize');
const { createTableIfMissing, dropTableIfPresent } = require('../migrationHelpers');

module.exports = {
  async up(queryInterface) {
    await createTableIfMissing(queryInterface, 'ordenes_compra', {
      id: { type: DataTypes.INTEGER, allowNull: false, autoIncrement: true, primaryKey: true },
      proveedor_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'proveedores', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      centro_costo_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: { model: 'centros_de_costo', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      estado_aprobacion: {
        type: DataTypes.ENUM('pendiente', 'aprobada', 'rechazada', 'recibida', 'cancelada'),
        allowNull: false,
        defaultValue: 'pendiente'
      },
      fecha_emision: { type: DataTypes.DATEONLY, allowNull: false },
      monto_total: { type: DataTypes.DECIMAL(14, 2), allowNull: false, defaultValue: 0 },
      created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
      updated_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW }
    });
  },

  async down(queryInterface) {
    await dropTableIfPresent(queryInterface, 'ordenes_compra');
  }
};
