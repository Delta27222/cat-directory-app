import { AppShell } from '@/features/shell/ui/layouts/AppShell';
import { PageShell, RedirectHome } from '@/shared/ui/components';

/** Gato confundido hecho con símbolos. */
const LOST_CAT = String.raw`
   /\_/\     ?
  ( o.O )  ?
   > ^ <
  /|   |\
 (_|   |_)
`;

/**
 * Página para cualquier ruta que no existe (404). Vive fuera del grupo
 * `(app)`, así que se envuelve en `AppShell` para mantener la barra superior.
 */
export default function NotFound() {
  return (
    <AppShell>
      <PageShell>
        <section className="motion-safe:animate-view-in flex flex-col items-center gap-6 py-12 text-center">
          <pre
            aria-hidden="true"
            className="font-mono text-brand text-lg leading-tight sm:text-xl"
          >
            {LOST_CAT}
          </pre>
          <div className="space-y-2">
            <p className="font-mono text-muted-foreground text-sm">404</p>
            <h1 className="font-display text-display-sm sm:text-display-md">
              Ruta no encontrada
            </h1>
            <p className="text-muted-foreground text-sm">
              Este gato buscó por todos lados, pero la página que querés no
              existe.
            </p>
          </div>
          <RedirectHome />
        </section>
      </PageShell>
    </AppShell>
  );
}
