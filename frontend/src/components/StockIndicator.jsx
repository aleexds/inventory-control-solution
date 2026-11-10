import { formatQuantity } from '../js/inventoryUtils'
import StatusBadge from './StatusBadge'

export default function StockIndicator({ material, stock, compact = false }) {
  const point = Number(material.demanda_promedio_diaria || 0) * Number(material.tiempo_entrega || 0)
    + Number(material.stock_seguridad || 0)
  const maximum = Number(material.stock_maximo || 0)
  const percentage = maximum > 0 ? Math.min((stock / maximum) * 100, 100) : 0
  const tone = stock <= point ? 'critical' : stock <= Number(material.stock_minimo || 0) * 1.25 ? 'warning' : 'success'

  if (compact) return <StatusBadge tone={tone} />

  return (
    <div className="stock-indicator">
      <div className="stock-indicator-head">
        <strong>{formatQuantity(stock)}</strong>
        <StatusBadge tone={tone} />
      </div>
      <div className="stock-track"><span className={`stock-track-fill stock-track-fill--${tone}`} style={{ width: `${percentage}%` }} /></div>
    </div>
  )
}
