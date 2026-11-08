import { useState } from 'react';
import { actualizar, ahora } from '../lib/almacen';
import { usarDoc } from '../lib/usarDoc';

type Props = { lab: string; curso: string };

/** Errores del lab: cada uno se vuelve una tarjeta de repaso. */
export default function LogErrores({ lab, curso }: Props) {
  const doc = usarDoc();
  const [descripcion, setDescripcion] = useState('');
  const [correccion, setCorreccion] = useState('');
  const [aviso, setAviso] = useState('');
  const errores = doc.errores.filter((e) => e.lab === lab && !e.descartado);

  const guardar = () => {
    try {
      actualizar((d) => {
        d.errores.push({ id: crypto.randomUUID(), curso, lab, descripcion: descripcion.trim(), correccion: correccion.trim(), actualizado: ahora() });
      });
      setDescripcion('');
      setCorreccion('');
      setAviso('Error guardado. Ya está en tus tarjetas de repaso.');
    } catch (err) {
      setAviso((err as Error).message);
    }
  };

  // Descartar en lugar de borrar: al combinar respaldos, un borrado reaparecería.
  const descartar = (id: string) =>
    actualizar((d) => {
      const x = d.errores.find((e) => e.id === id);
      if (x) Object.assign(x, { descartado: true, actualizado: ahora() });
    });

  return (
    <section className="mt-10 border-t border-borde pt-6" aria-labelledby="t-errores">
      <h2 id="t-errores" className="text-2xl font-bold">
        Log de errores
      </h2>
      <p className="mt-1 text-tenue">Anota lo que falló. Cada error se convierte en una tarjeta de repaso.</p>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          guardar();
        }}
        className="mt-4 max-w-[72ch] space-y-3"
      >
        <label className="block font-semibold">
          ¿Qué falló?
          <textarea required rows={2} value={descripcion} onChange={(e) => setDescripcion(e.target.value)} className="mt-1 block w-full rounded-md border border-borde bg-superficie p-2 font-normal" />
        </label>
        <label className="block font-semibold">
          Causa o forma correcta
          <textarea required rows={2} value={correccion} onChange={(e) => setCorreccion(e.target.value)} className="mt-1 block w-full rounded-md border border-borde bg-superficie p-2 font-normal" />
        </label>
        <button type="submit" className="min-h-11 rounded-md border-2 border-acento px-4 font-semibold">
          Guardar error
        </button>
        <p role="status" className="min-h-5 text-sm">
          {aviso}
        </p>
      </form>
      {errores.length > 0 && (
        <ul className="mt-4 max-w-[72ch] space-y-3">
          {errores.map((e) => (
            <li key={e.id} className="rounded-md border border-borde bg-superficie p-3">
              <p className="font-semibold">{e.descripcion}</p>
              <p className="mt-1">{e.correccion}</p>
              <button type="button" onClick={() => descartar(e.id)} className="enlace mt-2 min-h-11 text-sm underline">
                Descartar
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
