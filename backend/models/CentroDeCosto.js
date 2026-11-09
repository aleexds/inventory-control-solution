'use strict';

module.exports = (sequelize, DataTypes) => {
  const CentroDeCosto = sequelize.define('CentroDeCosto', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    codigo_proyecto: { type: DataTypes.STRING(80), allowNull: false, unique: true },
    nombre_obra: { type: DataTypes.STRING(180), allowNull: false },
    descripcion: DataTypes.TEXT
  }, { tableName: 'centros_de_costo', underscored: true });

  CentroDeCosto.associate = (db) => {
    CentroDeCosto.hasMany(db.Ubicacion, { foreignKey: 'centro_costo_id', as: 'ubicaciones' });
    CentroDeCosto.hasMany(db.OrdenCompra, { foreignKey: 'centro_costo_id', as: 'ordenes_compra' });
    CentroDeCosto.hasMany(db.Movimiento, { foreignKey: 'centro_costo_id', as: 'movimientos' });
  };

  return CentroDeCosto;
};
