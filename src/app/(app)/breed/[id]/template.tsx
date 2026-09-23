// Este template permite animacion al entrar en pagina de detalle
export default function BreedTemplate({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div className="motion-safe:animate-view-in">{children}</div>;
}
