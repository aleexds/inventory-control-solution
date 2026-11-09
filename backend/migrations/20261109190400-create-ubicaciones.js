'use strict';

const { DataTypes } = require('sequelize');
const { createTableIfMissing, dropTableIfPresent } = require('../migrationHelpers');

module.exports = {
  async up(queryInterface) {
    await createTableIfMissing(queryInterface, 'ubicaciones', {
      id: { type: DataTypes.INTEGER, allowNull: false, autoIncrement: true, primaryKey: true },
      nombre: { type: DataTypes.STRING(150), allowNull: false },
      tipo: { type: DataTypes.STRING(80), allowNull: false },
      direccion: { type: DataTypes.STRING(255), allowNull: true },
      centro_costo_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: { model: 'centros_de_costo', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
      updated_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW }
    });
  },

  async down(queryInterface) {
    await dropTableIfPresent(queryInterface, 'ubicaciones');
  }
};
