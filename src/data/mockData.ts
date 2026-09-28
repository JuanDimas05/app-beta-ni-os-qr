import { ChildProfile, ForumCategory, ForumPost, ChatMessage } from '../types/tea';

export const INITIAL_CHILDREN: ChildProfile[] = [
  {
    id: 'child_mateo_01',
    parentId: 'parent_usr_elena',
    nickname: 'Mateo',
    fullName: 'Mateo Méndez Ruiz',
    age: 7,
    photoUrl: '/src/assets/images/tea_calm_support_1790581774043.jpg',
    qrCodeId: 'TEA-QR-MATEO-8821',
    privacyMode: 'publico_diario',
    isAlertActive: false,
    communicationType: 'no_verbal',
    communicationNotes: 'Mateo es no verbal. Comprende intenciones y lenguaje receptivo sencillo. Puede usar gestos o señalar. Si está asustado no responde a preguntas complejas.',
    sensoryTriggers: ['ruidos_fuertes', 'multitudes', 'contacto_fisico'],
    customSensoryNotes: 'Las alarmas, sirenas o gritos le provocan sobrecarga sensorial inmediata y necesidad de huir o taparse los oídos.',
    calmingTechniques: [
      'Hablar con voz baja, pausada y sin movimientos bruscos',
      'Ofrecerle sus auriculares con cancelación de ruido (están en el bolsillo delantero de su mochila)',
      'Darle su dinosaurio de felpa azul de apego',
      'No acorralarlo ni rodearlo con varias personas'
    ],
    actionsToAvoid: [
      'No sujetarlo con fuerza de los brazos (puede entrar en pánico)',
      'No gritarle ni exigirle que mire a los ojos',
      'No quitarle sus objetos de confort',
      'Evitar tocarlo por la espalda de sorpresa'
    ],
    favoriteComfortItem: 'Dinosaurio de felpa azul y auriculares celestes en mochila',
    emergencyContacts: [
      {
        id: 'contact_elena',
        name: 'Elena Ruiz',
        relationship: 'Mamá',
        phone: '+52 55 9182 3456',
        whatsapp: '+525591823456',
        email: 'elena.ruiz.tea@ejemplo.com',
        isPrimary: true
      },
      {
        id: 'contact_carlos',
        name: 'Carlos Méndez',
        relationship: 'Papá',
        phone: '+52 55 9182 7890',
        whatsapp: '+525591827890',
        email: 'carlos.mendez@ejemplo.com',
        isPrimary: false
      }
    ],
    bloodType: 'O+',
    allergies: ['Cacahuates / Maní', 'Penicilina'],
    medications: ['Melatonina en gotas (solo nocturno)'],
    medicalAlertNotes: 'Alergia severa a frutos secos. No administrar alimentos sin consultar a sus padres.',
    createdAt: '2026-03-15T10:00:00Z',
    updatedAt: '2026-09-20T14:30:00Z'
  },
  {
    id: 'child_sofia_02',
    parentId: 'parent_usr_elena',
    nickname: 'Sofi',
    fullName: 'Sofía Méndez Ruiz',
    age: 5,
    photoUrl: '/src/assets/images/tea_hero_family_1790581758877.jpg',
    qrCodeId: 'TEA-QR-SOFI-4419',
    privacyMode: 'publico_diario',
    isAlertActive: false,
    communicationType: 'verbal_limitado',
    communicationNotes: 'Usa palabras sueltas ("agua", "mamá", "ir a casa"). Suele repetir frases cortas cuando se desregula (ecolalia).',
    sensoryTriggers: ['luces_brillantes', 'ruidos_fuertes'],
    customSensoryNotes: 'Sensible a luces fluorescentes parpadeantes o música a volumen alto.',
    calmingTechniques: [
      'Agacharse a su altura y mantener una distancia de un metro',
      'Decirle: "Estás segura, mamá ya viene"',
      'Permitirle caminar en círculos si eso la calma'
    ],
    actionsToAvoid: [
      'No invadir su espacio físico inmediato',
      'No hacer preguntas abiertas largas'
    ],
    favoriteComfortItem: 'Pulsera elástica morada con textura',
    emergencyContacts: [
      {
        id: 'contact_elena_2',
        name: 'Elena Ruiz',
        relationship: 'Mamá',
        phone: '+52 55 9182 3456',
        whatsapp: '+525591823456',
        email: 'elena.ruiz.tea@ejemplo.com',
        isPrimary: true
      }
    ],
    bloodType: 'A+',
    allergies: ['Ninguna conocida'],
    medications: [],
    medicalAlertNotes: '',
    createdAt: '2026-06-10T12:00:00Z',
    updatedAt: '2026-09-25T09:15:00Z'
  }
];

export const FORUM_CATEGORIES: ForumCategory[] = [
  {
    id: 'cat_crianza',
    name: 'Crianza & Rutinas Diarias',
    description: 'Estrategias para el sueño, transiciones diarias, selectividad alimentaria y desregulaciones.',
    icon: 'HeartHandshake',
    postCount: 38
  },
  {
    id: 'cat_terapias',
    name: 'Especialistas & Terapias',
    description: 'Recomendaciones de Terapia Ocupacional, Fonoaudiología, Integración Sensorial y Neuropediatría.',
    icon: 'Stethoscope',
    postCount: 54
  },
  {
    id: 'cat_educacion',
    name: 'Escuela & Adaptaciones (PEI)',
    description: 'Acompañamiento escolar, maestras de apoyo, inclusión en aulas y derechos legales.',
    icon: 'GraduationCap',
    postCount: 29
  },
  {
    id: 'cat_ocio',
    name: 'Ocio & Espacios Sensoriales',
    description: 'Parques tranquilos, cines con funciones distendidas, viajes y actividades amigables.',
    icon: 'SunMedium',
    postCount: 21
  }
];

