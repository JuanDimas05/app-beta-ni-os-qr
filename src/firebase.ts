import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut as fbSignOut,
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  deleteDoc, 
  collection, 
  onSnapshot, 
  getDocFromServer,
  Unsubscribe
} from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';
import { ChildProfile, UserAccount } from './types/tea';

// 1. Initialize Firebase App and Firestore
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId); /* CRITICAL: The app will break without this line */
export const auth = getAuth(app);

// Google Auth Provider
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

// 2. Validate Connection to Firestore on boot
export async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn("SISU Firestore: Please check your Firebase configuration or network connection.");
    }
  }
}
testConnection();

// 3. Error Handling adhering to the 8 Pillars & FirestoreErrorInfo specification
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// 4. Cloud Database Services for User Profiles & Children Profiles

/**
 * Saves or updates user account in Firestore `/users/{userId}`
 */
export async function syncUserToFirestore(user: UserAccount): Promise<void> {
  const path = `users/${user.id}`;
  try {
    const userRef = doc(db, 'users', user.id);
    await setDoc(userRef, {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      verifiedEmail: Boolean(user.verifiedEmail),
      createdAt: user.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }, { merge: true });
  } catch (error) {
    console.warn(`[Firestore] Notice updating user ${path}:`, error);
  }
}

/**
 * Fetches user profile from Firestore
 */
export async function fetchUserFromFirestore(userId: string): Promise<UserAccount | null> {
  const path = `users/${userId}`;
  try {
    const userRef = doc(db, 'users', userId);
    const snap = await getDoc(userRef);
    if (snap.exists()) {
      return snap.data() as UserAccount;
    }
    return null;
  } catch (error) {
    console.warn(`[Firestore] Notice fetching user ${path}:`, error);
    return null;
  }
}

/**
 * Saves a child profile in Firestore under `/users/{userId}/children/{childId}`
 * and registers/updates the emergency card in `/qr_registry/{qrCodeId}`
 */
