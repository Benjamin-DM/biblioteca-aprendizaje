# Quickstart: validación

Prerrequisito: Node ≥ 22.23.

```bash
npm install
npm test
npm run check      # tipos y esquemas
npm run dev        # http://localhost:4321/biblioteca-aprendizaje/
```

## Fase 1

1. Biblioteca: filtrar por área, tag, nivel y estado. Terraform aparece con estado vacío.
2. Curso GH-200: roadmap con gates, 5 módulos, gráfico de dominios, 9 labs y recursos.
3. Lección: tabla de contenidos, copiar código, anterior/siguiente, tema claro/oscuro.
4. Romper un quiz (borrar `correcta`): `npm run check` indica archivo y campo.
5. Poner `[[no-existe]]` en una lección: `npm run build` falla con el nombre del archivo.
6. `npm run new:course -- prueba --titulo "Prueba" --area infraestructura`: el curso aparece sin tocar código. Borrar la carpeta al terminar.

## Fases siguientes

Ver la columna "Cómo se prueba" en [preguntas-y-fases.md](preguntas-y-fases.md).
