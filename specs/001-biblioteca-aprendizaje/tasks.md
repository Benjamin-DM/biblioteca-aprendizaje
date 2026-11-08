---
description: "Tareas de Biblioteca de Aprendizaje"
---

# Tasks: Biblioteca de Aprendizaje

**Input**: documentos de `specs/001-biblioteca-aprendizaje/`

**Tests**: la constitución los exige para lógica no trivial.

## Fase de entrega 1: Scaffold, modelo y semilla

### Setup

- [x] T001 Crear `package.json`, `astro.config.mjs`, `tsconfig.json` y `.gitignore`
- [x] T002 Iniciar git con identidad local personal en `.git/config`
- [x] T003 Crear `src/styles/global.css` con Tailwind, tema claro/oscuro y estilos de Markdown

### Foundational

- [x] T004 Definir colecciones y esquemas zod en `src/content.config.ts`
- [x] T005 [P] Implementar el plugin de enlaces de Obsidian en `src/lib/remark-obsidian.mjs` con tests en `tests/remark-obsidian.test.ts`
- [x] T006 [P] Implementar armado del árbol, orden y anterior/siguiente en `src/lib/arbol.ts` con tests en `tests/arbol.test.ts`
- [x] T007 Crear la capa de lectura en `src/lib/contenido.ts`
- [x] T008 Crear `src/layouts/Base.astro` con navegación, salto al contenido y selector de tema

### US1: Explorar la biblioteca y leer una lección

- [x] T009 [US1] Crear el catálogo con filtros en `src/components/Catalogo.tsx` y `src/pages/biblioteca.astro`
- [x] T010 [US1] Crear la portada provisional en `src/pages/index.astro`
- [x] T011 [US1] Crear la vista de curso en `src/pages/cursos/[curso]/index.astro` con `src/components/Roadmap.astro` y `src/components/PesosDominio.astro`
- [x] T012 [US1] Crear la vista de lección con tabla de contenidos en `src/pages/cursos/[curso]/[modulo]/[leccion].astro`
- [x] T013 [US1] Crear la vista de lab en `src/pages/cursos/[curso]/labs/[lab].astro`
- [x] T014 [US1] Agregar el botón copiar en `src/components/BotonCopiar.astro`
- [x] T015 [US1] Crear `src/pages/404.astro`

### US2: Agregar contenido sin tocar la plataforma

- [x] T016 [US2] Crear áreas en `src/content/areas/`
- [x] T017 [US2] Crear el curso GH-200 en `src/content/cursos/gh-200/`: curso, roadmap, recursos y 5 módulos
- [x] T018 [P] [US2] Escribir las lecciones de los módulos 1 a 5
- [x] T019 [P] [US2] Escribir los 9 labs
- [x] T020 [P] [US2] Escribir las 20 preguntas en `*.quiz.yaml`
- [x] T021 [US2] Crear el curso vacío en `src/content/cursos/terraform/`
- [x] T022 [US2] Implementar `scripts/new-course.mjs` y `scripts/plantilla-curso/` con tests en `tests/new-course.test.ts`
- [x] T023 Validar la fase con `quickstart.md`, teclado, 360 px y Lighthouse

## Fase de entrega 2: Progreso y dashboard

- [x] T024 Implementar el almacén, migraciones y aviso de almacenamiento lleno en `src/lib/almacen.ts` con tests
- [x] T025 Implementar exportar e importar con combinación en `src/lib/respaldo.ts` con tests
- [x] T026 [US3] Hacer interactivos los checklists y marcar lección en `src/components/ProgresoLeccion.tsx`
- [x] T027 [US3] Agregar notas por lección en `src/components/Notas.tsx`
- [x] T028 [US3] Registrar sesiones básicas en `src/lib/sesiones.ts` con tests
- [x] T029 [US3] Reemplazar la portada por el dashboard en `src/components/Dashboard.tsx` con racha en `src/lib/racha.ts` y tests
- [x] T030 [US3] Mostrar el porcentaje del curso y el próximo paso del roadmap
- [x] T031 [US7] Crear la página de ajustes en `src/pages/ajustes.astro`: exportar, importar, resetear curso, tema

