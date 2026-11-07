# Data Model

## Contenido (archivos, validado en el build)

Formato exacto: [contracts/formato-contenido.md](contracts/formato-contenido.md).

| Entidad | Archivo | Campos | Reglas |
|---------|---------|--------|--------|
| Área | `areas/<id>.md` | nombre, descripcion, icono, color | `color` hexadecimal |
| Curso | `cursos/<id>/curso.md` | titulo, area, nivel, tags, objetivo, fecha_meta?, horas_semana, estado, fuentes | `area` existe; `nivel`: basico, intermedio, avanzado; `estado`: por-empezar, en-curso, completado |
| Módulo | `modulos/<id>/modulo.md` | titulo, orden, dominio? (nombre, peso_min, peso_max) | `peso_min` ≤ `peso_max` |
| Lección | `modulos/<id>/<leccion>.md` | titulo, orden, duracion_min, tags, dificultad?, tipo_contenido?, conceptos_clave?, preguntas_elaboracion? | `dificultad`: 1-3; `tipo_contenido`: conceptos, datos, practica |
| Lab | `modulos/<id>/lab-*.md` | titulo, orden, objetivo, criterio_hecho, duracion_min | `criterio_hecho` no vacío; los pasos van en el cuerpo |
| Quiz | `modulos/<id>/<leccion>.quiz.yaml` | preguntas[]: id, enunciado, opciones, correcta, explicacion | ids únicos por archivo; `correcta` es un índice válido; al menos 2 opciones |
| Roadmap | `cursos/<id>/roadmap.yaml` | fases[]: titulo, semanas[]: numero, titulo, tareas[]; gate | opcional por curso |
| Recursos | `cursos/<id>/recursos.md` | tabla Markdown: recurso, tipo, costo, para qué sirve | opcional por curso |

El dominio de una lección, lab o pregunta se hereda de su módulo.

## Datos personales (localStorage, fases 2 a 6)

Un único documento bajo la clave `biblioteca:v1`. Formato: [contracts/formato-exportacion.md](contracts/formato-exportacion.md).

| Entidad | Clave | Campos principales | Fusión al importar |
|---------|-------|--------------------|--------------------|
| Progreso de lección | id de lección | completada, abierta_en, actualizado | gana lo más reciente |
| Checklist | id de lección + hash del texto | hecho, actualizado | gana lo más reciente |
| Nota | id de lección | texto, actualizado | gana lo más reciente |
| Intento de quiz | id | modo, fecha, preguntas, respuestas, puntaje, duración | unión por id |
| Tarjeta | id de origen | origen, estado FSRS, vence, suspendida, actualizado | gana lo más reciente |
| Error de lab | id | lab, descripción, fecha | unión por id |
| Sesión | id | fecha, curso, lección, método, duración, foco, energía | unión por id |
| Mini-quiz | id de sesión + intervalo | método, vence, puntaje, en_ventana, actualizado | gana lo más reciente |
| Experimento | id | curso, métodos, asignación, activo, actualizado | gana lo más reciente |

Transiciones de un mini-quiz: `pendiente` → `hecho en ventana` o `hecho fuera de ventana`. Solo el primero cuenta en el panel.

Ventanas válidas: +1 d (1-3), +7 d (5-10), +30 d (25-40).
