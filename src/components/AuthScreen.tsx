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
  UserCheck,
  QrCode,
  Users
} from 'lucide-react';
import { UserAccount } from '../types/tea';

interface AuthScreenProps {
  onLoginSuccess: (user: UserAccount) => void;
  onOpenPublicScanDemo: () => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({
  onLoginSuccess,
  onOpenPublicScanDemo,
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email.trim() || !password.trim()) {
      setErrorMessage('Por favor ingresa tu correo electrónico y contraseña.');
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
        setErrorMessage('Debes aceptar los términos de protección y consentimiento parental.');
        return;
      }
    }

    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      const user: UserAccount = {
        id: isRegisterMode ? 'usr_' + Date.now() : 'parent_usr_elena',
        name: isRegisterMode ? name.trim() : (email.includes('carlos') ? 'Carlos Méndez' : 'Elena Ruiz'),
        email: email.trim(),
        role: isRegisterMode ? parentRole : (email.includes('carlos') ? 'Papá de Mateo' : 'Mamá de Mateo y Sofi'),
        phone: phone.trim() || '+52 55 9182 3456',
        verifiedEmail: true,
        createdAt: new Date().toISOString()
      };

      onLoginSuccess(user);
    }, 400);
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
    }, 250);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-teal-950 to-slate-900 flex flex-col justify-center items-center px-4 py-8 sm:px-6 lg:px-8 font-sans">
      <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-12 bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-800/40">
        
        {/* Left Side: Brand Value Proposition & Context (5 cols) */}
        <div className="lg:col-span-5 bg-gradient-to-b from-teal-800 to-slate-900 p-8 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="absolute -right-12 -bottom-12 w-48 h-48 bg-teal-600/20 rounded-full blur-3xl pointer-events-none" />
          
          <div>
            <div className="flex items-center gap-2.5 mb-6">
              <div className="w-10 h-10 rounded-2xl bg-teal-500 text-white flex items-center justify-center shadow-md">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <span className="text-xl font-bold font-display tracking-tight text-white">
                ConectaTEA
              </span>
            </div>

            <span className="inline-block text-[11px] font-semibold text-teal-300 uppercase tracking-widest bg-teal-900/60 px-3 py-1 rounded-full border border-teal-700/50 mb-3">
              Acceso Exclusivo para Familias
            </span>

            <h1 className="text-2xl font-bold font-display leading-tight text-white mb-3">
              Seguridad, Identificación QR & Red de Apoyo TEA
            </h1>

            <p className="text-xs text-teal-100/90 leading-relaxed mb-6">
              Inicia sesión o crea tu cuenta de tutor legal para gestionar los perfiles sensoriales de tus hijos, imprimir pulseras de auxilio y conectar con la comunidad.
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3 text-xs text-teal-100">
                <div className="w-5 h-5 rounded-md bg-teal-700/80 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5 text-teal-300" />
                </div>
                <span>Ficha médica y sensorial protegida con protocolos RGPD infantil.</span>
              </div>

              <div className="flex items-start gap-3 text-xs text-teal-100">
                <div className="w-5 h-5 rounded-md bg-teal-700/80 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5 text-teal-300" />
                </div>
                <span>Generación de códigos QR para pulseras, tarjetas y parches de ropa.</span>
              </div>

              <div className="flex items-start gap-3 text-xs text-teal-100">
                <div className="w-5 h-5 rounded-md bg-teal-700/80 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5 text-teal-300" />
                </div>
                <span>Foros y salas de conversación privadas entre familias de niños TEA.</span>
              </div>
            </div>
          </div>

          {/* Direct link to public emergency preview */}
          <div className="mt-8 pt-6 border-t border-teal-700/40">
            <button
              type="button"
              onClick={onOpenPublicScanDemo}
              className="w-full py-2.5 px-3 bg-teal-900/60 hover:bg-teal-900 border border-teal-600/40 rounded-xl text-xs text-teal-200 hover:text-white transition-colors flex items-center justify-center gap-2"
            >
              <QrCode className="w-4 h-4 text-teal-400" />
              <span>Ver Ficha Pública de Emergencia (Sin Cuenta)</span>
            </button>
          </div>
        </div>

        {/* Right Side: Mandatory Login & Registration Forms (7 cols) */}
        <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-center bg-white">
          <div className="mb-5">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold font-display text-slate-900">
                {isRegisterMode ? 'Registro de Padre o Tutor' : 'Iniciar Sesión'}
              </h2>

              <div className="flex rounded-xl p-1 bg-slate-100 text-xs">
                <button
                  type="button"
                  onClick={() => {
                    setIsRegisterMode(false);
                    setErrorMessage(null);
                  }}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                    !isRegisterMode ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  Entrar
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsRegisterMode(true);
                    setErrorMessage(null);
                  }}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                    isRegisterMode ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  Crear Cuenta
                </button>
              </div>
            </div>

            <p className="text-xs text-slate-500 mt-1">
              {isRegisterMode
                ? 'Ingresa tus datos para resguardar legalmente el perfil de tu hijo.'
                : 'Identifícate con tus credenciales parentales para acceder al panel.'}
            </p>
          </div>

          {/* Quick Demo Access Buttons */}
          <div className="mb-4 p-3 bg-slate-50 rounded-2xl border border-slate-200">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
              Acceso Rápido de Prueba (1 toque):
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('elena')}
                className="py-2 px-2.5 bg-white hover:bg-teal-50 hover:border-teal-300 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 transition-all flex items-center justify-center gap-1.5 shadow-2xs"
              >
                <UserCheck className="w-3.5 h-3.5 text-teal-700" />
                <span>Elena Ruiz (Mamá)</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('carlos')}
                className="py-2 px-2.5 bg-white hover:bg-teal-50 hover:border-teal-300 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 transition-all flex items-center justify-center gap-1.5 shadow-2xs"
              >
                <UserCheck className="w-3.5 h-3.5 text-teal-700" />
                <span>Carlos M. (Papá)</span>
              </button>
            </div>
          </div>

          {errorMessage && (
            <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-center gap-2">
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
              className="w-full py-3 px-4 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2 mt-2 active:scale-[0.99]"
            >
              <span>{loading ? 'Verificando...' : isRegisterMode ? 'Crear Cuenta y Entrar' : 'Iniciar Sesión'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Toggle between register and login footer */}
          <div className="pt-4 mt-2 border-t border-slate-100 text-center">
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
