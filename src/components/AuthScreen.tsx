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
        id: isRegisterMode ? 'usr_' + Date.now() : 'usr_' + btoa(email).slice(0, 10),
        name: isRegisterMode ? name.trim() : (name.trim() || email.split('@')[0]),
        email: email.trim(),
        role: isRegisterMode ? parentRole : 'Tutor / Familiar',
        phone: phone.trim() || '+52 55 1234 5678',
        verifiedEmail: true,
        createdAt: new Date().toISOString()
      };

      onLoginSuccess(user);
    }, 400);
  };

  const handleGoogleSignIn = () => {
    setLoading(true);
    setErrorMessage(null);
    // Simular autenticación OAuth de Google rápida y limpia
    setTimeout(() => {
      setLoading(false);
      const googleUser: UserAccount = {
        id: 'usr_google_' + Date.now(),
        name: name.trim() || 'Familia TEA (Google)',
        email: email.trim() || 'usuario.google@gmail.com',
        role: parentRole || 'Tutor Parental',
        phone: phone.trim() || '+52 55 9876 5432',
        avatarUrl: '',
        verifiedEmail: true,
        createdAt: new Date().toISOString()
      };
      onLoginSuccess(googleUser);
    }, 500);
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

          {/* Google Sign-In Button */}
          <div className="mb-4">
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full py-2.5 px-4 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-xl text-xs font-semibold transition-all shadow-2xs flex items-center justify-center gap-3 active:scale-[0.99]"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>{isRegisterMode ? 'Registrarse con Google' : 'Continuar con Google'}</span>
            </button>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-[11px] uppercase tracking-wider">
                <span className="bg-white px-3 text-slate-400 font-medium">o con correo electrónico</span>
              </div>
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
