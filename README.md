# Eventos 360 — Proyecto Full-Stack MEAN + Angular + React

## Descripción del proyecto
La plataforma **Eventos 360** centraliza la gestión de eventos culturales, educativos y deportivos en una sola API, permitiendo administrar la información desde dos clientes web distintos (Angular y React).

## Problema que resuelve
Los equipos de producción necesitan registrar, filtrar y actualizar eventos con rapidez. Este proyecto entrega un panel unificado para administrar eventos y consultarlos desde diferentes interfaces.

## Descripción funcional
- CRUD completo de eventos desde Angular y React.
- Listado con paginación y filtros por categoría/búsqueda.
- Visualización de detalle por ID.
- Formularios con validaciones y feedback de carga/errores.

## Entidad principal
### Evento
| Campo | Tipo | Reglas |
| --- | --- | --- |
| _id | ObjectId | Generado por MongoDB |
| titulo | string | requerido, mín. 3 caracteres |
| descripcion | string | requerido, mín. 10 caracteres |
| categoria | string | requerido |
| ubicacion | string | requerido |
| precio | number | rango 0-10000 |
| fecha | date | no puede ser anterior a hoy |
| esPublico | boolean | true/false |
| createdAt | date | automático |
| updatedAt | date | automático |

## Reglas de negocio (obligatorias)
1. No se permiten eventos duplicados con el mismo **título + fecha**.
2. El precio debe estar entre **0 y 10000**.
3. La fecha no puede ser anterior al día actual.
4. La descripción debe ser más larga que el título.

## Diagrama de colecciones (texto)
```
Event {
  _id: ObjectId
  titulo: String
  descripcion: String
  categoria: String
  ubicacion: String
  precio: Number
  fecha: Date
  esPublico: Boolean
  createdAt: Date
  updatedAt: Date
}
```

## Diagrama de colecciones (imagen)
![Diagrama de colecciones](docs/diagrama-colecciones.png)

## Endpoints de la API
Base URL: `https://TU_BACKEND.vercel.app`

| Método | Ruta | Descripción |
| --- | --- | --- |
| GET | `/api/v1/documentacion` | Documentación básica |
| GET | `/api/v1/eventos/get/all` | Listado con paginación + filtros (`page`, `limit`, `categoria`, `q`) |
| GET | `/api/v1/eventos/get/:id` | Obtener por ID |
| POST | `/api/v1/eventos/post` | Crear evento |
| PUT/PATCH | `/api/v1/eventos/update/:id` | Actualizar evento |
| DELETE | `/api/v1/eventos/delete/:id` | Eliminar evento |

## Estructura del proyecto
```
/project-root
  /backend
  /frontend-angular
  /frontend-react
```

## Configuración rápida
### Backend
1. Copia `.env.example` a `.env` y configura `MONGO_URI`.
2. Instala dependencias y arranca el servidor.
3. Pobla la base con 20 eventos reales/simulados.

### Frontend Angular
- Consume la API desde `frontend-angular/src/app/services/events.service.ts`.

### Frontend React
- Consume la API desde `frontend-react/src/api/eventsApi.js`.

## Scripts útiles
### Backend
- `npm run dev` → desarrollo
- `npm run start` → producción
- `npm run seed` → poblar base de datos
- `npm test` → pruebas de reglas de negocio

### Frontend Angular
- `npm run start` → desarrollo
- `npm run build` → producción

### Frontend React
- `npm run dev` → desarrollo
- `npm run build` → producción

## Despliegue en Vercel
- **Backend**: carpeta `backend/` (Vercel detecta `vercel.json`).
- **Frontend Angular**: carpeta `frontend-angular/`.
- **Frontend React**: carpeta `frontend-react/`.

Actualizar las URLs de la API en cada frontend luego del despliegue.

## URLs de despliegue (completar)
- API: `https://TU_BACKEND.vercel.app`
- Angular: `https://TU_FRONTEND_ANGULAR.vercel.app`
- React: `https://TU_FRONTEND_REACT.vercel.app`

## Capturas de pantalla
| Vista | Angular | React |
| --- | --- | --- |
| Listado | `docs/capturas/angular-listado.png` | `docs/capturas/react-listado.png` |
| Formulario | `docs/capturas/angular-formulario.png` | `docs/capturas/react-formulario.png` |
| Detalle | `docs/capturas/angular-detalle.png` | `docs/capturas/react-detalle.png` |

## Checklist de entrega
- [ ] Sustituir URLs de despliegue reales.
- [ ] Añadir capturas en `docs/capturas/`.
- [ ] Añadir imagen del diagrama en `docs/diagrama-colecciones.png`.
