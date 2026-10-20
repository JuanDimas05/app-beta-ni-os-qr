import { ChildProfile, UserAccount } from '../types/tea';
import { INITIAL_CHILDREN } from '../data/mockData';
import { 
  syncUserToFirestore, 
  saveChildProfileToFirestore, 
  deleteChildProfileFromFirestore, 
  getEmergencyProfileByQR,
  signInWithGoogleFirebase,
  signOutFirebase
} from '../firebase';

export interface StoredAccount extends UserAccount {
  password?: string;
}

export const DEMO_USER: UserAccount = {
  id: 'parent_usr_elena',
  name: 'Elena Ruiz',
  email: 'elena.ruiz.tea@ejemplo.com',
  role: 'Mamá de Mateo',
  phone: '+52 55 9182 3456',
  verifiedEmail: true,
  createdAt: '2026-03-01T08:00:00Z'
};

const ACCOUNTS_KEY = 'sisu_registered_users';
const LEGACY_ACCOUNTS_KEY = 'conectatea_registered_users';

const CURRENT_USER_KEY = 'sisu_user';
const LEGACY_CURRENT_USER_KEY = 'conectatea_user';

const SESSION_ACTIVE_KEY = 'sisu_session_active';
const LEGACY_SESSION_ACTIVE_KEY = 'conectatea_session_active';

const LEGACY_GLOBAL_CHILDREN_KEY = 'sisu_children';
const OLD_LEGACY_CHILDREN_KEY = 'conectatea_children';

const GLOBAL_QR_REGISTRY_KEY = 'sisu_all_children_registry';
const LEGACY_GLOBAL_QR_REGISTRY_KEY = 'conectatea_all_children_registry';

