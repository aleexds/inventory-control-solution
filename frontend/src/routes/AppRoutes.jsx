import { BrowserRouter, Route, Routes } from 'react-router-dom'
import AppShell from '../components/AppShell'
import AlertsPage from '../pages/AlertsPage'
import DashboardPage from '../pages/DashboardPage'
import MasterDataPage from '../pages/MasterDataPage'
import MaterialsPage from '../pages/MaterialsPage'
import MovementsPage from '../pages/MovementsPage'
import OrdersPage from '../pages/OrdersPage'
import TraceabilityPage from '../pages/TraceabilityPage'
import NotFoundPage from '../pages/NotFoundPage'

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppShell />}>
          <Route index element={<DashboardPage />} />
          <Route path="materiales" element={<MaterialsPage />} />
          <Route path="catalogos" element={<MasterDataPage />} />
          <Route path="movimientos" element={<MovementsPage />} />
          <Route path="ordenes" element={<OrdersPage />} />
          <Route path="trazabilidad" element={<TraceabilityPage />} />
          <Route path="alertas" element={<AlertsPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
