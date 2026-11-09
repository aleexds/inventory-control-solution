'use strict';

const { DataTypes } = require('sequelize');

const id = {
  type: DataTypes.INTEGER,
  allowNull: false,
  autoIncrement: true,
  primaryKey: true
};

const timestamps = {
  created_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  updated_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
};

const reference = (table, allowNull = false, onDelete = 'RESTRICT') => ({
  type: DataTypes.INTEGER,
  allowNull,
  references: { model: table, key: 'id' },
  onUpdate: 'CASCADE',
  onDelete
});

module.exports = {
  async up(queryInterface) {
    await queryInterface.createTable('proveedores', {
      id,
      nombre_fiscal: { type: DataTypes.STRING(180), allowNull: false },
      contacto: { type: DataTypes.STRING(150), allowNull: true },
      telefono: { type: DataTypes.STRING(40), allowNull: true },
      correo: { type: DataTypes.STRING(180), allowNull: true },
      calificacion_ponderada: { type: DataTypes.DECIMAL(5, 2), allowNull: true },
      ...timestamps
    });

    await queryInterface.createTable('materiales', {
      id,
      codigo_estandar: { type: DataTypes.STRING(80), allowNull: false, unique: true },
      nombre: { type: DataTypes.STRING(180), allowNull: false },
      categoria: { type: DataTypes.STRING(100), allowNull: false },
      subcategoria: { type: DataTypes.STRING(100), allowNull: true },
      stock_minimo: { type: DataTypes.DECIMAL(12, 3), allowNull: false, defaultValue: 0 },
      stock_maximo: { type: DataTypes.DECIMAL(12, 3), allowNull: true },
      stock_seguridad: { type: DataTypes.DECIMAL(12, 3), allowNull: false, defaultValue: 0 },
      demanda_promedio_diaria: { type: DataTypes.DECIMAL(12, 3), allowNull: false, defaultValue: 0 },
      tiempo_entrega: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
      ...timestamps
    });

    await queryInterface.createTable('centros_de_costo', {
      id,
      codigo_proyecto: { type: DataTypes.STRING(80), allowNull: false, unique: true },
      nombre_obra: { type: DataTypes.STRING(180), allowNull: false },
      descripcion: { type: DataTypes.TEXT, allowNull: true },
      ...timestamps
    });

    await queryInterface.createTable('usuarios', {
      id,
      nombre: { type: DataTypes.STRING(180), allowNull: false },
      correo: { type: DataTypes.STRING(180), allowNull: false, unique: true },
      rol: { type: DataTypes.STRING(80), allowNull: false },
      activo: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
      ...timestamps
    });

    await queryInterface.createTable('ubicaciones', {
      id,
      nombre: { type: DataTypes.STRING(150), allowNull: false },
      tipo: { type: DataTypes.STRING(80), allowNull: false },
      direccion: { type: DataTypes.STRING(255), allowNull: true },
      centro_costo_id: reference('centros_de_costo', true, 'SET NULL'),
      ...timestamps
    });

    await queryInterface.createTable('promociones', {
      id,
      proveedor_id: reference('proveedores'),
      codigo_promocion: { type: DataTypes.STRING(80), allowNull: false },
      tipo_descuento: { type: DataTypes.STRING(50), allowNull: false },
      valor: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
      vigencia_desde: { type: DataTypes.DATEONLY, allowNull: false },
      vigencia_hasta: { type: DataTypes.DATEONLY, allowNull: false },
      ...timestamps
    });

    await queryInterface.createTable('cotizaciones_proveedores', {
      id,
      proveedor_id: reference('proveedores'),
      material_id: reference('materiales'),
      precio_cotizado: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
      fecha_cotizacion: { type: DataTypes.DATEONLY, allowNull: false },
      fecha_vigencia: { type: DataTypes.DATEONLY, allowNull: false },
      ...timestamps
    });

    await queryInterface.createTable('ordenes_compra', {
      id,
      proveedor_id: reference('proveedores'),
      centro_costo_id: reference('centros_de_costo', true, 'SET NULL'),
      estado_aprobacion: {
        type: DataTypes.ENUM('pendiente', 'aprobada', 'rechazada', 'recibida', 'cancelada'),
        allowNull: false,
        defaultValue: 'pendiente'
      },
      fecha_emision: { type: DataTypes.DATEONLY, allowNull: false },
      monto_total: { type: DataTypes.DECIMAL(14, 2), allowNull: false, defaultValue: 0 },
      ...timestamps
    });

    await queryInterface.createTable('detalle_orden_compra', {
      id,
      orden_compra_id: reference('ordenes_compra'),
      material_id: reference('materiales'),
      cantidad: { type: DataTypes.DECIMAL(12, 3), allowNull: false },
      precio_unitario: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
      ...timestamps
    });

    await queryInterface.createTable('lotes', {
      id,
      material_id: reference('materiales'),
      proveedor_id: reference('proveedores'),
      detalle_orden_compra_id: reference('detalle_orden_compra', true, 'SET NULL'),
      numero_lote: { type: DataTypes.STRING(100), allowNull: false },
      fecha_recepcion: { type: DataTypes.DATEONLY, allowNull: false },
      ...timestamps
    });

    await queryInterface.createTable('alertas', {
      id,
      material_id: reference('materiales', true, 'SET NULL'),
      orden_compra_id: reference('ordenes_compra', true, 'SET NULL'),
      tipo_alerta: { type: DataTypes.STRING(80), allowNull: false },
      estado: {
        type: DataTypes.ENUM('activa', 'atendida', 'descartada'),
        allowNull: false,
        defaultValue: 'activa'
      },
      created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
      updated_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW }
    });

    await queryInterface.createTable('movimientos', {
      id,
      material_id: reference('materiales'),
      lote_id: reference('lotes', true, 'SET NULL'),
      detalle_orden_compra_id: reference('detalle_orden_compra', true, 'SET NULL'),
      ubicacion_id: reference('ubicaciones'),
      ubicacion_destino_id: reference('ubicaciones', true, 'SET NULL'),
      centro_costo_id: reference('centros_de_costo', true, 'SET NULL'),
      tipo_movimiento: {
        type: DataTypes.ENUM('entrada', 'salida', 'traslado', 'ajuste'),
        allowNull: false
      },
      cantidad: { type: DataTypes.DECIMAL(12, 3), allowNull: false },
      documento_origen: { type: DataTypes.STRING(150), allowNull: true },
      usuario_id: reference('usuarios'),
      ...timestamps
    });

    await queryInterface.createTable('devoluciones', {
      id,
      material_id: reference('materiales'),
      ubicacion_id: reference('ubicaciones'),
      proveedor_id: reference('proveedores', true, 'SET NULL'),
      lote_id: reference('lotes', true, 'SET NULL'),
      movimiento_id: reference('movimientos', true, 'SET NULL'),
      cantidad: { type: DataTypes.DECIMAL(12, 3), allowNull: false },
      motivo: { type: DataTypes.TEXT, allowNull: false },
      fecha: { type: DataTypes.DATE, allowNull: false },
      ...timestamps
    });

    await queryInterface.createTable('log_auditoria', {
      id,
      usuario_id: reference('usuarios', true, 'SET NULL'),
      accion: { type: DataTypes.STRING(100), allowNull: false },
      tabla_afectada: { type: DataTypes.STRING(100), allowNull: false },
      registro_id: { type: DataTypes.INTEGER, allowNull: true },
      timestamp: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
      ...timestamps
    });

    await queryInterface.createTable('facturas', {
      id,
      orden_compra_id: reference('ordenes_compra'),
      numero_factura: { type: DataTypes.STRING(100), allowNull: false },
      monto_neto: { type: DataTypes.DECIMAL(14, 2), allowNull: false },
      impuesto: { type: DataTypes.DECIMAL(14, 2), allowNull: false, defaultValue: 0 },
      estado_match: { type: DataTypes.STRING(80), allowNull: false, defaultValue: 'pendiente' },
      ...timestamps
    });

    await queryInterface.createTable('pagos', {
      id,
      factura_id: reference('facturas'),
      fecha_pago: { type: DataTypes.DATEONLY, allowNull: false },
      monto_pagado: { type: DataTypes.DECIMAL(14, 2), allowNull: false },
      referencia_bancaria: { type: DataTypes.STRING(150), allowNull: true },
      ...timestamps
    });

    await queryInterface.addIndex('promociones', ['proveedor_id']);
    await queryInterface.addIndex('cotizaciones_proveedores', ['proveedor_id', 'material_id']);
    await queryInterface.addIndex('detalle_orden_compra', ['orden_compra_id']);
    await queryInterface.addIndex('lotes', ['material_id', 'numero_lote']);
    await queryInterface.addIndex('movimientos', ['material_id', 'ubicacion_id', 'created_at']);
    await queryInterface.addIndex('movimientos', ['lote_id']);
    await queryInterface.addIndex('alertas', ['tipo_alerta', 'estado']);
    await queryInterface.addIndex('facturas', ['orden_compra_id', 'numero_factura']);
  },

  async down(queryInterface) {
    for (const table of [
      'pagos',
      'facturas',
      'log_auditoria',
      'devoluciones',
      'movimientos',
      'alertas',
      'lotes',
      'detalle_orden_compra',
      'ordenes_compra',
      'cotizaciones_proveedores',
      'promociones',
      'ubicaciones',
      'usuarios',
      'centros_de_costo',
      'materiales',
      'proveedores'
    ]) {
      await queryInterface.dropTable(table);
    }
  }
};
