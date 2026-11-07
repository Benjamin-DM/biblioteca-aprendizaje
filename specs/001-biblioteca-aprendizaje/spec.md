# Feature Specification: Biblioteca de Aprendizaje

**Feature Branch**: `001-biblioteca-aprendizaje`

**Created**: 2026-11-06

**Status**: Draft

**Input**: User description: ver [brief.md](brief.md) (texto original completo)

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Explorar la biblioteca y leer una lección (Priority: P1)

Abro la plataforma, filtro el catálogo por área, tag, nivel o estado, entro a un curso, veo su roadmap (fases, semanas, tareas, gates), sus módulos y sus recursos, y leo una lección con tabla de contenidos, código con resaltado y botón copiar, y navegación anterior/siguiente.

**Why this priority**: sin contenido navegable no hay nada que medir ni repasar.

**Independent Test**: con el curso semilla cargado, llegar desde el catálogo hasta una lección y copiar un bloque de código.

**Acceptance Scenarios**:

1. **Given** un catálogo con dos áreas, **When** filtro por un área, **Then** solo veo sus cursos.
2. **Given** un curso con roadmap, **When** abro su vista, **Then** veo fases, semanas, tareas y gates.
3. **Given** un curso con pesos por dominio, **When** abro su vista, **Then** veo el gráfico de pesos; **Given** un curso sin pesos, **Then** el gráfico no aparece.
4. **Given** un curso sin módulos, **When** abro su vista, **Then** se muestra un estado vacío sin errores.

---

### User Story 2 - Agregar contenido sin tocar la plataforma (Priority: P1)

Genero un curso nuevo con un comando, lo edito en Obsidian abriendo la carpeta de contenido como vault, y aparece en la biblioteca. Si escribo mal un dato, la validación me dice qué archivo y qué campo fallan.

**Why this priority**: la plataforma existe para crecer con cada tema nuevo.

**Independent Test**: generar un curso con el comando, agregar una lección desde Obsidian y verla publicada localmente sin cambiar código.

**Acceptance Scenarios**:

1. **Given** el comando de curso nuevo, **When** lo ejecuto con un nombre, **Then** se crea la estructura desde la plantilla y el sitio compila.
2. **Given** un quiz con un campo faltante, **When** corro la validación, **Then** falla indicando archivo y campo.
3. **Given** una lección con enlaces internos de Obsidian, **When** se publica, **Then** se ven como enlaces navegables.

---

### User Story 3 - Seguir mi progreso (Priority: P2)

Marco lecciones y checklists como hechos, escribo notas por lección y, al volver, el inicio me muestra el progreso global y por curso, dónde continuar, el próximo paso del roadmap, los días hasta cada fecha meta y mi racha.

**Why this priority**: da continuidad entre sesiones de estudio.

**Independent Test**: completar una lección, cerrar y reabrir el navegador, y comprobar que el inicio refleja el avance.

**Acceptance Scenarios**:

1. **Given** una lección con checklist, **When** marco ítems y recargo, **Then** siguen marcados.
2. **Given** progreso previo, **When** abro el inicio, **Then** "continuar" me lleva a la última lección abierta.
3. **Given** un curso sin fecha meta, **When** abro el inicio, **Then** no aparece cuenta regresiva para ese curso.

---

### User Story 4 - Evaluarme con quizzes (Priority: P2)

Hago un quiz en modo práctica (feedback inmediato) o en modo examen (con tiempo, puntaje e historial), de un módulo o intercalando varios módulos o cursos, y al final veo el desglose por dominio para saber qué reforzar.

**Why this priority**: es la medición base de la que dependen las tarjetas y el laboratorio.

**Independent Test**: completar un quiz en cada modo y verificar puntaje, explicación, desglose e historial.

**Acceptance Scenarios**:

1. **Given** modo práctica, **When** respondo, **Then** veo de inmediato si acerté y la explicación.
2. **Given** modo examen, **When** se agota el tiempo, **Then** el intento se cierra y se puntúa con lo respondido.
3. **Given** un quiz intercalado, **When** lo configuro, **Then** mezcla preguntas de los módulos o cursos elegidos.

---

### User Story 5 - Repasar con repetición espaciada (Priority: P2)

Repaso cada día las tarjetas que tocan. Salen de los quizzes, de las tablas "datos para memorizar" y de mis errores en labs. Cuando fallo un lab, lo anoto en el log de errores y se vuelve tarjeta.

**Why this priority**: es el método con más retorno para memorizar datos de examen.

**Independent Test**: repasar una tarjeta, comprobar que su próxima fecha cambia según la calificación, y crear una desde el log de errores.

**Acceptance Scenarios**:

