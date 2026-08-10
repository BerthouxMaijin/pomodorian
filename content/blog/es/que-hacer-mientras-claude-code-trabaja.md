---
title: "Qué hacer mientras Claude Code trabaja: un método"
description: "Las respuestas reales de Reddit, lo que dice la investigación sobre la atención y un flujo de trabajo con Claude Code que protege tu concentración."
date: "2026-08-10"
updated: "2026-08-10"
readTime: "10 min"
author: "Jean-Baptiste Berthoux"
keywords:
  - claude code workflow
  - que hacer mientras claude code trabaja
  - espera agente ia
  - cambio de contexto desarrolladores
status: published
translationKey: what-to-do-while-claude-code-is-working
sources:
  - "https://ics.uci.edu/~gmark/chi08-mark.pdf"
  - "https://www.sciencedirect.com/science/article/abs/pii/S0749597809000399"
  - "https://www.reddit.com/r/ClaudeCode/comments/1rferq7/what_do_you_do_when_claude_code_is_working/"
  - "https://www.reddit.com/r/ClaudeCode/comments/1qx9vdo/what_do_you_do_while_claude_code_is_working/"
  - "https://xkcd.com/303/"
---

La respuesta corta: quédate dentro de la tarea. Los mejores usos de los minutos en los que Claude Code trabaja son revisar lo que el agente acaba de producir, leer su razonamiento y escribir el siguiente prompt. El peor uso, según los desarrolladores que lo han probado y según cuatro décadas de investigación sobre la atención, es saltar a otro proyecto «solo un minuto».

