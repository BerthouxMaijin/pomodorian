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
      "Cinco minutos en cuenta regresiva y una alarma al final. Es lo que dura una pausa activa en muchas oficinas, y también el descanso corto de la técnica Pomodoro: lo justo para mover el cuerpo y volver con la cabeza despejada.",
    useCases: [
      "Una pausa activa en la oficina o en el home office.",
      "Estirar cuello, hombros y muñecas después de mucho teclado.",
      "El descanso corto entre dos pomodoros.",
      "Organizar a un grupo para que todos vuelvan a la vez.",
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
        heading: "Cuando el grupo tiene que volver a la vez",
        body: "En un taller, una clase o una reunión larga, el descanso de cinco minutos suele convertirse en quince porque nadie sabe cuánto queda. Proyecta el temporizador y anúncialo al iniciar: todos ven el tiempo bajar y, cuando suena la alarma, el grupo regresa sin que tengas que ir a buscar a cada persona al pasillo.",
      },
    ],
    faq: [
      {
        q: "¿Cada cuánto conviene hacer una pausa activa?",
        a: "No hay una regla única. Muchas empresas proponen una o dos al día; si trabajas con la técnica Pomodoro, ya tienes un descanso corto después de cada sesión de 25 minutos.",
      },
      {
        q: "¿Qué pasa cuando termina la cuenta regresiva?",
        a: "Suena una alarma y el temporizador vuelve a 05:00, listo para la siguiente pausa.",
      },
      {
        q: "¿Puedo proyectarlo en la sala de juntas?",
        a: "Sí, desde el navegador de la computadora conectada. El botón de pantalla completa agranda la cuenta regresiva donde el navegador lo permite, y con la tecla Esc vuelves a la página.",
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
      "El descanso después de una sesión de 50 minutos.",
      "Recoger los juguetes antes de cenar.",
    ],
    sections: [
      {
        heading: "Turnos justos entre hermanos",
        body: "La pelea por la consola o la tableta casi nunca es por el juego, sino por quién lleva más tiempo. Diez minutos por turno, con el temporizador a la vista de todos, cambian la discusión: ya no depende de un adulto que mida el tiempo, sino de una alarma que nadie puede acusar de favoritismo. Cuando suena, pasa el control.",
      },
      {
        heading: "Diez minutos de inglés al día",
        body: "Para aprender vocabulario, la constancia suele pesar más que las sesiones largas. Diez minutos diarios con tus tarjetas o tu aplicación de idiomas son fáciles de sostener, incluso en días ocupados. Inicia el temporizador, repasa las palabras pendientes y para cuando suene la alarma: mañana sigues, y eso es lo que cuenta.",
      },
      {
        heading: "Un vistazo a tus gastos",
        body: "Revisar las finanzas personales da pereza porque parece un trabajo enorme. Dale diez minutos a la semana: abre la app del banco, anota los gastos principales y compara con lo que planeabas. No hace falta una hoja de cálculo perfecta. Con el límite de tiempo, la revisión se vuelve un hábito y no una tarea que se pospone cada mes.",
      },
    ],
    faq: [
      {
        q: "¿Cómo reparto los turnos entre varios niños?",
        a: "Define el orden antes de empezar y vuelve a iniciar el temporizador en cada cambio. Al sonar la alarma, el contador regresa solo a 10:00, así que basta con presionar Iniciar.",
      },
      {
        q: "¿Sirven diez minutos al día para aprender inglés?",
        a: "Ayudan a mantener el hábito y a no olvidar lo aprendido. No sustituyen una clase, pero sumados a lo largo de semanas marcan diferencia.",
      },
      {
        q: "¿Sigue contando si cambio de pestaña?",
        a: "Sí. El tiempo restante se calcula con la hora real y es exacto cuando regresas. En una pestaña en segundo plano, algunos navegadores pueden retrasar la alarma hasta un minuto, salvo que esté sonando un sonido de fondo.",
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
      "Quince minutos y una alarma. Es lo que dura el medio tiempo de un partido de fútbol, y no es mala referencia para el descanso largo de la técnica Pomodoro: el momento de reponerse antes de la segunda mitad de la jornada.",
    useCases: [
      "El descanso largo después de cuatro pomodoros.",
      "Una rutina corta de ejercicio en casa.",
      "Preparar la lonchera y la mochila del día siguiente.",
      "Un descanso de grupo con hora de regreso clara.",
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
        q: "¿Puedo usarlo en el celular durante la rutina?",
        a: "Sí, en el navegador del celular, sin instalar nada. Deja la página abierta: mientras corre la cuenta regresiva, mantiene la pantalla encendida si tu navegador lo permite.",
      },
      {
        q: "¿Puedo pausar si me interrumpen?",
        a: "Sí. Pausa guarda el tiempo restante y Reanudar continúa desde ahí. Reiniciar lo regresa a 15 minutos.",
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
      "Temporizador de 20 minutos gratis con descanso de 5: para estudiar el EXANI-II por bloques, juntas breves o cocinar el arroz sin descuidarlo.",
    h1: "Temporizador 20 minutos",
    intro:
      "Veinte minutos de cuenta regresiva y, al sonar la alarma, el temporizador pasa solo al descanso de cinco minutos. Es un bloque cómodo para estudiar por partes, para una junta que no debería alargarse y hasta para la cocina.",
    useCases: [
      "Estudiar para el examen de admisión por bloques.",
      "Una junta breve con agenda clara.",
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
        heading: "Juntas de veinte minutos",
        body: "Una junta agendada para una hora tiende a ocupar la hora completa, aunque el tema dé para mucho menos. Prueba juntas de veinte minutos con una agenda de tres puntos y el temporizador a la vista. Cuando quedan cinco minutos, se cierran decisiones y responsables. Si algo no se resolvió, se agenda aparte, no se estira la reunión.",
      },
      {
        heading: "En la cocina: el arroz",
        body: "El arroz blanco suele necesitar entre quince y veinte minutos de cocción, según la variedad y la receta. Es justo el tipo de cosa que se quema cuando uno se distrae con el celular. Inicia el temporizador cuando bajes el fuego y dedícate a otra cosa: la alarma te avisa a tiempo para revisar.",
      },
    ],
    faq: [
      {
        q: "¿Cómo preparo una junta de veinte minutos?",
        a: "Comparte antes los tres puntos que se van a tratar, empieza puntual con el temporizador y reserva los últimos cinco minutos para decidir quién hace qué.",
      },
      {
        q: "¿Qué hace el enlace a la aplicación completa?",
        a: "Abre Pomodorian y cambia tu duración de concentración guardada a 20 minutos, hasta que la modifiques en los ajustes. La duración del descanso sigue siendo la de tus ajustes.",
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
      "Temporizador de 25 minutos gratis para la técnica Pomodoro, con descanso de 5. Estudia con música lo-fi o en grupo por videollamada.",
    h1: "Temporizador 25 minutos",
    intro:
      "Veinticinco minutos de concentración y cinco de descanso: es el pomodoro clásico. Este temporizador lo cuenta por ti, con la opción de poner música lo-fi de fondo mientras estudias o trabajas.",
    useCases: [
      "Un pomodoro clásico de 25 minutos.",
      "Estudiar con música lo-fi de fondo.",
      "Sesiones de estudio en grupo por videollamada.",
      "Llevar la cuenta de tus pomodoros con rayitas en papel.",
      "Avanzar en un proyecto pendiente, bloque por bloque.",
    ],
    sections: [
      {
        heading: "Pomodoros con música lo-fi",
        body: "La música lo-fi se volvió el fondo favorito de muchos estudiantes: ritmos suaves, sin letra, que llenan el silencio sin robar atención. En este temporizador puedes activarla debajo de la cuenta regresiva. Se pausa cuando pausas el temporizador y se detiene cuando suena la alarma, así el final de cada pomodoro se nota también en el oído.",
      },
      {
        heading: "Estudiar en grupo a distancia",
        body: "Muchos estudiantes se juntan por videollamada o en servidores de Discord para estudiar al mismo ritmo: todos empiezan el pomodoro a la vez, se silencian los micrófonos y se platica solo en el descanso. Ver a otros concentrados ayuda a no abrir otra pestaña. Pónganse de acuerdo en la hora de inicio y que cada quien abra este temporizador.",
      },
      {
        heading: "Una rayita por pomodoro",
        body: "Una forma sencilla de ver tu avance es anotar una rayita en una hoja cada vez que terminas un pomodoro. Al final del día tienes una imagen honesta de cuánto trabajo concentrado hiciste, sin aplicaciones ni gráficas. Si prefieres que se registre solo, la aplicación completa de Pomodorian guarda tus sesiones en tu navegador.",
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
      "Temporizador de 30 minutos gratis con descanso de 5: para estudiar oposiciones tema por tema, pasear al perro o tomar tu media hora de descanso.",
    h1: "Temporizador 30 minutos",
    intro:
      "Media hora en cuenta regresiva, con cinco minutos de descanso al lado. Treinta minutos son una unidad cómoda para estudiar un tema completo, para el paseo del perro o para ese descanso de media hora que la jornada laboral suele merecer.",
    useCases: [
      "Estudiar un tema de oposiciones con un final claro.",
      "El paseo del perro, con hora de regreso.",
      "Tu media hora de descanso en la jornada continua.",
      "Un bloque de trabajo de 30 minutos con descanso de 5.",
      "Leer los documentos antes de una reunión.",
    ],
    sections: [
      {
        heading: "Oposiciones, tema por tema",
        body: "En España, quien prepara oposiciones convive con un temario largo durante meses. Repartirlo en bloques de media hora ayuda a avanzar sin agotarse: un bloque para leer un tema, otro para hacer un esquema de memoria y otro para repasar lo que falló. Cinco minutos de descanso entre bloques, y una lista de temas tachados que crece cada semana.",
      },
      {
        heading: "El paseo del perro",
        body: "Un paseo de media hora le viene bien al perro y a quien lo pasea, sobre todo en días de home office en los que casi no sales de casa. Inicia el temporizador al salir: a los quince minutos sabes que toca dar la vuelta, y la alarma te avisa que es hora de volver al trabajo sin estar mirando el reloj.",
      },
      {
        heading: "La media hora de descanso",
        body: "En México, la Ley Federal del Trabajo prevé un descanso de por lo menos media hora durante la jornada continua. Muchas personas se lo comen frente a la pantalla. Inicia el temporizador al empezar tu descanso, aléjate del escritorio y regresa con la alarma: media hora de verdad rinde más que una hora a medias.",
      },
    ],
    faq: [
      {
        q: "¿Qué hago si suena la alarma y no terminé el tema?",
        a: "Anota exactamente dónde te quedaste, toma el descanso y decide después si sigues con otro bloque o lo dejas para mañana.",
      },
      {
        q: "¿La media hora de descanso es obligatoria?",
        a: "La Ley Federal del Trabajo la prevé para la jornada continua. Los detalles dependen de tu contrato y de tu centro de trabajo; si tienes dudas, revisa tu contrato o pregunta en recursos humanos.",
      },
      {
        q: "¿Puedo poner un sonido mientras estudio?",
        a: "Sí. Debajo del temporizador puedes activar lluvia, bosque, chimenea, cafetería o lo-fi, solos o combinados. Se pausan con el temporizador y se detienen al sonar la alarma.",
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
      "Temporizador de 1 hora gratis con descanso de 10 minutos: para tu partido de pádel, una clase en línea o tu hora de comida sin pantalla.",
    h1: "Temporizador 1 hora",
    intro:
      "Una hora completa, mostrada como 1:00:00, con un descanso de diez minutos al lado. Es la medida de muchas cosas del día: la hora de comida, una clase en línea, una reserva de pista de pádel.",
    useCases: [
      "Tu hora de comida, lejos de la computadora.",
      "Un partido de pádel en una pista reservada por hora.",
      "Una clase en línea, con preparación y repaso.",
      "Un bloque de trabajo de una hora con descanso de 10 minutos.",
      "Un examen de práctica de sesenta minutos.",
    ],
    sections: [
      {
        heading: "Una hora de comida de verdad",
        body: "En muchas oficinas se habla de la hora de comida, pero con frecuencia se reduce a un sándwich frente al correo. Inicia el temporizador cuando te levantes del escritorio y no regreses hasta la alarma: come sentado, conversa, sal a caminar un poco. La tarde se nota distinta cuando la pausa fue una pausa.",
      },
      {
        heading: "Pádel: la pista se reserva por hora",
        body: "Las pistas de pádel suelen reservarse en bloques de sesenta o noventa minutos, y siempre hay quien pierde el turno calentando. Pon el temporizador al entrar: unos minutos para calentar, el partido y un par de minutos al final para recoger antes de que llegue el siguiente grupo. Nadie tiene que mirar el reloj a mitad de un punto.",
      },
      {
        heading: "Una clase en línea bien aprovechada",
        body: "Muchas clases en línea duran una hora. Para sacarles provecho, usa el temporizador también fuera de ellas: diez minutos antes para revisar lo que viste la última vez y preparar tus dudas, y el descanso de diez minutos al terminar para pasar en limpio tus notas mientras aún están frescas.",
      },
    ],
    faq: [
      {
        q: "¿Puedo pausar la hora si me llaman?",
        a: "Sí. Pausa guarda el tiempo restante y Reanudar continúa desde ahí. Mejor aún, silencia el celular durante la hora y devuelve las llamadas en el descanso.",
      },
      {
        q: "¿Por qué el temporizador muestra 1:00:00?",
        a: "A partir de una hora, la cuenta se muestra en horas, minutos y segundos, para que 60:00 no se confunda con una hora del reloj.",
      },
      {
        q: "¿Qué hace el enlace a la aplicación?",
        a: "Abre Pomodorian y cambia tu duración de concentración guardada a 60 minutos. El descanso sigue siendo el de tus ajustes, y puedes cambiar ambos cuando quieras.",
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
