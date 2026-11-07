---
titulo: Seguridad en workflows
orden: 1
duracion_min: 50
tags: [seguridad, injection, oidc, attestations]
dificultad: 3
tipo_contenido: conceptos
conceptos_clave:
  - Script injection
  - Permisos y ciclo de vida de GITHUB_TOKEN
  - OIDC con id-token
  - Pinning por SHA completo
  - Artifact attestations
preguntas_elaboracion:
  - ¿Por qué pasar un valor por env evita la inyección, si el valor sigue siendo el mismo?
  - ¿Cómo se conecta OIDC con eliminar secretos de larga duración?
---

## Script injection

`${{ }}` se expande **antes** de que corra el shell. Un título de PR malicioso se vuelve código.

```yaml
# Vulnerable
- run: echo "${{ github.event.pull_request.title }}"

# Seguro: el shell recibe el valor como dato
- run: echo "$TITULO"
  env:
    TITULO: ${{ github.event.pull_request.title }}
```

Valida las entradas, usa comillas en el shell y prefiere actions revisadas a scripts inline con datos externos.

## GITHUB_TOKEN

Se crea para cada job y expira al terminar, o tras 24 horas como máximo. Declara lo mínimo:

```yaml
permissions:
  contents: read

jobs:
  etiquetar:
    permissions:
      contents: read
      pull-requests: write
```

| Aspecto | `GITHUB_TOKEN` | PAT |
| --- | --- | --- |
| Vida | Un job | Hasta que expire o se revoque |
| Alcance | El repo del workflow | El que tenga el usuario |
| Se crea | Automáticamente | A mano |

## OIDC

El job pide un token firmado y el proveedor cloud lo cambia por credenciales temporales. Así no guardas secretos de larga duración.

```yaml
permissions:
  id-token: write
  contents: read
```

Restringe la confianza en el cloud por repo, rama o environment, usando el claim `sub`.

## Pinning

```yaml
- uses: actions/checkout@<SHA-completo>  # v4.2.2
```

Solo un SHA completo es inmutable. Un tag puede moverse. Los `@main` o `@v*` flotantes necesitan una justificación.

## Políticas y aprobación

- Usa environments con aprobadores para despliegues. Ver [[ejecucion-y-salidas]].
- Limita las actions permitidas. Ver [[gobierno-de-actions]].
- Antes de adoptar una action, revisa creador, código y mantenimiento.

## Artifact attestations

Prueban dónde y cómo se construyó un artefacto.

```yaml
permissions:
  id-token: write
  attestations: write
  contents: read
steps:
  - uses: actions/attest-build-provenance@<SHA-completo>
    with:
      subject-path: dist/app.tar.gz
```

```bash
gh attestation verify dist/app.tar.gz --repo OWNER/REPO
```

## Practica

- [ ] Hacer [[lab-endurecer-workflow]]