export const INITIAL_POSTS: ForumPost[] = [
  {
    id: 'post_101',
    categoryId: 'cat_crianza',
    authorId: 'usr_patricia',
    authorName: 'Patricia Morales',
    authorRole: 'Mamá de Lucas (8 años, TEA Nivel 2)',
    title: '¿Cómo manejan la transición al salir del parque sin crisis?',
    content: 'Hola familias. Cada vez que tenemos que irnos de los columpios, Lucas entra en una angustia enorme. Empezamos a usar un temporizador visual de 5 y 2 minutos en el móvil y nos ha reducido las crisis en un 70%. ¿Qué otra herramienta les ha funcionado a ustedes?',
    tags: ['Transiciones', 'Anticipación', 'Apoyos Visuales'],
    createdAt: 'Hace 3 horas',
    likesCount: 24,
    commentsCount: 3,
    isPinned: true,
    comments: [
      {
        id: 'c_1',
        postId: 'post_101',
        authorId: 'usr_marcos',
        authorName: 'Marcos Villegas',
        authorRole: 'Papá de Tomás (6 años)',
        content: '¡Totalmente de acuerdo! Nosotros usamos un llavero con pictogramas físicos de "Parque -> Auto -> Casa". Ver la secuencia con fotos reales antes de subir al coche fue un antes y un después.',
        createdAt: 'Hace 2 horas',
        likesCount: 9,
        isHelpfulVerified: true
      },
      {
        id: 'c_2',
        postId: 'post_101',
        authorId: 'usr_claudia',
        authorName: 'Lic. Claudia S. (Terapeuta Ocupacional)',
        authorRole: 'Especialista en Integración Sensorial',
        content: 'Excelente estrategia, Patricia. Además del temporizador, una transición propioceptiva como "vamos saltando como ranitas hasta el auto" ayuda a regular el sistema vestibular antes del corte de actividad.',
        createdAt: 'Hace 1 hora',
        likesCount: 15,
        isHelpfulVerified: true
      },
      {
        id: 'c_3',
        postId: 'post_101',
        authorId: 'usr_elena',
        authorName: 'Elena Ruiz',
        authorRole: 'Mamá de Mateo (7 años)',
        content: 'Muchas gracias por compartir. Con Mateo probaremos los dos avisos con el temporizador esta tarde.',
        createdAt: 'Hace 25 min',
        likesCount: 4
      }
    ]
  },
  {
    id: 'post_102',
    categoryId: 'cat_educacion',
    authorId: 'usr_roberto',
    authorName: 'Roberto Álvarez',
    authorRole: 'Papá de Nicolás (9 años)',
    title: 'Plantilla de información sensorial para profesores al iniciar el ciclo escolar',
    content: 'Les comparto una guía de 1 hoja que diseñamos con su terapeuta para la maestra nueva. Incluye señales tempranas de sobrecarga (parpadeo rápido, taparse los oídos) y qué hacer antes del colapso. Si a alguien le sirve, se las paso con gusto.',
    tags: ['Escuela', 'Inclusión', 'Profesores'],
    createdAt: 'Ayer',
    likesCount: 42,
    commentsCount: 2,
    comments: [
      {
        id: 'c_4',
        postId: 'post_102',
        authorId: 'usr_andrea',
        authorName: 'Andrea Navarro',
        authorRole: 'Mamá de Juli (5 años)',
        content: '¡Por favor! Me vendría genial para presentar en el colegio la próxima semana.',
        createdAt: 'Ayer',
        likesCount: 6
      }
    ]
  },
  {
    id: 'post_103',
    categoryId: 'cat_ocio',
    authorId: 'usr_daniela',
    authorName: 'Daniela Prieto',
    authorRole: 'Mamá de Bruno (4 años)',
    title: 'Museos y espacios con "Hora Silenciosa" este fin de semana',
    content: 'Recomiendo mucho la visita al Museo Interactivo los domingos de 9:00 a 11:00 am. Apagan música ambiental, atenúan luces y tienen kits con orejeras y juguetes antiestrés en recepción.',
    tags: ['Espacios Amigables', 'Salidas', 'Sensorial'],
    createdAt: 'Hace 2 días',
    likesCount: 31,
    commentsCount: 1,
    comments: [
      {
        id: 'c_5',
        postId: 'post_103',
        authorId: 'usr_elena',
        authorName: 'Elena Ruiz',
        authorRole: 'Mamá de Mateo (7 años)',
        content: '¡Qué gran iniciativa! Hacen falta muchos más espacios como este en la ciudad.',
        createdAt: 'Hace 1 día',
        likesCount: 5
      }
    ]
  }
];

export const INITIAL_CHAT_MESSAGES: ChatMessage[] = [
  {
    id: 'msg_1',
    senderId: 'usr_marcos',
    senderName: 'Marcos V. (Papá de Tomás)',
    text: 'Hola a todos los del grupo de apoyo, ¿alguien conoce fonoaudióloga con experiencia en PROMPT por la zona norte?',
    timestamp: '10:14'
  },
  {
    id: 'msg_2',
    senderId: 'usr_patricia',
    senderName: 'Patricia M. (Mamá de Lucas)',
    text: 'Hola Marcos, te recomiendo a la Lic. Mariana Casas. Trabaja con Lucas hace 1 año y medio con avances hermosos.',
    timestamp: '10:18'
  },
  {
    id: 'msg_3',
    senderId: 'usr_elena',
    senderName: 'Elena Ruiz (Tú)',
    text: 'Apoyo esa recomendación, además tiene mucha paciencia con niños no verbales.',
    timestamp: '10:22'
  }
];
