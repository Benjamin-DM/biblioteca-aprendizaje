---
titulo: Secretos y variables
orden: 3
duracion_min: 30
tags: [secrets, variables, api]
dificultad: 2
tipo_contenido: datos
conceptos_clave:
  - Alcance en organización, repo y environment
  - Precedencia
  - Enmascarado en logs
  - Gestión por REST API
preguntas_elaboracion:
  - ¿Por qué un secreto de environment es más seguro que uno de repo para producción?
  - ¿Cuándo usarías una variable en lugar de un secreto?
---

## Alcance

Secretos y variables existen en tres niveles: organización, repositorio y environment. Si un nombre se repite, gana el nivel más bajo.

```text
environment > repositorio > organización
```

Los secretos de un environment solo están disponibles para jobs que lo referencian, y después de la aprobación si esta se requiere.

## Uso

```yaml
steps:
  - run: ./desplegar.sh "$URL"
    env:
      URL: ${{ vars.API_URL }}
      TOKEN: ${{ secrets.DEPLOY_TOKEN }}
```

| Aspecto | `secrets` | `vars` |
| --- | --- | --- |
| Valor | Cifrado | Texto |
| En logs | Se enmascara | Visible |
| Para | Credenciales | Configuración |

Pásalos por `env`, no dentro del texto del script. El enmascarado lo hace el runner: solo oculta un secreto usado en el job. Para un valor derivado, usa `::add-mask::`.

## Por REST API

Un secreto debe cifrarse con la clave pública del repo antes de enviarse. `gh` lo hace por ti.

```bash
gh secret set DEPLOY_TOKEN --env produccion
gh variable set API_URL --body https://api.ejemplo.com
gh api repos/OWNER/REPO/actions/secrets/public-key
```

## Para memorizar

| Dato | Valor |
| --- | --- |
| Precedencia | Environment, repo, organización |
| Dato visible en logs | Variables |
