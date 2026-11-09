'use strict';

const { DataTypes } = require('sequelize');
const { createTableIfMissing, dropTableIfPresent } = require('../migrationHelpers');

module.exports = {
  async up(queryInterface) {
    await createTableIfMissing(queryInterface, 'materiales', {
      id: { type: DataTypes.INTEGER, allowNull: false, autoIncrement: true, primaryKey: true },
      codigo_estandar: { type: DataTypes.STRING(80), allowNull: false, unique: true },
      nombre: { type: DataTypes.STRING(180), allowNull: false },
      categoria: { type: DataTypes.STRING(100), allowNull: false },
      subcategoria: { type: DataTypes.STRING(100), allowNull: true },
      stock_minimo: { type: DataTypes.DECIMAL(12, 3), allowNull: false, defaultValue: 0 },
      stock_maximo: { type: DataTypes.DECIMAL(12, 3), allowNull: true },
      stock_seguridad: { type: DataTypes.DECIMAL(12, 3), allowNull: false, defaultValue: 0 },
      demanda_promedio_diaria: { type: DataTypes.DECIMAL(12, 3), allowNull: false, defaultValue: 0 },
      tiempo_entrega: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
      created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
      updated_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW }
    });
  },

  async down(queryInterface) {
    await dropTableIfPresent(queryInterface, 'materiales');
  }
};
