import { ArrowDownRight, ArrowUpRight } from 'lucide-react'

export default function MetricCard({ label, value, note, icon: Icon, tone = 'clay', trend }) {
  return (
    <article className="metric-card">
      <div className={`metric-icon metric-icon--${tone}`}><Icon size={19} strokeWidth={1.8} /></div>
      <span className="metric-label">{label}</span>
      <div className="metric-value-row">
        <strong className="metric-value">{value}</strong>
        {trend && (
          <span className={`metric-trend ${trend.direction === 'down' ? 'metric-trend--down' : ''}`}>
            {trend.direction === 'down' ? <ArrowDownRight size={14} /> : <ArrowUpRight size={14} />}
            {trend.label}
          </span>
        )}
      </div>
      <span className="metric-note">{note}</span>
    </article>
  )
}
