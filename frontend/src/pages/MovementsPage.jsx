import { useMemo, useState } from 'react'
import { ArrowDownToLine, ArrowDownUp, ArrowUpFromLine, Plus, Search, SlidersHorizontal, Wrench } from 'lucide-react'
import { Link } from 'react-router-dom'
import { EmptyState, ErrorState, LoadingState } from '../components/Feedback'
import Modal from '../components/Modal'
import MovementForm from '../components/MovementForm'
import PageHeader from '../components/PageHeader'
import StatusBadge from '../components/StatusBadge'
import { useInventory } from '../js/InventoryState'
import { formatDate, formatQuantity } from '../js/inventoryUtils'

const typeIcons = { entrada: ArrowDownToLine, salida: ArrowUpFromLine, traslado: ArrowDownUp, ajuste: Wrench }

export default function MovementsPage() {
  const { data, loading, error, refresh, create } = useInventory()
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('todos')
  const [isOpen, setIsOpen] = useState(false)
  const [busy, setBusy] = useState(false)
  const [notice, setNotice] = useState('')

  const movements = useMemo(() => (data?.movimientos || [])
    .map((movement) => ({
      ...movement,
      material: data.materiales.find((item) => item.id === movement.material_id),
      location: data.ubicaciones.find((item) => item.id === movement.ubicacion_id),
      destination: data.ubicaciones.find((item) => item.id === movement.ubicacion_destino_id),
      user: data.usuarios.find((item) => item.id === movement.usuario_id),
    }))
    .filter((movement) => {
      const search = `${movement.material?.nombre || ''} ${movement.material?.codigo_estandar || ''} ${movement.documento_origen || ''} ${movement.location?.nombre || ''}`.toLowerCase()
      return search.includes(query.toLowerCase()) && (filter === 'todos' || movement.tipo_movimiento === filter)
    })
    .sort((a, b) => new Date(b.created_at || b.createdAt) - new Date(a.created_at || a.createdAt)), [data, query, filter])

  if (loading && !data) return <LoadingState />
  if (error && !data) return <ErrorState message={error} onRetry={refresh} />
  if (!data) return null

  async function saveMovement(values) {
    setBusy(true)
    try {
      await create('movimientos', values)
      setIsOpen(false)
      setNotice('Movimiento registrado. Las existencias se actualizaron.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <>
      <PageHeader
        eyebrow="KARDEX DE BODEGA"
        title="Movimientos"
        description="Entradas, consumos, traslados y ajustes con respaldo documental."
        actions={<button className="button button--primary" onClick={() => setIsOpen(true)}><Plus size={17} /> Registrar movimiento</button>}
      />
      {notice && <div className="inline-notice" role="status">{notice}<button onClick={() => setNotice('')} aria-label="Cerrar">×</button></div>}
      {error && <div className="inline-notice inline-notice--error" role="alert">{error}</div>}

      <section className="panel inventory-panel">
        <div className="table-toolbar">
          <label className="search-field"><Search size={17} /><input placeholder="Buscar material o documento…" aria-label="Buscar movimientos" value={query} onChange={(event) => setQuery(event.target.value)} /></label>
          <label className="filter-select"><SlidersHorizontal size={16} /><select aria-label="Filtrar tipo de movimiento" value={filter} onChange={(event) => setFilter(event.target.value)}><option value="todos">Todos los tipos</option><option value="entrada">Entradas</option><option value="salida">Salidas</option><option value="traslado">Traslados</option><option value="ajuste">Ajustes</option></select></label>
          <span className="result-count">{movements.length} registros</span>
        </div>

        {movements.length === 0 ? <EmptyState title="No hay movimientos para mostrar" description="Cambia los filtros o registra una operación de bodega." /> : (
          <div className="table-scroll">
            <table className="data-table">
              <thead><tr><th>Material</th><th>Operación</th><th>Origen / ubicación</th><th>Responsable</th><th>Documento</th><th>Fecha</th><th>Cantidad</th><th /></tr></thead>
              <tbody>
                {movements.map((movement) => {
                  const Icon = typeIcons[movement.tipo_movimiento] || Wrench
                  return (
                    <tr key={movement.id}>
                      <td><Link className="table-link" to={`/trazabilidad?material=${movement.material_id}`}>{movement.material?.nombre || 'Material eliminado'}</Link><small className="table-secondary">{movement.material?.codigo_estandar || '—'}</small></td>
                      <td><span className="operation-type"><span className={`operation-icon operation-icon--${movement.tipo_movimiento}`}><Icon size={15} /></span><StatusBadge tone={movement.tipo_movimiento} /></span></td>
                      <td>{movement.tipo_movimiento === 'traslado' ? <>{movement.location?.nombre || '—'} <span className="muted">→</span> {movement.destination?.nombre || '—'}</> : movement.location?.nombre || '—'}</td>
                      <td>{movement.user?.nombre || '—'}</td>
                      <td className="mono-text">{movement.documento_origen || '—'}</td>
                      <td>{formatDate(movement.created_at || movement.createdAt, { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                      <td className="quantity-cell">{movement.tipo_movimiento === 'salida' ? '−' : movement.tipo_movimiento === 'entrada' ? '+' : ''}{formatQuantity(movement.cantidad)}</td>
                      <td><Link className="text-link table-action" to={`/trazabilidad?material=${movement.material_id}`}>Detalle</Link></td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
        <div className="panel-footer">El stock actual se reconstruye desde este historial.</div>
      </section>

      {isOpen && (
        <Modal title="Registrar movimiento" description="Registra la operación y el documento que la respalda." onClose={() => setIsOpen(false)} size="wide">
          <MovementForm materials={data.materiales} locations={data.ubicaciones} users={data.usuarios.filter((user) => user.activo)} orders={data.ordenes_compra} orderDetails={data.detalle_orden_compra} onSubmit={saveMovement} onCancel={() => setIsOpen(false)} busy={busy} />
        </Modal>
      )}
    </>
  )
}
