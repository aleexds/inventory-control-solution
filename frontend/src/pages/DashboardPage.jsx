import { useMemo } from 'react'
import { Activity, ArrowDownLeft, ArrowRight, BellRing, Boxes, CircleAlert, ClipboardList, PackageSearch, Plus } from 'lucide-react'
import { Link } from 'react-router-dom'
import { EmptyState, ErrorState, LoadingState } from '../components/Feedback'
import MetricCard from '../components/MetricCard'
import PageHeader from '../components/PageHeader'
import StatusBadge from '../components/StatusBadge'
import { useInventory } from '../js/InventoryState'
import { calculateStock, findDuplicatePurchaseOrders, formatDate, formatQuantity, reorderPoint, stockStatus } from '../js/inventoryUtils'

function StockChart({ materials, movements }) {
  const series = useMemo(() => Array.from({ length: 7 }, (_, index) => {
    const date = new Date()
    date.setDate(date.getDate() - (6 - index))
    const day = date.toLocaleDateString('es-CR', { weekday: 'short' }).replace('.', '')
    const start = new Date(date)
    start.setHours(0, 0, 0, 0)
    const end = new Date(start)
    end.setDate(end.getDate() + 1)
    const total = movements
      .filter((movement) => {
        const time = new Date(movement.created_at || movement.createdAt).getTime()
        return time >= start.getTime() && time < end.getTime() && movement.tipo_movimiento === 'salida'
      })
      .reduce((sum, movement) => sum + Number(movement.cantidad), 0)
    return { day, total }
  }), [movements])
  const max = Math.max(...series.map((item) => item.total), 1)

  return (
    <div className="chart-wrap">
      <div className="chart-legend"><span><i /> Salidas registradas</span><strong>Últimos 7 días</strong></div>
      <div className="bar-chart" role="img" aria-label="Salidas registradas en los últimos siete días">
        {series.map((item, index) => (
          <div className="bar-chart-column" key={`${item.day}-${index}`}>
            <div className="bar-chart-bar-wrap">
              <span className="bar-chart-value">{item.total ? formatQuantity(item.total) : ''}</span>
              <div className={`bar-chart-bar ${item.total ? '' : 'bar-chart-bar--empty'}`} style={{ height: `${Math.max((item.total / max) * 100, item.total ? 8 : 3)}%` }} />
            </div>
            <span className="bar-chart-label">{item.day}</span>
          </div>
        ))}
      </div>
      <div className="chart-footnote"><span><Activity size={14} /> {materials.length} materiales activos en el catálogo</span></div>
    </div>
  )
}

