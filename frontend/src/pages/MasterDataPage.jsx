import { useState } from 'react'
import { Building2, Edit3, MapPin, Plus, Trash2, Truck, UsersRound } from 'lucide-react'
import { EmptyState, ErrorState, LoadingState } from '../components/Feedback'
import MasterRecordForm from '../components/MasterRecordForm'
import Modal from '../components/Modal'
import PageHeader from '../components/PageHeader'
import { useInventory } from '../js/InventoryState'

const sections = [
  { key: 'proveedores', label: 'Proveedores', singular: 'proveedor', icon: Truck, columns: [['nombre_fiscal', 'Proveedor'], ['contacto', 'Contacto'], ['telefono', 'Teléfono'], ['correo', 'Correo']] },
  { key: 'centros_de_costo', label: 'Obras y proyectos', singular: 'obra', icon: Building2, columns: [['codigo_proyecto', 'Código'], ['nombre_obra', 'Obra'], ['descripcion', 'Descripción']] },
  { key: 'ubicaciones', label: 'Ubicaciones', singular: 'ubicación', icon: MapPin, columns: [['nombre', 'Ubicación'], ['tipo', 'Tipo'], ['centro_costo_id', 'Centro de costo'], ['direccion', 'Dirección']] },
  { key: 'usuarios', label: 'Usuarios', singular: 'usuario', icon: UsersRound, columns: [['nombre', 'Nombre'], ['correo', 'Correo'], ['rol', 'Rol'], ['activo', 'Estado']] },
]

export default function MasterDataPage() {
  const { data, loading, error, refresh, create, update, remove } = useInventory()
  const [sectionKey, setSectionKey] = useState('proveedores')
  const [editing, setEditing] = useState(null)
  const [busy, setBusy] = useState(false)
  const [notice, setNotice] = useState('')
  const section = sections.find((item) => item.key === sectionKey)
  const records = data?.[sectionKey] || []

  if (loading && !data) return <LoadingState />
  if (error && !data) return <ErrorState message={error} onRetry={refresh} />
  if (!data) return null

  async function saveRecord(values) {
    setBusy(true)
    try {
      if (editing?.id) await update(sectionKey, editing.id, values)
      else await create(sectionKey, values)
      setEditing(null)
      setNotice('Registro guardado correctamente.')
    } finally {
      setBusy(false)
    }
  }

  async function deleteRecord(record) {
    const label = record.nombre_fiscal || record.nombre_obra || record.nombre
    if (!window.confirm(`¿Eliminar "${label}"?`)) return
    try {
      await remove(sectionKey, record.id)
      setNotice('Registro eliminado.')
    } catch (deleteError) {
      setNotice(deleteError.message)
    }
  }

  function displayValue(record, key) {
    if (key === 'centro_costo_id') return data.centros_de_costo.find((center) => center.id === record.centro_costo_id)?.nombre_obra || 'Sin asignar'
    if (key === 'activo') return record.activo ? 'Activo' : 'Inactivo'
    if (!record[key]) return '—'
    return record[key]
  }

  return (
    <>
      <PageHeader
        eyebrow="DATOS DE OPERACIÓN"
        title="Obras y proveedores"
        description="Mantén al día las bodegas, responsables y contactos que participan en cada compra y movimiento."
        actions={<button className="button button--primary" onClick={() => setEditing({})}><Plus size={17} /> Agregar {sectionKey === 'centros_de_costo' ? 'obra' : sectionKey === 'usuarios' ? 'usuario' : sectionKey === 'ubicaciones' ? 'ubicación' : 'proveedor'}</button>}
      />
      {notice && <div className="inline-notice" role="status">{notice}<button onClick={() => setNotice('')} aria-label="Cerrar">×</button></div>}
      {error && <div className="inline-notice inline-notice--error" role="alert">{error}</div>}

      <section className="panel inventory-panel master-panel">
        <div className="master-tabs" role="tablist" aria-label="Catálogos de operación">
          {sections.map(({ key, label, icon: Icon }) => (
            <button key={key} role="tab" aria-selected={sectionKey === key} className={`master-tab ${sectionKey === key ? 'master-tab--active' : ''}`} onClick={() => setSectionKey(key)}>
              <Icon size={16} />{label}<span>{data[key].length}</span>
            </button>
          ))}
        </div>
        {records.length === 0 ? (
          <EmptyState title={`Aún no hay ${section.label.toLowerCase()}`} description="Agrega registros para poder asignarlos a materiales, órdenes y movimientos." action={<button className="button button--secondary button--small" onClick={() => setEditing({})}><Plus size={14} /> Agregar registro</button>} />
        ) : (
          <div className="table-scroll">
            <table className="data-table">
              <thead><tr>{section.columns.map(([, label]) => <th key={label}>{label}</th>)}<th /></tr></thead>
              <tbody>
                {records.map((record) => (
                  <tr key={record.id}>
                    {section.columns.map(([key]) => <td key={key}>{key === 'nombre_fiscal' || key === 'nombre_obra' || key === 'nombre' ? <span className="table-primary">{displayValue(record, key)}</span> : displayValue(record, key)}</td>)}
                    <td><div className="row-actions"><button className="icon-button" onClick={() => setEditing(record)} aria-label={`Editar ${record.nombre_fiscal || record.nombre_obra || record.nombre}`}><Edit3 size={15} /></button><button className="icon-button icon-button--danger" onClick={() => deleteRecord(record)} aria-label={`Eliminar ${record.nombre_fiscal || record.nombre_obra || record.nombre}`}><Trash2 size={15} /></button></div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div className="panel-footer">Estos catálogos se reutilizan al registrar compras y movimientos de inventario.</div>
      </section>

      {editing && (
        <Modal         title={`${editing.id ? 'Editar' : 'Nuevo'} ${section.singular}`} description="Completa los datos de operación." onClose={() => setEditing(null)}>
          <MasterRecordForm section={sectionKey} initialValue={editing.id ? editing : undefined} centers={data.centros_de_costo} onSubmit={saveRecord} onCancel={() => setEditing(null)} busy={busy} />
        </Modal>
      )}
    </>
  )
}
