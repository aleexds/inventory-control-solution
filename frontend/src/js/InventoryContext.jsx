import { useCallback, useEffect, useMemo, useState } from 'react'
import { isDemoMode, request } from './demoStore'
import { InventoryContext } from './InventoryState'

const resources = [
  ['materiales', 'materiales'],
  ['movimientos', 'movimientos'],
  ['ordenes_compra', 'ordenes-compra'],
  ['detalle_orden_compra', 'detalle-orden-compra'],
  ['proveedores', 'proveedores'],
  ['ubicaciones', 'ubicaciones'],
  ['usuarios', 'usuarios'],
  ['lotes', 'lotes'],
  ['centros_de_costo', 'centros-de-costo'],
  ['alertas', 'alertas'],
]

async function loadResources() {
  const entries = await Promise.all(resources.map(async ([key, endpoint]) => {
    const records = []
    let page = 1
    let totalPages = 1
    do {
      const response = await request(endpoint, { limit: 100, page })
      records.push(...response.data)
      totalPages = response.pagination?.totalPages || 1
      page += 1
    } while (page <= totalPages)

    return [key, records.map((record) => ({
      ...record,
      created_at: record.created_at || record.createdAt,
      updated_at: record.updated_at || record.updatedAt,
    }))]
  }))
  return Object.fromEntries(entries)
}

export function InventoryProvider({ children }) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const refresh = useCallback(async (showLoading = false) => {
    if (showLoading) setLoading(true)
    setError('')
    try {
      setData(await loadResources())
    } catch (loadError) {
      setError(loadError.message || 'No se pudieron cargar los datos del inventario.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    let active = true
    loadResources()
      .then((result) => {
        if (active) setData(result)
      })
      .catch((loadError) => {
        if (active) setError(loadError.message || 'No se pudieron cargar los datos del inventario.')
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [])

  const mutate = useCallback(async (endpoint, method, body) => {
    const result = await request(endpoint, { method, body })
    await refresh()
    return result
  }, [refresh])

  const value = useMemo(() => ({
    data,
    loading,
    error,
    refresh,
    create: (endpoint, body) => mutate(endpoint, 'POST', body),
    update: (endpoint, id, body) => mutate(`${endpoint}/${id}`, 'PATCH', body),
    remove: (endpoint, id) => mutate(`${endpoint}/${id}`, 'DELETE'),
    demoMode: isDemoMode,
  }), [data, loading, error, refresh, mutate])

  return <InventoryContext.Provider value={value}>{children}</InventoryContext.Provider>
}