function DashboardContent() {
  const { data, loading, error, refresh } = useInventory()

  if (loading && !data) return <LoadingState />
  if (error && !data) return <ErrorState message={error} onRetry={refresh} />
  if (!data) return null

  const stockRows = data.materiales.map((material) => ({
    material,
    stock: calculateStock(material.id, data.movimientos),
    point: reorderPoint(material),
  }))
  const reorderRows = stockRows.filter(({ material, stock }) => stockStatus(material, stock).tone === 'critical')
    .sort((a, b) => a.stock - a.point - (b.stock - b.point))
  const duplicateOrders = findDuplicatePurchaseOrders(data.ordenes_compra, data.detalle_orden_compra, data.materiales)
  const activeOrders = data.ordenes_compra.filter((order) => ['pendiente', 'aprobada'].includes(order.estado_aprobacion))
  const recentMovements = [...data.movimientos]
    .sort((a, b) => new Date(b.created_at || b.createdAt) - new Date(a.created_at || a.createdAt))
    .slice(0, 5)

  return (
    <>
      <PageHeader
        eyebrow={new Intl.DateTimeFormat('es-CR', { weekday: 'long', day: 'numeric', month: 'long' }).format(new Date())}
        title="Resumen de inventario"
        description="Una vista clara de las existencias, compras y actividad de tus obras."
        actions={<Link className="button button--primary" to="/movimientos"><Plus size={17} /> Registrar movimiento</Link>}
      />

      {error && <div className="inline-notice inline-notice--error"><CircleAlert size={16} /> {error}</div>}

      <section className="metrics-grid" aria-label="Indicadores del inventario">
        <MetricCard label="Materiales registrados" value={data.materiales.length} note="Referencias activas" icon={Boxes} tone="clay" />
        <MetricCard label="Requieren reposición" value={reorderRows.length} note="En o bajo el punto de reorden" icon={BellRing} tone="rose" />
        <MetricCard label="Órdenes abiertas" value={activeOrders.length} note="Pendientes de recibir" icon={ClipboardList} tone="olive" />
        <MetricCard label="Movimientos recientes" value={data.movimientos.length} note="En todo el inventario" icon={ArrowDownLeft} tone="sand" />
      </section>

      <section className="dashboard-grid">
        <article className="panel chart-panel">
          <div className="panel-heading">
            <div><h2>Actividad de bodega</h2><p>Salidas de materiales registradas</p></div>
            <Link to="/movimientos" className="text-link">Ver movimientos <ArrowRight size={15} /></Link>
          </div>
          <StockChart materials={data.materiales} movements={data.movimientos} />
        </article>

        <article className="panel reorder-panel">
          <div className="panel-heading">
            <div><h2>Atención requerida</h2><p>Materiales que necesitan revisión</p></div>
            <span className="panel-heading-count">{reorderRows.length}</span>
          </div>
          {reorderRows.length === 0 ? (
            <EmptyState title="Todo en orden" description="No hay materiales por debajo del punto de reorden." />
          ) : (
            <div className="reorder-list">
              {reorderRows.slice(0, 4).map(({ material, stock, point }) => (
                <Link to={`/trazabilidad?material=${material.id}`} className="reorder-item" key={material.id}>
                  <span className="reorder-indicator"><span /></span>
                  <span className="reorder-copy"><strong>{material.nombre}</strong><small>{material.codigo_estandar}</small></span>
                  <span className="reorder-amount"><strong>{formatQuantity(stock)}</strong><small>PR {formatQuantity(point)}</small></span>
                </Link>
              ))}
              <Link to="/alertas" className="reorder-footer">Revisar todas las alertas <ArrowRight size={15} /></Link>
            </div>
          )}
        </article>
      </section>

      {duplicateOrders.length > 0 && (
        <Link className="duplicate-notice" to="/alertas">
          <span className="duplicate-icon"><PackageSearch size={18} /></span>
          <span><strong>{duplicateOrders.length} posible{duplicateOrders.length === 1 ? '' : 's'} compra{duplicateOrders.length === 1 ? '' : 's'} duplicada{duplicateOrders.length === 1 ? '' : 's'}</strong><small>Coincidencia de proveedor, material, cantidad y fecha</small></span>
          <ArrowRight size={17} />
        </Link>
      )}

      <section className="panel table-panel">
        <div className="panel-heading">
          <div><h2>Movimientos recientes</h2><p>Últimos registros de las bodegas y obras</p></div>
          <Link to="/movimientos" className="text-link">Ver historial <ArrowRight size={15} /></Link>
        </div>
        {recentMovements.length === 0 ? <EmptyState title="Aún no hay movimientos" description="Registra entradas, salidas, traslados o ajustes para comenzar." /> : (
          <div className="table-scroll">
            <table className="data-table">
              <thead><tr><th>Material</th><th>Movimiento</th><th>Ubicación</th><th>Documento</th><th>Fecha</th><th>Cantidad</th></tr></thead>
              <tbody>
                {recentMovements.map((movement) => {
                  const material = data.materiales.find((item) => item.id === movement.material_id)
                  const location = data.ubicaciones.find((item) => item.id === movement.ubicacion_id)
                  return (
                    <tr key={movement.id}>
                      <td><span className="table-primary">{material?.nombre || 'Material eliminado'}</span><small className="table-secondary">{material?.codigo_estandar || '—'}</small></td>
                      <td><StatusBadge tone={movement.tipo_movimiento} /></td>
                      <td>{location?.nombre || '—'}</td>
                      <td className="mono-text">{movement.documento_origen || '—'}</td>
                      <td>{formatDate(movement.created_at || movement.createdAt, { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                      <td className="quantity-cell">{formatQuantity(movement.cantidad)}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <div className="dashboard-footnote"><span className="footnote-mark" /> El punto de reorden se calcula con demanda diaria, plazo de entrega y stock de seguridad.</div>
    </>
  )
}

export default DashboardContent
