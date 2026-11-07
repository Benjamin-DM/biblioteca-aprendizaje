---
titulo: Matrix con service container
orden: 2
duracion_min: 45
objetivo: Generar variantes de un job con matrix y probar contra una base de datos en un service container.
criterio_hecho:
  - La matrix genera las combinaciones esperadas, con una excluida y una agregada por `include`.
  - Un job se conecta a Postgres y ejecuta una consulta.
  - Sabes si tu workflow acepta `<<`, porque lo probaste.
---

1. Crea una matrix de `os` y `node` con `fail-fast: false` y `max-parallel: 2`.
2. Excluye una combinación y devuélvela con `include`. Comprueba en la UI qué jobs se generan.
3. Fuerza un fallo en una variante y observa que las demás terminan.
4. Agrega otro job en `ubuntu-latest` con `services: postgres`, con health check.
5. Conéctate por `localhost:5432` con `psql` y ejecuta `SELECT 1`.
6. Reutiliza un bloque `env` con `&` y `*`. Después intenta `<<: *comunes` y anota el resultado.
