import { useState } from 'react'

const emptyValues = {
  codigo_estandar: '',
  nombre: '',
  categoria: '',
  subcategoria: '',
  stock_minimo: '',
  stock_maximo: '',
  stock_seguridad: '',
  demanda_promedio_diaria: '',
  tiempo_entrega: '',
}

const fields = [
  { name: 'codigo_estandar', label: 'Código interno', placeholder: 'MAT-CEM-001', required: true },
  { name: 'nombre', label: 'Nombre del material', placeholder: 'Cemento gris uso general', required: true, wide: true },
  { name: 'categoria', label: 'Categoría', placeholder: 'Cementantes', required: true },
  { name: 'subcategoria', label: 'Subcategoría', placeholder: 'Cemento' },
  { name: 'stock_minimo', label: 'Stock mínimo', type: 'number', required: true },
  { name: 'stock_maximo', label: 'Stock máximo', type: 'number' },
  { name: 'stock_seguridad', label: 'Stock de seguridad', type: 'number', required: true },
  { name: 'demanda_promedio_diaria', label: 'Demanda diaria promedio', type: 'number', required: true },
  { name: 'tiempo_entrega', label: 'Tiempo de entrega (días)', type: 'number', required: true },
]

export default function MaterialForm({ initialValue, onSubmit, onCancel, busy }) {
  const [values, setValues] = useState(() => ({ ...emptyValues, ...initialValue }))
  const [error, setError] = useState('')

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    const body = {
      ...values,
      stock_minimo: Number(values.stock_minimo),
      stock_maximo: values.stock_maximo === '' ? null : Number(values.stock_maximo),
      stock_seguridad: Number(values.stock_seguridad),
      demanda_promedio_diaria: Number(values.demanda_promedio_diaria),
      tiempo_entrega: Number(values.tiempo_entrega),
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
        {fields.map(({ name, label, type = 'text', placeholder, required, wide }) => (
          <label key={name} className={`form-field ${wide ? 'form-field--wide' : ''}`}>
            <span>{label}{required && <i> *</i>}</span>
            <input
              type={type}
              min={type === 'number' ? 0 : undefined}
              step={type === 'number' ? '0.01' : undefined}
              required={required}
              placeholder={placeholder}
              value={values[name] ?? ''}
              onChange={(event) => setValues({ ...values, [name]: event.target.value })}
            />
          </label>
        ))}
      </div>
      <p className="form-hint">El punto de reorden se calcula automáticamente: demanda diaria × plazo + stock de seguridad.</p>
      {error && <p className="form-error" role="alert">{error}</p>}
      <div className="form-actions">
        <button type="button" className="button button--secondary" onClick={onCancel}>Cancelar</button>
        <button className="button button--primary" disabled={busy}>{busy ? 'Guardando…' : 'Guardar material'}</button>
      </div>
    </form>
  )
}
