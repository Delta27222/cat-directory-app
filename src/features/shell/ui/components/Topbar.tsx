import { Cat } from 'lucide-react';
import Link from 'next/link';
import { ThemeToggle } from './ThemeToggle';

export function Topbar() {
  return (
    <header className="sticky top-0 z-10 border-b bg-card/80 backdrop-blur">
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link className="flex items-center gap-2 font-extrabold" href="/">
          <span className="bg-brand flex size-8 items-center justify-center rounded-lg text-primary-foreground">
            <Cat aria-hidden="true" className="size-5 " />
          </span>
          Cat Directory
        </Link>
        <ThemeToggle />
      </div>
    </header>
  );
}
