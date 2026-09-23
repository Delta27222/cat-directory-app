# cat-directory-app

Directorio de razas de gatos con datos de [catfact.ninja](https://catfact.ninja).
Next.js 15 (App Router, SSR `standalone`) + React 19 + TypeScript estricto.

- **Listado** (`/`): tabla virtualizada con scroll infinito, búsqueda y filtros
  por origen y pelaje. La primera página llega renderizada desde el servidor.
- **Detalle** (`/breed/[id]`): país, origen, pelaje y patrón de la raza, más un
  dato curioso que se puede renovar.
- Tema claro/oscuro, manejo de errores de red con reintentos y avisos.

## Arranque

```bash
npm install
npm run dev                  # http://localhost:3000
```

La API es pública: no hace falta `.env`. Para apuntar a otra base, copiar
`.env.example` a `.env.local` y cambiar `NEXT_PUBLIC_CAT_API_URL`.

## Scripts

| Script              | Qué hace                         |
| ------------------- | -------------------------------- |
| `npm run dev`       | Servidor de desarrollo           |
| `npm run build`     | Build de producción (standalone) |
| `npm start`         | Sirve el build                   |
| `npm test`          | Jest + Testing Library (pendiente: aún no hay pruebas) |
| `npm run typecheck` | `tsc --noEmit`                   |
| `npm run lint`      | Biome                            |
| `npm run format`    | Biome formatter                  |

## Stack

| Área               | Herramienta                                    |
| ------------------ | ---------------------------------------------- |
| Framework          | Next.js 15 (App Router) + React 19             |
| Estado de servidor | TanStack React Query 5                         |
| Estado de UI       | Zustand 5 (filtros)                            |
| Virtualización     | TanStack React Virtual 3                       |
| Validación         | Zod 4 (respuestas de la API)                   |
| Estilos            | Tailwind CSS 4 + tokens de tema (shadcn)       |
| Avisos             | react-hot-toast                                |
| Tema               | next-themes                                    |
| Calidad            | TypeScript estricto + Biome                    |

## Cómo resuelve cada requisito

### Renderizado inicial en el servidor

`BreedsPage` es un Server Component: pide la **página 1** a la API y el HTML
llega con las filas ya dibujadas, sin pantalla vacía ni skeleton. Los filtros
de la URL (`?origin=Mutation&coat=Short&search=…`) también se leen en el
servidor, así el HTML ya viene filtrado.

Las respuestas de la API quedan 1 hora en la caché de datos de Next
(`revalidate`), para no llamar a la API en cada visita (tiene límite de
peticiones).

### Infinite scroll

`useBreedsInfinite` (`useInfiniteQuery`) arranca con la página del servidor
como `initialData` y pide las siguientes solo desde el cliente. Cuando la
última fila visible está cerca del final de la lista, se pide la página
siguiente. Si un filtro deja pocas filas, se siguen trayendo páginas para
buscar coincidencias, y el pie de la tabla muestra el progreso ("Buscando
coincidencias… 40 de 98 razas revisadas").

### Virtualización

`BreedsTable` usa `@tanstack/react-virtual`: solo existen en el DOM las filas
visibles más un margen (~15), sin importar cuántas haya cargadas. Las filas
miden su alto real (por si un nombre ocupa dos líneas en mobile) y un
`initialRect` hace que el virtualizador también dibuje filas en el servidor.

La tabla es un grid de `div` con roles ARIA (`table`, `rowgroup`, `row`,
`cell`), porque un `<tr>` posicionado en absoluto pierde el ancho de las
columnas. Toda la fila es clickeable: el enlace va en la celda del nombre y se
estira sobre la fila con `::after`.

### Gestión de estado

- **React Query** para el estado de servidor: listado paginado, detalle y dato
  curioso.
- **Zustand** para el estado de UI: los filtros. El store se crea **por
  request** dentro de un Provider (`BreedFiltersContext`), con los filtros que
  el servidor leyó de la URL. Un store global de módulo se compartiría entre
  todas las visitas en el servidor. Cada acción (`setFilter`, `clear`) también
  actualiza la URL con `replaceState`, así los filtros sobreviven a una recarga
  y se pueden compartir.
- El buscador espera 300 ms sin escribir antes de filtrar
  (`useDebouncedCallback`).

### Detalle desde la caché

`useBreedDetail` busca la raza primero en las páginas que ya cargó la lista.
Si se llega desde ahí, aparece al instante y sin ninguna petición. Si se entra
por link directo o se recarga, la pide a la API (`getBreedById`). Como la API
no tiene `GET /breeds/:id`, se piden todas las razas (~98, una sola llamada) y
se busca por `id`.

La página de detalle no muestra nada a medias: espera la raza y el dato
curioso, y los muestra juntos.

### Manejo de errores y red

- **Reintentos con backoff exponencial:** hasta 3 reintentos (1 s, 2 s, 4 s…,
  con tope de 10 s), solo para errores pasajeros: sin red, `429` y `5xx`. Un
  `404` no se reintenta. `httpClient` lanza un `ApiError` con el `status` para
  poder distinguirlos.
- **Toasts:** si un error persiste después de los reintentos y ya había datos
  en pantalla (cargar más, recargar, "Otro dato"), se avisa con un toast y se
  siguen mostrando los datos anteriores. Si no había datos, la vista muestra
  su propio estado de error (`ErrorState`, `error.tsx`).
- **Sin conexión:** toast persistente "Sin conexión" mientras no hay red y
  "Conexión restablecida" al volver. React Query pausa las peticiones sin red
  y las retoma solas.
- Si falla el dato curioso, la página del detalle se muestra igual.

### Accesibilidad

- Roles ARIA de tabla válidos y `aria-rowcount` con el total real (aunque en
  el DOM haya menos filas).
- Atajo `/` para enfocar el buscador y `Esc` para limpiarlo.
- `aria-live` en los estados de carga y en el dato curioso.
- Las animaciones respetan `prefers-reduced-motion`.

### Tema y animaciones

- Claro/oscuro con `next-themes`. Todos los componentes usan los tokens del
  tema (`bg-card`, `text-foreground`, …), nunca colores fijos.
- Al cambiar de tema, el nuevo se revela en un círculo que crece desde el
  botón (View Transitions API). En navegadores sin soporte cambia al instante.
- El detalle entra con un fundido y una leve subida (`template.tsx`).

## Estructura

```
src/
├── app/                      # Rutas (App Router)
│   └── (app)/
│       ├── page.tsx          # Listado (/)
│       ├── error.tsx         # Límite de error con "Reintentar"
│       └── breed/[id]/       # Detalle (page, layout, template con animación)
├── core/                     # Sin React: API y modelos
│   ├── api/                  # httpClient (único fetch) + endpoints de razas
│   └── models/breeds/        # Esquemas Zod, modelo y mapper DTO → Breed
├── features/
│   ├── breeds/
│   │   ├── domain/           # Filtros puros (filtrar, opciones, parsear URL)
│   │   ├── application/      # queries (React Query), store (Zustand), hooks
│   │   └── ui/               # pages, widgets y componentes de la feature
│   └── shell/                # Topbar y cambio de tema
├── shared/                   # Reutilizable entre features (UI, hooks, utils)
├── ui/components/            # Primitivas de UI: button, card, input, skeleton
├── context/                  # Providers: React Query, tema, toasts
└── lib/                      # QueryClient (reintentos, toasts), utilidades
```

Las respuestas de la API se validan con Zod y se convierten a un modelo propio
(`Breed`): con un `id` estable para la URL (slug del nombre, la API no trae
uno) y `null` en vez de `""` para los datos que faltan.

## Diseño

El diseño visual de la app (paleta de colores, tipografías, componentes y
pantallas) se hizo con **Claude Design** y después se implementó en este
proyecto como tokens de tema (`src/styles/`) y componentes.

## Limitaciones conocidas

- **La API filtra poco:** no permite filtrar por origen ni pelaje, así que los
  filtros se aplican sobre las razas ya cargadas y se van pidiendo páginas
  para encontrar coincidencias.
- **Límite de peticiones:** catfact.ninja responde `429` si se le pide mucho
  seguido. La caché de Next y los reintentos con backoff lo mitigan.
- **Pruebas unitarias:** pendientes (Jest y Testing Library ya están
  instalados).
