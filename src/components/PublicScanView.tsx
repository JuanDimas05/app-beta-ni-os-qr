import React, { useState } from 'react';
import { 
  Phone, 
  MessageSquare, 
  MapPin, 
  Heart, 
  AlertTriangle, 
  ShieldCheck, 
  Volume2, 
  Sparkles, 
  CheckCircle2, 
  Smartphone, 
  Eye, 
  AlertOctagon,
  Copy,
  Check
} from 'lucide-react';
import { ChildProfile } from '../types/tea';

interface PublicScanViewProps {
  child: ChildProfile;
  onBackToApp?: () => void;
}

export const PublicScanView: React.FC<PublicScanViewProps> = ({
  child,
  onBackToApp,
}) => {
  const [deviceFrameMode, setDeviceFrameMode] = useState<boolean>(false);
  const [geoStatus, setGeoStatus] = useState<string | null>(null);
  const [currentCoords, setCurrentCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [copiedLocation, setCopiedLocation] = useState(false);
  const [activePictogram, setActivePictogram] = useState<string | null>(null);

  const primaryContact = child.emergencyContacts.find(c => c.isPrimary) || child.emergencyContacts[0];
  const secondaryContact = child.emergencyContacts.find(c => !c.isPrimary);

  // Geolocalización del buen samaritano
  const handleCaptureLocation = () => {
    if (!navigator.geolocation) {
      setGeoStatus('Tu navegador no soporta geolocalización.');
      return;
    }

    setGeoStatus('Obteniendo coordenadas GPS precisas...');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude
        };
        setCurrentCoords(coords);
        const mapsLink = `https://maps.google.com/?q=${coords.lat},${coords.lng}`;
        setGeoStatus(`Ubicación lista: Lat ${coords.lat.toFixed(4)}, Lng ${coords.lng.toFixed(4)}`);
        
        // Auto prepara WhatsApp si existe
        if (primaryContact?.whatsapp) {
          const cleanPhone = primaryContact.whatsapp.replace(/\D/g, '');
          const message = encodeURIComponent(
            `Hola ${primaryContact.name}, escaneé el código de ${child.nickname}. Estoy con él/ella ahora mismo. Mi ubicación en Google Maps es: ${mapsLink}`
          );
          window.open(`https://wa.me/${cleanPhone}?text=${message}`, '_blank');
        }
      },
      (err) => {
        console.warn('Geolocation error:', err);
        setGeoStatus('No se pudo acceder al GPS. Por favor comparta una referencia visual a los padres.');
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  const getWhatsAppLink = (phone: string, contactName: string) => {
    const cleanPhone = phone.replace(/\D/g, '');
    let msg = `Hola ${contactName}, estoy con ${child.nickname}. Escaneé su código de auxilio TEA y está conmigo en un lugar seguro.`;
    if (currentCoords) {
      msg += ` Mi ubicación exacta en Maps: https://maps.google.com/?q=${currentCoords.lat},${currentCoords.lng}`;
    }
    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`;
  };

  // Content render
  const renderPublicContent = () => (
    <div className="max-w-md mx-auto bg-white min-h-screen text-slate-800 shadow-2xl flex flex-col font-sans pb-12">
      {/* 1. High Visibility Status Alert Header */}
      {child.isAlertActive ? (
        <div className="bg-rose-600 text-white px-4 py-3.5 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-2.5">
            <AlertOctagon className="w-6 h-6 shrink-0 animate-bounce" />
            <div>
              <div className="text-xs font-black tracking-wider uppercase">
                ⚠️ ALERTA: NIÑO REPORTADO COMO EXTRAVIADO
              </div>
              <div className="text-[11px] text-rose-100 font-medium leading-tight">
                Por favor permanece a su lado y contacta a sus padres de inmediato.
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-teal-700 text-white px-4 py-2.5 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 font-semibold">
            <ShieldCheck className="w-4 h-4 text-teal-200" />
            <span>Ficha Pública de Identificación & Auxilio TEA</span>
          </div>
          <span className="text-[10px] bg-teal-800/80 px-2 py-0.5 rounded text-teal-100 font-mono">
            {child.qrCodeId}
          </span>
        </div>
      )}

      {/* 2. Empathetic Hero Introduction */}
      <div className="p-5 bg-gradient-to-b from-teal-50/70 to-white border-b border-slate-100">
        <div className="flex items-center gap-4">
          <img
            src={child.photoUrl}
            alt={child.nickname}
            className="w-20 h-20 rounded-2xl object-cover border-2 border-white shadow-md shrink-0"
          />
          <div>
            <div className="text-xs font-semibold text-teal-800 uppercase tracking-wide">
              Hola, mi nombre es
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight font-display">
              {child.nickname}
            </h1>
            <div className="text-xs text-slate-600 mt-0.5">
              <span>{child.age} años</span>
              <span className="mx-1.5" aria-hidden="true">·</span>
              <span className="font-medium text-teal-700">Tengo Condición del Espectro Autista</span>
            </div>
          </div>
        </div>

        {/* Short Communication Notice */}
        <div className="mt-4 p-3 bg-amber-50/90 rounded-xl border border-amber-200/80 text-xs text-amber-900 flex items-start gap-2.5">
          <Volume2 className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold block">
              {child.communicationType === 'no_verbal' ? 'Soy No Verbal' : 'Comunicación Limitada'}:
            </span>
            <p className="mt-0.5 text-amber-800 leading-relaxed text-[11px]">
              {child.communicationNotes || 'Comprende frases cortas y sencillas. Si estoy asustado puedo no responder verbalmente.'}
            </p>
          </div>
        </div>
      </div>

      {/* 3. Primary Emergency Call-to-Actions (Prominent Buttons) */}
      <div className="p-5 space-y-3 bg-slate-50 border-b border-slate-100">
        <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
          Contacto Inmediato con mi Familia:
        </div>

        {primaryContact && (
          <div className="space-y-2">
            <a
              href={`tel:${primaryContact.phone}`}
              className="w-full py-3.5 px-4 bg-teal-700 hover:bg-teal-800 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2.5 shadow-sm active:scale-[0.98] transition-all"
            >
              <Phone className="w-5 h-5 animate-pulse" />
              <span>Llamar a {primaryContact.name} ({primaryContact.relationship})</span>
            </a>

            <a
              href={getWhatsAppLink(primaryContact.whatsapp || primaryContact.phone, primaryContact.name)}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold text-xs flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Enviar WhatsApp con Mensaje de Auxilio</span>
            </a>
          </div>
        )}

        {/* Secondary Contact if exists */}
        {secondaryContact && (
          <div className="pt-1">
            <a
              href={`tel:${secondaryContact.phone}`}
              className="w-full py-2.5 px-4 bg-white border border-slate-300 text-slate-800 hover:bg-slate-100 rounded-xl font-medium text-xs flex items-center justify-center gap-2"
            >
              <Phone className="w-3.5 h-3.5 text-slate-500" />
              <span>Contacto 2: Llamar a {secondaryContact.name} ({secondaryContact.relationship})</span>
            </a>
          </div>
        )}

        {/* Share Location via Geolocation Button */}
        <div className="pt-1">
          <button
            type="button"
            onClick={handleCaptureLocation}
            className="w-full py-2.5 px-3 bg-blue-50 border border-blue-200 text-blue-800 hover:bg-blue-100 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
          >
            <MapPin className="w-4 h-4 text-blue-600" />
            <span>Compartir mi ubicación GPS actual con los padres</span>
          </button>
          {geoStatus && (
            <div className="text-[11px] text-center text-blue-700 mt-1 font-medium">
              {geoStatus}
            </div>
          )}
        </div>
      </div>

      {/* 4. Actionable Instructions for the Good Samaritan / Police */}
      <div className="p-5 space-y-4">
        {/* Qué SÍ hacer */}
        <div className="bg-emerald-50/70 p-4 rounded-2xl border border-emerald-200">
          <h2 className="text-xs font-bold text-emerald-950 uppercase tracking-wider flex items-center gap-1.5 mb-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            Cómo ayudarme (Qué SÍ hacer):
          </h2>
          <ul className="text-xs text-emerald-900 space-y-2">
            {child.calmingTechniques.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="font-bold text-emerald-600 mt-0.5">•</span>
                <span className="leading-snug">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Qué NO hacer */}
        <div className="bg-rose-50/70 p-4 rounded-2xl border border-rose-200">
          <h2 className="text-xs font-bold text-rose-950 uppercase tracking-wider flex items-center gap-1.5 mb-2.5">
            <AlertTriangle className="w-4 h-4 text-rose-600" />
            Qué evitar (Puede asustarme o sobrecargarme):
          </h2>
          <ul className="text-xs text-rose-900 space-y-2">
            {child.actionsToAvoid.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="font-bold text-rose-600 mt-0.5">✕</span>
                <span className="leading-snug">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Objeto de Confort */}
        {child.favoriteComfortItem && (
          <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-200 flex items-start gap-2.5 text-xs text-amber-950">
            <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block">Objeto de Confort en su Pertenencia:</span>
              <span className="text-amber-900">{child.favoriteComfortItem}</span>
            </div>
          </div>
        )}

        {/* 5. Apoyo Visual Interactivo: Pictogramas de Comunicación Rápida */}
        <div className="pt-2">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Muéstrale estos pictogramas en la pantalla:
            </h3>
            <span className="text-[10px] text-slate-400">Toca para ampliar</span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'water', label: '¿Tienes sed?', icon: '💧', text: '¿Quieres agua?' },
              { id: 'home', label: 'A salvo', icon: '🛡️', text: 'Estás seguro, ya llamamos a mamá.' },
              { id: 'noise', label: 'Mucho ruido', icon: '🎧', text: '¿Quieres tus auriculares?' },
              { id: 'mom', label: 'Mamá viene', icon: '❤️', text: 'Tu familia ya viene en camino.' },
              { id: 'sit', label: 'Sentarse', icon: '🪑', text: 'Vamos a sentarnos aquí tranquilos.' },
              { id: 'breathe', label: 'Respirar', icon: '🌸', text: 'Respira despacio conmigo.' },
            ].map((pic) => (
              <button
                key={pic.id}
                type="button"
                onClick={() => setActivePictogram(activePictogram === pic.id ? null : pic.id)}
                className={`p-2.5 rounded-xl border text-center transition-all ${
                  activePictogram === pic.id
                    ? 'border-teal-600 bg-teal-50 ring-2 ring-teal-500/20'
                    : 'border-slate-200 bg-white hover:bg-slate-50'
                }`}
              >
                <div className="text-2xl mb-1">{pic.icon}</div>
                <div className="text-[11px] font-bold text-slate-800 leading-tight">
                  {pic.label}
                </div>
              </button>
            ))}
          </div>

          {activePictogram && (
            <div className="mt-3 p-3 bg-teal-700 text-white rounded-xl text-center text-xs font-medium animate-in fade-in">
              {activePictogram === 'water' && '💧 "¿Tienes sed? ¿Quieres un poco de agua?"'}
              {activePictogram === 'home' && '🛡️ "Estás a salvo, nadie te hará daño. Tu familia ya fue contactada."'}
              {activePictogram === 'noise' && '🎧 "¿Hay mucho ruido? Vamos a un lugar más tranquilo."'}
              {activePictogram === 'mom' && '❤️ "Mamá y papá están avisados y vienen hacia aquí."'}
              {activePictogram === 'sit' && '🪑 "Vamos a sentarnos aquí en silencio un momento."'}
              {activePictogram === 'breathe' && '🌸 "Respira hondo conmigo: toma aire... y suelta suave."'}
            </div>
          )}
        </div>

        {/* 6. Medical & Allergies Alert */}
        {(child.allergies?.length || child.medications?.length || child.medicalAlertNotes) && (
          <div className="p-3.5 bg-slate-100 rounded-xl border border-slate-200 text-xs text-slate-700 space-y-1">
            <span className="font-bold text-slate-900 block">Información Médica Crítica:</span>
            {child.allergies && child.allergies.length > 0 && (
              <div>
                <span className="text-slate-500">Alergias severas: </span>
                <strong className="text-rose-700">{child.allergies.join(', ')}</strong>
              </div>
            )}
            {child.medicalAlertNotes && (
              <p className="text-[11px] text-slate-600 mt-1">
                {child.medicalAlertNotes}
              </p>
            )}
          </div>
        )}

        {/* Footer note */}
        <div className="pt-3 text-center border-t border-slate-100 text-[11px] text-slate-400">
          Esta ficha de auxilio es generada de forma segura mediante ConectaTEA. 
          Los datos sensibles son protegidos según normativas de privacidad de menores.
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      {/* Simulation / View Mode Bar */}
      <div className="bg-white p-3 sm:p-4 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <Eye className="w-4 h-4 text-teal-700" />
          <span className="font-semibold text-slate-800">
            Simulador de Vista Pública de Escaneo
          </span>
          <span className="text-slate-400">|</span>
          <span className="text-slate-500">
            Esto es exactamente lo que ve cualquier persona que escanea el código con su cámara
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setDeviceFrameMode(!deviceFrameMode)}
            className={`px-3 py-1.5 rounded-lg border text-xs font-medium flex items-center gap-1.5 transition-colors ${
              deviceFrameMode
                ? 'bg-slate-900 text-white border-slate-900'
                : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>{deviceFrameMode ? 'Marco Móvil' : 'Pantalla Completa'}</span>
          </button>

          {onBackToApp && (
            <button
              type="button"
              onClick={onBackToApp}
              className="px-3 py-1.5 bg-teal-50 text-teal-800 border border-teal-200 rounded-lg text-xs font-semibold hover:bg-teal-100"
            >
              Volver al Panel de Padres
            </button>
          )}
        </div>
      </div>

      {/* Main Container */}
      {deviceFrameMode ? (
        <div className="py-6 flex justify-center bg-slate-900/5 rounded-3xl p-4 sm:p-8">
          {/* Mobile frame bezel */}
          <div className="w-full max-w-[400px] bg-slate-900 p-3 rounded-[40px] shadow-2xl border-4 border-slate-800">
            <div className="w-28 h-4 bg-slate-800 mx-auto rounded-full mb-2" />
            <div className="rounded-[32px] overflow-hidden bg-white max-h-[780px] overflow-y-auto">
              {renderPublicContent()}
            </div>
            <div className="w-32 h-1 bg-slate-700 mx-auto rounded-full mt-2.5" />
          </div>
        </div>
      ) : (
        <div className="flex justify-center bg-slate-100/60 p-2 sm:p-4 rounded-2xl">
          {renderPublicContent()}
        </div>
      )}
    </div>
  );
};
