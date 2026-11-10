import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

export default function NotFoundPage() {
  return (
    <section className="not-found">
      <span className="eyebrow">404 · PÁGINA NO ENCONTRADA</span>
      <h1>Esta ubicación no existe</h1>
      <p>Vuelve al resumen para continuar con la gestión del inventario.</p>
      <Link to="/" className="button button--primary"><ArrowLeft size={16} /> Volver al resumen</Link>
    </section>
  )
}