Esa respuesta merece desarrollo, porque la espera en sí es nueva. Las herramientas de programación agéntica funcionan hoy de forma autónoma desde treinta segundos hasta un par de horas, y toda una generación de desarrolladores está redescubriendo un problema que sus predecesores creían muerto con los compiladores lentos. En 2026, «¿qué haces mientras Claude Code trabaja?» se ha convertido en una de las preguntas más recurrentes de los subreddits de programación, y Google Trends muestra la búsqueda pasando de cero a un pico vertical en menos de un año. Yo desarrollo [Pomodorian](https://pomodorian.app), un temporizador de concentración, así que tengo un interés evidente en esta pregunta; marcaré el momento en que el producto entra en escena, y todo lo anterior se sostiene sin él.

## La nueva pausa de compilación

Todo desarrollador conoce [xkcd n.º 303](https://xkcd.com/303/): dos programadores peleando con espadas sobre sillas de oficina porque «¡está compilando!» era la única excusa legítima para dejar de trabajar. La espera del agente es el mismo tiempo muerto con tres diferencias que la hacen más difícil, no más fácil, de gestionar.

Primero, la frecuencia. Una compilación lenta te interrumpía unas pocas veces al día; una sesión agéntica puede entregarte una espera cada pocos minutos, cada vez que termina un paso o pide una aprobación. Segundo, la imprevisibilidad: una ejecución puede acabar en cuarenta segundos o en cuarenta minutos, y rara vez sabes cuál de las dos por adelantado. Tercero, y lo más importante: no estás realmente libre. El agente puede necesitar una aprobación, puede desviarse de la especificación o puede terminar y quedarse parado, quemando tu impulso. Un hilo de r/ClaudeAI de febrero de 2026 lo bautizó con precisión: la paradoja «no puedo irme, no puedo concentrarme».

Esa combinación, huecos frecuentes, imprevisibles y semivigilados, es una forma genuinamente nueva de tiempo de trabajo. Tratarla como tiempo libre la desperdicia; tratarla como tiempo de trabajo te quema. Necesita su propio método.

## Qué hacen los desarrolladores en realidad: notas de campo de Reddit

La pregunta se repite porque nadie está satisfecho con su propia respuesta. A lo largo de los hilos recurrentes de [r/ClaudeCode](https://www.reddit.com/r/ClaudeCode/comments/1rferq7/what_do_you_do_when_claude_code_is_working/) (la edición de febrero de 2026 superó los cien votos), las respuestas caen en tres bandos.

**El bando honesto.** Café, correos y, como dice u/Formal_Bat_3109, «most importantly, go to Reddit». Un usuario responde simplemente «Pushups». Otro tiene el Football Manager en el segundo monitor. La aportación de u/dbbk: «Stare into middle distance». u/Luke_thePuke cuenta que su mujer detectó los minutos muertos y empezó a asignarle tareas domésticas. El autor del hilo admite que Reddit ya es su respuesta por defecto y que necesita algo mejor.

**El bando sistemático.** Sus respuestas convergen con una regularidad llamativa:

- **Revisar la salida.** u/Sponge8389 dedica la espera a revisar el código generado o a redactar el prompt de la siguiente sesión.
- **Leer el razonamiento del agente.** u/DifferenceTimely8292 describe el registro de razonamiento como una lectura fantástica y una lección de descomposición de problemas, y otros coinciden en que es el uso más infravalorado del hueco.
- **Ejecutar sesiones paralelas sobre el mismo proyecto.** u/taldbek mantiene varios espacios de trabajo abiertos: mientras un agente trabaja, alimenta al siguiente. El autor del [hilo de enero](https://www.reddit.com/r/ClaudeCode/comments/1qx9vdo/what_do_you_do_while_claude_code_is_working/) ejecuta 2 o 3 sesiones sobre el mismo repositorio y advierte explícitamente contra el repositorio distinto: probó a rellenar las esperas con tareas de otros proyectos y concluyó que fue un error que arruinó su flow y le vació la energía.
- **Planificar por lotes.** u/catalan-93 agrupa su lista de tareas por temas para que las tareas relacionadas se ejecuten juntas, lo que según él hace los cambios menos dolorosos.
- **Recibir notificaciones en lugar de vigilar.** Algunos canalizan las actualizaciones de Claude Code por síntesis de voz o por Telegram para poder alejarse sin ansiedad.

**El bando constructor.** Mi favorito: u/hotcoolhot se construyó un pequeño monitor de sesión físico (un microcontrolador con una pantalla redonda) que se lleva a la cocina para vigilar el estado de su agente mientras prepara algo de comer. Es una respuesta extrema, pero también es todo el problema en una sola imagen: la espera del agente crea la necesidad de *ver el estado de tu tiempo* de un vistazo.

## Por qué «hago otra cosa mientras tanto» sale caro

La respuesta más tentadora, rellenar las esperas del agente con un segundo proyecto, es contra la que advierten los usuarios con experiencia. La investigación explica por qué tienen razón.

En una serie de experimentos publicados en 2009, Sophie Leroy, entonces en la Universidad de Minnesota, demostró que cuando cambiamos de tarea con la primera sin terminar, parte de la atención se queda pegada a ella. Llamó a este efecto [residuo atencional](https://www.sciencedirect.com/science/article/abs/pii/S0749597809000399): el rendimiento en la segunda tarea cae, y cuanto más fuerte es el residuo, peor el resultado. Una ejecución de agente es el disparador de manual, porque tu primera tarea está por definición sin terminar mientras Claude trabaja, y anticipas que te reclamará en un momento imprevisible.

La investigación de campo apunta en la misma dirección. Observando a trabajadores de oficina minuto a minuto, [Gloria Mark y sus colegas de UC Irvine encontraron](https://ics.uci.edu/~gmark/chi08-mark.pdf) que el trabajo interrumpido tiene un coste real: tras una interrupción significativa, la gente tardaba de media unos 23 minutos en volver a la tarea original, normalmente tras desviarse por otras dos tareas, y lo compensaba trabajando más deprisa a cambio de más estrés y frustración. Sus datos más recientes añaden que el tiempo medio en una sola pantalla antes de cambiar ha caído por debajo del minuto. Un agente que te interrumpe cada pocos minutos, si dejas que cada interrupción lance un desvío, convierte tu día exactamente en el patrón fragmentado que midió su laboratorio.

El consenso de Reddit y la literatura coinciden en el mecanismo: el problema de la espera del agente no es la inactividad, es el cambio. Lo que significa que el objetivo de un método no es rellenar el hueco, sino mantener tu memoria de trabajo cargada en un solo proyecto mientras el agente hace su parte.

## Un protocolo según la duración de la espera

Este es el protocolo que se deduce de los testimonios y de la investigación. La regla central: calibra la espera y ajusta tu respuesta a ella.

1. **Menos de unos 2 minutos: no te muevas.** Quédate en la sesión. Mira pasar el diff, ojea el razonamiento. Cambiar a cualquier sitio, aunque sea una pestaña, no aporta nada y cuesta residuo.
2. **De 2 a 10 minutos: quédate en el proyecto, cambia de altitud.** Es la franja de oro del trabajo con contexto constante: revisar en serio la última salida, afinar la especificación, escribir el siguiente prompt, actualizar la lista de tareas, comprobar los tests. Mismo proyecto, distinta altitud. Aquí encaja también una segunda sesión sobre el *mismo repositorio* si ejecutas agentes en paralelo, como hacen los usuarios con experiencia; el contexto compartido mantiene baratas las revisiones.
3. **Más de 10 minutos, o una ejecución autónoma: haz una pausa de verdad, y protégela.** Configura una notificación (un sonido, un hook de voz, un puente de Telegram) para que el agente pueda avisarte, y aléjate de la pantalla. El movimiento gana al scroll: la respuesta «Pushups» es mejor ciencia cognitiva de lo que parece. Y si trabajas con compañeros, haz como la oficina de uno de los comentaristas: sincronizad las ejecuciones de vuestros agentes para que las esperas coincidan; es [body doubling](/blog/body-doubling) aplicado a la programación agéntica.
4. **Agrupa las aprobaciones.** Si tu sesión pide sobre todo confirmaciones rápidas, no te quedes flotando. Deja que se acumulen unos minutos y despáchalas en una pasada, la misma lógica de agrupación que usamos para [dejar de procrastinar con bloques de tiempo](/blog/es/dejar-procrastinar-tecnica-pomodoro).
5. **Cierra el bucle antes de abrir otro.** Cuando termina una ejecución, revisa y confirma (o rechaza) antes de lanzar el siguiente prompt. Un bucle abierto es precisamente lo que genera residuo atencional; cerrarlo es lo que abarata la siguiente espera.

Dos antipatrones que conviene nombrar, porque son los dos reflejos por defecto: **el segundo proyecto** (residuo máximo, el movimiento que los usuarios con experiencia lamentan) y **el scroll infinito** (una «pausa» que te deja más vacío que el trabajo). Si te llevas una sola cosa de la investigación: tu enemigo no es la espera, es el cambio sin gestionar.

## Dónde encaja un temporizador

Aquí toca ser transparente: Pomodorian es mi producto, y si este tema me llamó la atención es porque la espera del agente es, estructuralmente, un problema de temporizador. La espera es invisible, imprevisible y fragmentadora; un reloj visible es la herramienta más barata que tenemos para hacer concreto el tiempo, la misma razón por la que un desarrollador se construyó un monitor de sesión físico.

En la práctica, la combinación que funciona es ejecutar tus sesiones de agente *dentro* de intervalos Pomodoro en lugar de alrededor de ellos. Un intervalo de 25 minutos alberga con comodidad un ciclo de prompt, espera, revisión y siguiente prompt sobre un solo proyecto; la regla de tarea única del intervalo es exactamente la regla «mismo proyecto, otra altitud» de arriba, con una cuenta atrás visible que la hace cumplir. Cuando suena la alarma, te tomas el descanso que ya te estabas prometiendo, lejos de la pantalla, mientras el agente sigue trabajando. Cualquier temporizador sirve; [Pomodorian](https://pomodorian.app) añade un planificador con IA que divide tu objetivo en tareas del tamaño de un pomodoro, lo que encaja de forma muy directa con alimentar una cola de prompts bien acotados. Gratis, en el navegador, sin cuenta.

El fondo del asunto sigue en pie con cualquier herramienta: la programación agéntica no elimina la necesidad de trabajo profundo, la concentra. El agente escribe una parte creciente del código; tu palanca se desplaza a la especificación, la revisión y el criterio, actividades todas que premian una mente sin fragmentar. Los desarrolladores que gestionan bien la espera no son los que encontraron la mejor distracción. Son los que dejaron de tratarla como un hueco para distraerse.

## Preguntas frecuentes

### ¿Qué hago mientras Claude Code está ejecutándose?

Ajusta la acción a la duración de la espera. Menos de dos minutos: quédate en la sesión y lee la salida. De dos a diez minutos: revisa, afina tu especificación o escribe el siguiente prompt del mismo proyecto. Ejecuciones autónomas más largas: configura una notificación de fin y haz una pausa real lejos de la pantalla.

### ¿Puedo trabajar en otro proyecto mientras el agente se ejecuta?

El consenso de los usuarios con experiencia y la investigación dicen que no. Cambiar de tarea con una tarea sin terminar en vuelo crea residuo atencional, medido como peor rendimiento en la segunda tarea y una reincorporación costosa a la primera. Si quieres paralelismo, lanza una segunda sesión de agente sobre el mismo repositorio; el contexto compartido abarata los cambios.

### ¿Está mal mirar Reddit durante las esperas del agente?

Es la respuesta más común y la menos satisfactoria, según admiten quienes la dan. Las pausas de feeds tienden a alargarse más allá del final de la ejecución y a dejar la atención más fragmentada. Una micropausa física (moverte, estirar, hacer un café) restaura más y se desborda menos.

### ¿Cómo sé cuándo Claude Code me necesita sin vigilarlo?

Usa notificaciones en lugar de supervisión: campanas o hooks de terminal, actualizaciones por voz, o un puente de Telegram/Slack que te avise al terminar o ante una petición de aprobación. Los proyectos de la comunidad y los hooks nativos de Claude Code cubren los tres patrones.

### ¿Funciona la técnica Pomodoro con agentes de programación con IA?

Encajan bien. Un ciclo de agente (prompt, espera, revisión, siguiente prompt) cabe con naturalidad en un intervalo de concentración de 25 minutos sobre un solo proyecto, y la cuenta atrás visible del temporizador contrarresta la naturaleza informe y fragmentadora de las esperas. El descanso llega después, lejos de la pantalla, mientras el agente sigue trabajando.

## Puntos clave

- La espera del agente es la nueva pausa de compilación, pero más frecuente, menos predecible y solo semilibre; necesita un método deliberado, no una distracción por defecto.
- Las respuestas reales de la comunidad de Claude Code convergen: revisar la salida, leer el razonamiento, preparar el siguiente prompt, sesiones paralelas sobre el mismo repositorio y notificaciones en lugar de vigilancia.
- El movimiento a evitar es cambiar a otro proyecto: el residuo atencional (Leroy, 2009) y la investigación sobre interrupciones (Mark, UC Irvine) muestran que es el cambio, no la inactividad, lo que destruye la concentración.
- Calibra la espera: menos de 2 minutos, quieto; de 2 a 10, mismo proyecto a otra altitud; más, una pausa protegida lejos de la pantalla con una notificación configurada.
- Un temporizador visible convierte la espera informe en tiempo estructurado; ejecutar los ciclos del agente dentro de intervalos Pomodoro encaja de forma natural.