1. **Given** tarjetas vencidas, **When** repaso y califico, **Then** cada una se reprograma según mi respuesta.
2. **Given** un error registrado en un lab, **When** lo guardo, **Then** aparece como tarjeta nueva.
3. **Given** ninguna tarjeta vencida, **When** abro repaso, **Then** veo cuándo vence la próxima.

---

### User Story 6 - Buscar en todo el contenido (Priority: P3)

Busco un término y encuentro lecciones, labs y recursos de cualquier curso.

**Why this priority**: gana valor a medida que crece la biblioteca.

**Independent Test**: buscar un término presente solo en una lección y llegar a ella desde el resultado.

**Acceptance Scenarios**:

1. **Given** un término existente, **When** lo busco, **Then** veo resultados con enlace al contenido.
2. **Given** un término inexistente, **When** lo busco, **Then** veo un mensaje de sin resultados.

---

### User Story 7 - Proteger y mover mis datos (Priority: P2)

Desde ajustes exporto todos mis datos a un archivo, los importo en otro dispositivo, reseteo un curso y cambio entre tema claro y oscuro.

**Why this priority**: todo vive en un solo navegador; sin esto, perder ese navegador es perderlo todo.

**Independent Test**: exportar, borrar los datos del navegador, importar y comprobar que todo vuelve.

**Acceptance Scenarios**:

1. **Given** datos existentes, **When** exporto y reimporto, **Then** progreso, notas, sesiones, tarjetas y experimentos quedan intactos.
2. **Given** un archivo inválido, **When** lo importo, **Then** se rechaza con un motivo y nada cambia.
3. **Given** resetear un curso, **When** confirmo, **Then** solo se borran los datos de ese curso.

---

### User Story 8 - Publicación validada (Priority: P2)

Cada cambio propuesto pasa automáticamente lint, typecheck, validación de contenido, build y chequeo de enlaces. Al integrarse a la rama principal, el sitio se publica. Los workflows sirven además como material de práctica para el GH-200.

**Why this priority**: me da acceso desde el celular y evita publicar contenido roto.

**Independent Test**: abrir un cambio con un enlace roto y ver que falla; integrar uno correcto y ver el sitio actualizado.

**Acceptance Scenarios**:

1. **Given** un cambio con contenido inválido, **When** se valida, **Then** el resultado es fallido e indica la causa.
2. **Given** dos publicaciones seguidas, **When** corren, **Then** solo queda vigente la más reciente.

---

### User Story 9 - Estudiar con modos basados en evidencia (Priority: P3)

Al estudiar una lección elijo un modo: blurting (escribo lo que recuerdo y luego marco qué faltó), Feynman (explico y marco los conceptos clave que cubrí), elaboración (respondo preguntas "¿por qué?"), codificación dual (agrego mi diagrama) o práctica deliberada (lab). Puedo usar un temporizador Pomodoro 25/5 o 50/10 asociado a la sesión.

**Why this priority**: cambia cómo estudio, pero requiere contenido y progreso funcionando.

**Independent Test**: completar una lección en cada modo y comprobar que lo escrito y la sesión quedan guardados.

**Acceptance Scenarios**:

1. **Given** modo blurting, **When** inicio, **Then** el contenido de la lección queda oculto hasta que entrego mi texto.
2. **Given** modo Feynman en una lección con conceptos clave, **When** entrego, **Then** puedo marcar cuáles cubrí.
3. **Given** un diagrama propio en Mermaid, **When** lo guardo, **Then** se ve dibujado en la lección.

---

### User Story 10 - Descubrir cómo aprendo mejor (Priority: P3)

Cada sesión registra método, duración, foco y energía. La plataforma me programa mini-quizzes a +1, +7 y +30 días y guarda el puntaje asociado al método. En modo experimento elijo 2-3 métodos y la plataforma los rota entre lecciones comparables. Un panel compara métodos, advierte si hay pocos datos y, con datos suficientes, recomienda una combinación por tipo de contenido, explicada en una línea.

**Why this priority**: es lo más diferencial, pero solo da resultados tras semanas de uso.

**Independent Test**: con datos de prueba cargados por importación, comprobar panel, advertencias y recomendación con cifras calculadas a mano.

**Acceptance Scenarios**:

1. **Given** una sesión terminada hoy, **When** abro la plataforma mañana, **Then** veo su mini-quiz de +1 día pendiente.
2. **Given** un experimento con 2 métodos, **When** avanzo por lecciones de dificultad parecida, **Then** los métodos se reparten y la asignación queda registrada.
3. **Given** un método con menos de 5 sesiones, **When** abro el panel, **Then** veo la advertencia de pocos datos y no hay recomendación basada en él.
4. **Given** datos suficientes, **When** veo la recomendación, **Then** indica en qué datos se basa y puedo aceptarla o ignorarla.

---

### Edge Cases

