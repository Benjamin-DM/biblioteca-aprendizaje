# Decisiones y fases

**Estado**: decisiones cerradas por Benjamin el 2026-11-06. Plan por fases aprobado.

## Decisiones

1. **Alcance**: se agregan las fases 5 (modos de estudio) y 6 (laboratorio de métodos), después de las 4 del brief.
2. **Contenido semilla**: la fuente es la [guía oficial GH-200](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/gh-200), que aporta dominios, pesos y skills, pero no un roadmap. Roadmap de 6 semanas, gates, labs y preguntas se redactan como material propio.
3. **PC y celular**: importar combina los datos (unión de sesiones e intentos por id; en progreso y tarjetas gana lo más reciente). Reemplazar queda como opción con confirmación.
4. **Repo**: en la cuenta personal de GitHub, no en la organización. Falta confirmar cuál cuenta personal antes de la fase 4 (hay remotes con `NateCC0902` y `Benjamin-DM`).
5. **Specs**: excepción a la regla "specs en el vault": para este proyecto viven en `specs/`, con una nota de enlace en el vault.

## Fases

| Fase | Entrega | Cómo se prueba |
|------|---------|----------------|
| 1 | Scaffold, esquemas (con los campos de modos y laboratorio desde ya), biblioteca, curso, lección, roadmap, recursos, labs, enlaces de Obsidian, curso GH-200, curso vacío, `npm run new:course` | `npm run dev`; navegar; romper un YAML y ver el error |
| 2 | Progreso, checklists, notas, dashboard, racha, exportar/importar, ajustes, registro básico de sesiones | Marcar, recargar, exportar, limpiar, importar |
| 3 | Quizzes (práctica, examen, intercalado), flashcards con FSRS, log de errores, búsqueda | Tests de programación de repasos; `npm run build && npm run preview` para la búsqueda |
| 4 | Workflows de PR y deploy, README | `actionlint`; PR con enlace roto; deploy (push con OK de Benjamin) |
| 5 | Modos de estudio: blurting, Feynman, elaboración, codificación dual, Pomodoro | Completar una lección en cada modo |
| 6 | Mini-quizzes +1/+7/+30, modo experimento, panel "Cómo aprendo mejor", recomendación | Importar datos de prueba y comparar con cálculo manual |

Cada fase cierra con qué se hizo y cómo probarlo, y espera OK.

## Puntos del brief resueltos en la spec

- **Leitner o FSRS**: rige FSRS, porque el brief dice que reemplaza a Leitner (FR-018).
- **Sesiones desde la fase 2**: si no, lo estudiado antes de la fase 6 no serviría para el laboratorio.
- **Campos nuevos en la lección**: dificultad, tipo de contenido, conceptos clave y preguntas de elaboración (FR-003).
- **Contaminación de la medición**: las tarjetas se suspenden durante un experimento (FR-027).
- **Volumen de preguntas**: los mini-quizzes necesitan unas 6 preguntas por lección; hay que sumar preguntas antes de experimentar con una lección.
