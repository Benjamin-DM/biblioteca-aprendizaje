import { useEffect } from 'react';
import { completados, porcentaje, proximaTarea } from '../lib/progreso';
import type { ResumenCurso } from '../lib/resumen';
import { useDoc } from '../lib/useDoc';
import Barra from './Barra';

/** Porcentaje del curso, próximo paso del roadmap y marca de completado en la lista de módulos. */
export default function ProgresoCurso({ curso }: { curso: ResumenCurso }) {
  const doc = useDoc();
  const hechos = completados(doc, curso.items);
  const pct = porcentaje(hechos, curso.items.length);
  const tarea = proximaTarea(doc, curso.tareas);

  useEffect(() => {
    for (const el of document.querySelectorAll<HTMLElement>('[data-estado-item]')) {
      el.textContent = doc.lecciones[el.dataset.estadoItem!]?.completada ? ' · ✓ Completada' : '';
    }
  }, [doc]);

  if (curso.items.length === 0) return null;
  return (
    <section className="mt-6 max-w-md rounded-lg border border-borde bg-superficie p-4" aria-labelledby="t-progreso" data-pagefind-ignore>
      <h2 id="t-progreso" className="text-sm font-semibold text-tenue">
        Tu progreso
      </h2>
      <p className="mt-1">
        <span className="text-2xl font-bold">{pct} %</span>{' '}
        <span className="text-sm text-tenue">
          {hechos} de {curso.items.length} lecciones y labs
        </span>
      </p>
      <Barra valor={pct} />
      {tarea && (
        <p className="mt-3 text-sm">
          <span className="font-semibold">Próximo paso, semana {tarea.semana}:</span> {tarea.texto}
        </p>
      )}
    </section>
  );
}
