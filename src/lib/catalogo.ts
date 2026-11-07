export type TarjetaCurso = {
  id: string;
  titulo: string;
  area: string;
  nivel: string;
  estado: string;
  tags: string[];
  objetivo: string;
  lecciones: number;
  labs: number;
  href: string;
};

export type Filtros = { area: string; nivel: string; estado: string; tag: string };

export const SIN_FILTROS: Filtros = { area: '', nivel: '', estado: '', tag: '' };

/** Un filtro vacío deja pasar todo; los cuatro se combinan con Y. */
export function filtrarCursos(cursos: TarjetaCurso[], f: Filtros) {
  return cursos.filter(
    (c) =>
      (!f.area || c.area === f.area) &&
      (!f.nivel || c.nivel === f.nivel) &&
      (!f.estado || c.estado === f.estado) &&
      (!f.tag || c.tags.includes(f.tag)),
  );
}
