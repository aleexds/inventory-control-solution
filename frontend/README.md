# Frontend — Control de Inventario

Interfaz de Constructora Del Valle para revisar existencias por material, gestionar movimientos, dar seguimiento a órdenes y consultar trazabilidad.

## Requisitos

- Node.js 20.19+ o 22.12+
- El backend Express del proyecto, disponible en `http://localhost:3000`

## Desarrollo

```bash
npm install
npm run dev
```

Vite reenvía las solicitudes `/api` al backend en el puerto 3000. Para usar otra URL, define `VITE_API_URL` en un archivo `.env.local`.

## Datos de demostración

Para activar el catálogo y las operaciones de ejemplo, copia `.env.example` a `.env.local` y define:

```env
VITE_DEMO_MODE=true
```

El modo de demostración no modifica la base de datos. Guarda los cambios en el almacenamiento local del navegador.

## Verificaciones y compilación

```bash
npm run lint
npm run build
npm run preview
```
