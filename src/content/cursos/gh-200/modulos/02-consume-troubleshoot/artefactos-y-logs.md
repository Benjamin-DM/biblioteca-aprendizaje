---
titulo: Artefactos y logs
orden: 2
duracion_min: 20
tags: [artifacts, logs, api]
dificultad: 1
tipo_contenido: practica
conceptos_clave:
  - Encontrar runs, logs y artifacts en la UI
  - Acceso por REST API y gh
preguntas_elaboracion:
  - ¿Cuándo conviene automatizar la descarga de logs por API en lugar de usar la UI?
---

## En la UI

Pestaña **Actions**, luego el workflow y el run. Los artifacts aparecen al final del resumen; los logs se ven por step y se pueden descargar.

## Con gh

```bash
gh run list --workflow ci.yml --limit 5
gh run view RUN_ID --log-failed
gh run download RUN_ID --name reporte
```

## Con REST API

```bash
gh api repos/OWNER/REPO/actions/runs
gh api repos/OWNER/REPO/actions/runs/RUN_ID/artifacts
gh api repos/OWNER/REPO/actions/runs/RUN_ID/logs > logs.zip
gh api -X DELETE repos/OWNER/REPO/actions/artifacts/ARTIFACT_ID
```

Si un secreto llega sin enmascarar a un log, borra el log y rota el secreto. Ver [[secretos-y-variables]].
