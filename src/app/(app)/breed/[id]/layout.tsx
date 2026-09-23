import { PageShell } from "@/shared/ui/components";

export default function BreedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <PageShell>{children}</PageShell>;
}
