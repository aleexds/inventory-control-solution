const STORAGE_KEY = 'del-valle-inventory-demo-v2'
const resourceNames = {
  'centros-de-costo': 'centros_de_costo',
  'cotizaciones-proveedores': 'cotizaciones_proveedores',
  'detalle-orden-compra': 'detalle_orden_compra',
  'log-auditoria': 'log_auditoria',
  'ordenes-compra': 'ordenes_compra',
}
const endpointNames = {
  centros_de_costo: 'centros-de-costo',
  cotizaciones_proveedores: 'cotizaciones-proveedores',
  detalle_orden_compra: 'detalle-orden-compra',
  log_auditoria: 'log-auditoria',
  ordenes_compra: 'ordenes-compra',
}

function todayOffset(daysAgo) {
  const date = new Date()
  date.setDate(date.getDate() - daysAgo)
  return date.toISOString()
}

const seed = {
  materiales: [
    { id: 1, codigo_estandar: 'MAT-CEM-001', nombre: 'Cemento gris uso general', categoria: 'Cementantes', subcategoria: 'Cemento', stock_minimo: 20, stock_maximo: 160, stock_seguridad: 8, demanda_promedio_diaria: 6, tiempo_entrega: 5, created_at: todayOffset(90) },
    { id: 2, codigo_estandar: 'MAT-ACE-014', nombre: 'Varilla corrugada #4', categoria: 'Acero', subcategoria: 'Refuerzo', stock_minimo: 45, stock_maximo: 320, stock_seguridad: 14, demanda_promedio_diaria: 9, tiempo_entrega: 4, created_at: todayOffset(72) },
    { id: 3, codigo_estandar: 'MAT-ARE-008', nombre: 'Arena fina lavada', categoria: 'Agregados', subcategoria: 'Arena', stock_minimo: 30, stock_maximo: 140, stock_seguridad: 10, demanda_promedio_diaria: 8, tiempo_entrega: 2, created_at: todayOffset(63) },
    { id: 4, codigo_estandar: 'MAT-BLO-021', nombre: 'Bloque de concreto 12 cm', categoria: 'Mampostería', subcategoria: 'Bloques', stock_minimo: 200, stock_maximo: 1600, stock_seguridad: 80, demanda_promedio_diaria: 85, tiempo_entrega: 2, created_at: todayOffset(56) },
    { id: 5, codigo_estandar: 'MAT-GRA-010', nombre: 'Grava triturada 3/4"', categoria: 'Agregados', subcategoria: 'Grava', stock_minimo: 40, stock_maximo: 180, stock_seguridad: 10, demanda_promedio_diaria: 5, tiempo_entrega: 3, created_at: todayOffset(42) },
    { id: 6, codigo_estandar: 'MAT-MAL-003', nombre: 'Malla electrosoldada 6×6', categoria: 'Acero', subcategoria: 'Malla', stock_minimo: 12, stock_maximo: 70, stock_seguridad: 4, demanda_promedio_diaria: 2, tiempo_entrega: 6, created_at: todayOffset(34) },
  ],
  proveedores: [
    { id: 1, nombre_fiscal: 'Materiales La Rivera S.A.', contacto: 'Andrea Salas', telefono: '2256-0184', correo: 'compras@larivera.cr' },
    { id: 2, nombre_fiscal: 'Aceros del Valle Ltda.', contacto: 'Marco Rojas', telefono: '2248-7710', correo: 'ventas@acerosvalle.cr' },
    { id: 3, nombre_fiscal: 'Agregados San José S.A.', contacto: 'Paula Méndez', telefono: '2431-5062', correo: 'pedidos@agregadossj.cr' },
  ],
  centros_de_costo: [
    { id: 1, codigo_proyecto: 'OB-042', nombre_obra: 'Condominio Los Robles' },
    { id: 2, codigo_proyecto: 'OB-057', nombre_obra: 'Torre Alameda' },
    { id: 3, codigo_proyecto: 'BC-001', nombre_obra: 'Bodega Central' },
  ],
  ubicaciones: [
    { id: 1, nombre: 'Bodega Central', tipo: 'bodega', centro_costo_id: 3 },
    { id: 2, nombre: 'Condominio Los Robles', tipo: 'obra', centro_costo_id: 1 },
    { id: 3, nombre: 'Torre Alameda', tipo: 'obra', centro_costo_id: 2 },
  ],
  usuarios: [
    { id: 1, nombre: 'María Fernández', correo: 'maria@delvalle.cr', rol: 'Administradora', activo: true },
    { id: 2, nombre: 'Carlos Jiménez', correo: 'carlos@delvalle.cr', rol: 'Encargado de bodega', activo: true },
  ],
  ordenes_compra: [
    { id: 1, proveedor_id: 1, centro_costo_id: 1, estado_aprobacion: 'recibida', fecha_emision: todayOffset(1).slice(0, 10), monto_total: 486000, created_at: todayOffset(1) },
    { id: 2, proveedor_id: 2, centro_costo_id: 2, estado_aprobacion: 'aprobada', fecha_emision: todayOffset(3).slice(0, 10), monto_total: 725000, created_at: todayOffset(3) },
    { id: 3, proveedor_id: 1, centro_costo_id: 1, estado_aprobacion: 'pendiente', fecha_emision: todayOffset(2).slice(0, 10), monto_total: 482000, created_at: todayOffset(2) },
    { id: 4, proveedor_id: 3, centro_costo_id: 3, estado_aprobacion: 'recibida', fecha_emision: todayOffset(9).slice(0, 10), monto_total: 318000, created_at: todayOffset(9) },
  ],
  detalle_orden_compra: [
    { id: 1, orden_compra_id: 1, material_id: 1, cantidad: 60, precio_unitario: 8100 },
    { id: 2, orden_compra_id: 2, material_id: 2, cantidad: 80, precio_unitario: 9062.5 },
    { id: 3, orden_compra_id: 3, material_id: 1, cantidad: 58, precio_unitario: 8310 },
    { id: 4, orden_compra_id: 4, material_id: 3, cantidad: 42, precio_unitario: 7571.43 },
  ],
  movimientos: [
    { id: 1, material_id: 1, lote_id: 1, detalle_orden_compra_id: 1, ubicacion_id: 1, tipo_movimiento: 'entrada', cantidad: 50, documento_origen: 'OC-2026-001', usuario_id: 2, created_at: todayOffset(7) },
    { id: 2, material_id: 1, lote_id: 1, ubicacion_id: 1, tipo_movimiento: 'salida', cantidad: 22, documento_origen: 'VA-OB042-188', usuario_id: 2, created_at: todayOffset(4) },
    { id: 3, material_id: 1, lote_id: 1, ubicacion_id: 1, ubicacion_destino_id: 2, tipo_movimiento: 'traslado', cantidad: 9.5, documento_origen: 'TR-2026-031', usuario_id: 1, created_at: todayOffset(2) },
    { id: 4, material_id: 1, ubicacion_id: 2, tipo_movimiento: 'salida', cantidad: 7, documento_origen: 'VA-OB042-201', usuario_id: 2, created_at: todayOffset(1) },
    { id: 5, material_id: 2, lote_id: 2, ubicacion_id: 1, tipo_movimiento: 'entrada', cantidad: 120, documento_origen: 'OC-2026-002', usuario_id: 2, created_at: todayOffset(8) },
    { id: 6, material_id: 2, ubicacion_id: 1, tipo_movimiento: 'salida', cantidad: 38, documento_origen: 'VA-OB057-091', usuario_id: 2, created_at: todayOffset(3) },
    { id: 7, material_id: 2, ubicacion_id: 1, ubicacion_destino_id: 3, tipo_movimiento: 'traslado', cantidad: 26, documento_origen: 'TR-2026-029', usuario_id: 1, created_at: todayOffset(2) },
    { id: 8, material_id: 3, lote_id: 3, detalle_orden_compra_id: 4, ubicacion_id: 1, tipo_movimiento: 'entrada', cantidad: 42, documento_origen: 'OC-2026-004', usuario_id: 2, created_at: todayOffset(6) },
    { id: 9, material_id: 3, ubicacion_id: 1, tipo_movimiento: 'salida', cantidad: 40, documento_origen: 'VA-OB042-194', usuario_id: 2, created_at: todayOffset(2) },
    { id: 10, material_id: 3, ubicacion_id: 1, tipo_movimiento: 'salida', cantidad: 18, documento_origen: 'VA-OB057-087', usuario_id: 2, created_at: todayOffset(1) },
    { id: 11, material_id: 4, lote_id: 4, ubicacion_id: 1, tipo_movimiento: 'entrada', cantidad: 800, documento_origen: 'OC-2026-006', usuario_id: 2, created_at: todayOffset(5) },
    { id: 12, material_id: 4, ubicacion_id: 1, tipo_movimiento: 'salida', cantidad: 160, documento_origen: 'VA-OB057-088', usuario_id: 2, created_at: todayOffset(2) },
    { id: 13, material_id: 5, lote_id: 5, ubicacion_id: 1, tipo_movimiento: 'entrada', cantidad: 70, documento_origen: 'OC-2026-004', usuario_id: 2, created_at: todayOffset(5) },
    { id: 14, material_id: 5, ubicacion_id: 1, tipo_movimiento: 'salida', cantidad: 38, documento_origen: 'VA-OB042-190', usuario_id: 2, created_at: todayOffset(2) },
    { id: 15, material_id: 6, ubicacion_id: 1, tipo_movimiento: 'entrada', cantidad: 34, documento_origen: 'OC-2026-007', usuario_id: 2, created_at: todayOffset(4) },
    { id: 16, material_id: 6, ubicacion_id: 1, tipo_movimiento: 'salida', cantidad: 18, documento_origen: 'VA-OB057-090', usuario_id: 2, created_at: todayOffset(1) },
    { id: 17, material_id: 3, lote_id: 3, ubicacion_id: 1, tipo_movimiento: 'entrada', cantidad: 28, documento_origen: 'OC-2026-005', usuario_id: 2, created_at: todayOffset(5) },
  ],
  lotes: [
    { id: 1, material_id: 1, proveedor_id: 1, numero_lote: 'CEM-26-118', fecha_recepcion: todayOffset(7).slice(0, 10) },
    { id: 2, material_id: 2, proveedor_id: 2, numero_lote: 'VAR-26-204', fecha_recepcion: todayOffset(8).slice(0, 10) },
    { id: 3, material_id: 3, proveedor_id: 3, numero_lote: 'ARE-26-088', fecha_recepcion: todayOffset(6).slice(0, 10) },
    { id: 4, material_id: 4, proveedor_id: 1, numero_lote: 'BLO-26-317', fecha_recepcion: todayOffset(5).slice(0, 10) },
    { id: 5, material_id: 5, proveedor_id: 3, numero_lote: 'GRA-26-042', fecha_recepcion: todayOffset(5).slice(0, 10) },
  ],
  alertas: [],
}

