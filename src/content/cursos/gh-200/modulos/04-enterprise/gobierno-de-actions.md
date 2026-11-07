---
titulo: Gobierno de actions y workflows
orden: 1
duracion_min: 25
tags: [gobierno, politicas, enterprise]
dificultad: 2
tipo_contenido: conceptos
conceptos_clave:
  - Componentes reutilizables centralizados
  - Políticas de uso a nivel enterprise, organización y repo
  - Lista de actions permitidas
preguntas_elaboracion:
  - ¿Por qué una política de enterprise debe poder restringir lo que decide una organización?
---

## Reutilizar con control

Centraliza reusable workflows y plantillas en repos de la organización, con tags y revisión obligatoria. Así un arreglo de seguridad llega desde un solo lugar.

## Políticas de uso

Las políticas se definen en enterprise, organización y repo, y el nivel superior limita al inferior.

| Política | Efecto |
| --- | --- |
| Permitir todas | Cualquier action |
| Solo locales | Actions del mismo enterprise u organización |
| Seleccionadas | Las de GitHub, de creadores verificados, o por patrones |
| Deshabilitar | Sin Actions |

Ejemplo de patrones:

```text
actions/*,
mi-org/*,
proveedor/action@v2
```

## Controlar el acceso

- Un repo privado o interno con actions debe habilitar el acceso desde otros repos en su configuración de Actions.
- Protege `.github/workflows/` con CODEOWNERS.
- Limita los permisos por defecto de `GITHUB_TOKEN`. Ver [[seguridad-en-workflows]].