- Cambio el texto de un ítem de checklist o renombro una lección: el progreso asociado no se borra; queda como huérfano y sigue en la exportación.
- Se llena el almacenamiento del navegador: se avisa al usuario y se le ofrece exportar, sin fallar en silencio.
- Dos pestañas abiertas escriben a la vez: no se pierden datos ya guardados.
- Una exportación viene de una versión anterior del esquema: se migra al importarla.
- Un mini-quiz se hace fuera de su ventana: se guarda, pero no cuenta en la comparación de métodos.
- Una lección tiene pocas preguntas: no participa en el experimento y se indica por qué.
- Una lección no define preguntas de elaboración o conceptos clave: el modo correspondiente usa preguntas genéricas o avisa que falta el dato.
- Un curso no tiene quizzes, roadmap ni módulos: las vistas muestran estado vacío.
- El reloj cambia durante un quiz en modo examen o la pestaña queda en segundo plano: el tiempo restante se calcula sobre la hora de fin, no por conteo de ticks.

## Requirements *(mandatory)*

### Functional Requirements

**Contenido**

- **FR-001**: El contenido MUST organizarse como Área → Curso → Módulo → Lección, con los campos definidos en el brief.
- **FR-002**: Las lecciones MUST ser Markdown plano editable en Obsidian; quizzes y flashcards MUST definirse en YAML junto a la lección.
- **FR-003**: La lección MUST admitir además, de forma opcional: dificultad, tipo de contenido (conceptos, datos para memorizar, práctica), conceptos clave y preguntas de elaboración.
- **FR-004**: Cada pregunta de quiz MUST tener un identificador estable y un dominio opcional; los identificadores duplicados MUST fallar la validación.
- **FR-005**: El contenido inválido MUST fallar la validación indicando archivo y campo.
- **FR-006**: Los enlaces internos e imágenes de Obsidian MUST mostrarse correctamente en el sitio.
- **FR-007**: Un comando MUST generar la estructura de un curso nuevo desde una plantilla.
- **FR-008**: La semilla MUST incluir el curso GH-200 (5 módulos, roadmap de 6 semanas en 3 fases con gates, 9 labs, unas 20 preguntas) y un curso vacío de otra área. Dominios, pesos y datos del examen MUST salir de la [guía oficial GH-200](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/gh-200) (skills de enero 2026). Roadmap, labs y preguntas son material propio, redactado desde esa guía y la documentación oficial, y MUST marcarse como tal: no son preguntas de examen.

**Navegación y progreso**

- **FR-009**: El catálogo MUST filtrarse por área, tag, nivel y estado.
- **FR-010**: La vista de curso MUST mostrar roadmap, módulos, porcentaje completado y, si hay pesos, un gráfico por dominio.
- **FR-011**: La vista de lección MUST ofrecer tabla de contenidos, marcar como completada, notas personales, y navegación anterior/siguiente.
- **FR-012**: Los bloques de código MUST tener resaltado y botón copiar.
- **FR-013**: Los checklists de Markdown MUST ser interactivos y persistentes.
- **FR-014**: El inicio MUST mostrar progreso global y por curso, continuar, próximo paso del roadmap, días a cada fecha meta y racha de días.
- **FR-015**: El sitio MUST ofrecer búsqueda global en todo el contenido.

**Evaluación y repaso**

- **FR-016**: Los quizzes MUST ofrecer modo práctica y modo examen, con historial de intentos y desglose por dominio.
- **FR-017**: Los quizzes MUST poder intercalar preguntas de varios módulos o cursos.
- **FR-018**: Las tarjetas MUST programarse con repetición espaciada (FSRS, o SM-2 si FSRS resulta demasiado complejo) y reemplazan al Leitner mencionado en el brief.
- **FR-019**: Las tarjetas MUST originarse en quizzes, tablas "datos para memorizar" y el log de errores.
- **FR-020**: Los labs MUST mostrar objetivo, pasos, criterio de "hecho" y dominio, y permitir registrar errores en el log.

**Modos de estudio**

- **FR-021**: La lección MUST ofrecer los modos blurting, Feynman, elaboración, codificación dual (imagen o Mermaid) y práctica deliberada.
- **FR-022**: El sistema MUST ofrecer temporizador configurable (25/5 y 50/10) asociado a la sesión.
- **FR-023**: El sistema MUST NOT implementar estilos de aprendizaje (visual, auditivo, kinestésico).

**Laboratorio de métodos**

