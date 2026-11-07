<!--
Sync Impact Report
- Version: plantilla → 1.0.0 (adopción inicial)
- Principios añadidos: I a VI
- Secciones añadidas: Restricciones técnicas; Calidad y flujo de trabajo
- Secciones eliminadas: ninguna
- TODOs diferidos: ninguno
-->
# Biblioteca de Aprendizaje Constitution

## Core Principles

### I. El contenido es Markdown plano (NON-NEGOTIABLE)

Las lecciones MUST ser Markdown estándar con frontmatter, sin MDX ni sintaxis propia de la
plataforma. Lo interactivo MUST interpretarse desde Markdown estándar (`- [ ]`) o desde YAML.
`src/content/` MUST poder abrirse como vault de Obsidian y editarse ahí sin romper el build.

**Razón**: el contenido vive más que la plataforma y se edita en Obsidian.

### II. Estático y de un solo usuario

La plataforma MUST funcionar como sitio estático, sin backend, login ni servicios de terceros en
runtime. Los datos personales (progreso, notas, sesiones) MUST quedarse en el navegador. No se
permite telemetría ni analítica.

**Razón**: es de uso personal; el sitio publicado expone contenido, nunca datos del usuario.

### III. Los datos del usuario no se pierden

Todo dato personal MUST tener un esquema versionado con migración y MUST entrar en el
exportar/importar JSON. Las operaciones destructivas (resetear, importar con reemplazo) MUST pedir
confirmación. Un importado inválido MUST rechazarse sin modificar lo existente. Los datos de
contenido renombrado o borrado MUST conservarse como huérfanos, no eliminarse.

**Razón**: el laboratorio de métodos necesita meses de historial; no hay copia en servidor.

### IV. Genérica por diseño

Ningún componente MUST conocer un curso concreto. Toda diferencia entre cursos (dominios, fecha
meta, roadmap) MUST venir del contenido y ser opcional. El curso vacío de ejemplo MUST compilar
y renderizar siempre.

**Razón**: es una biblioteca que crece con cada tema, no un curso de GH-200.

### V. Aprender con evidencia

Las métricas de aprendizaje MUST medir retención, no percepción, y MUST advertir cuando haya pocos
datos. Una recomendación MUST explicar en qué datos se basa y poder ignorarse. No se implementan
"estilos de aprendizaje". Los datos del examen MUST salir de una fuente provista u oficial, nunca
inventarse.

**Razón**: una conclusión falsa sobre cómo aprendo es peor que no tener ninguna.

### VI. Simplicidad

Cada dependencia y abstracción MUST justificar un requisito confirmado. Se elige la solución más
pequeña que cumple; plataforma y librerías ya instaladas antes que código nuevo. La lógica no
trivial (programación de repasos, merge de importación, rotación de métodos, estadísticas) MUST
tener tests.

**Razón**: un proyecto personal sobrevive solo si mantenerlo es barato.

## Restricciones técnicas

- **Stack**: Astro + TypeScript; React solo en componentes interactivos; Tailwind CSS con modo
  claro/oscuro; content collections con zod; Pagefind para búsqueda; localStorage para persistencia.
- **Idioma**: interfaz en español; términos técnicos en inglés (workflow, runner, etc.).
- **Deploy**: GitHub Pages con GitHub Actions (`actions/upload-pages-artifact` y
  `actions/deploy-pages`).
- **CI/CD**: actions fijadas por SHA completo, `permissions` mínimos por job, cache de dependencias,
  `concurrency` en el deploy, job summary y comentarios cortos que expliquen cada decisión.
  Los workflows MUST pasar `actionlint`.

## Calidad y flujo de trabajo

- **Accesibilidad y performance**: navegación por teclado, contraste AA, responsive; Lighthouse ≥ 90
  en performance y accesibilidad.
- **Validación**: un PR MUST pasar lint, typecheck, esquema de contenido, build y enlaces rotos.
- **Entrega por fases**: cada fase cierra mostrando qué se hizo y cómo probarlo localmente, y MUST
  esperar el OK del usuario antes de seguir.
- **Git**: ningún push sin confirmación explícita. Los commits y PRs no llevan firmas de autoría
  de Claude.

## Governance

Esta constitución prevalece sobre otras prácticas del proyecto. Las enmiendas MUST quedar en este
archivo con su Sync Impact Report y requieren el OK del usuario. Versionado semántico: MAJOR si se
elimina o redefine un principio, MINOR si se añade uno, PATCH si solo cambia la redacción. Cada
plan (`/speckit-plan`) MUST verificar su cumplimiento y justificar cualquier excepción.

**Version**: 1.0.0 | **Ratified**: 2026-11-06 | **Last Amended**: 2026-11-06
