const statuses = {
  critical: 'Reponer',
  warning: 'Stock bajo',
  success: 'En nivel',
  pendiente: 'Pendiente',
  aprobada: 'Aprobada',
  rechazada: 'Rechazada',
  recibida: 'Recibida',
  cancelada: 'Cancelada',
  entrada: 'Entrada',
  salida: 'Salida',
  traslado: 'Traslado',
  ajuste: 'Ajuste',
  activa: 'Activa',
  atendida: 'Atendida',
}

export default function StatusBadge({ tone, children }) {
  const label = children || statuses[tone] || tone
  const resolvedTone = tone || 'neutral'
  return <span className={`status-badge status-badge--${resolvedTone}`}>{label}</span>
}
