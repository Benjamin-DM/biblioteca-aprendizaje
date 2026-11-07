---
titulo: Rendimiento y costo
orden: 2
duracion_min: 25
tags: [optimizacion, cache, concurrency]
dificultad: 2
tipo_contenido: conceptos
conceptos_clave:
  - Cache y retención eficientes
  - Reducir ejecuciones
  - Reducir el tamaño de la matrix
  - Runners adecuados
preguntas_elaboracion:
  - ¿Por qué un cache grande puede terminar haciendo más lento el workflow?
---

## Correr menos

```yaml
on:
  push:
    paths: ['src/**', 'package-lock.json']

concurrency:
  group: ci-${{ github.ref }}
  cancel-in-progress: true
```

- `paths` evita correr con cambios ajenos.
- `concurrency` cancela runs obsoletos.
- `if` salta jobs que no aplican.

## Correr más rápido

- Cachea dependencias, con claves basadas en `hashFiles`.
- Reduce la matrix a las combinaciones que aporten información, y deja el resto para `main` o una ejecución programada.
- Usa `timeout-minutes` para que un job colgado no consuma sus 360 minutos por defecto.
- Evalúa runners más grandes solo si reducen el tiempo total lo suficiente.

## Almacenar menos

- Usa `retention-days` bajos en artifacts temporales.
- Automatiza la limpieza y la retención por REST API en organizaciones grandes.
- Vigila el cache: si excedes el límite, GitHub expulsa entradas, y crear y borrar sin parar puede hacerlo todo más lento.

Datos en [[ejecucion-y-salidas]].