- **FR-024**: Cada sesión MUST registrar fecha, curso, lección, método, duración, foco y energía (1-5).
- **FR-025**: El sistema MUST programar mini-quizzes a +1, +7 y +30 días y guardar el puntaje asociado al método.
- **FR-026**: El modo experimento MUST permitir elegir 2-3 métodos y rotarlos entre lecciones de dificultad parecida del mismo curso, registrando la asignación.
- **FR-027**: Durante un experimento, las preguntas usadas en mini-quizzes MUST NOT aparecer como tarjetas, y las tarjetas de lecciones asignadas a un método sin repetición espaciada MUST suspenderse hasta el mini-quiz de +30 días, para no contaminar la medición.
- **FR-028**: El panel MUST mostrar por método: retención a 1/7/30 días, tiempo invertido, minutos por punto de retención, foco promedio y cantidad de sesiones, y advertir si hay menos de 5 sesiones.
- **FR-029**: Con datos suficientes, el sistema MUST recomendar una combinación de métodos por tipo de contenido, explicar en una línea en qué datos se basa y permitir aceptarla o ignorarla.

**Datos y ajustes**

- **FR-030**: Todos los datos personales MUST guardarse solo en el navegador y entrar en la exportación e importación JSON.
- **FR-031**: Importar MUST validar el archivo antes de aplicarlo y rechazar los inválidos sin cambios. Por defecto MUST combinar con los datos existentes: unión de sesiones e intentos por identificador, y en progreso y tarjetas gana lo más reciente. Reemplazar todo queda como opción con confirmación.
- **FR-032**: Ajustes MUST permitir resetear un curso con confirmación y cambiar el tema claro/oscuro.

**Publicación**

- **FR-033**: Cada cambio propuesto MUST validarse con lint, typecheck, esquema de contenido, build y enlaces rotos.
- **FR-034**: La integración a la rama principal MUST publicar el sitio, según las prácticas de la constitución.
- **FR-035**: El README MUST explicar cómo agregar un curso, escribir quizzes, usar la carpeta como vault y publicar.

### Key Entities

- **Área**: agrupa cursos; nombre, descripción, icono, color.
- **Curso**: pertenece a un área; nivel, tags, objetivo, fecha meta, horas por semana, estado, fuentes oficiales.
- **Módulo**: agrupa lecciones de un curso, con dominio y peso opcionales.
- **Lección**: pertenece a un módulo; orden, duración, tags, dominio, dificultad, tipo de contenido, conceptos clave, preguntas de elaboración.
- **Roadmap**: fases, semanas, tareas y gates de un curso.
- **Lab**: objetivo, pasos, criterio de "hecho", dominio.
- **Pregunta**: opciones, respuesta, explicación, dominio; identificador estable.
- **Recurso**: enlace, tipo, costo, para qué sirve.
- **Progreso** *(personal)*: lecciones y checklists completados, notas, última lección abierta.
- **Intento de quiz** *(personal)*: modo, puntaje, tiempo, respuestas, desglose por dominio.
- **Tarjeta** *(personal)*: origen, estado de repetición, próxima fecha.
- **Error de lab** *(personal)*: lab, descripción, tarjeta generada.
- **Sesión de estudio** *(personal)*: fecha, lección, método, duración, foco, energía.
- **Mini-quiz programado** *(personal)*: lección, intervalo, método, fecha prevista, puntaje, si cayó en ventana.
- **Experimento** *(personal)*: curso, métodos comparados, asignación por lección.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Puedo publicar localmente un curso nuevo sin modificar código de la plataforma, en menos de 10 minutos.
- **SC-002**: Las páginas alcanzan ≥ 90 en auditoría estándar de performance y accesibilidad, en móvil.
- **SC-003**: Todas las funciones se pueden usar solo con teclado y en pantallas de 360 px de ancho.
- **SC-004**: Una exportación reimportada en un navegador limpio restaura el 100 % de los datos personales.
- **SC-005**: Las cifras del panel de métodos coinciden con un cálculo manual sobre un conjunto de datos de prueba.
- **SC-006**: Ningún método con menos de 5 sesiones aparece en una recomendación.
- **SC-007**: Un contenido inválido o un enlace roto nunca llega al sitio publicado.
- **SC-008**: El sitio publicado no realiza ninguna petición a terceros ni expone datos personales.

## Assumptions

- Un solo usuario. Sin login, backend ni sincronización automática; el traspaso entre dispositivos es manual por archivo.
- Sin notificaciones: los mini-quizzes y repasos pendientes se muestran al abrir la plataforma.
- Sin IA en runtime: conceptos clave y preguntas de elaboración se escriben en el contenido, y la recomendación es un cálculo sobre mis datos.
- Las ventanas válidas de mini-quiz son +1 d (1-3), +7 d (5-10) y +30 d (25-40). Decisión propia, ajustable.
- Cada sesión registra un único método principal, para que la comparación sea atribuible.
- Una lección necesita al menos 6 preguntas para entrar a un experimento (2 por mini-quiz, sin repetir). Decisión propia, ajustable.
- "Dificultad parecida" significa el mismo valor de dificultad (1-3) declarado en la lección.
- Los resultados del laboratorio son orientativos: con un solo sujeto y pocas muestras no constituyen evidencia estadística.
