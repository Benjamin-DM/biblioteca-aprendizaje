/** Barra de progreso decorativa: el porcentaje siempre va también como texto. */
export default function Barra({ valor }: { valor: number }) {
  return (
    <div className="mt-1 h-2 rounded bg-acento-suave" aria-hidden="true">
      <div className="h-2 rounded bg-acento" style={{ width: `${valor}%` }} />
    </div>
  );
}
