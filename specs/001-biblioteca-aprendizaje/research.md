# Research: Biblioteca de Aprendizaje

Versiones consultadas en npm el 2026-11-06. Las de fases futuras se revalidan al llegar.

## TypeScript 6, no 7

- **Decision**: TypeScript 6.0.x.
- **Rationale**: `@astrojs/check` 0.9.12 declara `typescript: ^5 || ^6`.
- **Alternatives**: TS 7.0.2, rechazado por esa restricción.

## Procesador de Markdown

- **Decision**: `unified()` de `@astrojs/markdown-remark`, declarado en `markdown.processor`.
- **Rationale**: Astro 7 usa Sätteri por defecto, y los plugins de remark y rehype ya no corren sin este paquete. `markdown.remarkPlugins` está deprecado.
- **Alternatives**: portar los plugins a Sätteri, sin evaluar porque no aporta nada a este proyecto por ahora.

## Jerarquía deducida de las carpetas

- **Decision**: curso y módulo salen de la ruta del archivo; solo `area` del curso es una referencia explícita, y se valida contra las áreas existentes.
- **Rationale**: mover un archivo en Obsidian no deja referencias colgadas; un dato no puede contradecir a otro.
- **Alternatives**: `curso` y `modulo` en el frontmatter, rechazado por duplicación.

## Enlaces de Obsidian

- **Decision**: plugin de remark propio que convierte `[[nota]]`, `[[nota|texto]]` y `![[imagen]]`. Un enlace sin destino falla el build.
- **Rationale**: son pocas líneas, y fallar en el build cumple SC-007.
- **Alternatives**: una dependencia de wikilinks, rechazada porque habría que adaptarla igual a las rutas del sitio.

## Identificador de pregunta

- **Decision**: id global `<id del quiz>#<id local>`. Los ids locales son únicos por archivo, validados con zod.
- **Rationale**: evita un chequeo entre archivos; el id es estable mientras no se renombre el archivo, y un rename deja huérfanos, no pérdida.

## Gráficos y estilos

- **Decision**: barras de dominio con HTML y CSS; estilos de Markdown propios en `global.css`.
- **Rationale**: un solo gráfico sencillo no justifica una librería ni `@tailwindcss/typography`.

## Repetición espaciada

- **Decision**: `ts-fsrs` (fase 3).
- **Rationale**: el brief prefiere FSRS, y reimplementarlo sería más riesgo que dependencia.
- **Alternatives**: SM-2 propio, solo si `ts-fsrs` pesa demasiado en el bundle de repaso. Se mide en la fase 3.

## Contenido GH-200

- **Decision**: dominios, pesos y skills según la [guía oficial](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/gh-200) (skills de enero 2026, página actualizada el 2026-02-05). Un módulo por dominio y una lección por grupo de skills: 14 lecciones.
- **Rationale**: es la fuente que eligió Benjamin. Roadmap, labs y preguntas son material propio y se declaran así en el curso.