## Fase de entrega 3: Quizzes, flashcards y búsqueda

- [ ] T032 [US4] Implementar puntaje, desglose e intercalado en `src/lib/quiz.ts` con tests
- [ ] T033 [US4] Crear el modo práctica y examen en `src/components/Quiz.tsx`, con el tiempo calculado sobre la hora de fin
- [ ] T034 [US4] Crear la página de quiz intercalado e historial en `src/pages/quiz.astro`
- [ ] T035 [US5] Integrar FSRS en `src/lib/repaso.ts` con tests; medir el bundle
- [ ] T036 [US5] Extraer tarjetas de quizzes y tablas "datos para memorizar" en `src/lib/tarjetas.ts` con tests
- [ ] T037 [US5] Crear el repaso en `src/components/Repaso.tsx` y `src/pages/repaso.astro`
- [ ] T038 [US5] Agregar el log de errores de labs en `src/components/LogErrores.tsx`
- [ ] T039 [US6] Integrar Pagefind en el build y crear `src/components/Busqueda.astro`

## Fase de entrega 4: CI/CD y deploy

- [ ] T040 [US8] Agregar lint con ESLint en `eslint.config.js`
- [ ] T041 [US8] Crear `.github/workflows/pr.yml`: lint, typecheck, esquema, tests, build y enlaces rotos
- [ ] T042 [US8] Crear `.github/workflows/deploy.yml` con SHA fijados, `permissions` mínimos, cache, `concurrency` y job summary
- [ ] T043 [US8] Validar los workflows con `actionlint`
- [ ] T044 Escribir `README.md`
- [ ] T045 [US8] Crear el repo en la cuenta personal, hacer el primer deploy y probar un PR con enlace roto (con OK para el push)

## Fase de entrega 5: Modos de estudio

- [ ] T046 [US9] Crear el selector de modo y la sesión en `src/components/ModoEstudio.tsx`
- [ ] T047 [P] [US9] Implementar blurting en `src/components/modos/Blurting.tsx`
- [ ] T048 [P] [US9] Implementar Feynman en `src/components/modos/Feynman.tsx`
- [ ] T049 [P] [US9] Implementar elaboración en `src/components/modos/Elaboracion.tsx`
- [ ] T050 [P] [US9] Implementar codificación dual con Mermaid diferido en `src/components/modos/Dual.tsx`
- [ ] T051 [P] [US9] Implementar el Pomodoro en `src/components/Pomodoro.tsx` con lógica en `src/lib/pomodoro.ts` y tests
- [ ] T052 [US9] Registrar foco y energía al cerrar la sesión

## Fase de entrega 6: Laboratorio de métodos

- [ ] T053 [US10] Programar mini-quizzes y ventanas en `src/lib/miniquiz.ts` con tests
- [ ] T054 [US10] Crear la pantalla de mini-quizzes pendientes en `src/components/MiniQuizzes.tsx`
- [ ] T055 [US10] Implementar la rotación y suspensión de tarjetas en `src/lib/experimento.ts` con tests
- [ ] T056 [US10] Crear la configuración de experimentos en `src/components/Experimento.tsx`
- [ ] T057 [US10] Calcular las métricas por método en `src/lib/metricas.ts` con tests contra un cálculo manual
- [ ] T058 [US10] Crear el panel en `src/pages/como-aprendo.astro` y `src/components/PanelMetodos.tsx`
- [ ] T059 [US10] Implementar la recomendación en `src/lib/recomendacion.ts` con tests
- [ ] T060 Sumar preguntas a las lecciones que entren en un experimento
- [ ] T061 Pasada final de accesibilidad y Lighthouse sobre todo el sitio

## Dependencies

Cada fase depende de la anterior. US3, US4 y US5 dependen de T024. US10 depende de US4, US5 y US9.

## Implementation Strategy

Entrega incremental: al cerrar cada fase se valida con el usuario y se espera su OK antes de seguir.
