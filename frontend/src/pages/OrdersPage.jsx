import { useMemo, useState } from 'react'
import { AlertTriangle, Check, ClipboardList, Plus, Search } from 'lucide-react'
import { EmptyState, ErrorState, LoadingState } from '../components/Feedback'
import Modal from '../components/Modal'
import OrderForm from '../components/OrderForm'
import PageHeader from '../components/PageHeader'
import { useInventory } from '../js/InventoryState'
import { findDuplicatePurchaseOrders, formatCurrency, formatDate, formatQuantity, purchaseOrderReference } from '../js/inventoryUtils'

export default function OrdersPage() {
  const { data, loading, error, refresh, create, update } = useInventory()
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('todas')
  const [isOpen, setIsOpen] = useState(false)
  const [busy, setBusy] = useState(false)
  const [notice, setNotice] = useState('')

  const duplicates = useMemo(() => data
    ? findDuplicatePurchaseOrders(data.ordenes_compra, data.detalle_orden_compra, data.materiales)
    : [], [data])
  const orders = useMemo(() => (data?.ordenes_compra || []).map((order) => {
    const supplier = data.proveedores.find((item) => item.id === order.proveedor_id)
    const center = data.centros_de_costo.find((item) => item.id === order.centro_costo_id)
    const detail = data.detalle_orden_compra.find((item) => item.orden_compra_id === order.id)
    const material = data.materiales.find((item) => item.id === detail?.material_id)
    return { ...order, supplier, center, detail, material }
  }).filter((order) => {
    const search = `${purchaseOrderReference(order)} ${order.supplier?.nombre_fiscal || ''} ${order.material?.nombre || ''} ${order.center?.nombre_obra || ''}`.toLowerCase()
    return search.includes(query.toLowerCase()) && (statusFilter === 'todas' || order.estado_aprobacion === statusFilter)
  }).sort((a, b) => new Date(b.fecha_emision) - new Date(a.fecha_emision)), [data, query, statusFilter])

  if (loading && !data) return <LoadingState />
  if (error && !data) return <ErrorState message={error} onRetry={refresh} />
  if (!data) return null

  async function saveOrder(values) {
    setBusy(true)
    try {
      const order = await create('ordenes-compra', {
        proveedor_id: values.proveedor_id,
        centro_costo_id: values.centro_costo_id,
        estado_aprobacion: 'pendiente',
        fecha_emision: new Date().toISOString().slice(0, 10),
        monto_total: values.cantidad * values.precio_unitario,
      })
      try {
        await create('detalle-orden-compra', {
          orden_compra_id: order.id,
          material_id: values.material_id,
          cantidad: values.cantidad,
          precio_unitario: values.precio_unitario,
        })
      } catch (detailError) {
        setIsOpen(false)
        setNotice(`La orden ${purchaseOrderReference(order)} se creó, pero no se pudo guardar su detalle: ${detailError.message}`)
        return
      }
      setIsOpen(false)
      setNotice('Orden y detalle registrados. Se verificaron posibles coincidencias.')
    } finally {
      setBusy(false)
    }
  }

  async function changeStatus(order, status) {
    try {
      await update('ordenes-compra', order.id, { estado_aprobacion: status })
      setNotice(`${purchaseOrderReference(order)} actualizada a "${status}".`)
    } catch (updateError) {
      setNotice(updateError.message)
    }
  }

  return (
    <>
      <PageHeader
        eyebrow="ABASTECIMIENTO"
        title="Órdenes de compra"
        description="Seguimiento de pedidos y revisión preventiva de coincidencias."
        actions={<button className="button button--primary" onClick={() => setIsOpen(true)}><Plus size={17} /> Nueva orden</button>}
      />
      {notice && <div className="inline-notice" role="status">{notice}<button onClick={() => setNotice('')} aria-label="Cerrar">×</button></div>}
      {error && <div className="inline-notice inline-notice--error" role="alert">{error}</div>}

      {duplicates.length > 0 && (
        <div className="inline-notice inline-notice--warning duplicate-inline">
          <AlertTriangle size={17} />
          <span><strong>{duplicates.length} coincidencia{duplicates.length > 1 ? 's' : ''} por revisar.</strong> Mismo proveedor y material, cantidades con diferencia ≤10% y fechas dentro de 7 días.</span>
        </div>
      )}

      <section className="panel inventory-panel">
        <div className="table-toolbar">
          <label className="search-field"><Search size={17} /><input placeholder="Buscar orden, proveedor o material…" aria-label="Buscar órdenes" value={query} onChange={(event) => setQuery(event.target.value)} /></label>
          <label className="filter-select"><ClipboardList size={16} /><select aria-label="Filtrar por estado" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}><option value="todas">Todos los estados</option><option value="pendiente">Pendientes</option><option value="aprobada">Aprobadas</option><option value="recibida">Recibidas</option><option value="rechazada">Rechazadas</option><option value="cancelada">Canceladas</option></select></label>
          <span className="result-count">{orders.length} órdenes</span>
        </div>
        {orders.length === 0 ? <EmptyState title="No hay órdenes para mostrar" description="Cambia los filtros o crea una nueva orden de compra." /> : (
          <div className="table-scroll">
            <table className="data-table orders-table">
              <thead><tr><th>Orden</th><th>Proveedor</th><th>Material</th><th>Obra destino</th><th>Fecha</th><th>Total</th><th>Estado</th><th>Revisión</th></tr></thead>
              <tbody>
                {orders.map((order) => {
                  const possibleDuplicate = duplicates.some((match) => match.first.id === order.id || match.second.id === order.id)
                  return (
                    <tr key={order.id}>
                      <td><span className="table-primary mono-text">{purchaseOrderReference(order)}</span><small className="table-secondary">#{order.id}</small></td>
                      <td>{order.supplier?.nombre_fiscal || '—'}</td>
                      <td>{order.material ? <><span className="table-primary">{order.material.nombre}</span><small className="table-secondary">{formatQuantity(order.detail?.cantidad)} unidades</small></> : 'Sin detalle'}</td>
                      <td>{order.center?.nombre_obra || 'Sin asignar'}</td>
                      <td>{formatDate(order.fecha_emision, { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                      <td className="quantity-cell">{formatCurrency(order.monto_total)}</td>
                      <td>
                        <select className={`status-select status-select--${order.estado_aprobacion}`} aria-label={`Cambiar estado de ${purchaseOrderReference(order)}`} value={order.estado_aprobacion} onChange={(event) => changeStatus(order, event.target.value)}>
                          <option value="pendiente">Pendiente</option><option value="aprobada">Aprobada</option><option value="rechazada">Rechazada</option><option value="cancelada">Cancelada</option>
                          {order.estado_aprobacion === 'recibida' && <option value="recibida" disabled>Recibida</option>}
                        </select>
                      </td>
                      <td>{possibleDuplicate ? <span className="review-flag"><AlertTriangle size={15} /> Revisar</span> : <span className="review-clear"><Check size={15} /> Sin alertas</span>}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
        <div className="panel-footer">Regla de posible duplicado: mismo proveedor y artículo, cantidades dentro de ±10% y emisión dentro de 7 días.</div>
      </section>

      {isOpen && (
        <Modal title="Nueva orden de compra" description="Registra un pedido con su primer material asociado." onClose={() => setIsOpen(false)} size="wide">
          <OrderForm suppliers={data.proveedores} centers={data.centros_de_costo} materials={data.materiales} onSubmit={saveOrder} onCancel={() => setIsOpen(false)} busy={busy} />
        </Modal>
      )}
    </>
  )
}