export const getRegisteredAccounts = (): StoredAccount[] => {
  try {
    const raw = localStorage.getItem(ACCOUNTS_KEY) || localStorage.getItem(LEGACY_ACCOUNTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const saveRegisteredAccounts = (accounts: StoredAccount[]) => {
  try {
    localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
  } catch (e) {
    console.warn('Error saving registered accounts:', e);
  }
};

/**
 * Returns current session if active, or null
 */
export const getCurrentSession = (): UserAccount | null => {
  try {
    const isActive = localStorage.getItem(SESSION_ACTIVE_KEY) || localStorage.getItem(LEGACY_SESSION_ACTIVE_KEY);
    const raw = localStorage.getItem(CURRENT_USER_KEY) || localStorage.getItem(LEGACY_CURRENT_USER_KEY);
    if (isActive === 'true' && raw) {
      return JSON.parse(raw);
    }
    return null;
  } catch {
    return null;
  }
};

/**
 * Clears any previous session and legacy global data
 */
export const clearPreviousSession = () => {
  try {
    localStorage.removeItem(LEGACY_GLOBAL_CHILDREN_KEY);
    localStorage.removeItem(OLD_LEGACY_CHILDREN_KEY);
    localStorage.removeItem(CURRENT_USER_KEY);
    localStorage.removeItem(LEGACY_CURRENT_USER_KEY);
    localStorage.removeItem(SESSION_ACTIVE_KEY);
    localStorage.removeItem(LEGACY_SESSION_ACTIVE_KEY);
  } catch (e) {
    console.warn('Error clearing previous session:', e);
  }
};

/**
 * Validates registration and creates a new isolated user account
 * starting with 0 child profiles ([]).
 */
export const registerNewUser = (
  name: string,
  email: string,
  password: string,
  role: string,
  phone: string,
  acceptedTerms: boolean
): { success: true; user: UserAccount } | { success: false; error: string } => {
  const cleanName = name.trim();
  const cleanEmail = email.trim().toLowerCase();
  const cleanPassword = password.trim();
  const cleanPhone = phone.trim();

  // Validations
  if (!cleanName || cleanName.length < 2) {
    return { success: false, error: 'Por favor ingresa tu nombre completo (mínimo 2 letras).' };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!cleanEmail || !emailRegex.test(cleanEmail)) {
    return { success: false, error: 'Por favor ingresa un correo electrónico válido.' };
  }

  if (!cleanPassword || cleanPassword.length < 6) {
    return { success: false, error: 'La contraseña debe contener al menos 6 caracteres.' };
  }

  if (!cleanPhone || cleanPhone.replace(/[^0-9]/g, '').length < 7) {
    return { success: false, error: 'Por favor ingresa un número de teléfono de contacto válido (mínimo 7 dígitos) para los avisos de emergencia.' };
  }

  if (!acceptedTerms) {
    return { success: false, error: 'Debes confirmar la responsabilidad parental y protección de datos para registrar menores.' };
  }

  // Check if account already exists
  const existingAccounts = getRegisteredAccounts();
  const existing = existingAccounts.find(a => a.email.toLowerCase() === cleanEmail);
  if (existing) {
    return { 
      success: false, 
      error: 'Ya existe una cuenta registrada con este correo electrónico. Por favor inicia sesión con tu contraseña.' 
    };
  }

  // 1. Limpiar almacenamiento previo para aislar la nueva cuenta
  clearPreviousSession();

  // 2. Crear nueva cuenta de usuario
  const newUserId = 'usr_' + Date.now() + '_' + Math.floor(Math.random() * 1000);
  const newUser: StoredAccount = {
    id: newUserId,
    name: cleanName,
    email: cleanEmail,
    role: role || 'Tutor Parental',
    phone: cleanPhone,
    password: cleanPassword,
    verifiedEmail: true,
    createdAt: new Date().toISOString()
  };

  // 3. Guardar en registro de cuentas
  existingAccounts.push(newUser);
  saveRegisteredAccounts(existingAccounts);

  // 4. Inicializar perfiles de niños estrictamente vacíos ([]) para esta cuenta
  try {
    localStorage.setItem(`sisu_children_${newUserId}`, JSON.stringify([]));
    localStorage.setItem(`sisu_children_${encodeURIComponent(cleanEmail)}`, JSON.stringify([]));
  } catch (e) {
    console.warn('Error initializing empty children store:', e);
  }

  // 5. Guardar sesión activa únicamente de esta nueva cuenta
  try {
    const sessionUser: UserAccount = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      phone: newUser.phone,
      verifiedEmail: newUser.verifiedEmail,
      createdAt: newUser.createdAt
    };
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(sessionUser));
    localStorage.setItem(SESSION_ACTIVE_KEY, 'true');
  } catch (e) {
    console.warn('Error saving session:', e);
  }

  // 6. Sincronizar cuenta a la base de datos Firestore en la nube
  syncUserToFirestore(newUser).catch(err => {
    console.warn('[Firestore] Sync user error on register:', err);
  });

  const { password: _, ...safeUser } = newUser;
  return { success: true, user: safeUser };
};

/**
 * Handles Google Sign-In using Firebase Authentication with popup.
 * If popup is closed or blocked, falls back cleanly to local auth.
 * Ensures clean isolated account with 0 child profiles ([]).
 */
export const handleGoogleAuthAsync = async (
  customRole = 'Tutor Parental',
  customPhone = '+52 55 9876 5432'
): Promise<UserAccount> => {
  clearPreviousSession();

  try {
    const userAccount = await signInWithGoogleFirebase(customRole, customPhone);

    const existingAccounts = getRegisteredAccounts();
    const existing = existingAccounts.find(a => a.id === userAccount.id || a.email.toLowerCase() === userAccount.email.toLowerCase());

    if (!existing) {
      existingAccounts.push(userAccount);
      saveRegisteredAccounts(existingAccounts);

      // Limpia perfiles de niños para cuenta nueva ([])
      localStorage.setItem(`sisu_children_${userAccount.id}`, JSON.stringify([]));
      if (userAccount.email) {
        localStorage.setItem(`sisu_children_${encodeURIComponent(userAccount.email.toLowerCase())}`, JSON.stringify([]));
      }
    }

    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userAccount));
    localStorage.setItem(SESSION_ACTIVE_KEY, 'true');
    return userAccount;
  } catch (err) {
    console.warn('Firebase Google Auth popup cancelled or error, using local fallback:', err);
    return handleGoogleAuth('Familia TEA (Google)', 'usuario.google@gmail.com', customRole, customPhone);
  }
};

/**
 * Handles Google Sign-In for new or existing accounts.
 * Always ensures clean isolated profiles for new accounts with 0 children ([]).
 */
