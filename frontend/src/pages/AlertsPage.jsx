import { useMemo } from 'react'
import { AlertTriangle, ArrowRight, BellRing, Boxes, ClipboardList, PackageSearch } from 'lucide-react'
import { Link } from 'react-router-dom'
import { EmptyState, ErrorState, LoadingState } from '../components/Feedback'
import PageHeader from '../components/PageHeader'
import StatusBadge from '../components/StatusBadge'
import { useInventory } from '../js/InventoryState'
import { calculateStock, findDuplicatePurchaseOrders, formatDate, formatQuantity, reorderPoint } from '../js/inventoryUtils'

export default function AlertsPage() {
  const { data, loading, error, refresh } = useInventory()
  const reorderAlerts = useMemo(() => (data?.materiales || []).map((material) => {
    const stock = calculateStock(material.id, data.movimientos)
    return { material, stock, point: reorderPoint(material) }
  }).filter(({ stock, point }) => stock <= point), [data])
  const duplicates = useMemo(() => data
    ? findDuplicatePurchaseOrders(data.ordenes_compra, data.detalle_orden_compra, data.materiales)
    : [], [data])

  if (loading && !data) return <LoadingState />
  if (error && !data) return <ErrorState message={error} onRetry={refresh} />
  if (!data) return null

  return (
    <>
      <PageHeader
        eyebrow="PREVENCIÓN"
        title="Alertas"
        description="Revisa riesgos de quiebre y coincidencias antes de aprobar una compra."
      />
      {error && <div className="inline-notice inline-notice--error">{error}</div>}

      <section className="alert-summary-grid">
        <article className="alert-summary-card alert-summary-card--reorder">
          <span><BellRing size={19} /></span><div><small>Reposición necesaria</small><strong>{reorderAlerts.length}</strong></div>
        </article>
        <article className="alert-summary-card alert-summary-card--duplicate">
          <span><PackageSearch size={19} /></span><div><small>Compras por revisar</small><strong>{duplicates.length}</strong></div>
        </article>
        <article className="alert-summary-card alert-summary-card--catalog">
          <span><Boxes size={19} /></span><div><small>Materiales monitoreados</small><strong>{data.materiales.length}</strong></div>
        </article>
      </section>

      <section className="panel alert-panel">
        <div className="panel-heading">
          <div><h2><BellRing size={18} /> Alertas de reorden</h2><p>La existencia disponible alcanzó el punto de reorden calculado.</p></div>
          <span className="panel-heading-count panel-heading-count--alert">{reorderAlerts.length}</span>
        </div>
        {reorderAlerts.length === 0 ? <EmptyState title="Sin alertas de reorden" description="Todos los materiales están por encima de su punto de reposición." /> : (
          <div className="alert-list">
            {reorderAlerts.map(({ material, stock, point }) => (
              <div className="alert-row" key={material.id}>
                <span className="alert-row-icon"><AlertTriangle size={17} /></span>
                <div className="alert-row-copy"><strong>{material.nombre}</strong><small>{material.codigo_estandar} · {material.categoria}</small></div>
                <div className="alert-stock"><small>Existencia / reorden</small><strong>{formatQuantity(stock)} <span>/ {formatQuantity(point)}</span></strong></div>
                <StatusBadge tone="critical" />
                <Link to={`/trazabilidad?material=${material.id}`} className="text-link">Trazabilidad <ArrowRight size={14} /></Link>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="panel alert-panel">
        <div className="panel-heading">
          <div><h2><ClipboardList size={18} /> Posibles compras duplicadas</h2><p>Mismo proveedor y artículo, cantidades similares y fechas cercanas.</p></div>
          <span className="panel-heading-count panel-heading-count--warning">{duplicates.length}</span>
        </div>
        <p className="rule-caption">Regla aplicada: mismo proveedor, mismo material, variación de cantidad máxima del 10% y emisión dentro de 7 días.</p>
        {duplicates.length === 0 ? <EmptyState title="Sin coincidencias por revisar" description="No encontramos órdenes recientes que cumplan la regla definida." /> : (
          <div className="duplicate-list">
            {duplicates.map(({ first, second, material, quantity }) => {
              const supplier = data.proveedores.find((item) => item.id === first.proveedor_id)
              const ref = (order) => `OC-${String(new Date(order.fecha_emision).getFullYear()).slice(-2)}-${String(order.id).padStart(3, '0')}`
              return (
                <div className="duplicate-row" key={`${first.id}-${second.id}-${material?.id}`}>
                  <span className="duplicate-row-icon"><PackageSearch size={17} /></span>
                  <div className="duplicate-row-copy"><strong>{material?.nombre || 'Material'}</strong><small>{supplier?.nombre_fiscal || 'Proveedor'} · cantidad aproximada {formatQuantity(quantity)}</small></div>
                  <div className="duplicate-orders"><span>{ref(first)} <small>{formatDate(first.fecha_emision)}</small></span><span>{ref(second)} <small>{formatDate(second.fecha_emision)}</small></span></div>
                  <StatusBadge tone="warning">Revisar</StatusBadge>
                  <Link className="text-link" to="/ordenes">Ver órdenes <ArrowRight size={14} /></Link>
                </div>
              )
            })}
          </div>
        )}
      </section>
    </>
  )
}
