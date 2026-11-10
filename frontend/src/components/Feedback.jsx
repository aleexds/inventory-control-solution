import { LoaderCircle, PackageOpen, RefreshCw, TriangleAlert } from 'lucide-react'

export function LoadingState({ label = 'Cargando información…' }) {
  return (
    <div className="loading-state">
      <LoaderCircle size={22} className="spin" />
      <span>{label}</span>
    </div>
  )
}

export function ErrorState({ message, onRetry }) {
  return (
    <div className="feedback-card feedback-card--error">
      <span className="feedback-icon"><TriangleAlert size={20} /></span>
      <div><strong>No se pudo cargar la información</strong><p>{message}</p></div>
      {onRetry && <button className="button button--secondary button--small" onClick={onRetry}><RefreshCw size={15} /> Reintentar</button>}
    </div>
  )
}

export function EmptyState({ title = 'Sin registros todavía', description, action }) {
  return (
    <div className="empty-state">
      <span className="empty-icon"><PackageOpen size={22} /></span>
      <strong>{title}</strong>
      {description && <p>{description}</p>}
      {action}
    </div>
  )
}
