import { useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import {
  ArrowDownUp,
  Bell,
  Building2,
  Boxes,
  ClipboardList,
  FileClock,
  LayoutDashboard,
  Menu,
  PackageSearch,
  PanelLeftClose,
  Search,
  Warehouse,
  X,
} from 'lucide-react'
import { useInventory } from '../js/InventoryState'
import { calculateStock, reorderPoint } from '../js/inventoryUtils'

const navigation = [
  { label: 'Resumen', to: '/', icon: LayoutDashboard, end: true },
  { label: 'Inventario', to: '/materiales', icon: Boxes },
  { label: 'Obras y proveedores', to: '/catalogos', icon: Building2 },
  { label: 'Movimientos', to: '/movimientos', icon: ArrowDownUp },
  { label: 'Órdenes de compra', to: '/ordenes', icon: ClipboardList },
  { label: 'Trazabilidad', to: '/trazabilidad', icon: FileClock },
  { label: 'Alertas', to: '/alertas', icon: Bell, alert: true },
]

const titles = Object.fromEntries(navigation.map(({ to, label }) => [to, label]))

function Sidebar({ open, onClose }) {
  const { data } = useInventory()
  const reorderCount = data?.materiales.filter((material) => (
    calculateStock(material.id, data.movimientos) <= reorderPoint(material)
  )).length ?? 0

  return (
    <>
      {open && <button className="sidebar-scrim" onClick={onClose} aria-label="Cerrar menú" />}
      <aside className={`sidebar ${open ? 'sidebar--open' : ''}`}>
        <div className="brand">
          <div className="brand-mark"><Warehouse size={21} strokeWidth={2.2} /></div>
          <div className="brand-copy">
            <strong>DEL VALLE</strong>
            <span>CONTROL DE OBRA</span>
          </div>
          <button className="icon-button sidebar-close" onClick={onClose} aria-label="Cerrar menú">
            <X size={18} />
          </button>
        </div>

        <div className="workspace-label">GESTIÓN</div>
        <nav className="side-nav" aria-label="Navegación principal">
          {navigation.map(({ label, to, icon: Icon, end, alert }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={onClose}
              className={({ isActive }) => `nav-link ${isActive ? 'nav-link--active' : ''}`}
            >
              <Icon size={18} strokeWidth={1.8} />
              <span>{label}</span>
              {alert && reorderCount > 0 && <span className="nav-count">{reorderCount}</span>}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="sidebar-note">
            <span className="sidebar-note-icon"><PackageSearch size={16} /></span>
            <div>
              <strong>Inventario al día</strong>
              <span>Control por bodega y obra</span>
            </div>
          </div>
          <div className="sidebar-user">
            <div className="avatar">MF</div>
            <div className="sidebar-user-copy">
              <strong>María Fernández</strong>
              <span>Administración</span>
            </div>
            <PanelLeftClose size={16} className="sidebar-user-more" />
          </div>
        </div>
      </aside>
    </>
  )
}

function Topbar({ onMenu }) {
  const location = useLocation()
  const title = titles[location.pathname] || 'Control de inventario'
  const today = new Intl.DateTimeFormat('es-CR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(new Date())

  return (
    <header className="topbar">
      <div className="topbar-leading">
        <button className="icon-button menu-button" onClick={onMenu} aria-label="Abrir menú">
          <Menu size={21} />
        </button>
        <div className="breadcrumbs">
          <span>Del Valle</span><span className="breadcrumb-separator">/</span><strong>{title}</strong>
        </div>
      </div>
      <div className="topbar-actions">
        <span className="topbar-date">{today}</span>
        <Link className="topbar-search" to="/materiales" aria-label="Buscar materiales">
          <Search size={17} /><span>Buscar</span><kbd>⌘ K</kbd>
        </Link>
        <span className="topbar-divider" />
        <div className="topbar-profile">
          <div className="avatar avatar--small">MF</div>
          <span>María Fernández</span>
        </div>
      </div>
    </header>
  )
}

export default function AppShell() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { demoMode } = useInventory()

  return (
    <div className="app-shell">
      <Sidebar open={menuOpen} onClose={() => setMenuOpen(false)} />
      <div className="main-column">
        <Topbar onMenu={() => setMenuOpen(true)} />
        {demoMode && (
          <div className="demo-banner">
            <span className="demo-dot" />
            Vista de demostración · Los cambios se guardan en este navegador
          </div>
        )}
        <main className="page-content"><Outlet /></main>
        <footer className="app-footer">
          <span>Constructora Del Valle S.A.</span>
          <span>Control de inventario y trazabilidad</span>
        </footer>
      </div>
    </div>
  )
}
