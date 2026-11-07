---
titulo: Endurecer un workflow
orden: 1
duracion_min: 60
objetivo: Tomar un workflow inseguro y aplicarle pinning, permisos mínimos, mitigación de inyección y attestations.
criterio_hecho:
  - Un payload en el título de un PR ya no se ejecuta.
  - Todas las actions están fijadas por SHA completo y `actionlint` pasa.
  - "`gh attestation verify` confirma el artefacto."
---

Hazlo en un repo privado de prueba.

1. Escribe un workflow con `pull_request` que haga `echo` del título dentro de `${{ }}`.
2. Abre un PR con el título `"; echo INYECTADO; echo "` y observa el log.
3. Corrígelo pasando el valor por `env` y repite.
4. Declara `permissions: {}` a nivel de workflow y agrega solo lo necesario por job.
5. Reemplaza cada tag de action por su SHA completo, con la versión en un comentario.
6. Publica un artefacto con `actions/attest-build-provenance` y verifícalo con `gh attestation verify`.
