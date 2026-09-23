'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import type React from 'react';
import { flushSync } from 'react-dom';
import { Button } from '@/ui/components/button';
import { toast } from 'react-hot-toast';


/** Duración del círculo que revela el tema nuevo. */
const REVEAL_DURATION_MS = 500;

/**
 * Alterna claro/oscuro. Los dos íconos se renderizan siempre y el CSS decide
 * cuál se ve, así el HTML del servidor coincide con el del cliente.
 */
export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();

  const toggleTheme = (event: React.MouseEvent<HTMLButtonElement>) => {
    toast.success('Gracias claude por la animación 😼');
    const next = resolvedTheme === 'dark' ? 'light' : 'dark';
    const applyTheme = () => {
      document.documentElement.classList.toggle('dark', next === 'dark');
      flushSync(() => setTheme(next));
    };

    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    if (!document.startViewTransition || reduceMotion) {
      applyTheme();
      return;
    }

    // El círculo nace en el centro del botón y crece hasta la esquina más lejana.
    const { left, top, width, height } =
      event.currentTarget.getBoundingClientRect();
    const x = left + width / 2;
    const y = top + height / 2;
    const radius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );

    const transition = document.startViewTransition(applyTheme);
    transition.ready.then(() => {
      document.documentElement.animate(
        {
          clipPath: [
            `circle(0px at ${x}px ${y}px)`,
            `circle(${radius}px at ${x}px ${y}px)`,
          ],
        },
        {
          duration: REVEAL_DURATION_MS,
          easing: 'ease-in-out',
          pseudoElement: '::view-transition-new(root)',
        }
      );
    });
  };

  return (
    <Button
      aria-label="Cambiar tema"
      onClick={toggleTheme}
      size="icon"
      variant="ghost"
    >
      <Sun aria-hidden="true" className="dark:hidden" />
      <Moon aria-hidden="true" className="hidden dark:block" />
    </Button>
  );
}