export const handleGoogleAuth = (
  customName?: string,
  customEmail?: string,
  customRole?: string,
  customPhone?: string
): UserAccount => {
  clearPreviousSession();

  const cleanEmail = (customEmail?.trim() || 'usuario.google@gmail.com').toLowerCase();
  const cleanName = customName?.trim() || 'Familia TEA (Google)';
  const cleanRole = customRole || 'Tutor Parental';
  const cleanPhone = customPhone?.trim() || '+52 55 9876 5432';

  const existingAccounts = getRegisteredAccounts();
  let existingUser = existingAccounts.find(a => a.email.toLowerCase() === cleanEmail);

  if (!existingUser) {
    // New Google User
    const googleId = 'usr_google_' + Date.now();
    const newGoogleUser: StoredAccount = {
      id: googleId,
      name: cleanName,
      email: cleanEmail,
      role: cleanRole,
      phone: cleanPhone,
      verifiedEmail: true,
      createdAt: new Date().toISOString()
    };

    existingAccounts.push(newGoogleUser);
    saveRegisteredAccounts(existingAccounts);

    // Inicializar lista limpia y vacía ([]) de perfiles para este nuevo usuario
    localStorage.setItem(`sisu_children_${googleId}`, JSON.stringify([]));
    localStorage.setItem(`sisu_children_${encodeURIComponent(cleanEmail)}`, JSON.stringify([]));

    // Sincronizar en Firestore
    syncUserToFirestore(newGoogleUser).catch(e => console.warn('[Firestore] Sync warning:', e));

    existingUser = newGoogleUser;
  }

  // Guardar sesión activa
  const { password: _, ...sessionUser } = existingUser;
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(sessionUser));
  localStorage.setItem(SESSION_ACTIVE_KEY, 'true');

  return sessionUser;
};

/**
 * Authenticates an existing user credentials
 */
export const loginWithCredentials = (
  email: string,
  password: string
): { success: true; user: UserAccount } | { success: false; error: string } => {
  const cleanEmail = email.trim().toLowerCase();
  const cleanPassword = password.trim();

  if (!cleanEmail || !cleanPassword) {
    return { success: false, error: 'Por favor ingresa tu correo electrónico y contraseña.' };
  }

  // Demo user fallback check
  if (cleanEmail === DEMO_USER.email.toLowerCase()) {
    clearPreviousSession();
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(DEMO_USER));
    localStorage.setItem(SESSION_ACTIVE_KEY, 'true');
    return { success: true, user: DEMO_USER };
  }

  const existingAccounts = getRegisteredAccounts();
  const found = existingAccounts.find(a => a.email.toLowerCase() === cleanEmail);

  if (!found) {
    return {
      success: false,
      error: 'No se encontró ninguna cuenta registrada con este correo. Por favor crea tu cuenta con "Regístrate como padre o tutor".'
    };
  }

  if (found.password && found.password !== cleanPassword) {
    return {
      success: false,
      error: 'Contraseña incorrecta. Por favor verifica tus credenciales.'
    };
  }

  clearPreviousSession();
  const { password: _, ...sessionUser } = found;
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(sessionUser));
  localStorage.setItem(SESSION_ACTIVE_KEY, 'true');

  // Sincronizar usuario a Firestore en inicio de sesión
  syncUserToFirestore(sessionUser).catch(err => {
    console.warn('[Firestore] Sync user error on login:', err);
  });

  return { success: true, user: sessionUser };
};

/**
 * Logs in directly to the Demo account (Elena Ruiz with Mateo & Sofi)
 */
export const loginDemoAccount = (): UserAccount => {
  clearPreviousSession();
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(DEMO_USER));
  localStorage.setItem(SESSION_ACTIVE_KEY, 'true');
  return DEMO_USER;
};

/**
 * Logs out current user session from local and Firebase
 */
export const logoutSession = () => {
  clearPreviousSession();
  signOutFirebase().catch(e => console.warn('Firebase signout warning:', e));
};

/**
 * Loads children profiles strictly for the specified user account.
 * For new users or users with no saved profiles, returns strictly [].
 * Mateo and Sofi are ONLY loaded for the demo account (parent_usr_elena).
 */
