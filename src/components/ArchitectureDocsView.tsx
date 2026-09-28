import React, { useState } from 'react';
import { 
  Layers, 
  Database, 
  ShieldCheck, 
  Cpu, 
  Workflow, 
  Lock, 
  Smartphone, 
  FileText, 
  Code,
  CheckCircle,
  Copy,
  Check
} from 'lucide-react';

export const ArchitectureDocsView: React.FC = () => {
  const [activeSection, setActiveSection] = useState<'screens' | 'models' | 'privacy' | 'tech'>('screens');
  const [copiedCode, setCopiedCode] = useState(false);

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code).then(() => {
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    });
  };

  const sqlSchema = `CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    full_name VARCHAR(150) NOT NULL,
    phone VARCHAR(30) NOT NULL,
    is_verified_parent BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE child_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    parent_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    nickname VARCHAR(60) NOT NULL,
    full_name_encrypted TEXT, -- Cifrado AES-256 para resguardo legal
    birth_date DATE,
    photo_url TEXT,
    qr_code_id VARCHAR(50) UNIQUE NOT NULL,
    privacy_mode VARCHAR(20) DEFAULT 'publico_diario' CHECK (privacy_mode IN ('publico_diario', 'alerta_emergencia', 'restringido')),
    is_alert_active BOOLEAN DEFAULT FALSE,
    communication_type VARCHAR(50) NOT NULL,
    communication_notes TEXT,
    sensory_triggers JSONB DEFAULT '[]'::jsonb,
    calming_techniques JSONB DEFAULT '[]'::jsonb,
    actions_to_avoid JSONB DEFAULT '[]'::jsonb,
    favorite_comfort_item VARCHAR(255),
    blood_type VARCHAR(10),
    allergies JSONB DEFAULT '[]'::jsonb,
    medications JSONB DEFAULT '[]'::jsonb,
    medical_alert_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE emergency_contacts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    child_id UUID NOT NULL REFERENCES child_profiles(id) ON DELETE CASCADE,
    name VARCHAR(120) NOT NULL,
    relationship VARCHAR(60) NOT NULL,
    phone VARCHAR(30) NOT NULL,
    whatsapp VARCHAR(30) NOT NULL,
    email VARCHAR(255),
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE qr_audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    qr_code_id VARCHAR(50) NOT NULL,
    child_id UUID NOT NULL REFERENCES child_profiles(id) ON DELETE CASCADE,
    scanned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    user_agent TEXT,
    approx_ip_city VARCHAR(100),
    geo_latitude DECIMAL(10, 8),
    geo_longitude DECIMAL(11, 8),
    notified_parent BOOLEAN DEFAULT FALSE
);

CREATE TABLE forum_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id VARCHAR(50) NOT NULL,
    author_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    tags JSONB DEFAULT '[]'::jsonb,
    likes_count INT DEFAULT 0,
    is_pinned BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE forum_comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID NOT NULL REFERENCES forum_posts(id) ON DELETE CASCADE,
    author_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    is_verified_specialist BOOLEAN DEFAULT FALSE,
    likes_count INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);`;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 rounded-2xl text-white p-6 sm:p-8 shadow-sm">
        <div className="flex items-center gap-2 text-teal-400 text-xs font-semibold uppercase tracking-wider">
          <Workflow className="w-4 h-4" />
          <span>Especificación Técnica & Arquitectura de Producto</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold mt-1 mb-2 font-display text-white">
          Documento de Ingeniería y Diseño: ConectaTEA
        </h1>
        <p className="text-slate-300 text-sm max-w-3xl leading-relaxed">
          Diseño holístico de la solución: mapa de pantallas móviles, modelos de bases de datos relacionales y NoSQL,
          normativas de privacidad infantil (COPPA / GDPR-K / LOPD-GDD) y stack tecnológico para la vista pública instantánea.
        </p>

        {/* Section Tabs */}
        <div className="mt-6 flex flex-wrap gap-2">
          {[
            { id: 'screens', label: '1. Mapa de Pantallas & Flujos', icon: Layers },
            { id: 'models', label: '2. Modelos de Base de Datos', icon: Database },
            { id: 'privacy', label: '3. Privacidad & Cumplimiento', icon: ShieldCheck },
            { id: 'tech', label: '4. Stack Tecnológico QR & Web', icon: Cpu },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSection(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                  activeSection === tab.id
                    ? 'bg-teal-600 text-white shadow-sm'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* SECTION 1: MAPA DE PANTALLAS & FLUJOS */}
      {activeSection === 'screens' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h2 className="text-lg font-bold text-slate-900 font-display flex items-center gap-2">
              <Layers className="w-5 h-5 text-teal-700" />
              1. Mapa de Pantallas de la Aplicación Móvil
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              La arquitectura de información se divide en dos mundos: 
              <strong> El Entorno Privado de los Padres (PWA / App Móvil)</strong> y 
              <strong> La Vista Pública de Auxilio (Página Web Ultraligera sin Login para Transeúntes)</strong>.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
              {/* Screen 1 */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                <div className="text-xs font-bold text-teal-800 uppercase tracking-wider">
                  Pantalla 1
                </div>
                <h3 className="text-sm font-bold text-slate-900">
                  Panel de Inicio & Perfiles de Menores
                </h3>
                <ul className="text-xs text-slate-600 space-y-1 list-disc list-inside">
                  <li>Selector rápido entre hijos registrados.</li>
                  <li>Ficha de resumen: nivel de comunicación, desencadenantes y contactos.</li>
                  <li><strong>Botón Alerta SOS</strong>: cambia el estado del niño a "Extraviado" con 1 toque.</li>
                  <li>Acceso directo a generación de etiquetas e historial de escaneos.</li>
                </ul>
              </div>

              {/* Screen 2 */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                <div className="text-xs font-bold text-teal-800 uppercase tracking-wider">
                  Pantalla 2
                </div>
                <h3 className="text-sm font-bold text-slate-900">
                  Formulario Asistido de Registro TEA
                </h3>
                <ul className="text-xs text-slate-600 space-y-1 list-disc list-inside">
                  <li>Nombre o apodo visible (recomendación de privacidad).</li>
                  <li>Estilo de comunicación (No verbal, PECS, CAA, ecolalia).</li>
                  <li>Técnicas de desescalada de crisis con sugerencias de 1 toque.</li>
                  <li>Acciones que se deben evitar a toda costa.</li>
                  <li>Contactos primarios y secundarios de rescate.</li>
                </ul>
              </div>

              {/* Screen 3 */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                <div className="text-xs font-bold text-teal-800 uppercase tracking-wider">
                  Pantalla 3
                </div>
                <h3 className="text-sm font-bold text-slate-900">
                  Estudio de Exportación & Impresión QR
                </h3>
                <ul className="text-xs text-slate-600 space-y-1 list-disc list-inside">
                  <li>Selector de formato: Pulsera Tyvek/Silicona, Tarjeta 85x54mm o Parche 70x70mm.</li>
                  <li>Personalización de frase tranquilizadora exterior.</li>
                  <li>Filtro de privacidad: incluir o no teléfono impreso visible.</li>
                  <li>Descarga en PNG de alta resolución (300 DPI) e impresión nativa directa.</li>
                </ul>
              </div>

              {/* Screen 4 */}
              <div className="p-4 rounded-xl border border-slate-200 bg-teal-50/70 border-teal-200 space-y-2">
                <div className="text-xs font-bold text-teal-900 uppercase tracking-wider">
                  Pantalla 4 (Externa / Terceros)
                </div>
                <h3 className="text-sm font-bold text-slate-900">
                  Ficha Pública de Escaneo Inmediato
                </h3>
                <ul className="text-xs text-slate-700 space-y-1 list-disc list-inside">
                  <li>Carga en &lt; 1 segundo sin requerir instalación ni cuenta.</li>
                  <li>Banner de estado (Normal vs Extraviado).</li>
                  <li>Botón directo de llamada a mamá/papá y WhatsApp con ubicación GPS.</li>
                  <li>Guía de qué SÍ hacer y qué NO hacer para proteger al menor.</li>
                  <li>Pictogramas de comunicación interactivos para el transeúnte.</li>
                </ul>
              </div>

              {/* Screen 5 */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                <div className="text-xs font-bold text-teal-800 uppercase tracking-wider">
                  Pantalla 5
                </div>
                <h3 className="text-sm font-bold text-slate-900">
                  Foros de Apoyo Categorizados
                </h3>
                <ul className="text-xs text-slate-600 space-y-1 list-disc list-inside">
                  <li>Temas: Crianza cotidiana, Terapias, Escuela/PEI y Ocio Sensorial.</li>
                  <li>Buscador instantáneo por etiquetas sensoriales.</li>
                  <li>Respuestas con sello de "Especialista Verificado".</li>
                  <li>Botón para compartir recursos y pictogramas descargables.</li>
                </ul>
              </div>

              {/* Screen 6 */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                <div className="text-xs font-bold text-teal-800 uppercase tracking-wider">
                  Pantalla 6
                </div>
                <h3 className="text-sm font-bold text-slate-900">
                  Salas de Chat entre Padres & Soporte
                </h3>
                <ul className="text-xs text-slate-600 space-y-1 list-disc list-inside">
                  <li>Chat grupal en tiempo real para dudas rápidas.</li>
                  <li>Mensajería directa entre familias de la misma zona.</li>
                  <li>Filtro anti-spam y moderación comunitaria estricta.</li>
                  <li>Cifrado en tránsito para proteger vivencias personales.</li>
                </ul>
              </div>
            </div>

            {/* User Journey Map Diagram */}
            <div className="mt-6 p-5 bg-slate-50 rounded-xl border border-slate-200">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">
                Diagrama del Flujo Crítico de Emergencia (User Journey):
              </h3>
              <div className="text-xs text-slate-700 space-y-3">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-teal-700 text-white flex items-center justify-center font-bold text-xs shrink-0">1</span>
                  <span><strong>Prevención:</strong> Los padres registran la ficha con apodo, desencadenantes y contactos. Imprimen el QR en la pulsera o parche de ropa del niño.</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-teal-700 text-white flex items-center justify-center font-bold text-xs shrink-0">2</span>
                  <span><strong>Incidente:</strong> El menor se desorienta en un centro comercial o parque. Un transeúnte o policía local nota la pulsera y escanea el QR con la cámara de su móvil.</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-teal-700 text-white flex items-center justify-center font-bold text-xs shrink-0">3</span>
                  <span><strong>Acceso Inmediato:</strong> Se abre la web pública en 800ms. El buen samaritano ve: <em>"Mateo es no verbal. No lo tomes del brazo. Habla suave. Llama a su mamá Elena"</em>.</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-teal-700 text-white flex items-center justify-center font-bold text-xs shrink-0">4</span>
                  <span><strong>Contacto & Geolocalización:</strong> Con un solo toque, el transeúnte pulsa "Llamar" o "Enviar WhatsApp con GPS", compartiendo las coordenadas exactas de Google Maps con la madre.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: MODELOS DE DATOS */}
      {activeSection === 'models' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900 font-display flex items-center gap-2">
                  <Database className="w-5 h-5 text-teal-700" />
                  2. Estructura de la Base de Datos (Relacional & Documental)
                </h2>
                <p className="text-xs text-slate-600 mt-0.5">
                  Diseño normalizado con soporte JSONB para atributos sensoriales altamente variables.
                </p>
              </div>

              <button
                type="button"
                onClick={() => copyCode(sqlSchema)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium transition-colors"
              >
                {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCode ? '¡Copiado!' : 'Copiar DDL SQL'}</span>
              </button>
            </div>

            {/* SQL schema code block */}
            <div className="rounded-xl overflow-hidden border border-slate-200 bg-slate-950 p-4 font-mono text-[11px] text-slate-300 overflow-x-auto max-h-[420px]">
              <pre>{sqlSchema}</pre>
            </div>

            {/* Model dictionary */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-xs font-bold text-slate-900 block mb-1">
                  Entidad: ChildProfile (Menor)
                </span>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Contiene los datos centrales de auxilio. El campo <code>nickname</code> es obligatorio y público, mientras que <code>full_name_encrypted</code> se mantiene cifrado en reposo para cumplir con el principio de minimización. Los desencadenantes y técnicas de calma se modelan como arrays indexados para búsqueda rápida.
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-xs font-bold text-slate-900 block mb-1">
                  Entidad: QR_Audit_Log (Auditoría)
                </span>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Cada vez que se escanea el código QR se genera un registro inmutable con marca de tiempo, cabecera de navegador y, si el usuario acepta, coordenadas geográficas aproximadas para notificar a los tutores y prevenir uso indebido.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 3: PRIVACIDAD Y CUMPLIMIENTO */}
      {activeSection === 'privacy' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h2 className="text-lg font-bold text-slate-900 font-display flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-teal-700" />
              3. Protocolos de Privacidad y Cumplimiento Normativo de Menores
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              Tratar información sobre menores y diagnósticos médicos exige el estándar más estricto del Reglamento General de Protección de Datos (RGPD / GDPR-K, Art. 8 y 9) y la Children's Online Privacy Protection Act (COPPA).
            </p>

            <div className="space-y-3 pt-2">
              {/* Rule 1 */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-teal-700" />
                  <h3 className="text-xs font-bold text-slate-900">
                    A. Principio de Minimización de Datos en la Ficha Pública
                  </h3>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed pl-6">
                  Nunca se exponen en la URL pública apellidos completos, dirección del hogar, colegio ni historial clínico exhaustivo. 
                  En <strong>Modo Diario Seguro</strong>, la vista pública solo muestra el apodo, la edad aproximada, qué hacer/evitar y los botones de llamada directa a los padres.
                </p>
              </div>

              {/* Rule 2 */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-teal-700" />
                  <h3 className="text-xs font-bold text-slate-900">
                    B. Cifrado Asimétrico y Reducción de Huella en el Código QR
                  </h3>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed pl-6">
                  El código QR <strong>no almacena datos personales en texto plano</strong> dentro de la matriz de puntos. 
                  Únicamente codifica un identificador único seguro (ej. <code>/s/TEA-8821</code>). 
                  Esto permite revocar el código al instante o cambiar teléfonos sin tener que tirar la pulsera física.
                </p>
              </div>

              {/* Rule 3 */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-teal-700" />
                  <h3 className="text-xs font-bold text-slate-900">
                    C. Consentimiento Parental Verificado (VPC) & Derecho al Olvido
                  </h3>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed pl-6">
                  Solo los tutores legales que confirman su identidad mediante correo de doble factor pueden crear fichas. 
                  En cumplimiento con el RGPD, los padres cuentan con un botón de <strong>"Eliminación Total Inmediata"</strong> que purga de forma irrecuperable los registros, fotos y logs de escaneo.
                </p>
              </div>

              {/* Rule 4 */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-teal-700" />
                  <h3 className="text-xs font-bold text-slate-900">
                    D. Geolocalización Opt-in con Consentimiento Explícito
                  </h3>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed pl-6">
                  La geolocalización no se captura de forma oculta ni en segundo plano. Requiere que el transeúnte pulse activamente <em>"Compartir mi ubicación con los padres"</em>, abriendo directamente WhatsApp o SMS sin almacenar coordenadas en servidores ajenos.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 4: STACK TECNOLÓGICO SUGERIDO */}
      {activeSection === 'tech' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h2 className="text-lg font-bold text-slate-900 font-display flex items-center gap-2">
              <Cpu className="w-5 h-5 text-teal-700" />
              4. Sugerencias Tecnológicamente Más Viables para QR y Vista Pública
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              En una emergencia real, un transeúnte puede encontrarse en un subterráneo, parque o zona con señal 3G débil. 
              La vista pública debe ser hiper-optimizada para cargar en milisegundos con cero dependencias pesadas.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              {/* Tech 1 */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <span className="text-xs font-bold text-teal-800 uppercase tracking-wider block">
                  A. Generación de Códigos QR
                </span>
                <p className="text-xs text-slate-700 leading-relaxed">
                  <strong>Recomendación:</strong> Generación dual SVG + Canvas utilizando corrección de errores <strong>Reed-Solomon Nivel M (15%) o H (30%)</strong>.
                </p>
                <ul className="text-xs text-slate-600 space-y-1 list-disc list-inside">
                  <li><strong>SVG vectorial:</strong> Ideal para impresión textil en parches o grabado láser en placas de aluminio sin pixelación.</li>
                  <li><strong>Canvas PNG a 300 DPI:</strong> Exportable para planchas de impresión doméstica de etiquetas y pulseras.</li>
                  <li><strong>Contraste mínimo 7:1:</strong> Colores oscuros profundos sobre fondo blanco puro para asegurar lectura bajo luz solar directa o cámaras de gama baja.</li>
                </ul>
              </div>

              {/* Tech 2 */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <span className="text-xs font-bold text-teal-800 uppercase tracking-wider block">
                  B. Vista Pública Ultraligera (Edge SSR / SSG)
                </span>
                <p className="text-xs text-slate-700 leading-relaxed">
                  <strong>Recomendación:</strong> Cloudflare Workers o Vercel Edge con renderizado HTML mínimo estático (&lt; 45 KB gzipped).
                </p>
                <ul className="text-xs text-slate-600 space-y-1 list-disc list-inside">
                  <li><strong>Cero JavaScript obligatorio para el primer render:</strong> Los botones <code>tel:</code> y <code>wa.me</code> funcionan de forma nativa sin esperar hidratación de React.</li>
                  <li><strong>Caché en CDN Edge:</strong> TTFB inferior a 50 milisegundos en cualquier parte del mundo.</li>
                  <li><strong>No requerir instalación:</strong> Se abre directamente en Safari o Chrome al apuntar con la cámara.</li>
                </ul>
              </div>

              {/* Tech 3 */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <span className="text-xs font-bold text-teal-800 uppercase tracking-wider block">
                  C. Notificación Push a los Padres
                </span>
                <p className="text-xs text-slate-700 leading-relaxed">
                  <strong>Recomendación:</strong> Webhook inmediato activado en el escaneo con Web Push (VAPID) y respaldo vía SMS (Twilio / AWS SNS).
                </p>
                <ul className="text-xs text-slate-600 space-y-1 list-disc list-inside">
                  <li>Al abrirse la URL pública, el servidor dispara una alerta silenciosa al teléfono del padre: <em>"Tu código QR fue escaneado a las 14:02"</em>.</li>
                  <li>Evita falsas alarmas con límite de tasa (rate limiting de 1 alerta cada 3 minutos por IP).</li>
                </ul>
              </div>

              {/* Tech 4 */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <span className="text-xs font-bold text-teal-800 uppercase tracking-wider block">
                  D. Resistencia Física del Soporte
                </span>
                <p className="text-xs text-slate-700 leading-relaxed">
                  <strong>Recomendación de Materiales:</strong>
                </p>
                <ul className="text-xs text-slate-600 space-y-1 list-disc list-inside">
                  <li><strong>Pulseras:</strong> Silicona médica hipoalergénica con QR grabado por láser o Tyvek impermeable para parques.</li>
                  <li><strong>Ropa y Mochilas:</strong> Vinilo textil termotransferible o parches bordados con bordes redondeados para evitar rozaduras sensoriales.</li>
                  <li><strong>Calzado:</strong> Pasador de cordones metálico o etiqueta interior en lengüeta para niños que se quitan accesorios.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
