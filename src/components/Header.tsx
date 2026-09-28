import React from 'react';
import { ShieldCheck, QrCode, Users, Eye, BookOpen, AlertCircle, User, LogOut, LogIn } from 'lucide-react';
import { ChildProfile, UserAccount } from '../types/tea';

interface HeaderProps {
  currentTab: 'profiles' | 'qr_export' | 'community' | 'public_scan' | 'architecture';
  setCurrentTab: (tab: 'profiles' | 'qr_export' | 'community' | 'public_scan' | 'architecture') => void;
  activeChild: ChildProfile | null;
  toggleEmergencyAlert: () => void;
  currentUser: UserAccount | null;
  onOpenAuth: () => void;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  setCurrentTab,
  activeChild,
  toggleEmergencyAlert,
  currentUser,
  onOpenAuth,
  onLogout,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Zone 1: Single text element wordmark */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setCurrentTab('profiles')}
              className="flex items-center gap-2.5 text-left focus:outline-none"
            >
              <div className="w-9 h-9 rounded-xl bg-teal-600 text-white flex items-center justify-center shadow-sm">
                <ShieldCheck className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="text-xl font-bold tracking-tight text-slate-900 font-display">
                  ConectaTEA
                </span>
                <span className="hidden sm:inline-block text-xs text-slate-500 ml-2">
                  Seguridad & Red de Familias
                </span>
              </div>
            </button>
          </div>

          {/* Zone 2: Navigation Links (Text with active state, no pill clutter) */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <button
              onClick={() => setCurrentTab('profiles')}
              className={`transition-colors py-1 ${
                currentTab === 'profiles'
                  ? 'text-teal-700 font-semibold border-b-2 border-teal-600'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Hijos & Perfiles
            </button>

            <button
              onClick={() => setCurrentTab('qr_export')}
              className={`flex items-center gap-1.5 transition-colors py-1 ${
                currentTab === 'qr_export'
                  ? 'text-teal-700 font-semibold border-b-2 border-teal-600'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <QrCode className="w-4 h-4 text-slate-400" />
              <span>QR & Etiquetas</span>
            </button>

            <button
              onClick={() => setCurrentTab('public_scan')}
              className={`flex items-center gap-1.5 transition-colors py-1 ${
                currentTab === 'public_scan'
                  ? 'text-teal-700 font-semibold border-b-2 border-teal-600'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Eye className="w-4 h-4 text-slate-400" />
              <span>Vista de Escaneo</span>
            </button>

            <button
              onClick={() => setCurrentTab('community')}
              className={`flex items-center gap-1.5 transition-colors py-1 ${
                currentTab === 'community'
                  ? 'text-teal-700 font-semibold border-b-2 border-teal-600'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Users className="w-4 h-4 text-slate-400" />
              <span>Comunidad & Foro</span>
            </button>

            <button
              onClick={() => setCurrentTab('architecture')}
              className={`flex items-center gap-1.5 transition-colors py-1 ${
                currentTab === 'architecture'
                  ? 'text-teal-700 font-semibold border-b-2 border-teal-600'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <BookOpen className="w-4 h-4 text-slate-400" />
              <span>Arquitectura & Docs</span>
            </button>
          </nav>

          {/* Zone 3: Primary contextual action & Auth */}
          <div className="flex items-center gap-2.5">
            {activeChild && (
              <button
                onClick={toggleEmergencyAlert}
                title={activeChild.isAlertActive ? "Desactivar modo búsqueda" : "Activar alerta si el menor está extraviado"}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeChild.isAlertActive
                    ? 'bg-rose-600 text-white animate-pulse shadow-sm'
                    : 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100'
                }`}
              >
                <AlertCircle className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">
                  {activeChild.isAlertActive ? 'Alerta Activa' : 'Modo Alerta SOS'}
                </span>
                <span className="sm:hidden">
                  {activeChild.isAlertActive ? 'SOS ACTIVO' : 'SOS'}
                </span>
              </button>
            )}

            <button
              onClick={() => setCurrentTab('public_scan')}
              className="hidden sm:inline-flex px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              Simular Escaneo
            </button>

            {currentUser ? (
              <div className="flex items-center gap-2 pl-1 border-l border-slate-200">
                <div 
                  className="flex items-center gap-2 text-left cursor-pointer"
                  onClick={onOpenAuth}
                  title="Ver perfil de padre / tutor"
                >
                  <div className="w-8 h-8 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-xs border border-teal-200">
                    {currentUser.name.charAt(0)}
                  </div>
                  <div className="hidden lg:block">
                    <span className="text-xs font-bold text-slate-800 block leading-tight">
                      {currentUser.name}
                    </span>
                    <span className="text-[10px] text-teal-700 block leading-tight">
                      {currentUser.role}
                    </span>
                  </div>
                </div>

                <button
                  onClick={onLogout}
                  title="Cerrar sesión"
                  className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-lg transition-colors shadow-2xs"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Acceso Padres</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile subnavigation bar for seamless thumb access */}
      <div className="md:hidden border-t border-slate-100 bg-slate-50/90 px-2 py-1.5 overflow-x-auto flex items-center gap-1 text-xs">
        <button
          onClick={() => setCurrentTab('profiles')}
          className={`px-3 py-1 rounded-md whitespace-nowrap ${
            currentTab === 'profiles' ? 'bg-white text-teal-800 shadow-xs font-medium' : 'text-slate-600'
          }`}
        >
          Hijos
        </button>
        <button
          onClick={() => setCurrentTab('qr_export')}
          className={`px-3 py-1 rounded-md whitespace-nowrap ${
            currentTab === 'qr_export' ? 'bg-white text-teal-800 shadow-xs font-medium' : 'text-slate-600'
          }`}
        >
          QR Imprimible
        </button>
        <button
          onClick={() => setCurrentTab('public_scan')}
          className={`px-3 py-1 rounded-md whitespace-nowrap ${
            currentTab === 'public_scan' ? 'bg-white text-teal-800 shadow-xs font-medium' : 'text-slate-600'
          }`}
        >
          Ficha Pública
        </button>
        <button
          onClick={() => setCurrentTab('community')}
          className={`px-3 py-1 rounded-md whitespace-nowrap ${
            currentTab === 'community' ? 'bg-white text-teal-800 shadow-xs font-medium' : 'text-slate-600'
          }`}
        >
          Comunidad
        </button>
        <button
          onClick={() => setCurrentTab('architecture')}
          className={`px-3 py-1 rounded-md whitespace-nowrap ${
            currentTab === 'architecture' ? 'bg-white text-teal-800 shadow-xs font-medium' : 'text-slate-600'
          }`}
        >
          Arquitectura
        </button>
      </div>
    </header>
  );
};
