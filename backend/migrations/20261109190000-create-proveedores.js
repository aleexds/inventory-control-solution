'use strict';

const { DataTypes } = require('sequelize');
const { createTableIfMissing, dropTableIfPresent } = require('../migrationHelpers');

module.exports = {
  async up(queryInterface) {
    await createTableIfMissing(queryInterface, 'proveedores', {
      id: { type: DataTypes.INTEGER, allowNull: false, autoIncrement: true, primaryKey: true },
      nombre_fiscal: { type: DataTypes.STRING(180), allowNull: false },
      contacto: { type: DataTypes.STRING(150), allowNull: true },
      telefono: { type: DataTypes.STRING(40), allowNull: true },
      correo: { type: DataTypes.STRING(180), allowNull: true },
      calificacion_ponderada: { type: DataTypes.DECIMAL(5, 2), allowNull: true },
      created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
      updated_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW }
    });
  },

  async down(queryInterface) {
    await dropTableIfPresent(queryInterface, 'proveedores');
  }
};
