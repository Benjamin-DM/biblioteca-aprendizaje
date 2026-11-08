import { useEffect, useRef, useState } from 'react';
import { actualizar, ahora, hash } from '../lib/almacen';
import { enlazarCasillas } from '../lib/casillas';
import { registrarSesion, segundosDelTick, TICK_MS } from '../lib/sesiones';
import { usarDoc } from '../lib/usarDoc';

type Props = { id: string; curso: string };

/** Marca de completado, notas, checklists y registro de la sesión de una lección o lab. */
export default function ProgresoLeccion({ id, curso }: Props) {
  const doc = usarDoc();
  const completada = Boolean(doc.lecciones[id]?.completada);
  const notaGuardada = doc.notas[id]?.texto ?? '';
  const [nota, setNota] = useState<string | null>(null);
  const [estadoNota, setEstadoNota] = useState('');
  const temporizador = useRef<ReturnType<typeof setTimeout>>(undefined);

  // Apertura, checklists y tiempo de estudio.
  useEffect(() => {
    try {
      actualizar((d) => {
        d.aperturas[id] = { actualizado: ahora() };
      });
    } catch {
      // El aviso global ya informó el error; la lección se puede leer igual.
    }
    const casillas = [...document.querySelectorAll<HTMLInputElement>('.prose input[type="checkbox"]')];
    const desenlazar = enlazarCasillas(casillas, 'checklists', (c) => `${id}#${hash(c.getAttribute('aria-label') ?? '')}`);

    const sesion = { id: crypto.randomUUID(), curso, leccion: id, fecha: ahora(), metodo: 'lectura', segundos: 0 };
    let ultimaActividad = Date.now();
    const marcarActividad = () => (ultimaActividad = Date.now());
    const eventos = ['pointerdown', 'keydown', 'scroll'] as const;
    for (const e of eventos) window.addEventListener(e, marcarActividad, { passive: true });
    const intervalo = setInterval(() => {
      const suma = segundosDelTick(document.visibilityState === 'visible', ultimaActividad, Date.now());
      if (suma === 0) return;
      sesion.segundos += suma;
      try {
        actualizar((d) => registrarSesion(d, sesion));
      } catch {
        // El aviso global ya informó el error; el tiempo sigue contándose en memoria.
      }
    }, TICK_MS);

    return () => {
      desenlazar();
      clearInterval(intervalo);
      for (const e of eventos) window.removeEventListener(e, marcarActividad);
    };
  }, [id, curso]);

  const alternar = () => {
    try {
      actualizar((d) => {
        d.lecciones[id] = { completada: !completada, actualizado: ahora() };
      });
    } catch {
      // El aviso global ya informó el error; el botón sigue mostrando lo guardado.
    }
  };

  const escribir = (texto: string) => {
    setNota(texto);
    setEstadoNota('Sin guardar…');
    clearTimeout(temporizador.current);
    temporizador.current = setTimeout(() => {
      try {
        actualizar((d) => {
          d.notas[id] = { texto, actualizado: ahora() };
        });
        setEstadoNota('Guardado');
      } catch (e) {
        setEstadoNota((e as Error).message);
      }
    }, 600);
  };

  return (
    <section className="mt-10 border-t border-borde pt-6" aria-label="Tu progreso" data-pagefind-ignore>
      <button
        type="button"
        aria-pressed={completada}
        onClick={alternar}
        className="min-h-11 rounded-md border-2 border-acento px-4 font-semibold aria-pressed:bg-acento aria-pressed:text-fondo"
      >
        {completada ? '✓ Completada' : 'Marcar como completada'}
      </button>
      <label htmlFor={`nota-${id}`} className="mt-6 block font-semibold">
        Tus notas
      </label>
      <textarea
        id={`nota-${id}`}
        rows={5}
        value={nota ?? notaGuardada}
        onChange={(e) => escribir(e.target.value)}
        aria-describedby={`estado-nota-${id}`}
        className="mt-2 w-full max-w-[72ch] rounded-md border border-borde bg-superficie p-3"
      />
      <p id={`estado-nota-${id}`} role="status" className="mt-1 min-h-5 text-sm text-tenue">
        {estadoNota}
      </p>
    </section>
  );
}
