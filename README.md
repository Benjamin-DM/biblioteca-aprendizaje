# Biblioteca de Aprendizaje

Plataforma web personal para estudiar temas técnicos: rutas de estudio, lecciones, labs, quizzes, repaso con repetición espaciada y seguimiento de progreso. Es un sitio estático, para un solo usuario: tus datos quedan en el navegador.

Publicada en https://benjamin-dm.github.io/biblioteca-aprendizaje/

## Requisitos y comandos

Node 24 (ver `.nvmrc`).

| Comando | Qué hace |
| --- | --- |
| `npm install` | Instala dependencias |
| `npm run dev` | Servidor local en http://localhost:4321/biblioteca-aprendizaje/ (sin búsqueda) |
| `npm run build` | Genera `dist/` y el índice de búsqueda |
| `npm run preview` | Sirve `dist/` para probarlo como en producción |
| `npm run check` | Tipos y validación del contenido |
| `npm run lint` | ESLint |
| `npm test` | Tests |
| `npm run check:links` | Enlaces internos rotos en `dist/` |
| `npm run new:course -- <id> --titulo "Título" --area <area>` | Crea un curso desde la plantilla |

## Cómo está organizado el contenido

Todo vive en `src/content/`. La jerarquía sale de las carpetas:

```text
src/content/
├── areas/<area>.md                  # nombre, descripcion, icono, color
├── _adjuntos/                       # imágenes
└── cursos/<curso>/
    ├── curso.md                     # titulo, area, nivel, objetivo, fecha_meta, ...
    ├── roadmap.yaml                 # fases, semanas, tareas y gates (opcional)
    ├── recursos.md                  # tabla de recursos (opcional)
    └── modulos/<NN-modulo>/
        ├── modulo.md                # titulo, orden, dominio y peso (opcional)
        ├── <leccion>.md
        ├── <leccion>.quiz.yaml      # preguntas de esa lección (opcional)
        └── lab-<nombre>.md          # objetivo, criterio_hecho; pasos en el cuerpo
```

El formato completo de cada archivo está en `specs/001-biblioteca-aprendizaje/contracts/formato-contenido.md`.

## Agregar un curso

1. `npm run new:course -- kubernetes --titulo "Kubernetes" --area infraestructura`
2. Edita `src/content/cursos/kubernetes/curso.md` y la lección de ejemplo.
3. `npm run check` te dice qué archivo y qué campo están mal, si los hay.
4. `npm run dev` y abre la biblioteca.

Para un área nueva, crea `src/content/areas/<id>.md` con `nombre`, `descripcion`, `icono` y `color` (hexadecimal).

## Escribir quizzes

Un archivo `<leccion>.quiz.yaml` junto a la lección, con el mismo nombre:

```yaml
preguntas:
  - id: dispatch-inputs        # minúsculas y guiones; único en el archivo
    enunciado: ¿Qué evento acepta inputs definidos manualmente?
    opciones:
      - workflow_dispatch
      - schedule
    correcta: 0                # índice de la opción correcta, desde 0
    explicacion: workflow_dispatch define inputs tipados.
```

- **No cambies un `id` publicado:** el historial y las tarjetas de repaso dependen de él.
- **Si un texto contiene `::` o `: `, ponlo entre comillas:** si no, YAML lo interpreta como otra cosa.
- **El dominio de cada pregunta sale del `modulo.md`:** es el que se usa en el desglose de resultados.
- **Las preguntas también son tarjetas de repaso.** Además, toda tabla bajo un título `## Para memorizar` se convierte en tarjetas: primera columna al frente, el resto atrás.

## Usar la carpeta como vault de Obsidian

1. En Obsidian: **Open folder as vault** y elige `src/content/`.
2. En **Settings > Files & Links**, activa **Detect all file extensions** para ver los `.yaml`.
3. Los enlaces `[[nota]]`, `[[nota|texto]]` y `![[imagen.png]]` funcionan en el sitio. Un enlace a una nota que no existe falla el build, así que no se publica nada roto.
4. Guarda las imágenes en `_adjuntos/`. La carpeta `.obsidian/` está ignorada por git.

## Tus datos

Progreso, notas, sesiones, intentos y tarjetas se guardan en el `localStorage` del navegador. No hay servidor.

- **Ajustes > Exportar** descarga un respaldo JSON.
- **Ajustes > Importar** lo combina con lo que ya tienes: por cada dato gana el más reciente. Así pasas tus datos entre la PC y el celular.
- Si borras los datos del navegador sin exportar, se pierden.

## Deploy

GitHub Actions publica en GitHub Pages en cada push a `main`.

| Workflow | Cuándo | Qué hace |
| --- | --- | --- |
| `pr.yml` | Pull request a `main` | Lint, typecheck, esquema, tests, build y enlaces |
| `deploy.yml` | Push a `main` o manual | Lo mismo y, si pasa, publica en Pages |
| `validar.yml` | Lo llaman los otros dos | Los pasos de validación, en un solo lugar |

Configuración inicial, una sola vez:

1. Crea el repo `biblioteca-aprendizaje` en GitHub.
2. En **Settings > Pages > Build and deployment**, elige **Source: GitHub Actions**.
3. Haz push a `main`.

Si el repo cambia de nombre o de cuenta, actualiza `site` y `base` en `astro.config.mjs`, y la base en `scripts/check-links.mjs`.

Los comentarios de cada workflow explican sus decisiones: actions fijadas por SHA completo, `permissions` mínimos por job, cache de npm, `concurrency` y job summary.
