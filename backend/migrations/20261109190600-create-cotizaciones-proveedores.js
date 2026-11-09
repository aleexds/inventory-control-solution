'use strict';

const { DataTypes } = require('sequelize');
const { createTableIfMissing, dropTableIfPresent } = require('../migrationHelpers');

module.exports = {
  async up(queryInterface) {
    await createTableIfMissing(queryInterface, 'cotizaciones_proveedores', {
      id: { type: DataTypes.INTEGER, allowNull: false, autoIncrement: true, primaryKey: true },
      proveedor_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'proveedores', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      material_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'materiales', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      precio_cotizado: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
      fecha_cotizacion: { type: DataTypes.DATEONLY, allowNull: false },
      fecha_vigencia: { type: DataTypes.DATEONLY, allowNull: false },
      created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
      updated_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW }
    });
  },

  async down(queryInterface) {
    await dropTableIfPresent(queryInterface, 'cotizaciones_proveedores');
  }
};
