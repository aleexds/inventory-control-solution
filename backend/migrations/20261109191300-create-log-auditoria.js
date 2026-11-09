'use strict';

const { DataTypes } = require('sequelize');
const { createTableIfMissing, dropTableIfPresent } = require('../migrationHelpers');

module.exports = {
  async up(queryInterface) {
    await createTableIfMissing(queryInterface, 'log_auditoria', {
      id: { type: DataTypes.INTEGER, allowNull: false, autoIncrement: true, primaryKey: true },
      usuario_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: { model: 'usuarios', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      accion: { type: DataTypes.STRING(100), allowNull: false },
      tabla_afectada: { type: DataTypes.STRING(100), allowNull: false },
      registro_id: { type: DataTypes.INTEGER, allowNull: true },
      timestamp: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
      created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
      updated_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW }
    });
  },

  async down(queryInterface) {
    await dropTableIfPresent(queryInterface, 'log_auditoria');
  }
};
