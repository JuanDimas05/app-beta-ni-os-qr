export type CommunicationNeed = 
  | 'no_verbal' 
  | 'verbal_limitado' 
  | 'verbal_fluido' 
  | 'usa_pictogramas_pecs' 
  | 'usa_comunicador_caa' 
  | 'ecolalia';

export type SensorySensitivity = 
  | 'ruidos_fuertes' 
  | 'luces_brillantes' 
  | 'contacto_fisico' 
  | 'multitudes' 
  | 'olores_fuertes' 
  | 'texturas_ropa';

export type PrivacyMode = 'publico_diario' | 'alerta_emergencia' | 'restringido';

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  role: string; // ej. "Mamá de Mateo", "Papá de Sofi", "Terapeuta", "Familiar tutor"
  phone: string;
  avatarUrl?: string;
  verifiedEmail: boolean;
  createdAt: string;
}

export interface EmergencyContact {
  id: string;
  name: string;
  relationship: string; // ej. Mamá, Papá, Terapeuta, Abuela
  phone: string;
  whatsapp: string;
  email?: string;
  isPrimary: boolean;
}

export interface ChildProfile {
  id: string;
  parentId: string;
  nickname: string; // Nombre o apodo para preservar privacidad
  fullName?: string; // Opcional / privado
  age: number;
  photoUrl: string;
  qrCodeId: string;
  privacyMode: PrivacyMode; // 'publico_diario' oculta apellidos y detalles médicos profundos
  isAlertActive: boolean; // Si el niño se extravió, activa banner de alta urgencia en la vista pública
  
  // 1. Necesidades de comunicación
  communicationType: CommunicationNeed;
  communicationNotes: string; // Ej: "Comprende instrucciones cortas. Si se asusta puede no responder."
  sensoryTriggers: SensorySensitivity[];
  customSensoryNotes?: string;

  // 2. Formas de interactuar o calmar
  calmingTechniques: string[]; // Ej: "Hablar con tono suave", "Ofrecerle sus auriculares canceladores en su mochila", "Darle su peluche azul"
  actionsToAvoid: string[]; // Ej: "No sujetarlo de los brazos", "No gritarle ni rodearlo en grupo", "No mirarlo fijamente de cerca"
  favoriteComfortItem?: string; // Ej: "Dinosaurio de goma verde en el bolsillo lateral"

  // 3. Contactos de emergencia
  emergencyContacts: EmergencyContact[];

  // 4. Datos médicos críticos (opcional)
  bloodType?: string;
  allergies?: string[];
  medications?: string[];
  medicalAlertNotes?: string; // Ej: "Tiene epilepsia controlada con Levetiracetam", "Diabético Tipo 1"
  
  createdAt: string;
  updatedAt: string;
}

export interface QRTagConfig {
  id: string;
  childId: string;
  tagType: 'wristband' | 'pocket_card' | 'clothing_patch' | 'backpack_badge';
  includePhoto: boolean;
  includeDirectPhone: boolean;
  includePictograms: boolean;
  customSafetyMessage: string;
  accentColor: string;
}

export interface ForumCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  postCount: number;
}

export interface ForumComment {
  id: string;
  postId: string;
  authorId: string;
  authorName: string;
  authorRole: string; // ej. "Mamá de Leo (6a)", "Fonoaudióloga & Mamá", "Papá de Mateo (8a)"
  authorAvatar?: string;
  content: string;
  createdAt: string;
  likesCount: number;
  isHelpfulVerified?: boolean;
}

export interface ForumPost {
  id: string;
  categoryId: string;
  authorId: string;
  authorName: string;
  authorRole: string;
  authorAvatar?: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: string;
  likesCount: number;
  commentsCount: number;
  comments: ForumComment[];
  isPinned?: boolean;
  savedByMe?: boolean;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  text: string;
  timestamp: string;
  isParentCommunity?: boolean;
}

export interface ScanTelemetryLog {
  id: string;
  childId: string;
  scannedAt: string;
  locationApprox?: string;
  userAgent?: string;
  notifiedParent: boolean;
}
