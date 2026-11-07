# Implementation Plan: Biblioteca de Aprendizaje

**Branch**: `001-biblioteca-aprendizaje` | **Date**: 2026-11-06 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `specs/001-biblioteca-aprendizaje/spec.md`

## Summary

Sitio estático con Astro que renderiza una biblioteca de cursos escrita en Markdown y YAML, editable en Obsidian. Los componentes interactivos son islas de React y guardan los datos personales en localStorage, con exportación e importación combinada. Encima de eso se construye un laboratorio que compara métodos de estudio por retención medida.

## Technical Context

**Language/Version**: TypeScript 6 (`@astrojs/check` aún no admite TS 7), Node ≥ 22.23

**Primary Dependencies**: Astro 7, `@astrojs/react` + React 19, Tailwind CSS 4, Pagefind (fase 3), `ts-fsrs` (fase 3), Mermaid con carga diferida (fase 5)

**Storage**: un documento JSON versionado en localStorage; sin backend

**Testing**: Vitest para lógica no trivial; `astro check` y `astro sync` para tipos y contenido; Lighthouse manual por fase

**Target Platform**: navegadores modernos en escritorio y móvil; GitHub Pages con base `/biblioteca-aprendizaje/`

**Project Type**: sitio web estático

**Performance Goals**: Lighthouse ≥ 90 en performance y accesibilidad, en móvil

**Constraints**: sin peticiones a terceros en runtime; contenido sin MDX; contraste AA; teclado completo

**Scale/Scope**: un usuario, decenas de cursos, cientos de lecciones

## Constitution Check

| Principio | Cómo se cumple |
|-----------|----------------|
| I. Markdown plano | Sin MDX. Enlaces de Obsidian resueltos con un plugin de remark; lo interactivo sale de `- [ ]` y YAML |
| II. Estático | Build estático; datos solo en localStorage; sin analítica |
| III. Datos no se pierden | Documento con `version` y migraciones; importar valida antes de aplicar; huérfanos conservados |
| IV. Genérica | La jerarquía sale de carpetas y frontmatter; roadmap, dominios y fecha meta son opcionales; curso vacío en la semilla |
| V. Evidencia | Retención por mini-quiz, advertencia con menos de 5 sesiones, recomendación explicada |
| VI. Simplicidad | Ver [research.md](research.md); gráficos y estilos de contenido con CSS, sin librerías |

Sin violaciones. Re-chequeado tras el diseño: sin cambios.

## Project Structure

### Documentation (this feature)

```text
specs/001-biblioteca-aprendizaje/
├── brief.md
├── spec.md
├── preguntas-y-fases.md
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   ├── formato-contenido.md
│   └── formato-exportacion.md
└── tasks.md
```

### Source Code (repository root)

```text
src/
├── content.config.ts        # colecciones y esquemas zod
├── content/                 # vault de Obsidian
│   ├── areas/*.md
│   ├── _adjuntos/           # imágenes
│   └── cursos/<curso>/
│       ├── curso.md
│       ├── roadmap.yaml
│       ├── recursos.md
│       └── modulos/<modulo>/
│           ├── modulo.md
│           ├── <leccion>.md
│           ├── <leccion>.quiz.yaml
│           └── lab-<nombre>.md
├── components/              # .astro estáticos; .tsx solo si son interactivos
├── layouts/
├── lib/                     # lógica pura y testeable
├── pages/
└── styles/global.css
scripts/
├── new-course.mjs
└── plantilla-curso/
tests/
.github/workflows/           # fase 4
```

**Structure Decision**: un solo proyecto Astro. Curso y módulo se deducen de la carpeta, para no duplicar en el frontmatter datos que podrían contradecirse.

## Complexity Tracking

Sin violaciones que justificar.
