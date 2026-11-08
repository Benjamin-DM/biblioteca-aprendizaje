import { useState } from 'react';
import { actualizar, ahora, combinar, leer, resetearCurso, validar } from '../lib/almacen';
import { fechaLocal } from '../lib/progreso';

type Props = { cursos: { slug: string; titulo: string }[] };
type Tema = 'claro' | 'oscuro' | 'sistema';

const leerTema = (): Tema => (localStorage.getItem('biblioteca:tema') as Tema | null) ?? 'sistema';

function aplicarTema(tema: Tema) {
  if (tema === 'sistema') localStorage.removeItem('biblioteca:tema');
  else localStorage.setItem('biblioteca:tema', tema);
  const oscuro = tema === 'sistema' ? matchMedia('(prefers-color-scheme: dark)').matches : tema === 'oscuro';
  document.documentElement.classList.toggle('dark', oscuro);
  window.dispatchEvent(new Event('biblioteca:tema'));
}

export default function Ajustes({ cursos }: Props) {
  const [mensaje, setMensaje] = useState('');
  const [reemplazar, setReemplazar] = useState(false);
  const [curso, setCurso] = useState(cursos[0]?.slug ?? '');
  const [tema, setTema] = useState<Tema | null>(null);

  const exportar = () => {
    const texto = JSON.stringify({ ...leer(), exportado: ahora() }, null, 2);
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([texto], { type: 'application/json' }));
    a.download = `biblioteca-${fechaLocal(new Date())}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
    setMensaje('Exportación descargada.');
  };

  const importar = async (archivo: File | undefined) => {
    if (!archivo) return;
    try {
      let datos: unknown;
      try {
        datos = JSON.parse(await archivo.text());
      } catch {
        throw new Error('El archivo no es JSON válido.');
      }
      const entrante = validar(datos);
      if (reemplazar && !confirm('Esto reemplaza todos tus datos actuales por los del archivo. ¿Continuar?')) {
        setMensaje('Importación cancelada.');
        return;
      }
      actualizar((actual) => (reemplazar ? entrante : combinar(actual, entrante)));
      setMensaje(reemplazar ? 'Datos reemplazados.' : 'Datos combinados con los existentes.');
    } catch (e) {
      setMensaje(`No se importó nada: ${(e as Error).message}`);
    }
  };

  const resetear = () => {
    const titulo = cursos.find((c) => c.slug === curso)?.titulo;
    if (!confirm(`Se borrará tu progreso, notas y sesiones de "${titulo}". ¿Continuar?`)) return;
    try {
      actualizar((doc) => resetearCurso(doc, curso));
      setMensaje(`Progreso de "${titulo}" borrado.`);
    } catch (e) {
      setMensaje((e as Error).message);
    }
  };

  const temaActual = tema ?? (typeof window === 'undefined' ? null : leerTema());

  return (
    <div className="max-w-2xl space-y-10">
      <p role="status" className="min-h-6 font-semibold">
        {mensaje}
      </p>

      <section aria-labelledby="t-respaldo">
        <h2 id="t-respaldo" className="text-xl font-bold">
          Respaldo
        </h2>
        <p className="mt-2 text-tenue">
          Tus datos viven solo en este navegador. Exporta para respaldarlos o para pasarlos a otro dispositivo.
        </p>
        <button type="button" onClick={exportar} className="mt-3 min-h-11 rounded-md border-2 border-acento px-4 font-semibold">
          Exportar datos
        </button>
        <div className="mt-6">
          <label htmlFor="importar" className="block font-semibold">
            Importar un archivo exportado
          </label>
          <input
            id="importar"
            type="file"
            accept="application/json,.json"
            onChange={(e) => {
              importar(e.target.files?.[0]);
              e.target.value = '';
            }}
            className="mt-2 block min-h-11 file:mr-3 file:min-h-11 file:cursor-pointer file:rounded-md file:border-2 file:border-acento file:bg-transparent file:px-4 file:font-semibold file:text-tinta"
          />
          <label className="mt-3 flex items-start gap-2">
            <input type="checkbox" checked={reemplazar} onChange={(e) => setReemplazar(e.target.checked)} className="mt-1 size-4" />
            <span>
              Reemplazar todo en lugar de combinar. Al combinar, por cada dato gana el más reciente y no se borra nada.
            </span>
          </label>
        </div>
      </section>

      {cursos.length > 0 && (
        <section aria-labelledby="t-reset">
          <h2 id="t-reset" className="text-xl font-bold">
            Resetear un curso
          </h2>
          <p className="mt-2 text-tenue">Borra progreso, notas y sesiones del curso. Exporta antes si quieres conservarlos.</p>
          <div className="mt-3 flex flex-wrap items-end gap-3">
            <label className="flex flex-col gap-1 font-semibold">
              Curso
              <select
                value={curso}
                onChange={(e) => setCurso(e.target.value)}
                className="min-h-11 rounded-md border border-borde bg-superficie px-2 font-normal"
              >
                {cursos.map((c) => (
                  <option key={c.slug} value={c.slug}>
                    {c.titulo}
                  </option>
                ))}
              </select>
            </label>
            <button type="button" onClick={resetear} className="min-h-11 rounded-md border-2 border-borde px-4 font-semibold">
              Resetear curso
            </button>
          </div>
        </section>
      )}

      <fieldset>
        <legend className="text-xl font-bold">Tema</legend>
        <div className="mt-3 flex flex-wrap gap-4">
          {(['claro', 'oscuro', 'sistema'] as const).map((t) => (
            <label key={t} className="flex min-h-11 items-center gap-2">
              <input
                type="radio"
                name="tema"
                checked={temaActual === t}
                onChange={() => {
                  aplicarTema(t);
                  setTema(t);
                }}
                className="size-4"
              />
              {t === 'sistema' ? 'Según el sistema' : t === 'claro' ? 'Claro' : 'Oscuro'}
            </label>
          ))}
        </div>
      </fieldset>
    </div>
  );
}
