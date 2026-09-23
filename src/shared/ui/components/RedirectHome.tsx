'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '@/ui/components/button';

/**
 * Botón para volver al inicio y cuenta regresiva que redirige sola, así nadie
 * queda atascado en una página que no existe.
 */
export function RedirectHome({ seconds = 5 }: { seconds?: number }) {
  const router = useRouter();
  const [left, setLeft] = useState(seconds);

  useEffect(() => {
    if (left <= 0) {
      router.replace('/');
      return;
    }
    const timeout = setTimeout(() => setLeft((value) => value - 1), 1000);
    return () => clearTimeout(timeout);
  }, [left, router]);

  return (
    <div className="flex flex-col items-center gap-3">
      <Button asChild>
        <Link href="/">Volver al inicio</Link>
      </Button>
      <p aria-live="polite" className="text-muted-foreground text-sm">
        Te llevamos al inicio en {left} s…
      </p>
    </div>
  );
}
