import type { ResumenCurso } from '../lib/resumen';
import { completados, continuar, diasDeEstudio, diasHasta, fechaLocal, porcentaje, proximaTarea, racha } from '../lib/progreso';
import { useDoc, useHoy } from '../lib/useDoc';
import Barra from './Barra';

function FechaMeta({ meta, hoy }: { meta: string; hoy: Date }) {
  const dias = diasHasta(meta, hoy);
  if (dias > 0) return <>Faltan {dias} {dias === 1 ? 'día' : 'días'} para la fecha meta</>;
  if (dias === 0) return <>La fecha meta es hoy</>;
  return <>La fecha meta pasó hace {-dias} {dias === -1 ? 'día' : 'días'}</>;
}

export default function Dashboard({ cursos }: { cursos: ResumenCurso[] }) {
  const doc = useDoc();
  const hoy = useHoy();
  const todos = cursos.flatMap((c) => c.items);
  const hechos = completados(doc, todos);
  const ultimo = continuar(doc, todos);
  const cursoDeUltimo = ultimo && cursos.find((c) => c.items.includes(ultimo));
  const dias = diasDeEstudio(doc);
  const enRacha = hoy ? racha(dias, hoy) : 0;

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-3">
        <section className="rounded-lg border border-borde bg-superficie p-4" aria-labelledby="t-continuar">
          <h2 id="t-continuar" className="text-sm font-semibold text-tenue">
            Continuar
          </h2>
          {ultimo ? (
            <p className="mt-1">
              <a className="enlace font-semibold" href={ultimo.href}>
                {ultimo.titulo}
              </a>
              <span className="block text-sm text-tenue">{cursoDeUltimo?.titulo}</span>
            </p>
          ) : (
            <p className="mt-1">Abre una lección desde tus cursos.</p>
          )}
        </section>
        <section className="rounded-lg border border-borde bg-superficie p-4" aria-labelledby="t-global">
          <h2 id="t-global" className="text-sm font-semibold text-tenue">
            Progreso global
          </h2>
          <p className="mt-1 text-2xl font-bold">{porcentaje(hechos, todos.length)} %</p>
          <Barra valor={porcentaje(hechos, todos.length)} />
          <p className="mt-1 text-sm text-tenue">
            {hechos} de {todos.length} lecciones y labs
          </p>
        </section>
        <section className="rounded-lg border border-borde bg-superficie p-4" aria-labelledby="t-racha">
          <h2 id="t-racha" className="text-sm font-semibold text-tenue">
            Racha
          </h2>
          <p className="mt-1 text-2xl font-bold">
            {enRacha} {enRacha === 1 ? 'día' : 'días'}
          </p>
          {hoy && (
            <p className="text-sm text-tenue">
              {dias.has(fechaLocal(hoy)) ? 'Hoy ya estudiaste.' : 'Estudia hoy para sumar un día.'}
            </p>
          )}
        </section>
      </div>

      <h2 className="mt-10 text-xl font-bold">Tus cursos</h2>
      <ul className="mt-4 grid gap-4 sm:grid-cols-2">
        {cursos.map((c) => {
          const hechosCurso = completados(doc, c.items);
          const pct = porcentaje(hechosCurso, c.items.length);
          const tarea = proximaTarea(doc, c.tareas);
          return (
            <li key={c.slug} className="rounded-lg border border-borde bg-superficie p-4">
              <h3 className="font-semibold">
                <a className="enlace" href={c.href}>
                  {c.titulo}
                </a>
              </h3>
              {c.items.length === 0 ? (
                <p className="mt-2 text-sm text-tenue">Sin lecciones todavía.</p>
              ) : (
                <>
                  <p className="mt-2 text-sm">
                    {pct} % · {hechosCurso} de {c.items.length}
                  </p>
                  <Barra valor={pct} />
                </>
              )}
              {tarea && (
                <p className="mt-3 text-sm">
                  <span className="font-semibold">Próximo paso, semana {tarea.semana}:</span> {tarea.texto}
                </p>
              )}
              {c.fechaMeta && hoy && (
                <p className="mt-2 text-sm text-tenue">
                  <FechaMeta meta={c.fechaMeta} hoy={hoy} />
                </p>
              )}
            </li>
          );
        })}
      </ul>
    </>
  );
}
