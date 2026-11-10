import { useState } from 'react'

const blankRecords = {
  proveedores: { nombre_fiscal: '', contacto: '', telefono: '', correo: '', calificacion_ponderada: '' },
  centros_de_costo: { codigo_proyecto: '', nombre_obra: '', descripcion: '' },
  ubicaciones: { nombre: '', tipo: 'bodega', direccion: '', centro_costo_id: '' },
  usuarios: { nombre: '', correo: '', rol: 'Encargado de bodega', activo: true },
}

function getFields(section, centers) {
  if (section === 'proveedores') return [
    { name: 'nombre_fiscal', label: 'Nombre fiscal', required: true, wide: true },
    { name: 'contacto', label: 'Persona de contacto' },
    { name: 'telefono', label: 'Teléfono', type: 'tel' },
    { name: 'correo', label: 'Correo electrónico', type: 'email' },
    { name: 'calificacion_ponderada', label: 'Calificación (0–5)', type: 'number', min: 0, max: 5 },
  ]
  if (section === 'centros_de_costo') return [
    { name: 'codigo_proyecto', label: 'Código de proyecto', required: true },
    { name: 'nombre_obra', label: 'Nombre de la obra', required: true },
    { name: 'descripcion', label: 'Descripción', type: 'textarea', wide: true },
  ]
  if (section === 'ubicaciones') return [
    { name: 'nombre', label: 'Nombre de la ubicación', required: true, wide: true },
    { name: 'tipo', label: 'Tipo', type: 'select', options: [{ value: 'bodega', label: 'Bodega' }, { value: 'obra', label: 'Obra' }] },
    { name: 'centro_costo_id', label: 'Centro de costo', type: 'select', options: [{ value: '', label: 'Sin asignar' }, ...centers.map((center) => ({ value: center.id, label: `${center.codigo_proyecto} · ${center.nombre_obra}` }))] },
    { name: 'direccion', label: 'Dirección', wide: true },
  ]
  return [
    { name: 'nombre', label: 'Nombre completo', required: true },
    { name: 'rol', label: 'Rol', type: 'select', options: [{ value: 'Administradora', label: 'Administradora' }, { value: 'Encargado de bodega', label: 'Encargado de bodega' }, { value: 'Residente de obra', label: 'Residente de obra' }, { value: 'Compras', label: 'Compras' }] },
    { name: 'correo', label: 'Correo electrónico', type: 'email', required: true, wide: true },
    { name: 'activo', label: 'Usuario activo', type: 'checkbox', wide: true },
  ]
}

export default function MasterRecordForm({ section, initialValue, centers, onSubmit, onCancel, busy }) {
  const [values, setValues] = useState(() => ({ ...blankRecords[section], ...initialValue }))
  const [error, setError] = useState('')
  const fields = getFields(section, centers)

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    const body = { ...values }
    if (section === 'proveedores') {
      body.calificacion_ponderada = body.calificacion_ponderada === '' ? null : Number(body.calificacion_ponderada)
    }
    if (section === 'ubicaciones') {
      body.centro_costo_id = body.centro_costo_id ? Number(body.centro_costo_id) : null
    }
    try {
      await onSubmit(body)
    } catch (submitError) {
      setError(submitError.message)
    }
  }

  return (
    <form className="form" onSubmit={handleSubmit}>
      <div className="form-grid">
        {fields.map((field) => (
          <label key={field.name} className={`form-field ${field.wide ? 'form-field--wide' : ''} ${field.type === 'checkbox' ? 'form-field--checkbox' : ''}`}>
            {field.type !== 'checkbox' && <span>{field.label}{field.required && <i> *</i>}</span>}
            {field.type === 'select' ? (
              <select required={field.required} value={values[field.name] ?? ''} onChange={(event) => setValues({ ...values, [field.name]: event.target.value })}>
                {field.options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
              </select>
            ) : field.type === 'textarea' ? (
              <textarea rows="3" value={values[field.name] ?? ''} onChange={(event) => setValues({ ...values, [field.name]: event.target.value })} />
            ) : field.type === 'checkbox' ? (
              <span><input type="checkbox" checked={Boolean(values[field.name])} onChange={(event) => setValues({ ...values, [field.name]: event.target.checked })} /> {field.label}</span>
            ) : (
              <input
                type={field.type || 'text'}
                min={field.min}
                max={field.max}
                step={field.type === 'number' ? '0.1' : undefined}
                required={field.required}
                value={values[field.name] ?? ''}
                onChange={(event) => setValues({ ...values, [field.name]: event.target.value })}
              />
            )}
          </label>
        ))}
      </div>
      {error && <p className="form-error" role="alert">{error}</p>}
      <div className="form-actions">
        <button type="button" className="button button--secondary" onClick={onCancel}>Cancelar</button>
        <button className="button button--primary" disabled={busy}>{busy ? 'Guardando…' : 'Guardar registro'}</button>
      </div>
    </form>
  )
}
