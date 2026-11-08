# Biblioteca de Aprendizaje

Plataforma web personal para estudiar temas técnicos y medir qué métodos de estudio funcionan. Sitio estático, un solo usuario, datos en el navegador.

## Dónde está cada cosa

- `.specify/memory/constitution.md`: principios y restricciones. Mandan sobre el resto.
- `specs/001-biblioteca-aprendizaje/`: `brief.md` (pedido original), `spec.md`, `preguntas-y-fases.md` (decisiones), `plan.md`, `tasks.md`.
- `src/content/`: el contenido. Se abre como vault de Obsidian; solo Markdown plano y YAML.

## Cómo trabajar

- Flujo Spec Kit: `/speckit-plan`, `/speckit-tasks`, `/speckit-implement`. Marcar las tareas hechas en `tasks.md`.
- Entrega por fases. Al cerrar cada una: qué se hizo, cómo probarlo y esperar el OK de Benjamin.
- Interfaz en español; términos técnicos en inglés.
- Las specs viven en `specs/` de este repo: excepción aprobada a la regla general de specs en el vault.
- Datos del examen GH-200: solo de la guía oficial o de docs.github.com. Lo demás se marca como material propio.

## Trampas conocidas

- Al cambiar el código de un plugin remark/rehype en `src/lib/`, borrar `node_modules/.astro/data-store.json` antes de construir: Astro cachea el Markdown renderizado y no detecta ese cambio.

## Git

- Repo personal en la cuenta **Benjamin-DM**: `git@github-personal:Benjamin-DM/biblioteca-aprendizaje.git` (alias SSH `github-personal`). Nunca la organización. `gh` tiene activa la cuenta de trabajo por defecto; no usarla acá.
- Identidad local del repo, no la global (que es la de trabajo).
- Commit y push solo con OK explícito. Sin firmas de autoría de Claude.
