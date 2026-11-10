export function reorderPoint(material) {
  return Number(material.demanda_promedio_diaria || 0) * Number(material.tiempo_entrega || 0)
    + Number(material.stock_seguridad || 0)
}

export function calculateStock(materialId, movements, locationId = null) {
  return movements.reduce((stock, movement) => {
    if (movement.tipo_movimiento === 'entrada' && movement.ubicacion_id === locationId) {
      return stock + (movement.material_id === materialId ? Number(movement.cantidad) : 0)
    }
    if (movement.tipo_movimiento === 'entrada' && locationId === null && movement.material_id === materialId) {
      return stock + Number(movement.cantidad)
    }

    if (movement.tipo_movimiento === 'salida' && movement.material_id === materialId
      && (locationId === null || movement.ubicacion_id === locationId)) {
      return stock - Number(movement.cantidad)
    }

    if (movement.tipo_movimiento === 'traslado' && movement.material_id === materialId) {
      if (locationId === null) return stock
      if (movement.ubicacion_id === locationId) return stock - Number(movement.cantidad)
      if (movement.ubicacion_destino_id === locationId) return stock + Number(movement.cantidad)
    }

    if (movement.tipo_movimiento === 'ajuste' && movement.material_id === materialId
      && (locationId === null || movement.ubicacion_id === locationId)) {
      return stock + Number(movement.cantidad)
    }
    return stock
  }, 0)
}

export function stockStatus(material, stock) {
  const point = reorderPoint(material)
  if (stock <= point) return { label: 'Reponer', tone: 'critical' }
  if (stock <= Number(material.stock_minimo || 0) * 1.25) return { label: 'Bajo', tone: 'warning' }
  return { label: 'En nivel', tone: 'success' }
}

export function formatQuantity(value) {
  return new Intl.NumberFormat('es-CR', { maximumFractionDigits: 1 }).format(value)
}

export function formatDate(value, options = { day: '2-digit', month: 'short' }) {
  if (!value) return '—'
  const dateOnly = typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)
  const date = dateOnly
    ? new Date(Number(value.slice(0, 4)), Number(value.slice(5, 7)) - 1, Number(value.slice(8, 10)))
    : new Date(value)
  return new Intl.DateTimeFormat('es-CR', options).format(date)
}

export function purchaseOrderReference(order) {
  const year = String(order.fecha_emision || new Date().getFullYear()).slice(0, 4).slice(-2)
  return `OC-${year}-${String(order.id).padStart(3, '0')}`
}

export function formatCurrency(value) {
  return new Intl.NumberFormat('es-CR', { style: 'currency', currency: 'CRC', maximumFractionDigits: 0 }).format(value || 0)
}

export function findDuplicatePurchaseOrders(orders, details, materials) {
  const byId = new Map(materials.map((material) => [material.id, material]))
  const detailByOrder = new Map()
  for (const detail of details) {
    detailByOrder.set(detail.orden_compra_id, [...(detailByOrder.get(detail.orden_compra_id) || []), detail])
  }

  const matches = []
  for (let first = 0; first < orders.length; first += 1) {
    for (let second = first + 1; second < orders.length; second += 1) {
      const a = orders[first]
      const b = orders[second]
      if (a.proveedor_id !== b.proveedor_id || ['cancelada', 'rechazada'].includes(a.estado_aprobacion)
        || ['cancelada', 'rechazada'].includes(b.estado_aprobacion)) continue
      const dateGap = Math.abs(new Date(a.fecha_emision) - new Date(b.fecha_emision)) / 86400000
      if (dateGap > 7) continue

      for (const left of detailByOrder.get(a.id) || []) {
        for (const right of detailByOrder.get(b.id) || []) {
          if (left.material_id !== right.material_id) continue
          const largest = Math.max(Number(left.cantidad), Number(right.cantidad))
          const similarity = largest === 0 ? 1 : Math.min(Number(left.cantidad), Number(right.cantidad)) / largest
          if (similarity >= 0.9) {
            matches.push({
              first: a,
              second: b,
              material: byId.get(left.material_id),
              quantity: left.cantidad,
            })
          }
        }
      }
    }
  }
  return matches
}
