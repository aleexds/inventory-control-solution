import { useState } from 'react'

export default function OrderForm({ suppliers, centers, materials, onSubmit, onCancel, busy }) {
  const [values, setValues] = useState({ proveedor_id: '', centro_costo_id: '', material_id: '', cantidad: '', precio_unitario: '' })
  const [error, setError] = useState('')

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    try {
      await onSubmit({
        proveedor_id: Number(values.proveedor_id),
        centro_costo_id: values.centro_costo_id ? Number(values.centro_costo_id) : null,
        material_id: Number(values.material_id),
        cantidad: Number(values.cantidad),
        precio_unitario: Number(values.precio_unitario),
      })
    } catch (submitError) {
      setError(submitError.message)
    }
  }

  return (
    <form className="form" onSubmit={handleSubmit}>
      <div className="form-grid">
        <label className="form-field form-field--wide">
          <span>Proveedor *</span>
          <select required value={values.proveedor_id} onChange={(event) => setValues({ ...values, proveedor_id: event.target.value })}>
            <option value="">Selecciona un proveedor</option>
            {suppliers.map((supplier) => <option key={supplier.id} value={supplier.id}>{supplier.nombre_fiscal}</option>)}
          </select>
        </label>
        <label className="form-field form-field--wide">
          <span>Obra / centro de costo</span>
          <select value={values.centro_costo_id} onChange={(event) => setValues({ ...values, centro_costo_id: event.target.value })}>
            <option value="">Sin asignar</option>
            {centers.map((center) => <option key={center.id} value={center.id}>{center.codigo_proyecto} · {center.nombre_obra}</option>)}
          </select>
        </label>
        <label className="form-field form-field--wide">
          <span>Material *</span>
          <select required value={values.material_id} onChange={(event) => setValues({ ...values, material_id: event.target.value })}>
            <option value="">Selecciona un material</option>
            {materials.map((material) => <option key={material.id} value={material.id}>{material.nombre}</option>)}
          </select>
        </label>
        <label className="form-field">
          <span>Cantidad *</span>
          <input type="number" min="0.01" step="0.01" required value={values.cantidad} onChange={(event) => setValues({ ...values, cantidad: event.target.value })} />
        </label>
        <label className="form-field">
          <span>Precio unitario (₡) *</span>
          <input type="number" min="0.01" step="0.01" required value={values.precio_unitario} onChange={(event) => setValues({ ...values, precio_unitario: event.target.value })} />
        </label>
      </div>
      <p className="form-hint">La orden quedará pendiente de aprobación. Se revisarán coincidencias con órdenes recientes del mismo proveedor.</p>
      {error && <p className="form-error" role="alert">{error}</p>}
      <div className="form-actions">
        <button type="button" className="button button--secondary" onClick={onCancel}>Cancelar</button>
        <button className="button button--primary" disabled={busy}>{busy ? 'Registrando…' : 'Registrar orden'}</button>
      </div>
    </form>
  )
}
