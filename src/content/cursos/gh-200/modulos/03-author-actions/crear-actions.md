---
titulo: Tipos de action
orden: 1
duracion_min: 30
tags: [actions, javascript, docker, composite]
dificultad: 2
tipo_contenido: conceptos
conceptos_clave:
  - Action de JavaScript
  - Action de Docker
  - Composite action
  - Troubleshooting de una action
preguntas_elaboracion:
  - ¿Por qué una action de Docker limita en qué runners puede correr?
  - ¿Qué cambia al diagnosticar un fallo en una composite action frente a una de JavaScript?
---

## Comparación

| Aspecto | JavaScript | Docker | Composite |
| --- | --- | --- | --- |
| Corre en | Directo en el runner | Un contenedor | Steps en el runner |
| Sistemas | Linux, Windows, macOS | Solo Linux | Según sus steps |
| Inicio | Rápido | Más lento: debe obtener o construir la imagen | Rápido |
| Dependencias | Empaquetadas con la action | Dentro de la imagen | Las del runner o de otras actions |
| Usa | Una versión de Node en `runs.using` | `docker` | `composite` |

## Composite

```yaml
name: Saludar
description: Saluda y expone el saludo
inputs:
  nombre:
    required: true
outputs:
  saludo:
    value: ${{ steps.s.outputs.saludo }}
runs:
  using: composite
  steps:
    - id: s
      shell: bash
      env:
        NOMBRE: ${{ inputs.nombre }}
      run: echo "saludo=Hola $NOMBRE" >> "$GITHUB_OUTPUT"
```

Cada step `run` de una composite action debe declarar `shell`.

## Troubleshooting

- Activa el debug logging: ver [[interpretar-ejecuciones]].
- Si la action no se encuentra, revisa la ref y el acceso al repo.
- En JavaScript, comprueba que el código empaquetado esté en el repo: el runner no ejecuta `npm install` por ti.
- Para comunicar errores desde la action, usa `::error::` y un código de salida distinto de 0.

## Immutable actions

La guía del examen pide entender el despliegue de immutable actions en runners hospedados y su efecto en el pinning. Léelo junto con el pinning por SHA en [[seguridad-en-workflows]], y consulta la documentación vigente: es un tema que cambia.

## Practica

- [ ] Hacer [[lab-action-composite]]
- [ ] Hacer [[lab-action-javascript]]
