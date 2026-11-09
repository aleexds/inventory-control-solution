'use strict';

const { DataTypes } = require('sequelize');
const { createTableIfMissing, dropTableIfPresent } = require('../migrationHelpers');

module.exports = {
  async up(queryInterface) {
    await createTableIfMissing(queryInterface, 'promociones', {
      id: { type: DataTypes.INTEGER, allowNull: false, autoIncrement: true, primaryKey: true },
      proveedor_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'proveedores', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      codigo_promocion: { type: DataTypes.STRING(80), allowNull: false },
      tipo_descuento: { type: DataTypes.STRING(50), allowNull: false },
      valor: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
      vigencia_desde: { type: DataTypes.DATEONLY, allowNull: false },
      vigencia_hasta: { type: DataTypes.DATEONLY, allowNull: false },
      created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
      updated_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW }
    });
  },

  async down(queryInterface) {
    await dropTableIfPresent(queryInterface, 'promociones');
  }
};