export const getChildrenForUser = (user: UserAccount | null): ChildProfile[] => {
  if (!user) return [];

  // Demo account Elena Ruiz retains demo profiles
  if (user.id === DEMO_USER.id || user.email?.toLowerCase() === DEMO_USER.email.toLowerCase()) {
    try {
      const demoSaved = localStorage.getItem(`sisu_children_${DEMO_USER.id}`) || localStorage.getItem(`conectatea_children_${DEMO_USER.id}`);
      return demoSaved ? JSON.parse(demoSaved) : INITIAL_CHILDREN;
    } catch {
      return INITIAL_CHILDREN;
    }
  }

  try {
    // Check by user ID (prefer sisu_ key, fallback to conectatea_ key)
    const userKey = `sisu_children_${user.id}`;
    const legacyUserKey = `conectatea_children_${user.id}`;
    const saved = localStorage.getItem(userKey) ?? localStorage.getItem(legacyUserKey);
    if (saved !== null) {
      return JSON.parse(saved);
    }

    // Check by user email
    if (user.email) {
      const emailKey = `sisu_children_${encodeURIComponent(user.email.toLowerCase())}`;
      const legacyEmailKey = `conectatea_children_${encodeURIComponent(user.email.toLowerCase())}`;
      const savedByEmail = localStorage.getItem(emailKey) ?? localStorage.getItem(legacyEmailKey);
      if (savedByEmail !== null) {
        return JSON.parse(savedByEmail);
      }
    }

    // Absolutely 0 profiles for any other user
    return [];
  } catch {
    return [];
  }
};

/**
 * Saves children profiles for the specific user account and updates global QR index
 * and synchronizes with Firebase Firestore cloud database.
 */
export const saveChildrenForUser = (user: UserAccount, children: ChildProfile[]) => {
  try {
    // 1. Guardar bajo la clave del usuario
    const userKey = `sisu_children_${user.id}`;
    localStorage.setItem(userKey, JSON.stringify(children));

    if (user.email) {
      const emailKey = `sisu_children_${encodeURIComponent(user.email.toLowerCase())}`;
      localStorage.setItem(emailKey, JSON.stringify(children));
    }

    // 2. Mantener índice público de Códigos QR para que escaneos de emergencia
    // funcionen desde cualquier dispositivo o navegador
    const registryRaw = localStorage.getItem(GLOBAL_QR_REGISTRY_KEY) || localStorage.getItem(LEGACY_GLOBAL_QR_REGISTRY_KEY);
    let registry: ChildProfile[] = registryRaw ? JSON.parse(registryRaw) : [];

    // Remover perfiles antiguos de este usuario en el registro y añadir los actualizados
    registry = registry.filter(c => c.parentId !== user.id);
    registry.push(...children);

    localStorage.setItem(GLOBAL_QR_REGISTRY_KEY, JSON.stringify(registry));

    // 3. Sincronizar en la nube Firestore si no es la cuenta demo fija
    if (user.id !== DEMO_USER.id) {
      children.forEach(child => {
        saveChildProfileToFirestore(user.id, child).catch(e => {
          console.warn('[Firestore] Error syncing child to cloud:', e);
        });
      });
    }
  } catch (e) {
    console.warn('Error saving children for user:', e);
  }
};

/**
 * Deletes a child profile from cloud Firestore and emergency registry
 */
export const deleteChildFromCloud = async (user: UserAccount, childId: string, qrCodeId?: string) => {
  if (user.id === DEMO_USER.id) return;
  try {
    await deleteChildProfileFromFirestore(user.id, childId, qrCodeId);
  } catch (e) {
    console.warn('[Firestore] Error removing child from cloud:', e);
  }
};

/**
 * Look up a child profile by qrCodeId or ID across all registered profiles or demo
 */
export const findChildByQR = (identifier: string): ChildProfile | null => {
  if (!identifier) return null;

  try {
    // Check in global QR registry
    const registryRaw = localStorage.getItem(GLOBAL_QR_REGISTRY_KEY) || localStorage.getItem(LEGACY_GLOBAL_QR_REGISTRY_KEY);
    if (registryRaw) {
      const registry: ChildProfile[] = JSON.parse(registryRaw);
      const found = registry.find(c => c.qrCodeId === identifier || c.id === identifier);
      if (found) return found;
    }

    // Check in demo profiles
    const demoFound = INITIAL_CHILDREN.find(c => c.qrCodeId === identifier || c.id === identifier);
    if (demoFound) return demoFound;

    return null;
  } catch {
    return null;
  }
};

/**
 * Async look up that checks local registry first, then queries Firestore `/qr_registry/{identifier}`
 * so anyone on ANY device can access the emergency aid sheet!
 */
export const findChildByQRAsync = async (identifier: string): Promise<ChildProfile | null> => {
  if (!identifier) return null;

  // 1. Local / demo check
  const local = findChildByQR(identifier);
  if (local) return local;

  // 2. Cloud Firestore check
  try {
    const cloudProfile = await getEmergencyProfileByQR(identifier);
    if (cloudProfile) return cloudProfile;
  } catch (e) {
    console.warn('[Firestore] Async emergency lookup error:', e);
  }

  return null;
};
