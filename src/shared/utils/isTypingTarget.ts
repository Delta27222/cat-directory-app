/**
 * Indica si el evento viene de un campo donde se está escribiendo. Sirve para
 * que los atajos de teclado (p. ej. `/`) no se disparen mientras se tipea.
 */
export function isTypingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  return (
    target.isContentEditable ||
    ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)
  );
}
