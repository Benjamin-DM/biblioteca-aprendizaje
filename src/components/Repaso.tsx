import { useEffect, useState } from 'react';
import type { Grade } from 'ts-fsrs';
import { actualizar } from '../lib/almacen';
import { calificar, cola, describirIntervalo, NOTAS, previsiones, proximoVencimiento, type EstadoTarjeta, type Tarjeta } from '../lib/repaso';
import { usarDoc } from '../lib/usarDoc';
import ConCodigo from './ConCodigo';

type Props = { tarjetas: Tarjeta[]; cursos: { slug: string; titulo: string }[] };

const ORIGEN = { quiz: 'Pregunta de quiz', dato: 'Dato para memorizar', error: 'Tu log de errores' };

export default function Repaso({ tarjetas, cursos }: Props) {
  const doc = usarDoc();
  const [curso, setCurso] = useState('');
  const [revelada, setRevelada] = useState(false);
  const [aviso, setAviso] = useState('');
  const ahora = new Date();

  const deErrores: Tarjeta[] = doc.errores
    .filter((e) => !e.descartado)
    .map((e) => ({ id: `${e.lab}#error-${e.id}`, curso: e.curso, frente: e.descripcion, reverso: e.correccion, origen: 'error' }));
  // Tus errores van primero entre las nuevas: son lo que más vale repasar.
  const todas = [...deErrores, ...tarjetas].filter((t) => !curso || t.curso === curso);
  const estados = doc.tarjetas as unknown as Record<string, EstadoTarjeta | undefined>;
  const pendientes = cola(todas, estados, ahora);
  const actual = pendientes[0];

  const responder = (nota: Grade) => {
    if (!actual) return;
    try {
      actualizar((d) => {
        d.tarjetas[actual.id] = calificar(estados[actual.id], nota, new Date());
      });
      setRevelada(false);
      setAviso('');
    } catch (e) {
      setAviso((e as Error).message);
    }
  };

  useEffect(() => {
    const teclas = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLSelectElement || e.target instanceof HTMLTextAreaElement) return;
      if (!revelada && (e.key === ' ' || e.key === 'Enter') && actual) {
        e.preventDefault();
        setRevelada(true);
      }
      const n = NOTAS.find((x) => x.tecla === e.key);
      if (revelada && n) responder(n.nota);
    };
    window.addEventListener('keydown', teclas);
    return () => window.removeEventListener('keydown', teclas);
  });

  const proxima = proximoVencimiento(todas, estados);
  const prev = actual && revelada ? previsiones(estados[actual.id], ahora) : undefined;

  return (
    <div className="max-w-2xl">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <label className="flex flex-col gap-1 font-semibold">
          Curso
          <select value={curso} onChange={(e) => setCurso(e.target.value)} className="min-h-11 rounded-md border border-borde bg-superficie px-2 font-normal">
            <option value="">Todos</option>
            {cursos.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.titulo}
              </option>
            ))}
          </select>
        </label>
        <p className="text-sm text-tenue" role="status">
          {pendientes.length} {pendientes.length === 1 ? 'tarjeta' : 'tarjetas'} para hoy
        </p>
      </div>
      {aviso && <p className="mt-3 font-semibold">{aviso}</p>}

      {!actual ? (
        <div className="mt-8 rounded-lg border border-borde bg-superficie p-6">
          <p className="text-lg font-semibold">No hay tarjetas para hoy.</p>
          {proxima && <p className="mt-1 text-tenue">La próxima vence el {proxima.toLocaleString('es', { dateStyle: 'medium', timeStyle: 'short' })}.</p>}
        </div>
      ) : (
        <section className="mt-8 rounded-lg border border-borde bg-superficie p-6" aria-labelledby="frente">
          <p className="text-sm text-tenue">
            {ORIGEN[actual.origen]}
            {!estados[actual.id] && ' · nueva'}
          </p>
          <h2 id="frente" className="mt-2 text-xl font-semibold">
            <ConCodigo texto={actual.frente} />
          </h2>
          {revelada ? (
            <>
              <p className="mt-4 border-t border-borde pt-4 text-lg">
                <ConCodigo texto={actual.reverso} />
              </p>
              <p className="mt-6 text-sm text-tenue">¿Qué tan bien lo recordaste? Teclas 1 a 4.</p>
              <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
                {NOTAS.map((n) => (
                  <button key={n.nota} type="button" onClick={() => responder(n.nota)} className="min-h-11 rounded-md border-2 border-acento px-2 font-semibold">
                    {n.texto}
                    {prev && <span className="block text-xs font-normal">{describirIntervalo(ahora, prev[n.nota])}</span>}
                  </button>
                ))}
              </div>
            </>
          ) : (
            <button type="button" onClick={() => setRevelada(true)} className="mt-6 min-h-11 rounded-md border-2 border-acento px-4 font-semibold">
              Mostrar respuesta <span className="font-normal">(Espacio)</span>
            </button>
          )}
        </section>
      )}
      <p className="mt-4 text-sm text-tenue">
        {todas.length} tarjetas en total. Hasta 15 nuevas por día; las demás esperan.
      </p>
    </div>
  );
}
