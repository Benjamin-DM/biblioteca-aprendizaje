import { useCallback, useEffect, useRef, useState } from 'react';
import { actualizar, ahora } from '../lib/almacen';
import { armar, formatoTiempo, puntuar, restante, type Pregunta, type PreguntaEnJuego, type Respuestas, type Resultado } from '../lib/quiz';
import { useDoc } from '../lib/useDoc';
import ConCodigo from './ConCodigo';

type Curso = { slug: string; titulo: string; modulos: { clave: string; titulo: string }[] };
type Props = { preguntas: Pregunta[]; cursos: Curso[] };
type Modo = 'practica' | 'examen';
type Juego = { modo: Modo; items: PreguntaEnJuego[]; inicio: number; fin?: number };

const boton = 'min-h-11 rounded-md border-2 px-4 font-semibold';

function Configurar({ preguntas, cursos, alEmpezar }: Props & { alEmpezar: (j: Juego) => void }) {
  const parametros = typeof location === 'undefined' ? new URLSearchParams() : new URLSearchParams(location.search);
  const [leccion, setLeccion] = useState(parametros.get('leccion') ?? '');
  const cursoInicial = parametros.get('curso');
  const [modulos, setModulos] = useState(
    () => new Set(cursos.filter((c) => !cursoInicial || c.slug === cursoInicial).flatMap((c) => c.modulos.map((m) => m.clave))),
  );
  const [modo, setModo] = useState<Modo>('practica');
  const disponibles = leccion ? preguntas.filter((p) => p.leccion === leccion).length : preguntas.filter((p) => modulos.has(p.modulo)).length;
  const [cantidad, setCantidad] = useState(10);
  const [minutos, setMinutos] = useState(20);
  const tituloLeccion = preguntas.find((p) => p.leccion === leccion)?.leccionTitulo;
  const n = Math.min(cantidad, disponibles);

  const alternar = (clave: string) => {
    const s = new Set(modulos);
    if (s.has(clave)) s.delete(clave);
    else s.add(clave);
    setModulos(s);
  };

  return (
    <form
      className="max-w-2xl space-y-6"
      onSubmit={(e) => {
        e.preventDefault();
        const items = armar(preguntas, leccion ? { leccion } : { modulos }, n);
        const inicio = Date.now();
        alEmpezar({ modo, items, inicio, fin: modo === 'examen' ? inicio + minutos * 60_000 : undefined });
      }}
    >
      <fieldset>
        <legend className="text-lg font-bold">Modo</legend>
        <div className="mt-2 space-y-2">
          <label className="flex items-start gap-2">
            <input type="radio" name="modo" checked={modo === 'practica'} onChange={() => setModo('practica')} className="mt-1 size-4" />
            <span><strong>Práctica:</strong> ves si acertaste y la explicación después de cada pregunta.</span>
          </label>
          <label className="flex items-start gap-2">
            <input type="radio" name="modo" checked={modo === 'examen'} onChange={() => setModo('examen')} className="mt-1 size-4" />
            <span><strong>Examen:</strong> con tiempo; el resultado y las explicaciones llegan al final.</span>
          </label>
        </div>
      </fieldset>

      {leccion ? (
        <p>
          Preguntas de la lección <strong>{tituloLeccion ?? leccion}</strong>.{' '}
          <button type="button" className="enlace underline" onClick={() => setLeccion('')}>
            Elegir módulos
          </button>
        </p>
      ) : (
        <fieldset>
          <legend className="text-lg font-bold">Qué entra</legend>
          <p className="text-sm text-tenue">Elegir varios módulos o cursos mezcla sus preguntas (práctica intercalada).</p>
          {cursos.map((c) => (
            <div key={c.slug} className="mt-3">
              <p className="font-semibold">{c.titulo}</p>
              <ul className="mt-1 space-y-1">
                {c.modulos.map((m) => (
                  <li key={m.clave}>
                    <label className="flex items-start gap-2">
                      <input type="checkbox" checked={modulos.has(m.clave)} onChange={() => alternar(m.clave)} className="mt-1 size-4" />
                      <span>
                        {m.titulo} <span className="text-sm text-tenue">({preguntas.filter((p) => p.modulo === m.clave).length})</span>
                      </span>
                    </label>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </fieldset>
      )}

      <div className="flex flex-wrap gap-6">
        <label className="flex flex-col gap-1 font-semibold">
          Preguntas
          {/* Sin max: si se piden más de las disponibles, se usan todas (ver n). Un max bloquearía el envío. */}
          <input type="number" min={1} value={cantidad} onChange={(e) => setCantidad(Number(e.target.value))} className="min-h-11 w-28 rounded-md border border-borde bg-superficie px-2 font-normal" />
        </label>
        {modo === 'examen' && (
          <label className="flex flex-col gap-1 font-semibold">
            Minutos
            <input type="number" min={1} value={minutos} onChange={(e) => setMinutos(Number(e.target.value))} className="min-h-11 w-28 rounded-md border border-borde bg-superficie px-2 font-normal" />
          </label>
        )}
      </div>
      <p className="text-sm text-tenue">{disponibles} preguntas disponibles con esta selección.</p>
      <button type="submit" disabled={n < 1} className={`${boton} border-acento disabled:opacity-50`}>
        Empezar con {n} {n === 1 ? 'pregunta' : 'preguntas'}
      </button>
    </form>
  );
}

function Opciones({ item, elegida, bloqueada, alElegir }: { item: PreguntaEnJuego; elegida?: number; bloqueada: boolean; alElegir: (i: number) => void }) {
  const { pregunta, orden } = item;
  return (
    <fieldset>
      <legend className="text-lg font-semibold">
        <ConCodigo texto={pregunta.enunciado} />
      </legend>
      <div className="mt-3 space-y-2">
        {orden.map((original) => {
          const resaltar = bloqueada && (original === pregunta.correcta ? 'border-acento' : original === elegida ? 'border-tinta border-dashed' : '');
          return (
            <label key={original} className={`flex min-h-11 items-start gap-3 rounded-md border-2 border-borde bg-superficie p-3 ${resaltar || ''}`}>
              <input type="radio" name={pregunta.id} checked={elegida === original} disabled={bloqueada} onChange={() => alElegir(original)} className="mt-1 size-4" />
              <span>
                <ConCodigo texto={pregunta.opciones[original]} />
                {bloqueada && original === pregunta.correcta && <strong> (correcta)</strong>}
                {bloqueada && original === elegida && original !== pregunta.correcta && <strong> (tu respuesta)</strong>}
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

function Jugar({ juego, alTerminar }: { juego: Juego; alTerminar: (r: Respuestas) => void }) {
  const [i, setI] = useState(0);
  const [respuestas, setRespuestas] = useState<Respuestas>({});
  const [revelada, setRevelada] = useState(false);
  const [quedan, setQuedan] = useState(juego.fin ? restante(juego.fin, juego.inicio) : 0);
  const item = juego.items[i];
  const ultima = i === juego.items.length - 1;
  const practica = juego.modo === 'practica';

  // El temporizador lee las respuestas más recientes sin reiniciarse en cada clic, y cierra una sola vez.
  const respuestasRef = useRef<Respuestas>({});
  const cerrado = useRef(false);
  const cerrar = useCallback(
    (r: Respuestas) => {
      if (cerrado.current) return;
      cerrado.current = true;
      alTerminar(r);
    },
    [alTerminar],
  );

  useEffect(() => {
    if (!juego.fin) return;
    const t = setInterval(() => {
      const s = restante(juego.fin!, Date.now());
      setQuedan(s);
      if (s === 0) {
        clearInterval(t);
        cerrar(respuestasRef.current);
      }
    }, 1000);
    return () => clearInterval(t);
  }, [juego.fin, cerrar]);

  const elegir = (original: number) => {
    const nuevas = { ...respuestas, [item.pregunta.id]: original };
    respuestasRef.current = nuevas;
    setRespuestas(nuevas);
  };
  const bien = respuestas[item.pregunta.id] === item.pregunta.correcta;

  return (
    <div className="max-w-2xl">
      <div className="mb-4 flex flex-wrap justify-between gap-2 text-sm text-tenue">
        <span>
          Pregunta {i + 1} de {juego.items.length} · {item.pregunta.dominio}
        </span>
        {juego.fin && (
          <span className="font-semibold text-tinta" role="timer" aria-label={`Tiempo restante ${formatoTiempo(quedan)}`}>
            ⏱ {formatoTiempo(quedan)}
          </span>
        )}
      </div>
      <Opciones item={item} elegida={respuestas[item.pregunta.id]} bloqueada={practica && revelada} alElegir={elegir} />
      <div role="status" className="mt-4">
        {practica && revelada && (
          <div className="rounded-md border-l-4 border-acento bg-superficie p-3">
            <p className="font-semibold">{bien ? '✓ Correcto' : '✗ Incorrecto'}</p>
            <p className="mt-1">
              <ConCodigo texto={item.pregunta.explicacion} />
            </p>
          </div>
        )}
      </div>
      <div className="mt-6 flex flex-wrap gap-3">
        {!practica && i > 0 && (
          <button type="button" className={`${boton} border-borde`} onClick={() => setI(i - 1)}>
            Anterior
          </button>
        )}
        {practica && !revelada ? (
          <button type="button" className={`${boton} border-acento disabled:opacity-50`} disabled={respuestas[item.pregunta.id] === undefined} onClick={() => setRevelada(true)}>
            Comprobar
          </button>
        ) : ultima ? (
          <button type="button" className={`${boton} border-acento`} onClick={() => cerrar(respuestas)}>
            Ver resultado
          </button>
        ) : (
          <button
            type="button"
            className={`${boton} border-acento`}
            onClick={() => {
              setI(i + 1);
              setRevelada(false);
            }}
          >
            Siguiente
          </button>
        )}
        {!practica && !ultima && (
          <button type="button" className={`${boton} border-borde`} onClick={() => cerrar(respuestas)}>
            Terminar ahora
          </button>
        )}
      </div>
    </div>
  );
}

function Resumen({ juego, respuestas, resultado, alReiniciar }: { juego: Juego; respuestas: Respuestas; resultado: Resultado; alReiniciar: () => void }) {
  return (
    <div className="max-w-2xl">
      <h2 className="text-2xl font-bold">
        {resultado.correctas} de {resultado.total} · {resultado.porcentaje} %
      </h2>
      <h3 className="mt-6 text-lg font-bold">Por dominio (lo más débil primero)</h3>
      <ul className="mt-2 space-y-2">
        {resultado.dominios.map((d) => (
          <li key={d.dominio} className="flex justify-between gap-4 border-b border-borde pb-1">
            <span>{d.dominio}</span>
            <span className="font-semibold whitespace-nowrap">
              {d.correctas}/{d.total} · {d.porcentaje} %
            </span>
          </li>
        ))}
      </ul>
      <h3 className="mt-8 text-lg font-bold">Revisión</h3>
      <ol className="mt-3 space-y-8">
        {juego.items.map((item) => (
          <li key={item.pregunta.id}>
            <Opciones item={item} elegida={respuestas[item.pregunta.id]} bloqueada alElegir={() => {}} />
            {respuestas[item.pregunta.id] === undefined && <p className="mt-2 font-semibold">Sin responder.</p>}
            <p className="mt-2 border-l-4 border-acento pl-3">
              <ConCodigo texto={item.pregunta.explicacion} />
            </p>
          </li>
        ))}
      </ol>
      <button type="button" className={`${boton} mt-8 border-acento`} onClick={alReiniciar}>
        Hacer otro quiz
      </button>
    </div>
  );
}

function Historial() {
  const doc = useDoc();
  const intentos = [...doc.intentos].sort((a, b) => b.actualizado.localeCompare(a.actualizado)).slice(0, 10);
  if (intentos.length === 0) return null;
  return (
    <section className="mt-12 max-w-2xl" aria-labelledby="t-historial">
      <h2 id="t-historial" className="text-xl font-bold">
        Últimos intentos
      </h2>
      <ul className="mt-3 space-y-2">
        {intentos.map((x) => (
          <li key={x.id} className="border-b border-borde pb-2">
            <span className="font-semibold">{x.porcentaje} %</span> ({x.correctas}/{x.total}) · {x.modo === 'examen' ? 'Examen' : 'Práctica'} ·{' '}
            {new Date(x.actualizado).toLocaleString('es')} · {formatoTiempo(x.segundos)}
            {x.dominios[0] && x.dominios[0].porcentaje < 100 && <span className="block text-sm text-tenue">Reforzar: {x.dominios[0].dominio}</span>}
          </li>
        ))}
      </ul>
    </section>
  );
}

export default function Quiz({ preguntas, cursos }: Props) {
  const [juego, setJuego] = useState<Juego | null>(null);
  const [final, setFinal] = useState<{ respuestas: Respuestas; resultado: Resultado } | null>(null);
  const [aviso, setAviso] = useState('');

  const terminar = (respuestas: Respuestas) => {
    if (!juego || final) return;
    const lista = juego.items.map((x) => x.pregunta);
    const resultado = puntuar(lista, respuestas);
    const cursosDelIntento = [...new Set(lista.map((p) => p.curso))];
    try {
      actualizar((d) => {
        d.intentos.push({
          id: crypto.randomUUID(),
          curso: cursosDelIntento.length === 1 ? cursosDelIntento[0] : undefined,
          modo: juego.modo,
          preguntas: lista.map((p) => p.id),
          respuestas,
          segundos: Math.round((Date.now() - juego.inicio) / 1000),
          ...resultado,
          actualizado: ahora(),
        });
      });
      setAviso('');
    } catch (e) {
      setAviso(`El intento no se guardó: ${(e as Error).message}`);
    }
    setFinal({ respuestas, resultado });
  };

  return (
    <>
      <p role="status" className="font-semibold">
        {aviso}
      </p>
      {!juego && <Configurar preguntas={preguntas} cursos={cursos} alEmpezar={setJuego} />}
      {juego && !final && <Jugar juego={juego} alTerminar={terminar} />}
      {juego && final && (
        <Resumen
          juego={juego}
          {...final}
          alReiniciar={() => {
            setJuego(null);
            setFinal(null);
          }}
        />
      )}
      {!juego && <Historial />}
    </>
  );
}