export async function saveChildProfileToFirestore(userId: string, child: ChildProfile): Promise<void> {
  const childPath = `users/${userId}/children/${child.id}`;
  const qrPath = `qr_registry/${child.qrCodeId}`;

  try {
    // 1. Guardar en la subcolección del usuario
    const childRef = doc(db, 'users', userId, 'children', child.id);
    await setDoc(childRef, {
      id: child.id,
      parentId: userId,
      nickname: child.nickname,
      fullName: child.fullName || '',
      age: Number(child.age) || 0,
      photoUrl: child.photoUrl || '',
      qrCodeId: child.qrCodeId,
      privacyMode: child.privacyMode || 'publico_diario',
      isAlertActive: Boolean(child.isAlertActive),
      communicationType: child.communicationType || 'no_verbal',
      communicationNotes: child.communicationNotes || '',
      sensoryTriggers: child.sensoryTriggers || [],
      customSensoryNotes: child.customSensoryNotes || '',
      calmingTechniques: child.calmingTechniques || [],
      actionsToAvoid: child.actionsToAvoid || [],
      favoriteComfortItem: child.favoriteComfortItem || '',
      emergencyContacts: child.emergencyContacts || [],
      bloodType: child.bloodType || '',
      allergies: child.allergies || [],
      medications: child.medications || [],
      medicalAlertNotes: child.medicalAlertNotes || '',
      createdAt: child.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    // 2. Publicar ficha de emergencia en `/qr_registry/{qrCodeId}` para escaneo público
    if (child.qrCodeId) {
      try {
        const qrRef = doc(db, 'qr_registry', child.qrCodeId);
        await setDoc(qrRef, {
          id: child.id,
          qrCodeId: child.qrCodeId,
          childId: child.id,
          parentId: userId,
          nickname: child.nickname,
          fullName: child.privacyMode === 'restringido' ? '' : (child.fullName || ''),
          age: Number(child.age) || 0,
          photoUrl: child.photoUrl || '',
          privacyMode: child.privacyMode || 'publico_diario',
          isAlertActive: Boolean(child.isAlertActive),
          communicationType: child.communicationType || 'no_verbal',
          communicationNotes: child.communicationNotes || '',
          sensoryTriggers: child.sensoryTriggers || [],
          customSensoryNotes: child.customSensoryNotes || '',
          calmingTechniques: child.calmingTechniques || [],
          actionsToAvoid: child.actionsToAvoid || [],
          favoriteComfortItem: child.favoriteComfortItem || '',
          emergencyContacts: child.emergencyContacts || [],
          bloodType: child.bloodType || '',
          allergies: child.allergies || [],
          medications: child.medications || [],
          medicalAlertNotes: child.medicalAlertNotes || '',
          updatedAt: new Date().toISOString()
        });
      } catch (qrErr) {
        console.warn(`[Firestore] Notice saving qr registry ${qrPath}:`, qrErr);
      }
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, childPath);
  }
}

/**
 * Removes child profile from Firestore and unregisters its emergency QR
 */
export async function deleteChildProfileFromFirestore(userId: string, childId: string, qrCodeId?: string): Promise<void> {
  const childPath = `users/${userId}/children/${childId}`;
  try {
    const childRef = doc(db, 'users', userId, 'children', childId);
    await deleteDoc(childRef);

    if (qrCodeId) {
      try {
        const qrRef = doc(db, 'qr_registry', qrCodeId);
        await deleteDoc(qrRef);
      } catch (e) {
        console.warn(`[Firestore] Notice deleting qr registry:`, e);
      }
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, childPath);
  }
}

/**
 * Subscribes to real-time updates for a user's children in Firestore
 */
export function subscribeUserChildren(
  userId: string, 
  onData: (children: ChildProfile[]) => void,
  onError?: (err: any) => void
): Unsubscribe {
  const path = `users/${userId}/children`;
  const childrenCol = collection(db, 'users', userId, 'children');

  return onSnapshot(
    childrenCol,
    (snapshot) => {
      const items: ChildProfile[] = [];
      snapshot.forEach((d) => {
        items.push(d.data() as ChildProfile);
      });
      onData(items);
    },
    (error) => {
      console.warn(`[Firestore] Snapshot error on ${path}:`, error);
      if (onError) onError(error);
    }
  );
}

/**
 * Queries emergency QR record from Firestore for unauthenticated or public scan
 */
export async function getEmergencyProfileByQR(qrCodeId: string): Promise<ChildProfile | null> {
  if (!qrCodeId) return null;
  const path = `qr_registry/${qrCodeId}`;

  try {
    const qrRef = doc(db, 'qr_registry', qrCodeId);
    const snap = await getDoc(qrRef);
    if (snap.exists()) {
      const data = snap.data();
      return {
        id: data.childId || data.id,
        parentId: data.parentId,
        nickname: data.nickname,
        fullName: data.fullName,
        age: data.age,
        photoUrl: data.photoUrl,
        qrCodeId: data.qrCodeId,
        privacyMode: data.privacyMode,
        isAlertActive: data.isAlertActive,
        communicationType: data.communicationType,
        communicationNotes: data.communicationNotes,
        sensoryTriggers: data.sensoryTriggers || [],
        customSensoryNotes: data.customSensoryNotes,
        calmingTechniques: data.calmingTechniques || [],
        actionsToAvoid: data.actionsToAvoid || [],
        favoriteComfortItem: data.favoriteComfortItem,
        emergencyContacts: data.emergencyContacts || [],
        bloodType: data.bloodType,
        allergies: data.allergies || [],
        medications: data.medications || [],
        medicalAlertNotes: data.medicalAlertNotes,
        createdAt: data.updatedAt || new Date().toISOString(),
        updatedAt: data.updatedAt || new Date().toISOString(),
      } as ChildProfile;
    }
    return null;
  } catch (error) {
    console.warn(`[Firestore] Error querying emergency QR ${path}:`, error);
    return null;
  }
}

/**
 * Performs Google Sign-In using Firebase Authentication popup.
 * Returns a clean UserAccount linked to the user's Google credentials.
 */
export async function signInWithGoogleFirebase(
  customRole = 'Tutor Parental',
  customPhone = '+52 55 9876 5432'
): Promise<UserAccount> {
  const result = await signInWithPopup(auth, googleProvider);
  const fbUser: FirebaseUser = result.user;

  const userAccount: UserAccount = {
    id: fbUser.uid,
    name: fbUser.displayName || 'Tutor Parental',
    email: fbUser.email || 'usuario@gmail.com',
    role: customRole,
    phone: customPhone,
    avatarUrl: fbUser.photoURL || undefined,
    verifiedEmail: Boolean(fbUser.emailVerified),
    createdAt: fbUser.metadata.creationTime || new Date().toISOString()
  };

  // Sync to Firestore
  await syncUserToFirestore(userAccount);

  return userAccount;
}

/**
 * Signs out from Firebase Authentication
 */
export async function signOutFirebase(): Promise<void> {
  try {
    await fbSignOut(auth);
  } catch (e) {
    console.warn('Firebase signout warning:', e);
  }
}
