'use strict';

module.exports = (sequelize, DataTypes) => {
  const Alerta = sequelize.define('Alerta', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    material_id: DataTypes.INTEGER,
    orden_compra_id: DataTypes.INTEGER,
    tipo_alerta: { type: DataTypes.STRING(80), allowNull: false },
    estado: {
      type: DataTypes.ENUM('activa', 'atendida', 'descartada'),
      allowNull: false,
      defaultValue: 'activa'
    }
  }, { tableName: 'alertas', underscored: true });

  Alerta.associate = (db) => {
    Alerta.belongsTo(db.Material, { foreignKey: 'material_id', as: 'material' });
    Alerta.belongsTo(db.OrdenCompra, { foreignKey: 'orden_compra_id', as: 'orden_compra' });
  };

  return Alerta;
};
