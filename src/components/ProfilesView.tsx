import React from 'react';
import { 
  Plus, 
  QrCode, 
  Eye, 
  Edit3, 
  Phone, 
  AlertTriangle, 
  Sparkles, 
  Heart, 
  Volume2, 
  ShieldAlert,
  Info,
  UserCheck,
  Lock
} from 'lucide-react';
import { ChildProfile, UserAccount } from '../types/tea';

interface ProfilesViewProps {
  childrenList: ChildProfile[];
  activeChild: ChildProfile | null;
  setActiveChild: (child: ChildProfile) => void;
  onEditChild: (child: ChildProfile) => void;
  onAddNewChild: () => void;
  onNavigateToQR: (child: ChildProfile) => void;
  onNavigateToScan: (child: ChildProfile) => void;
  onToggleAlert: (childId: string) => void;
  currentUser: UserAccount | null;
  onOpenAuth: () => void;
}

export const ProfilesView: React.FC<ProfilesViewProps> = ({
  childrenList,
  activeChild,
  setActiveChild,
  onEditChild,
  onAddNewChild,
  onNavigateToQR,
  onNavigateToScan,
  onToggleAlert,
  currentUser,
  onOpenAuth,
}) => {
  return (
    <div className="space-y-6">
      {/* Top Banner / Welcome with anti-slop clean layout */}
      <div className="bg-gradient-to-r from-teal-800 to-slate-900 rounded-2xl text-white p-6 sm:p-8 shadow-sm">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-teal-300 text-xs font-semibold tracking-wider uppercase">
              Plataforma de Protección y Empatía
            </span>
            {currentUser && (
              <span className="bg-teal-700/60 text-teal-200 border border-teal-500/30 text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1 font-medium">
                <UserCheck className="w-3 h-3 text-teal-300" />
                Sesión de: {currentUser.name} ({currentUser.role})
              </span>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold mt-1 mb-2 font-display text-white">
            Perfiles de Identificación & Códigos de Auxilio TEA
          </h1>
          <p className="text-teal-100/90 text-sm leading-relaxed max-w-2xl">
            Registra los datos vitales, desencadenantes sensoriales y pasos exactos para calmar a tus hijos en momentos de crisis. 
            Cualquier persona que escanee su pulsera o parche podrá contactarte en segundos y sabrá cómo actuar con respeto.
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <button
              onClick={onAddNewChild}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white text-slate-900 rounded-lg text-xs font-semibold hover:bg-teal-50 transition-colors shadow-xs"
            >
              <Plus className="w-4 h-4 text-teal-700" />
              <span>Registrar Nuevo Menor</span>
            </button>
            
            {!currentUser && (
              <button
                onClick={onOpenAuth}
                className="inline-flex items-center gap-2 px-4 py-2 bg-teal-700/70 hover:bg-teal-600 border border-teal-500/40 text-white rounded-lg text-xs font-medium transition-colors"
              >
                <Lock className="w-3.5 h-3.5 text-teal-200" />
                <span>Iniciar Sesión / Crear Cuenta de Tutor</span>
              </button>
            )}

            <div className="text-xs text-teal-200">
              {childrenList.length} {childrenList.length === 1 ? 'perfil registrado' : 'perfiles registrados'}
            </div>
          </div>
        </div>
      </div>

      {/* Children Profiles Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {childrenList.map((child) => {
          const isSelected = activeChild?.id === child.id;

          return (
            <div
              key={child.id}
              onClick={() => setActiveChild(child)}
              className={`rounded-2xl border transition-all duration-200 bg-white overflow-hidden shadow-xs cursor-pointer ${
                isSelected
                  ? 'border-teal-600 ring-2 ring-teal-500/20'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              {/* Card Header */}
              <div className="p-5 sm:p-6 border-b border-slate-100 flex items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                  <img
                    src={child.photoUrl}
                    alt={child.nickname}
                    className="w-16 h-16 rounded-xl object-cover border border-slate-200 shadow-xs"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-lg font-bold text-slate-900 font-display">
                        {child.nickname}
                      </h2>
                      <span className="text-xs text-slate-500">
                        ({child.age} años)
                      </span>
                    </div>

                    <div className="text-xs text-slate-500 mt-0.5">
                      <span>{child.communicationType === 'no_verbal' ? 'No verbal' : child.communicationType === 'verbal_limitado' ? 'Verbal limitado' : 'Verbal con apoyo'}</span>
                      <span className="mx-1.5" aria-hidden="true">·</span>
                      <span>QR: {child.qrCodeId}</span>
                    </div>

                    <div className="mt-1 flex items-center gap-1.5 text-[11px] text-teal-800 font-medium">
                      <span>Modo: {child.privacyMode === 'publico_diario' ? 'Diario Seguro' : 'Emergencia Completa'}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onEditChild(child);
                    }}
                    className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                    title="Editar ficha"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Status Alert Banner if active */}
              {child.isAlertActive && (
                <div className="bg-rose-50 border-b border-rose-200 px-5 py-2.5 flex items-center justify-between text-xs text-rose-900 font-medium">
                  <div className="flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-rose-600 animate-pulse" />
                    <span>¡Alerta de Búsqueda Activada para este menor!</span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleAlert(child.id);
                    }}
                    className="text-xs text-rose-700 underline font-semibold hover:text-rose-900"
                  >
                    Desactivar
                  </button>
                </div>
              )}

              {/* Card Body with Essential Highlights */}
              <div className="p-5 sm:p-6 space-y-4 text-xs">
                {/* Communication note */}
                <div>
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                    Comprensión y Comunicación
                  </span>
                  <p className="text-slate-700 leading-relaxed bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                    {child.communicationNotes || 'Comprende órdenes cortas. No presionar en situaciones de sobrecarga.'}
                  </p>
                </div>

                {/* Calming & Avoid summary */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="bg-emerald-50/60 p-2.5 rounded-lg border border-emerald-100">
                    <span className="font-semibold text-emerald-900 block mb-1 flex items-center gap-1">
                      <Heart className="w-3.5 h-3.5 text-emerald-600" />
                      Para Calmarlo:
                    </span>
                    <ul className="text-emerald-800 space-y-1 text-[11px]">
                      {child.calmingTechniques.slice(0, 2).map((item, idx) => (
                        <li key={idx} className="line-clamp-1">✓ {item}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-rose-50/60 p-2.5 rounded-lg border border-rose-100">
                    <span className="font-semibold text-rose-900 block mb-1 flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                      Evitar Absolutamente:
                    </span>
                    <ul className="text-rose-800 space-y-1 text-[11px]">
                      {child.actionsToAvoid.slice(0, 2).map((item, idx) => (
                        <li key={idx} className="line-clamp-1">✕ {item}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Emergency Contacts Summary */}
                <div>
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
                    Contactos Directos de Emergencia
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {child.emergencyContacts.map((contact) => (
                      <div
                        key={contact.id}
                        className="flex items-center gap-1.5 bg-slate-100 text-slate-800 px-2.5 py-1 rounded-md text-xs"
                      >
                        <Phone className="w-3 h-3 text-teal-600" />
                        <span className="font-medium">{contact.name} ({contact.relationship}):</span>
                        <span className="text-slate-600 font-mono text-[11px]">{contact.phone}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Comfort Item */}
                {child.favoriteComfortItem && (
                  <div className="text-[11px] text-slate-600 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>Objeto de confort: <strong>{child.favoriteComfortItem}</strong></span>
                  </div>
                )}
              </div>

              {/* Card Footer Actions */}
              <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleAlert(child.id);
                  }}
                  className={`text-xs px-2.5 py-1.5 rounded-md font-medium transition-colors ${
                    child.isAlertActive
                      ? 'bg-rose-600 text-white hover:bg-rose-700'
                      : 'text-rose-700 hover:bg-rose-50'
                  }`}
                >
                  {child.isAlertActive ? 'Desactivar Alerta' : '⚠️ Activar Alerta SOS'}
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveChild(child);
                      onNavigateToScan(child);
                    }}
                    className="flex items-center gap-1 px-3 py-1.5 bg-white border border-slate-200 text-slate-700 rounded-md text-xs font-medium hover:bg-slate-100 transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5 text-slate-500" />
                    <span>Ver Ficha Pública</span>
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveChild(child);
                      onNavigateToQR(child);
                    }}
                    className="flex items-center gap-1 px-3 py-1.5 bg-teal-700 text-white rounded-md text-xs font-semibold hover:bg-teal-800 transition-colors shadow-2xs"
                  >
                    <QrCode className="w-3.5 h-3.5" />
                    <span>Generar QR & Pulsera</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Safety & Protocol Guide for Parents */}
      <div className="p-6 bg-slate-100/80 rounded-2xl border border-slate-200/80">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-teal-700 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-slate-900">
              Recomendación para los Soportes Físicos (Pulseras y Parches)
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Muchos niños en el espectro autista tienen hiperreactividad táctil a etiquetas o pulseras de plástico rígido.
              Recomendamos imprimir el código QR en <strong>parches termoadhesivos de algodón suave</strong> para el interior o exterior de la ropa,
              o en <strong>pulseras de silicona de grado alimentario</strong> sin bordes filosos.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
