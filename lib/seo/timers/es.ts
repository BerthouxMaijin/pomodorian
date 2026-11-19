import type { TimerPage } from "./types";

// Spanish timer pages, week 4 (2026-11-19). Volumes are monthly searches in
// Mexico from OpenSEO on 2026-10-29; see seo-agent/timer-pages/QUEUE.tsv.
// Written in tú form for Mexico and Latin America (with a nod to Spain where
// it fits), around topics the English, German and French pages of the same
// duration do not use.
export const esTimerPages: TimerPage[] = [
  {
    slug: "temporizador-5-minutos",
    lang: "es",
    minutes: 5,
    role: "break",
    label: "5 minutos",
    title: "Temporizador 5 minutos: cuenta regresiva gratis",
    description:
      "Temporizador de 5 minutos gratis para tu pausa activa en la oficina, un estiramiento rápido o el descanso corto de la técnica Pomodoro.",
    h1: "Temporizador 5 minutos",
    intro:
      "Presiona Iniciar: cinco minutos después suena la alarma. Es el tiempo de una pausa activa en muchas oficinas y del descanso corto de la técnica Pomodoro, lo justo para mover el cuerpo y volver con la cabeza despejada.",
    useCases: [
      "Una pausa activa en la oficina o en el home office.",
      "Estirar cuello, hombros y muñecas después de mucho teclado.",
      "El descanso corto entre dos pomodoros.",
      "Un descanso en una videollamada larga.",
      "Calentar antes de una rutina de ejercicio.",
    ],
    sections: [
      {
        heading: "La pausa activa, en cinco minutos",
        body: "En México y en buena parte de América Latina, muchas empresas promueven las pausas activas: unos minutos para levantarse, estirarse y cambiar de postura en medio de la jornada. Cinco minutos alcanzan para una rutina sencilla de cuello, hombros, espalda y piernas. Con el temporizador, la pausa tiene un final claro y nadie se queda dudando cuándo volver.",
      },
      {
        heading: "Para manos que teclean todo el día",
        body: "Quien pasa horas frente al teclado o al celular suele acumular tensión en muñecas y antebrazos. Aprovecha los cinco minutos para abrir y cerrar las manos, girar las muñecas con suavidad y estirar los dedos. Si algo duele de forma persistente, no es tema para un temporizador sino para consultar a un profesional de la salud.",
      },
      {
        heading: "Un descanso en plena videollamada",
        body: "En una capacitación o una junta en línea de varias horas, pedir \"cinco minutos\" y apagar cámaras suele terminar en un regreso escalonado. Comparte la pestaña del temporizador antes del descanso: cada quien sabe a qué hora volver, aunque haya ido por un café. Al regresar, retoma justo donde quedó la agenda.",
      },
    ],
    faq: [
      {
        q: "¿Cada cuánto conviene hacer una pausa activa?",
        a: "No hay una regla única. Lo importante es no pasar horas sin levantarte; con la técnica Pomodoro, ya tienes un descanso corto después de cada sesión de 25 minutos.",
      },
      {
        q: "¿Qué estiramientos caben en cinco minutos?",
        a: "Por ejemplo: girar los hombros, inclinar la cabeza hacia cada lado, estirar los brazos por encima de la cabeza y caminar un poco. Hazlos sin forzar y detente si algo duele.",
      },
      {
        q: "¿Puedo mostrar el temporizador en una videollamada?",
        a: "Sí: comparte la pestaña del navegador donde corre el temporizador. Todos verán la cuenta regresiva en su pantalla.",
      },
    ],
    relatedArticleSlugs: [
      "guia-completa-tecnica-pomodoro",
      "pausas-never-dumb",
      "organizar-dia-trabajo-home-office",
    ],
    published: "2026-11-19",
  },
  {
    slug: "temporizador-10-minutos",
    lang: "es",
    minutes: 10,
    role: "break",
    label: "10 minutos",
    title: "Temporizador 10 minutos: cuenta regresiva en línea",
    description:
      "Temporizador de 10 minutos gratis: para repartir turnos entre hermanos, repasar vocabulario de inglés o revisar tus gastos de la semana.",
    h1: "Temporizador 10 minutos",
    intro:
      "Presiona Iniciar y el temporizador cuenta diez minutos hacia atrás. Diez minutos son ideales para cosas pequeñas que se hacen mejor con un límite claro: un turno de videojuego, una ronda de vocabulario o un vistazo honesto a tus gastos.",
    useCases: [
      "Repartir turnos de consola o tableta entre hermanos.",
      "Una ronda diaria de vocabulario de inglés.",
      "Revisar los gastos de la semana.",
      "Una ronda de preguntas para repasar con tu hijo.",
      "Revisar la agenda de mañana antes de cerrar la laptop.",
    ],
    sections: [
      {
        heading: "Turnos justos entre hermanos",
        body: "La pelea por la consola o la tableta casi nunca es por el juego, sino por quién lleva más tiempo. Diez minutos por turno, con el temporizador a la vista de todos, cambian la discusión: ya no depende de un adulto que mida el tiempo, sino de una alarma que nadie puede acusar de favoritismo. Cuando suena, pasa el control.",
      },
      {
        heading: "Diez minutos de inglés al día",
        body: "Para aprender vocabulario ayuda repasar a menudo, aunque sea poco. Diez minutos diarios con tus tarjetas o tu aplicación de idiomas son fáciles de sostener, incluso en días ocupados. Inicia el temporizador, repasa las palabras pendientes y para cuando suene la alarma: mañana sigues, y eso es lo que cuenta.",
      },
      {
        heading: "Un vistazo a tus gastos",
        body: "Revisar las finanzas personales da pereza porque parece un trabajo enorme. Dale diez minutos a la semana: abre la app del banco, anota los gastos principales y compara con lo que planeabas. No hace falta una hoja de cálculo perfecta. Con el límite de tiempo, la revisión se vuelve un hábito y no una tarea que se pospone cada mes.",
      },
    ],
    faq: [
      {
        q: "¿Cómo reparto los turnos entre varios niños?",
        a: "Escriban el orden en un papel a la vista de todos. Quien recibe el control es quien presiona Iniciar: así nadie puede decir que su turno empezó tarde.",
      },
      {
        q: "¿Sirven diez minutos al día para aprender inglés?",
        a: "Ayudan a mantener el hábito y a no olvidar lo aprendido. No sustituyen una clase, pero sumados a lo largo de semanas marcan diferencia.",
      },
      {
        q: "¿Cómo reviso mis gastos en diez minutos?",
        a: "Tres pasos: anota los cinco gastos más grandes de la semana, márcalos como necesarios o no, y decide un solo ajuste para la siguiente semana. Nada más.",
      },
    ],
    relatedArticleSlugs: [
      "dejar-procrastinar-tecnica-pomodoro",
      "mejores-tecnicas-estudio-ciencia",
      "organizar-dia-trabajo-home-office",
    ],
    published: "2026-11-19",
  },
  {
    slug: "temporizador-15-minutos",
    lang: "es",
    minutes: 15,
    role: "break",
    label: "15 minutos",
    title: "Temporizador 15 minutos: cuenta regresiva gratis",
    description:
      "Temporizador de 15 minutos gratis: tu descanso largo como un medio tiempo de fútbol, una rutina de ejercicio corta o preparar la lonchera.",
    h1: "Temporizador 15 minutos",
    intro:
      "Un cuarto de hora: lo que puede durar, como máximo, el medio tiempo de un partido de fútbol. Buena referencia para el descanso largo de la técnica Pomodoro, el momento de reponerse antes de la segunda mitad de la jornada.",
    useCases: [
      "El descanso largo después de cuatro pomodoros.",
      "Una rutina corta de ejercicio en casa.",
      "Preparar la lonchera y la mochila del día siguiente.",
      "El medio tiempo de un partido en la liga del barrio.",
      "Ordenar el escritorio al cerrar la semana.",
    ],
    sections: [
      {
        heading: "Como el medio tiempo de un partido",
        body: "Las reglas del fútbol fijan el descanso entre los dos tiempos en un máximo de quince minutos. Los equipos lo usan para recuperarse y ajustar la estrategia, no para empezar otro partido. Tu descanso largo puede funcionar igual: levántate, hidrátate, come algo y piensa en qué vas a hacer en la segunda mitad del día, sin abrir el correo.",
      },
      {
        heading: "Una rutina de ejercicio de quince minutos",
        body: "Muchas rutinas de ejercicio en casa, como los circuitos por intervalos, están pensadas para unos quince minutos. Es poco tiempo, pero suficiente para mover todo el cuerpo si lo haces con intención. Inicia el temporizador, sigue tu rutina y para con la alarma. Si tienes alguna condición de salud, consulta antes qué ejercicios te convienen.",
      },
      {
        heading: "La lonchera de mañana, esta noche",
        body: "Las mañanas con niños suelen ser una carrera. Quince minutos la noche anterior para preparar la lonchera, revisar la mochila y dejar el uniforme listo ahorran muchos gritos a las siete de la mañana. Con el temporizador, la tarea tiene un final, y los niños pueden participar sabiendo que no es una eternidad.",
      },
    ],
    faq: [
      {
        q: "¿Qué ejercicios caben en quince minutos?",
        a: "Un circuito sencillo: sentadillas, plancha, saltos y estiramientos, repetido varias veces. Ajusta la intensidad a tu condición y detente si algo duele.",
      },
      {
        q: "¿Sirve para el medio tiempo de un partido amateur?",
        a: "Sí. Inícialo al silbatazo y deja el celular a la vista en la banca: cuando suena la alarma, todos saben que toca volver a la cancha.",
      },
      {
        q: "¿Necesito crear una cuenta?",
        a: "No. El temporizador funciona en el navegador, sin registro ni publicidad. El sonido de fondo que elijas se recuerda para tu próxima visita.",
      },
    ],
    relatedArticleSlugs: [
      "guia-completa-tecnica-pomodoro",
      "meditacion-pausas-pomodoro",
      "ritmos-ultradianos-ciclos-concentracion",
    ],
    published: "2026-11-19",
  },
  {
    slug: "temporizador-20-minutos",
    lang: "es",
    minutes: 20,
    role: "focus",
    breakMinutes: 5,
    label: "20 minutos",
    title: "Temporizador 20 minutos: cuenta regresiva para estudiar",
    description:
      "Temporizador de 20 minutos gratis con descanso de 5: para estudiar el EXANI-II por bloques, hacer el quehacer por partes o cocinar el arroz.",
    h1: "Temporizador 20 minutos",
    intro:
      "Veinte minutos de cuenta regresiva y, al sonar la alarma, el temporizador pasa solo al descanso de cinco minutos. Es un bloque cómodo para estudiar por partes, para el quehacer de la casa y hasta para la cocina.",
    useCases: [
      "Estudiar para el examen de admisión por bloques.",
      "Una tarea de la casa por bloque: trastes, planchado, baño.",
      "Cocinar el arroz sin olvidarlo en la estufa.",
      "Resolver una guía de ejercicios de matemáticas.",
      "Un bloque de trabajo con descanso de cinco minutos.",
    ],
    sections: [
      {
        heading: "Estudiar para el EXANI-II por bloques",
        body: "El EXANI-II del Ceneval es el examen de admisión de muchas universidades mexicanas, y su temario abarca varias áreas. Estudiarlo todo de golpe agota. Divide el temario en bloques de veinte minutos: uno para repasar un tema, otro para resolver reactivos de práctica, y así. Con cinco minutos de descanso entre bloques, llegas al final de la tarde con la cabeza más fresca.",
      },
      {
        heading: "El quehacer, una tarea por bloque",
        body: "El quehacer del fin de semana parece no terminar nunca porque todo se mezcla. Asigna una tarea a cada bloque de veinte minutos: los trastes en uno, el planchado en otro, el baño en el siguiente. Con el descanso de cinco minutos entre bloques, la mañana del sábado avanza por etapas y te queda claro qué ya está hecho.",
      },
      {
        heading: "En la cocina: el arroz",
        body: "El arroz blanco suele necesitar entre quince y veinte minutos de cocción, según la variedad y la receta. Es justo el tipo de cosa que se quema cuando uno se distrae con el celular. Inicia el temporizador cuando bajes el fuego y dedícate a otra cosa: la alarma te avisa a tiempo para revisar.",
      },
    ],
    faq: [
      {
        q: "¿Cómo practico reactivos con el temporizador?",
        a: "Elige un grupo de reactivos de una sola área, contéstalos sin consultar durante los veinte minutos y revisa las respuestas en el descanso. Así entrenas también el ritmo.",
      },
      {
        q: "¿Puedo dejarlo corriendo en otra pestaña mientras cocino?",
        a: "Sí. El tiempo restante se calcula con la hora real y siempre es exacto. Ojo: en segundo plano, algunos navegadores pueden retrasar la alarma hasta un minuto, salvo que esté sonando un sonido de fondo.",
      },
      {
        q: "¿Y si el arroz necesita más tiempo?",
        a: "Cuando suena la alarma, el temporizador pasa al descanso de cinco minutos: inícialo y tendrás cinco minutos más de margen.",
      },
    ],
    relatedArticleSlugs: [
      "pomodoro-estudiantes-estudiar-mejor",
      "mejores-tecnicas-estudio-ciencia",
      "pomodoro-tdah",
    ],
    published: "2026-11-19",
  },
  {
    slug: "temporizador-25-minutos",
    lang: "es",
    minutes: 25,
    role: "focus",
    breakMinutes: 5,
    label: "25 minutos",
    title: "Temporizador 25 minutos: técnica Pomodoro gratis",
    description:
      "Temporizador de 25 minutos gratis para la técnica Pomodoro, con descanso de 5. Estudia con música lo-fi y el celular en modo No molestar.",
    h1: "Temporizador 25 minutos",
    intro:
      "Veinticinco minutos de concentración y cinco de descanso: es el pomodoro clásico. Este temporizador lo cuenta por ti, con la opción de poner música lo-fi de fondo mientras estudias o trabajas.",
    useCases: [
      "Un pomodoro clásico de 25 minutos.",
      "Estudiar con música lo-fi de fondo.",
      "Empezar el día por la tarea más difícil.",
      "Trabajar con el celular en modo No molestar.",
      "Preparar una exposición de la escuela por partes.",
    ],
    sections: [
      {
        heading: "Pomodoros con música lo-fi",
        body: "Muchos estudiantes prefieren estudiar con música lo-fi: ritmos suaves y sin letra que, para ellos, llenan el silencio sin distraer. En este temporizador puedes activarla debajo de la cuenta regresiva. Se pausa cuando pausas el temporizador y se detiene cuando suena la alarma, así el final de cada pomodoro se nota también en el oído.",
      },
      {
        heading: "El celular en No molestar",
        body: "La mayor fuente de interrupciones suele estar en el bolsillo. Antes de iniciar el pomodoro, activa el modo No molestar o Concentración de tu celular, o déjalo boca abajo en otra habitación. Veinticinco minutos sin notificaciones es poco tiempo para el mundo y mucho para tu tarea: los mensajes seguirán ahí en el descanso.",
      },
      {
        heading: "El primer pomodoro, para lo más difícil",
        body: "Empezar el día con lo más pesado tiene una ventaja práctica: lo haces cuando todavía nadie te ha escrito y antes de que el cansancio se acumule. Dedica el primer pomodoro de la mañana a esa tarea que llevas días evitando. Aunque no la termines, ya empezó, y el resto del día pesa menos.",
      },
    ],
    faq: [
      {
        q: "¿La música lo-fi sigue durante el descanso?",
        a: "Sí, si la dejas activada: se detiene al sonar la alarma y vuelve a sonar cuando inicias el descanso. Puedes apagarla en cualquier momento con el mismo botón.",
      },
      {
        q: "¿Funciona en el celular?",
        a: "Sí, en el navegador, sin instalar nada. Mientras corre la cuenta regresiva, la página mantiene la pantalla encendida si tu navegador lo permite, así que puedes dejar el celular sobre el escritorio mientras estudias.",
      },
      {
        q: "¿Puedo cambiar la duración del descanso?",
        a: "Aquí el descanso dura cinco minutos. Si quieres otro, abre el temporizador de 10 o 15 minutos en otra pestaña al terminar el pomodoro.",
      },
    ],
    relatedArticleSlugs: [
      "guia-completa-tecnica-pomodoro",
      "mejores-sonidos-ambientales-concentrarse",
      "body-doubling",
    ],
    published: "2026-11-19",
  },
  {
    slug: "temporizador-30-minutos",
    lang: "es",
    minutes: 30,
    role: "focus",
    breakMinutes: 5,
    label: "30 minutos",
    title: "Temporizador 30 minutos: cuenta regresiva gratis",
    description:
      "Temporizador de 30 minutos gratis con descanso de 5: para pasear al perro, tomar tu media hora de descanso completa o estudiar tema por tema.",
    h1: "Temporizador 30 minutos",
    intro:
      "Treinta minutos, una alarma, y cinco minutos de descanso si los necesitas. Media hora alcanza para el paseo del perro, para el descanso que marca la ley en la jornada continua o para estudiar un tema completo.",
    useCases: [
      "Estudiar un tema de oposiciones con un final claro.",
      "El paseo del perro, con hora de regreso.",
      "Tu media hora de descanso en la jornada continua.",
      "Un bloque de trabajo de 30 minutos con descanso de 5.",
      "Una sesión de estiramientos al final del día.",
    ],
    sections: [
      {
        heading: "Oposiciones, tema por tema",
        body: "En España, quien prepara oposiciones convive con un temario largo durante meses. Repartirlo en bloques de media hora ayuda a avanzar sin agotarse: un bloque para leer un tema, otro para hacer un esquema de memoria y otro para repasar lo que falló. Cinco minutos de descanso entre bloques, y una lista de temas tachados que crece cada semana.",
      },
      {
        heading: "El paseo del perro",
        body: "Un paseo de media hora le viene bien al perro y a quien lo pasea, sobre todo en días de home office en los que casi no sales de casa. Inicia el temporizador al salir y deja el celular en el bolsillo: el perro marca el paso y la alarma marca el final, sin que tengas que estar mirando el reloj.",
      },
      {
        heading: "La media hora de descanso",
        body: "En México, la Ley Federal del Trabajo prevé un descanso de por lo menos media hora durante la jornada continua. Media hora pasa rápido, así que conviene repartirla: unos veinte minutos para comer con calma y el resto para salir a tomar aire. Con el temporizador sabes cuánto te queda sin estar sacando el celular.",
      },
    ],
    faq: [
      {
        q: "¿Media hora de paseo es suficiente para mi perro?",
        a: "Depende de la raza, la edad y la energía de cada perro. Si tienes dudas, pregúntale a tu veterinario.",
      },
      {
        q: "¿La media hora de descanso es obligatoria?",
        a: "La Ley Federal del Trabajo la prevé para la jornada continua. Los detalles dependen de tu contrato y de tu centro de trabajo; si tienes dudas, revisa tu contrato o pregunta en recursos humanos.",
      },
      {
        q: "¿Puedo encadenar varios bloques de media hora?",
        a: "Sí. Al sonar la alarma, el temporizador pasa al descanso de cinco minutos; cuando termina el descanso, vuelve solo a 30 minutos y basta con presionar Iniciar.",
      },
    ],
    relatedArticleSlugs: [
      "pomodoro-estudiantes-estudiar-mejor",
      "organizar-dia-trabajo-home-office",
      "mejores-sonidos-ambientales-concentrarse",
    ],
    published: "2026-11-19",
  },
  {
    slug: "temporizador-1-hora",
    lang: "es",
    minutes: 60,
    role: "focus",
    breakMinutes: 10,
    label: "1 hora",
    title: "Temporizador 1 hora: cuenta regresiva de 60 minutos",
    description:
      "Temporizador de 1 hora gratis con descanso de 10 minutos: para tu partido de pádel, una clase en línea o el proyecto personal del fin de semana.",
    h1: "Temporizador 1 hora",
    intro:
      "Presiona Iniciar y el contador arranca en 1:00:00. Una hora es la medida de una reserva de cancha de pádel, de muchas clases en línea y de ese rato del sábado que por fin le dedicas a tu proyecto personal.",
    useCases: [
      "El proyecto personal que avanzas los sábados.",
      "Un partido de pádel en una cancha reservada por hora.",
      "Una clase en línea, con preparación y repaso.",
      "Un bloque de trabajo de una hora con descanso de 10 minutos.",
      "Una sesión de práctica de un idioma con un tutor.",
    ],
    sections: [
      {
        heading: "El proyecto personal del sábado",
        body: "El negocio propio, la página web, el libro que quieres escribir: los proyectos personales viven de horas sueltas que nunca llegan. Aparta una hora fija el sábado, decide antes qué vas a avanzar y empieza con el temporizador. Una hora a la semana parece poco, pero son más de cincuenta horas al año dedicadas a algo que te importa.",
      },
      {
        heading: "Pádel: la cancha se reserva por hora",
        body: "Las canchas de pádel suelen reservarse en bloques de sesenta o noventa minutos, y siempre hay quien pierde el turno calentando. Pon el temporizador al entrar: unos minutos para calentar, el partido y un par de minutos al final para recoger antes de que llegue el siguiente grupo. Nadie tiene que mirar el reloj a mitad de un punto.",
      },
      {
        heading: "Una clase en línea bien aprovechada",
        body: "Muchas clases en línea duran una hora. Para sacarles provecho, usa el temporizador también fuera de ellas: diez minutos antes para revisar lo que viste la última vez y preparar tus dudas, y el descanso de diez minutos al terminar para pasar en limpio tus notas mientras aún están frescas.",
      },
    ],
    faq: [
      {
        q: "¿Cuánto tiempo dejo para calentar antes del partido?",
        a: "Unos minutos de movilidad y peloteo suelen bastar para entrar en juego. Lo importante es que estén dentro de tu hora y no se los quites al grupo siguiente.",
      },
      {
        q: "¿Puedo usarlo en la cancha desde el celular?",
        a: "Sí, en el navegador del celular. Mientras corre la cuenta regresiva, la página mantiene la pantalla encendida si tu navegador lo permite.",
      },
      {
        q: "¿Qué hago si el partido se alarga?",
        a: "La alarma marca el final de tu reserva. Si el siguiente grupo ya está esperando, deja el último punto para la próxima vez: es la mejor forma de que te respeten tu hora a ti también.",
      },
    ],
    relatedArticleSlugs: [
      "sesiones-pomodoro-largas-guia",
      "ritmos-ultradianos-ciclos-concentracion",
      "organizar-dia-trabajo-home-office",
    ],
    published: "2026-11-19",
  },
];
