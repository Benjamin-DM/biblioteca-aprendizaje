# Brief original (fuente de la spec)

# Rol y objetivo
Eres un ingeniero full-stack senior. Vamos a construir "Biblioteca de Aprendizaje": una plataforma web personal para estudiar varios temas técnicos (DevOps, GitHub Actions, Kubernetes/AKS, Terraform, Helm, seguridad, Python, etc.) con rutas de estudio, lecciones, labs, quizzes y seguimiento de progreso. No es un curso suelto: es una biblioteca que crece con cada tema nuevo que agrego.

Antes de escribir código: revisa este brief, hazme como máximo 5 preguntas si algo es ambiguo y luego propón un plan por fases. Espera mi OK antes de implementar.

# Contexto del usuario
- Soy ingeniero DevSecOps. Trabajo en Windows con Claude Code y documento en Obsidian.
- Es para uso personal y de un solo usuario: sin login ni backend.
- La interfaz va en español. Los términos técnicos se quedan en inglés (workflow, runner, etc.).
- El primer curso que voy a cargar es la certificación GitHub Actions (GH-200). La plataforma tiene que servir igual para cualquier otro tema.

# Stack (proponer alternativas solo si hay una razón fuerte)
- Astro + TypeScript, con React solo en los componentes interactivos.
- Tailwind CSS, con modo claro/oscuro.
- Contenido en Markdown con frontmatter, validado con content collections y zod.
- Búsqueda estática con Pagefind.
- Progreso guardado en localStorage, con exportar/importar en JSON.
- Deploy en GitHub Pages con GitHub Actions.

# Modelo de contenido
Jerarquía: Área → Ruta/Curso → Módulo → Lección.
- Área: nombre, descripción, icono, color.
- Curso: título, área, nivel, tags, objetivo (ej. "Aprobar GH-200"), fecha meta opcional, horas por semana, estado (por empezar / en curso / completado), fuentes oficiales.
- Lección: título, módulo, orden, duración estimada, tags, dominio o peso de examen opcional.
- Tipos de bloque dentro de un curso:
  - roadmap: fases → semanas → tareas, con gates (criterios para avanzar)
  - lección teórica (Markdown + bloques de código con resaltado y botón copiar)
  - checklist (`- [ ]`) con progreso persistente
  - lab práctico: objetivo, pasos, criterio de "hecho", dominio que cubre
  - quiz: opción múltiple con explicación, en archivos YAML junto a la lección
  - flashcards: generadas desde el mismo YAML de quiz o desde una tabla "datos para memorizar"
  - recursos: tabla con enlace, tipo, costo y para qué sirve

IMPORTANTE: el contenido debe seguir siendo Markdown plano compatible con Obsidian (nada de MDX en las lecciones). Tengo que poder abrir `src/content/` como vault y editarlo ahí. Lo interactivo (checklists, quizzes) se interpreta desde Markdown estándar o desde YAML.

# Funcionalidades
1. Inicio / dashboard: progreso global y por curso, "continuar donde lo dejé", próximo paso del roadmap, días que faltan para cada fecha meta y racha de días estudiando.
2. Biblioteca: catálogo de áreas y cursos con filtros por área, tag, nivel y estado.
3. Vista de curso: roadmap visual (fases/semanas/gates), módulos, % completado y un gráfico de pesos por dominio cuando el curso es una certificación.
4. Vista de lección: tabla de contenidos, marcar como completada, notas personales por lección (localStorage), y navegación anterior/siguiente.
5. Quizzes: modo examen (con tiempo, puntaje e historial de intentos) y modo práctica (feedback inmediato). Al final, desglose por dominio para saber qué reforzar.
6. Flashcards con repetición espaciada simple (estilo Leitner).
7. Búsqueda global en todo el contenido.
8. Ajustes: exportar/importar progreso, resetear un curso, tema claro/oscuro.

# Metodologías de aprendizaje + laboratorio personal
La plataforma no solo guarda contenido: tiene que ayudarme a aprender mejor y averiguar con datos qué métodos me funcionan a mí.

