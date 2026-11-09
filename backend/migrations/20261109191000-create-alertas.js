'use strict';

const { DataTypes } = require('sequelize');
const { createTableIfMissing, dropTableIfPresent } = require('../migrationHelpers');

const reference = (table) => ({
  type: DataTypes.INTEGER,
  allowNull: true,
  references: { model: table, key: 'id' },
  onUpdate: 'CASCADE',
  onDelete: 'SET NULL'
});

module.exports = {
  async up(queryInterface) {
    const created = await createTableIfMissing(queryInterface, 'alertas', {
      id: { type: DataTypes.INTEGER, allowNull: false, autoIncrement: true, primaryKey: true },
      material_id: reference('materiales'),
      orden_compra_id: reference('ordenes_compra'),
      tipo_alerta: { type: DataTypes.STRING(80), allowNull: false },
      estado: {
        type: DataTypes.ENUM('activa', 'atendida', 'descartada'),
        allowNull: false,
        defaultValue: 'activa'
      },
      created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
      updated_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW }
    });

    if (created) {
      await queryInterface.addIndex('alertas', ['tipo_alerta', 'estado']);
    }
  },

  async down(queryInterface) {
    await dropTableIfPresent(queryInterface, 'alertas');
  }
};
