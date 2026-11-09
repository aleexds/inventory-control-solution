'use strict';

module.exports = (sequelize, DataTypes) => {
  const Material = sequelize.define('Material', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    codigo_estandar: { type: DataTypes.STRING(80), allowNull: false, unique: true },
    nombre: { type: DataTypes.STRING(180), allowNull: false },
    categoria: { type: DataTypes.STRING(100), allowNull: false },
    subcategoria: DataTypes.STRING(100),
    stock_minimo: { type: DataTypes.DECIMAL(12, 3), allowNull: false, defaultValue: 0 },
    stock_maximo: DataTypes.DECIMAL(12, 3),
    stock_seguridad: { type: DataTypes.DECIMAL(12, 3), allowNull: false, defaultValue: 0 },
    demanda_promedio_diaria: { type: DataTypes.DECIMAL(12, 3), allowNull: false, defaultValue: 0 },
    tiempo_entrega: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    punto_reorden: {
      type: DataTypes.VIRTUAL,
      get() {
        return Number(this.getDataValue('demanda_promedio_diaria')) *
          Number(this.getDataValue('tiempo_entrega')) +
          Number(this.getDataValue('stock_seguridad'));
      }
    }
  }, { tableName: 'materiales', underscored: true });

  Material.associate = (db) => {
    Material.hasMany(db.Lote, { foreignKey: 'material_id', as: 'lotes' });
    Material.hasMany(db.CotizacionProveedor, { foreignKey: 'material_id', as: 'cotizaciones' });
    Material.hasMany(db.DetalleOrdenCompra, { foreignKey: 'material_id', as: 'detalles_compra' });
    Material.hasMany(db.Alerta, { foreignKey: 'material_id', as: 'alertas' });
    Material.hasMany(db.Movimiento, { foreignKey: 'material_id', as: 'movimientos' });
    Material.hasMany(db.Devolucion, { foreignKey: 'material_id', as: 'devoluciones' });
  };

  return Material;
};
