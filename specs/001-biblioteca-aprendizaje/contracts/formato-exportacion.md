# Contrato: formato de exportación

Archivo JSON con el documento completo de localStorage. Se fija en la fase 2; las fases siguientes agregan campos con una migración.

```json
{
  "version": 1,
  "exportado": "2026-11-06T12:00:00.000Z",
  "lecciones": {},
  "checklists": {},
  "notas": {},
  "intentos": [],
  "tarjetas": {},
  "errores": [],
  "sesiones": [],
  "miniquizzes": {},
  "experimentos": {},
  "ajustes": {}
}
```

## Reglas

- Un archivo con `version` mayor a la soportada se rechaza con un motivo.
- Uno con `version` menor se migra antes de combinar.
- Listas: unión por `id`.
- Mapas: por clave, gana el `actualizado` más reciente.
- Las claves sin contenido actual (huérfanos) se conservan.
- Reemplazar todo es una opción explícita con confirmación.
- Si falla la validación o la escritura, los datos existentes no cambian.
