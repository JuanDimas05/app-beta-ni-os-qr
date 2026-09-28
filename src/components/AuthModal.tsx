import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Mail, 
  Lock, 
  User, 
  Phone, 
  Heart, 
  ArrowRight, 
  Sparkles, 
  Check, 
  AlertCircle,
  Eye,
  EyeOff,
  X
} from 'lucide-react';
import { UserAccount } from '../types/tea';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: UserAccount) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
}) => {
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [parentRole, setParentRole] = useState('Mamá');
  const [showPassword, setShowPassword] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email.trim() || !password.trim()) {
      setErrorMessage('Por favor ingresa tu correo y contraseña.');
      return;
    }

    if (isRegisterMode) {
      if (!name.trim()) {
        setErrorMessage('Por favor ingresa tu nombre completo.');
        return;
      }
      if (password.length < 6) {
        setErrorMessage('La contraseña debe tener al menos 6 caracteres.');
        return;
      }
      if (!acceptedTerms) {
        setErrorMessage('Debes aceptar los términos de protección de datos de menores.');
        return;
      }
    }

    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      const user: UserAccount = {
        id: isRegisterMode ? 'usr_' + Date.now() : 'parent_usr_elena',
        name: isRegisterMode ? name.trim() : 'Elena Ruiz',
        email: email.trim(),
        role: isRegisterMode ? `${parentRole}` : 'Mamá de Mateo (7 años)',
        phone: phone.trim() || '+52 55 9182 3456',
        verifiedEmail: true,
        createdAt: new Date().toISOString()
      };

      onLoginSuccess(user);
      onClose();
    }, 450);
  };

  const handleQuickDemoLogin = (preset: 'elena' | 'carlos') => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (preset === 'elena') {
        onLoginSuccess({
          id: 'parent_usr_elena',
          name: 'Elena Ruiz',
          email: 'elena.ruiz@ejemplo.com',
          role: 'Mamá de Mateo (7 años) y Sofi (5 años)',
          phone: '+52 55 9182 3456',
          verifiedEmail: true,
          createdAt: '2026-03-15T10:00:00Z'
        });
      } else {
        onLoginSuccess({
          id: 'parent_usr_carlos',
          name: 'Carlos Méndez',
          email: 'carlos.mendez@ejemplo.com',
          role: 'Papá de Mateo',
          phone: '+52 55 9182 7890',
          verifiedEmail: true,
          createdAt: '2026-04-10T12:00:00Z'
        });
      }
      onClose();
    }, 300);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Top Banner */}
        <div className="p-6 bg-gradient-to-r from-teal-800 to-slate-900 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-10 h-10 rounded-2xl bg-teal-600/90 text-white flex items-center justify-center mb-3 shadow-xs">
            <ShieldCheck className="w-6 h-6" />
          </div>

          <h2 className="text-xl font-bold font-display text-white">
            {isRegisterMode ? 'Crear Cuenta de Familia' : 'Iniciar Sesión Parental'}
          </h2>
          <p className="text-xs text-teal-100/90 mt-1 leading-relaxed">
            {isRegisterMode
              ? 'Protege la ficha médica, administra códigos QR y conecta con otros cuidadores.'
              : 'Accede al panel de control seguro de tus hijos y códigos QR de auxilio.'}
          </p>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-4">
          {/* Quick Demo Selector for fast evaluation */}
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
              Acceso Rápido de Prueba (1 Clic):
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('elena')}
                className="flex-1 py-1.5 px-2 bg-white hover:bg-teal-50 hover:text-teal-900 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 transition-colors shadow-2xs"
              >
                Elena Ruiz (Mamá)
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('carlos')}
                className="flex-1 py-1.5 px-2 bg-white hover:bg-teal-50 hover:text-teal-900 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 transition-colors shadow-2xs"
              >
                Carlos Méndez (Papá)
              </button>
            </div>
          </div>

          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            {isRegisterMode && (
              <>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Nombre Completo del Padre / Tutor *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      required
                      placeholder="Ej. Elena Ruiz Gómez"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Parentesco
                    </label>
                    <select
                      value={parentRole}
                      onChange={(e) => setParentRole(e.target.value)}
                      className="w-full px-2.5 py-2 text-xs border border-slate-300 rounded-xl bg-white focus:outline-none focus:border-teal-600"
                    >
                      <option value="Mamá">Mamá</option>
                      <option value="Papá">Papá</option>
                      <option value="Tutor Legal">Tutor Legal</option>
                      <option value="Abuela / Abuelo">Abuela / Abuelo</option>
                      <option value="Terapeuta de apoyo">Terapeuta</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Teléfono SOS *
                    </label>
                    <div className="relative">
                      <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                      <input
                        type="tel"
                        required
                        placeholder="+52 55 1234 5678"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full pl-8 pr-2.5 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:border-teal-600"
                      />
                    </div>
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Correo Electrónico *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="email"
                  required
                  placeholder="ejemplo@correo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-medium text-slate-700">
                  Contraseña *
                </label>
                {!isRegisterMode && (
                  <button
                    type="button"
                    onClick={() => alert('Se enviaría un enlace de restablecimiento seguro a tu correo electrónico verificado.')}
                    className="text-[11px] text-teal-700 hover:underline"
                  >
                    ¿Olvidaste tu contraseña?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Mínimo 6 caracteres"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-10 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {isRegisterMode && (
              <label className="flex items-start gap-2 pt-1 text-xs text-slate-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={acceptedTerms}
                  onChange={(e) => setAcceptedTerms(e.target.checked)}
                  className="mt-0.5 rounded text-teal-600 focus:ring-teal-500"
                />
                <span className="text-[11px] leading-tight">
                  Confirmo que soy padre, madre o tutor legal con potestad para resguardar los datos de salud del menor (Consentimiento Parental RGPD/COPPA).
                </span>
              </label>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2 mt-2 active:scale-[0.99]"
            >
              <span>{loading ? 'Verificando...' : isRegisterMode ? 'Crear Cuenta y Comenzar' : 'Entrar a Mi Panel'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Toggle between register and login */}
          <div className="pt-3 border-t border-slate-100 text-center">
            {isRegisterMode ? (
              <p className="text-xs text-slate-600">
                ¿Ya tienes una cuenta registrada?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setIsRegisterMode(false);
                    setErrorMessage(null);
                  }}
                  className="text-teal-700 font-bold hover:underline"
                >
                  Inicia sesión aquí
                </button>
              </p>
            ) : (
              <p className="text-xs text-slate-600">
                ¿Aún no tienes cuenta?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setIsRegisterMode(true);
                    setErrorMessage(null);
                  }}
                  className="text-teal-700 font-bold hover:underline"
                >
                  Regístrate como padre o tutor
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
