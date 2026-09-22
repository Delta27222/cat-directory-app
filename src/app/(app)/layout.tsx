import { AppShell } from '@/features/shell/ui/layouts/AppShell';

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <AppShell>{children}</AppShell>;
}
