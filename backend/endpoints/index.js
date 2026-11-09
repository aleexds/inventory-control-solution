'use strict';

const routers = {
  alertas: require('./alertaRoutes'),
  'centros-de-costo': require('./centroDeCostoRoutes'),
  'cotizaciones-proveedores': require('./cotizacionProveedorRoutes'),
  'detalle-orden-compra': require('./detalleOrdenCompraRoutes'),
  devoluciones: require('./devolucionRoutes'),
  facturas: require('./facturaRoutes'),
  'log-auditoria': require('./logAuditoriaRoutes'),
  lotes: require('./loteRoutes'),
  materiales: require('./materialRoutes'),
  movimientos: require('./movimientoRoutes'),
  'ordenes-compra': require('./ordenCompraRoutes'),
  pagos: require('./pagoRoutes'),
  promociones: require('./promocionRoutes'),
  proveedores: require('./proveedorRoutes'),
  ubicaciones: require('./ubicacionRoutes'),
  usuarios: require('./usuarioRoutes')
};

function registerEndpoints(app, basePath = '/api') {
  for (const [resource, router] of Object.entries(routers)) {
    app.use(`${basePath}/${resource}`, router);
  }
}

module.exports = { routers, registerEndpoints };
