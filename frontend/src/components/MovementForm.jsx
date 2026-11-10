import { useState } from 'react'
import { purchaseOrderReference } from '../js/inventoryUtils'

const initial = {
  material_id: '',
  tipo_movimiento: 'entrada',
  cantidad: '',
  ubicacion_id: '',
  ubicacion_destino_id: '',
  centro_costo_id: '',
  documento_origen: '',
  detalle_orden_compra_id: '',
}

export default function MovementForm({ materials, locations, users, orders, orderDetails, onSubmit, onCancel, busy }) {
  const [values, setValues] = useState(() => ({ ...initial, usuario_id: users[0] ? String(users[0].id) : '' }))
  const [error, setError] = useState('')
  const isTransfer = values.tipo_movimiento === 'traslado'
  const selectedOrderDetail = orderDetails.find((detail) => String(detail.id) === values.detalle_orden_compra_id)

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    if (Number(values.cantidad) === 0 || (!isTransfer && values.tipo_movimiento !== 'ajuste' && Number(values.cantidad) < 0)) {
      setError('La cantidad debe ser mayor que cero. Para un ajuste, indica una cantidad positiva o negativa.')
      return
    }
    if (isTransfer && values.ubicacion_id === values.ubicacion_destino_id) {
      setError('El origen y el destino deben ser distintos.')
      return
    }

    try {
      await onSubmit({
        ...values,
        material_id: Number(values.material_id),
        cantidad: Number(values.cantidad),
        ubicacion_id: Number(values.ubicacion_id),
        ubicacion_destino_id: isTransfer ? Number(values.ubicacion_destino_id) : null,
        centro_costo_id: values.centro_costo_id ? Number(values.centro_costo_id) : null,
        usuario_id: Number(values.usuario_id),
        detalle_orden_compra_id: values.detalle_orden_compra_id ? Number(values.detalle_orden_compra_id) : null,
      })
    } catch (submitError) {
      setError(submitError.message)
    }
  }

  return (
    <form className="form" onSubmit={handleSubmit}>
      <div className="form-grid">
        {values.tipo_movimiento === 'entrada' && (
          <label className="form-field form-field--wide">
            <span>Orden de compra de origen</span>
            <select
              value={values.detalle_orden_compra_id}
              onChange={(event) => {
                const detail = orderDetails.find((item) => String(item.id) === event.target.value)
                const order = orders.find((item) => item.id === detail?.orden_compra_id)
                setValues({
                  ...values,
                  detalle_orden_compra_id: event.target.value,
                  material_id: detail ? String(detail.material_id) : values.material_id,
                  cantidad: detail ? String(detail.cantidad) : values.cantidad,
                  documento_origen: order ? purchaseOrderReference(order) : values.documento_origen,
                })
              }}
            >
              <option value="">Entrada sin OC asociada</option>
              {orderDetails.map((detail) => {
                const order = orders.find((item) => item.id === detail.orden_compra_id)
                const material = materials.find((item) => item.id === detail.material_id)
                if (!order) return null
                return <option key={detail.id} value={detail.id}>{purchaseOrderReference(order)} · {material?.nombre || 'Material'} · {detail.cantidad}</option>
              })}
            </select>
          </label>
        )}
        <label className="form-field form-field--wide">
          <span>Material *</span>
          <select required value={values.material_id} disabled={Boolean(selectedOrderDetail)} onChange={(event) => setValues({ ...values, material_id: event.target.value, detalle_orden_compra_id: '' })}>
            <option value="">Selecciona un material</option>
            {materials.map((material) => <option key={material.id} value={material.id}>{material.codigo_estandar} · {material.nombre}</option>)}
          </select>
        </label>
        <label className="form-field">
          <span>Tipo de movimiento *</span>
          <select value={values.tipo_movimiento} onChange={(event) => setValues({
            ...values,
            tipo_movimiento: event.target.value,
            detalle_orden_compra_id: '',
            documento_origen: values.tipo_movimiento === 'entrada' && values.detalle_orden_compra_id ? '' : values.documento_origen,
          })}>
            <option value="entrada">Entrada</option>
            <option value="salida">Salida</option>
            <option value="traslado">Traslado</option>
            <option value="ajuste">Ajuste de inventario</option>
          </select>
        </label>
        <label className="form-field">
          <span>Cantidad {values.tipo_movimiento === 'ajuste' && '(negativa o positiva)'} *</span>
          <input type="number" min={values.tipo_movimiento === 'ajuste' ? undefined : '0.01'} step="0.01" required value={values.cantidad} onChange={(event) => setValues({ ...values, cantidad: event.target.value })} />
        </label>
        <label className="form-field">
          <span>{isTransfer ? 'Ubicación de origen' : 'Ubicación'} *</span>
          <select required value={values.ubicacion_id} onChange={(event) => setValues({ ...values, ubicacion_id: event.target.value })}>
            <option value="">Selecciona una ubicación</option>
            {locations.map((location) => <option key={location.id} value={location.id}>{location.nombre}</option>)}
          </select>
        </label>
        {isTransfer && (
          <label className="form-field">
            <span>Ubicación de destino *</span>
            <select required value={values.ubicacion_destino_id} onChange={(event) => setValues({ ...values, ubicacion_destino_id: event.target.value })}>
              <option value="">Selecciona el destino</option>
              {locations.filter((location) => String(location.id) !== values.ubicacion_id).map((location) => <option key={location.id} value={location.id}>{location.nombre}</option>)}
            </select>
          </label>
        )}
        <label className="form-field">
          <span>Responsable *</span>
          <select required value={values.usuario_id} onChange={(event) => setValues({ ...values, usuario_id: event.target.value })}>
            {users.map((user) => <option key={user.id} value={user.id}>{user.nombre}</option>)}
          </select>
        </label>
        <label className="form-field form-field--wide">
          <span>Documento de origen</span>
          <input placeholder="OC-2026-014 o vale de salida" value={values.documento_origen} onChange={(event) => setValues({ ...values, documento_origen: event.target.value })} />
        </label>
      </div>
      <p className="form-hint">Cada operación queda asociada al responsable y al documento que la respalda.</p>
      {error && <p className="form-error" role="alert">{error}</p>}
      <div className="form-actions">
        <button type="button" className="button button--secondary" onClick={onCancel}>Cancelar</button>
        <button className="button button--primary" disabled={busy}>{busy ? 'Guardando…' : 'Registrar movimiento'}</button>
      </div>
    </form>
  )
}
