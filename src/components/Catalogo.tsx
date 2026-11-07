import { useState } from 'react';
import { filtrarCursos, SIN_FILTROS, type Filtros, type TarjetaCurso } from '../lib/catalogo';

type Area = { id: string; nombre: string; descripcion: string; icono: string; color: string };
type Opcion = { valor: string; texto: string };
type Props = {
  cursos: TarjetaCurso[];
  areas: Area[];
  niveles: Opcion[];
  estados: Opcion[];
  tags: string[];
  etiquetas: { nivel: Record<string, string>; estado: Record<string, string> };
};

function Filtro(props: { etiqueta: string; valor: string; opciones: Opcion[]; alCambiar: (v: string) => void }) {
  return (
    <label className="flex flex-col gap-1 text-sm font-medium">
      {props.etiqueta}
      <select
        className="min-h-11 rounded-md border border-borde bg-superficie px-2 font-normal"
        value={props.valor}
        onChange={(e) => props.alCambiar(e.target.value)}
      >
        <option value="">Todos</option>
        {props.opciones.map((o) => (
          <option key={o.valor} value={o.valor}>
            {o.texto}
          </option>
        ))}
      </select>
    </label>
  );
}

export default function Catalogo({ cursos, areas, niveles, estados, tags, etiquetas }: Props) {
  const [filtros, setFiltros] = useState<Filtros>(SIN_FILTROS);
  const cambiar = (campo: keyof Filtros) => (valor: string) => setFiltros({ ...filtros, [campo]: valor });
  const visibles = filtrarCursos(cursos, filtros);
  const hayFiltros = Object.values(filtros).some(Boolean);

  return (
    <>
      <form className="grid grid-cols-2 gap-3 sm:grid-cols-4" aria-label="Filtros del catálogo" onSubmit={(e) => e.preventDefault()}>
        <Filtro
          etiqueta="Área"
          valor={filtros.area}
          opciones={areas.map((a) => ({ valor: a.id, texto: a.nombre }))}
          alCambiar={cambiar('area')}
        />
        <Filtro etiqueta="Nivel" valor={filtros.nivel} opciones={niveles} alCambiar={cambiar('nivel')} />
        <Filtro etiqueta="Estado" valor={filtros.estado} opciones={estados} alCambiar={cambiar('estado')} />
        <Filtro
          etiqueta="Tag"
          valor={filtros.tag}
          opciones={tags.map((t) => ({ valor: t, texto: t }))}
          alCambiar={cambiar('tag')}
        />
      </form>

      <div className="mt-3 flex min-h-11 items-center gap-4 text-sm text-tenue">
        <p role="status">
          {visibles.length} {visibles.length === 1 ? 'curso' : 'cursos'}
        </p>
        {hayFiltros && (
          <button type="button" className="enlace min-h-11 underline" onClick={() => setFiltros(SIN_FILTROS)}>
            Limpiar filtros
          </button>
        )}
      </div>

      {visibles.length === 0 && <p className="mt-6">Ningún curso coincide con estos filtros.</p>}

      {areas.map((area) => {
        const delArea = visibles.filter((c) => c.area === area.id);
        if (delArea.length === 0) return null;
        return (
          <section key={area.id} className="mt-8" aria-labelledby={`area-${area.id}`}>
            <h2 id={`area-${area.id}`} className="text-xl font-bold">
              <span aria-hidden="true">{area.icono}</span> {area.nombre}
            </h2>
            <p className="mt-1 text-tenue">{area.descripcion}</p>
            <ul className="mt-4 grid gap-4 sm:grid-cols-2">
              {delArea.map((c) => (
                <li
                  key={c.id}
                  className="rounded-lg border border-borde border-l-4 bg-superficie p-4"
                  style={{ borderLeftColor: area.color }}
                >
                  <h3 className="font-semibold">
                    <a className="enlace" href={c.href}>
                      {c.titulo}
                    </a>
                  </h3>
                  <p className="mt-1 text-sm">{c.objetivo}</p>
                  <p className="mt-2 text-sm text-tenue">
                    {etiquetas.nivel[c.nivel]} · {etiquetas.estado[c.estado]} ·{' '}
                    {c.lecciones === 0 ? 'Sin lecciones todavía' : `${c.lecciones} lecciones, ${c.labs} labs`}
                  </p>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </>
  );
}
