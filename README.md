# cat-directory-app

Directorio de razas de gatos. Next.js 15 (App Router, SSR `standalone`) +
React 19 + TypeScript estricto, con datos de [catfact.ninja](https://catfact.ninja).

## Arranque

```bash
npm install
npm run dev                  # http://localhost:3000
```

La API es pública: no hace falta `.env`. Para apuntar a otra base, copiar
`.env.example` a `.env.local`.

## Scripts

| Script              | Qué hace                         |
| ------------------- | -------------------------------- |
| `npm run dev`       | Servidor de desarrollo           |
| `npm run build`     | Build de producción (standalone) |
| `npm start`         | Sirve el build                   |
| `npm test`          | Jest + Testing Library + MSW     |
| `npm run typecheck` | `tsc --noEmit`                   |
| `npm run lint`      | Biome                            |
| `npm run format`    | Biome formatter                  |

