---
titulo: Distribuir y versionar actions
orden: 3
duracion_min: 25
tags: [marketplace, versionado]
dificultad: 1
tipo_contenido: conceptos
conceptos_clave:
  - Distribución pública, privada y por Marketplace
  - Requisitos de Marketplace
  - Tags semánticos y tag mayor móvil
preguntas_elaboracion:
  - ¿Qué riesgo trae para un consumidor fijarse a un tag mayor móvil, y qué gana a cambio?
---

## Modelos de distribución

| Modelo | Cómo se consume |
| --- | --- |
| En el mismo repo | `uses: ./.github/actions/mi-action` |
| Repo privado o interno compartido | `uses: OWNER/REPO@ref`, habilitando el acceso en la configuración de Actions del repo |
| Público | `uses: OWNER/REPO@ref` |
| Marketplace | Igual, y además se puede descubrir en el catálogo |

## Requisitos de Marketplace

- El repo es público.
- Tiene un único archivo de metadata en la raíz. Puede haber otros en subcarpetas, pero no se listan.
- El `name` es único.

Si se borra el repo, también se borra la publicación.

## Versionado

Publica releases con tags semánticos (`v1.2.3`) y mantén un tag mayor (`v1`) que apunte a la última compatible.

```bash
git tag -a v1.2.3 -m "v1.2.3"
git tag -f v1 v1.2.3
git push origin v1.2.3
git push origin v1 --force
```

| Referencia | Estabilidad |
| --- | --- |
| `@<sha>` | Inmutable; la más segura |
| `@v1.2.3` | Un tag se puede mover |
| `@v1` | Móvil a propósito |
| `@main` | Cambia en cada commit |

Ver [[seguridad-en-workflows]].
