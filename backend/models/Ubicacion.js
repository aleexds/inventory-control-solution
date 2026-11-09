'use strict';

module.exports = (sequelize, DataTypes) => {
  const Ubicacion = sequelize.define('Ubicacion', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    nombre: { type: DataTypes.STRING(150), allowNull: false },
    tipo: { type: DataTypes.STRING(80), allowNull: false },
    direccion: DataTypes.STRING(255),
    centro_costo_id: DataTypes.INTEGER
  }, { tableName: 'ubicaciones', underscored: true });

  Ubicacion.associate = (db) => {
    Ubicacion.belongsTo(db.CentroDeCosto, { foreignKey: 'centro_costo_id', as: 'centro_costo' });
    Ubicacion.hasMany(db.Movimiento, { foreignKey: 'ubicacion_id', as: 'movimientos_origen' });
    Ubicacion.hasMany(db.Movimiento, { foreignKey: 'ubicacion_destino_id', as: 'movimientos_destino' });
    Ubicacion.hasMany(db.Devolucion, { foreignKey: 'ubicacion_id', as: 'devoluciones' });
  };

  return Ubicacion;
};