## Métodos a implementar (cada uno como un "modo de estudio" de la lección)
1. Recuerdo activo / blurting: antes de ver la lección, escribo de memoria todo lo que sé del tema; después comparo con el contenido y marco qué faltó.
2. Repetición espaciada: reemplaza el Leitner simple por FSRS (o SM-2 si FSRS es demasiado complejo). Las tarjetas salen de quizzes, de las tablas "datos para memorizar" y de mis propios errores.
3. Técnica Feynman: explico el concepto con mis palabras, como para alguien junior, en un cuadro de texto. La plataforma me muestra un checklist de conceptos clave de la lección para que yo marque cuáles cubrí.
4. Práctica intercalada (interleaving): quizzes que mezclan preguntas de varios módulos o cursos en lugar de uno solo.
5. Práctica deliberada / aprender haciendo: los labs con criterio de "hecho"; si fallo algo, se registra en un "log de errores" que alimenta las flashcards.
6. Codificación dual: en cada lección, un espacio para un diagrama propio (enlace a imagen o Mermaid) además del texto.
7. Bloques de tiempo: temporizador Pomodoro configurable (25/5, 50/10) asociado a la sesión.
8. Elaboración: después de cada lección, 2–3 preguntas "¿por qué?" / "¿cómo se conecta con X?" que respondo por escrito.

No implementes "estilos de aprendizaje" (visual/auditivo/kinestésico): la evidencia científica no los respalda.

## Laboratorio de métodos (experimentar conmigo mismo)
- Cada sesión de estudio registra: fecha, curso, lección, método usado, duración, y al final cómo me sentí de foco y energía (escala 1–5).
- Retención medida, no percibida: la plataforma programa mini-quizzes automáticos de la lección a +1, +7 y +30 días, y guarda el puntaje asociado al método con el que la estudié.
- Modo experimento: yo elijo 2–3 métodos a comparar y la plataforma los rota entre lecciones de dificultad parecida del mismo curso (no siempre el mismo método para el mismo tipo de tema), para que la comparación sea justa.
- Panel "Cómo aprendo mejor": por método muestra retención a 1/7/30 días, tiempo invertido, minutos por punto de retención, foco promedio y cantidad de sesiones. Advierte si hay muy pocos datos (menos de ~5 sesiones por método) para sacar conclusiones.
- Recomendación: con datos suficientes, sugiere mi combinación de métodos por tipo de contenido (conceptos, datos para memorizar, práctica). Explica en una línea en qué datos se basa. Puedo aceptarla o ignorarla.
- Todo esto vive en localStorage y entra en el exportar/importar JSON.

# Contenido semilla
- Crea el curso "GitHub Actions — Certificación GH-200" con 5 módulos (uno por dominio del examen), un roadmap de 6 semanas en 3 fases con gates, 9 labs y unas 20 preguntas de quiz de ejemplo. Te pegaré mi roadmap en Markdown para usarlo como fuente: no inventes datos del examen.
- Crea un curso vacío de ejemplo en otra área (por ejemplo "Terraform") para probar que la plataforma es genérica.
- Agrega un script `npm run new:course` que genere la estructura de un curso nuevo desde una plantilla.

# CI/CD (también me sirve para practicar para el GH-200)
- Workflow de PR: lint, typecheck, validación del esquema de contenido, build y chequeo de enlaces rotos.
- Workflow de deploy a GitHub Pages en push a main, con `actions/upload-pages-artifact` y `actions/deploy-pages`.
- Buenas prácticas obligatorias: actions fijadas por SHA completo, `permissions` mínimos por job, cache de dependencias, `concurrency` en el deploy y un job summary con el resultado del build.
- Explica cada decisión del workflow con comentarios cortos en el YAML.

# Calidad
- Accesible (navegación por teclado, contraste AA) y responsive (la uso también desde el celular).
- Sin dependencias innecesarias; Lighthouse ≥ 90 en performance y accesibilidad.
- README con: cómo agregar un curso, cómo escribir quizzes en YAML, cómo usar la carpeta como vault de Obsidian y cómo hacer el deploy.

# Entrega por fases
1. Scaffold + modelo de contenido + esquemas + curso semilla renderizando.
2. Progreso, checklists, notas y dashboard.
3. Quizzes, flashcards y búsqueda.
4. CI/CD y deploy.
Al cerrar cada fase: muestra qué hiciste, cómo probarlo localmente, y espera mi OK.