function clone(value) {
  return JSON.parse(JSON.stringify(value))
}

function loadStore() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) return JSON.parse(stored)
  } catch (error) {
    console.error('No fue posible leer los datos de demostración guardados.', error)
  }

  const initial = clone(seed)
  saveStore(initial)
  return initial
}

function saveStore(store) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store))
  } catch (error) {
    console.error('No fue posible guardar los datos de demostración.', error)
    throw new Error('No se pudieron guardar los cambios en el navegador.')
  }
}

export const isDemoMode = import.meta.env.VITE_DEMO_MODE === 'true'

export async function request(resource, options = {}) {
  const { method = 'GET', body } = options

  if (isDemoMode) {
    const store = loadStore()
    const [pathCollection, id] = resource.split('/')
    const collection = resourceNames[pathCollection] || pathCollection
    const rows = store[collection]
    if (!rows) throw new Error(`El recurso de demostración "${collection}" no existe.`)

    if (method === 'GET' && id) {
      const record = rows.find((row) => row.id === Number(id))
      if (!record) throw new Error('Registro no encontrado.')
      return clone(record)
    }

    if (method === 'GET') {
      const limit = Math.min(Number(options.limit) || 100, 100)
      const page = Math.max(Number(options.page) || 1, 1)
      const data = rows.slice((page - 1) * limit, page * limit)
      return { data: clone(data), pagination: { page, limit, total: rows.length, totalPages: Math.ceil(rows.length / limit) } }
    }

    if (method === 'POST') {
      const record = { ...body, id: rows.reduce((max, row) => Math.max(max, row.id), 0) + 1, created_at: new Date().toISOString(), updated_at: new Date().toISOString() }
      rows.push(record)
      saveStore(store)
      return clone(record)
    }

    const index = rows.findIndex((row) => row.id === Number(id))
    if (index < 0) throw new Error('Registro no encontrado.')
    if (method === 'PUT' || method === 'PATCH') {
      rows[index] = { ...rows[index], ...body, updated_at: new Date().toISOString() }
      saveStore(store)
      return clone(rows[index])
    }
    if (method === 'DELETE') {
      rows.splice(index, 1)
      saveStore(store)
      return null
    }

    throw new Error(`Método "${method}" no soportado en modo demostración.`)
  }

  const query = method === 'GET' && !resource.includes('/')
    ? `?page=${options.page || 1}&limit=${options.limit || 100}`
    : ''
  const [collection, id] = resource.split('/')
  const endpoint = `${endpointNames[collection] || collection}${id ? `/${id}` : ''}`
  const response = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/${endpoint}${query}`, {
    method,
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  })

  if (!response.ok) {
    let message = `La solicitud falló (${response.status}).`
    try {
      const payload = await response.json()
      if (payload.message) message = payload.message
    } catch {
      // Conserva el mensaje HTTP si el servidor no devolvió JSON.
    }
    throw new Error(message)
  }

  if (response.status === 204) return null
  return response.json()
}
