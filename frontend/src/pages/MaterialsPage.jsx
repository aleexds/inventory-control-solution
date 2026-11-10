import { useMemo, useState } from 'react'
import { Edit3, Plus, Search, SlidersHorizontal, Trash2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { EmptyState, ErrorState, LoadingState } from '../components/Feedback'
import MaterialForm from '../components/MaterialForm'
import Modal from '../components/Modal'
import PageHeader from '../components/PageHeader'
import StockIndicator from '../components/StockIndicator'
import { useInventory } from '../js/InventoryState'
import { calculateStock, formatQuantity, reorderPoint } from '../js/inventoryUtils'

export default function MaterialsPage() {
  const { data, loading, error, refresh, create, update, remove } = useInventory()
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('todos')
  const [editing, setEditing] = useState(null)
  const [busy, setBusy] = useState(false)
  const [notice, setNotice] = useState('')

  const materials = useMemo(() => (data?.materiales || []).map((material) => ({
    ...material,
    stock: calculateStock(material.id, data.movimientos),
    point: reorderPoint(material),
  })).filter((material) => {
    const text = `${material.nombre} ${material.codigo_estandar} ${material.categoria}`.toLowerCase()
    const matchesQuery = text.includes(query.toLowerCase())
    const matchesFilter = filter === 'todos'
      || (filter === 'reponer' && material.stock <= material.point)
      || (filter === 'en-nivel' && material.stock > material.point)
    return matchesQuery && matchesFilter
  }), [data, query, filter])

  if (loading && !data) return <LoadingState />
  if (error && !data) return <ErrorState message={error} onRetry={refresh} />
  if (!data) return null

  async function saveMaterial(values) {
    setBusy(true)
    try {
      if (editing?.id) await update('materiales', editing.id, values)
      else await create('materiales', values)
      setEditing(null)
      setNotice(editing?.id ? 'Material actualizado.' : 'Material agregado al catálogo.')
    } finally {
      setBusy(false)
    }
  }

  async function deleteMaterial(material) {
    if (!window.confirm(`¿Eliminar "${material.nombre}" del catálogo?`)) return
    try {
      await remove('materiales', material.id)
      setNotice('Material eliminado.')
    } catch (deleteError) {
      setNotice(deleteError.message)
    }
  }

  return (
    <>
      <PageHeader
        eyebrow="CATÁLOGO MAESTRO"
        title="Materiales"
        description="Parámetros de stock, demanda y reabastecimiento para cada insumo."
        actions={<button className="button button--primary" onClick={() => setEditing({})}><Plus size={17} /> Agregar material</button>}
      />
      {notice && <div className="inline-notice" role="status">{notice}<button onClick={() => setNotice('')} aria-label="Cerrar">×</button></div>}
      {error && <div className="inline-notice inline-notice--error" role="alert">{error}</div>}

      <section className="panel inventory-panel">
        <div className="table-toolbar">
          <label className="search-field">
            <Search size={17} />
            <input aria-label="Buscar materiales" placeholder="Buscar por nombre, código o categoría…" value={query} onChange={(event) => setQuery(event.target.value)} />
          </label>
          <label className="filter-select">
            <SlidersHorizontal size={16} />
            <select aria-label="Filtrar materiales" value={filter} onChange={(event) => setFilter(event.target.value)}>
              <option value="todos">Todos los materiales</option>
              <option value="reponer">Requieren reposición</option>
              <option value="en-nivel">Por encima del punto de reorden</option>
            </select>
          </label>
          <span className="result-count">{materials.length} resultados</span>
        </div>
        {materials.length === 0 ? (
          <EmptyState title={query ? 'No encontramos coincidencias' : 'No hay materiales registrados'} description={query ? 'Prueba con otro término o cambia los filtros.' : 'Agrega los insumos de tus bodegas y obras.'} />
        ) : (
          <div className="table-scroll">
            <table className="data-table materials-table">
              <thead><tr><th>Material</th><th>Categoría</th><th>Existencia</th><th>Mín. / Máx.</th><th>Demanda diaria</th><th>Plazo</th><th>Punto reorden</th><th>Estado</th><th /></tr></thead>
              <tbody>
                {materials.map((material) => (
                  <tr key={material.id}>
                    <td><span className="table-primary">{material.nombre}</span><small className="table-secondary">{material.codigo_estandar}</small></td>
                    <td>{material.categoria}</td>
                    <td><StockIndicator material={material} stock={material.stock} /></td>
                    <td>{formatQuantity(material.stock_minimo)} <span className="muted">/</span> {formatQuantity(material.stock_maximo || 0)}</td>
                    <td>{formatQuantity(material.demanda_promedio_diaria)}</td>
                    <td>{material.tiempo_entrega} días</td>
                    <td><strong className="reorder-value">{formatQuantity(material.point)}</strong></td>
                    <td><StockIndicator material={material} stock={material.stock} compact /></td>
                    <td>
                      <div className="row-actions">
                        <Link className="icon-button" to={`/trazabilidad?material=${material.id}`} title="Ver trazabilidad" aria-label={`Ver trazabilidad de ${material.nombre}`}><Search size={16} /></Link>
                        <button className="icon-button" onClick={() => setEditing(material)} title="Editar" aria-label={`Editar ${material.nombre}`}><Edit3 size={15} /></button>
                        <button className="icon-button icon-button--danger" onClick={() => deleteMaterial(material)} title="Eliminar" aria-label={`Eliminar ${material.nombre}`}><Trash2 size={15} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div className="panel-footer"><span>Stock consolidado a partir del historial de movimientos.</span><span className="footer-dot" />Punto de reorden calculado automáticamente</div>
      </section>

      {editing && (
        <Modal title={editing.id ? 'Editar material' : 'Nuevo material'} description="Completa los parámetros de almacenamiento y reposición." onClose={() => setEditing(null)} size="wide">
          <MaterialForm initialValue={editing.id ? editing : undefined} onSubmit={saveMaterial} onCancel={() => setEditing(null)} busy={busy} />
        </Modal>
      )}
    </>
  )
}
