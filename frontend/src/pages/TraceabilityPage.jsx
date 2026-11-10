import { useMemo } from 'react'
import { ArrowDownToLine, ArrowDownUp, ArrowUpFromLine, FileClock, PackageCheck, Wrench } from 'lucide-react'
import { useSearchParams } from 'react-router-dom'
import { EmptyState, ErrorState, LoadingState } from '../components/Feedback'
import PageHeader from '../components/PageHeader'
import StatusBadge from '../components/StatusBadge'
import { useInventory } from '../js/InventoryState'
import { calculateStock, formatDate, formatQuantity, purchaseOrderReference } from '../js/inventoryUtils'

const icons = { entrada: ArrowDownToLine, salida: ArrowUpFromLine, traslado: ArrowDownUp, ajuste: Wrench }

function purchaseReference(movement, details, orders) {
  const detail = details.find((item) => item.id === movement.detalle_orden_compra_id)
  const order = orders.find((item) => item.id === detail?.orden_compra_id)
  if (order) return purchaseOrderReference(order)
  return movement.documento_origen || 'Sin documento vinculado'
}

export default function TraceabilityPage() {
  const { data, loading, error, refresh } = useInventory()
  const [params, setParams] = useSearchParams()
  const requestedId = Number(params.get('material')) || ''
  const materialId = data?.materiales.some((material) => material.id === requestedId)
    ? requestedId
    : data?.materiales[0]?.id || ''
  const material = data?.materiales.find((item) => item.id === materialId)
  const movements = useMemo(() => (data?.movimientos || [])
    .filter((movement) => movement.material_id === materialId)
    .sort((a, b) => new Date(b.created_at || b.createdAt) - new Date(a.created_at || a.createdAt)), [data, materialId])

  if (loading && !data) return <LoadingState />
  if (error && !data) return <ErrorState message={error} onRetry={refresh} />
  if (!data) return null

  const totalStock = material ? calculateStock(material.id, data.movimientos) : 0
  const locationStocks = material ? data.ubicaciones.map((location) => ({
    location,
    stock: calculateStock(material.id, data.movimientos, location.id),
  })).filter((item) => item.stock !== 0) : []

  return (
    <>
      <PageHeader
        eyebrow="HISTORIAL DE EXISTENCIAS"
        title="Trazabilidad"
        description="Sigue cada material desde su recepción hasta el consumo en obra."
      />
      {data.materiales.length === 0 ? <EmptyState title="No hay materiales para consultar" description="Agrega un material para comenzar su trazabilidad." /> : (
        <>
          <section className="trace-selector panel">
            <label className="form-field trace-select">
              <span>Selecciona un material</span>
              <select value={materialId} onChange={(event) => setParams({ material: event.target.value })}>
                {data.materiales.map((item) => <option key={item.id} value={item.id}>{item.codigo_estandar} · {item.nombre}</option>)}
              </select>
            </label>
            {material && (
              <div className="trace-summary">
                <span className="trace-summary-icon"><PackageCheck size={20} /></span>
                <div><small>Existencia consolidada</small><strong>{formatQuantity(totalStock)}</strong></div>
                <div className="trace-summary-divider" />
                <div><small>Categoría</small><strong>{material.categoria}</strong></div>
                <div className="trace-summary-divider" />
                <div><small>Movimientos</small><strong>{movements.length}</strong></div>
              </div>
            )}
          </section>

          {material && (
            <section className="trace-layout">
              <article className="panel trace-history">
                <div className="panel-heading">
                  <div><h2>Historial del material</h2><p>{material.codigo_estandar} · {material.nombre}</p></div>
                  <span className="history-count">{movements.length} registros</span>
                </div>
                {movements.length === 0 ? <EmptyState title="Sin movimientos registrados" description="Cuando el material tenga operaciones, aparecerán aquí." /> : (
                  <div className="timeline">
                    {movements.map((movement) => {
                      const Icon = icons[movement.tipo_movimiento] || Wrench
                      const location = data.ubicaciones.find((item) => item.id === movement.ubicacion_id)
                      const destination = data.ubicaciones.find((item) => item.id === movement.ubicacion_destino_id)
                      const user = data.usuarios.find((item) => item.id === movement.usuario_id)
                      const lot = data.lotes.find((item) => item.id === movement.lote_id)
                      const reference = purchaseReference(movement, data.detalle_orden_compra, data.ordenes_compra)
                      return (
                        <div className="timeline-entry" key={movement.id}>
                          <span className={`timeline-icon timeline-icon--${movement.tipo_movimiento}`}><Icon size={16} /></span>
                          <div className="timeline-content">
                            <div className="timeline-title-row"><strong>{movement.tipo_movimiento === 'entrada' ? 'Recepción de material' : movement.tipo_movimiento === 'salida' ? 'Salida a obra' : movement.tipo_movimiento === 'traslado' ? 'Traslado entre ubicaciones' : 'Ajuste de inventario'}</strong><StatusBadge tone={movement.tipo_movimiento} /></div>
                            <p>{movement.tipo_movimiento === 'traslado' ? `${location?.nombre || 'Ubicación'} → ${destination?.nombre || 'Ubicación'}` : location?.nombre || 'Ubicación no especificada'}</p>
                            <div className="timeline-meta">
                              <span><FileClock size={13} /> {formatDate(movement.created_at || movement.createdAt, { day: '2-digit', month: 'long', year: 'numeric' })}</span>
                              <span>Por {user?.nombre || 'Usuario no disponible'}</span>
                              <span className="mono-text">{reference}</span>
                              {lot && <span>Lote {lot.numero_lote}</span>}
                            </div>
                          </div>
                          <strong className={`timeline-quantity ${movement.tipo_movimiento === 'salida' ? 'timeline-quantity--negative' : ''}`}>{movement.tipo_movimiento === 'salida' ? '−' : movement.tipo_movimiento === 'entrada' ? '+' : ''}{formatQuantity(movement.cantidad)}</strong>
                        </div>
                      )
                    })}
                  </div>
                )}
              </article>

              <aside className="panel location-panel">
                <div className="panel-heading"><div><h2>Por ubicación</h2><p>Existencia registrada por centro</p></div></div>
                {locationStocks.length === 0 ? <p className="muted location-empty">No hay existencias registradas.</p> : (
                  <div className="location-list">
                    {locationStocks.map(({ location, stock }) => (
                      <div className="location-row" key={location.id}><span className="location-pin" /><span><strong>{location.nombre}</strong><small>{location.tipo === 'bodega' ? 'Bodega' : 'Obra activa'}</small></span><b>{formatQuantity(stock)}</b></div>
                    ))}
                  </div>
                )}
                <div className="trace-note"><strong>Origen rastreable</strong><span>Las entradas vinculadas a una línea de OC mantienen su referencia de compra y lote.</span></div>
              </aside>
            </section>
          )}
        </>
      )}
    </>
  )
}
