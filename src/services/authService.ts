import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile as updateFirebaseAuthProfile,
  User as FirebaseUser
} from 'firebase/auth';
import {
  doc,
  getDoc,
  setDoc,
  collection,
  getDocs
} from 'firebase/firestore';
import { auth, db } from './firebase';
import { User, UserId, ISO8601Timestamp } from '../types/messenger';
import { appStorage } from '../utils/storage';
import { MOCK_USERS } from '../data/mockData';

export interface LoginCredentials {
  emailOrUsername: string;
  password?: string;
}

export interface RegisterData {
  displayName: string;
  username: string;
  email: string;
  password?: string;
}

class AuthService {
  private authInitialized = false;

  constructor() {
    this.initAuthListener();
  }

  private initAuthListener() {
    if (this.authInitialized) return;
    this.authInitialized = true;

    onAuthStateChanged(auth, async (fbUser: FirebaseUser | null) => {
      if (fbUser) {
        try {
          const userDocRef = doc(db, 'users', fbUser.uid);
          const userSnap = await getDoc(userDocRef);

          if (userSnap.exists()) {
            const userData = userSnap.data() as User;
            appStorage.setCurrentUserId(userData.id);
            // Sync with local users cache
            const users = appStorage.getUsers();
            const existingIndex = users.findIndex(u => u.id === userData.id);
            if (existingIndex >= 0) {
              users[existingIndex] = userData;
            } else {
              users.unshift(userData);
            }
            appStorage.saveUsers(users);
          }
        } catch (e) {
          console.warn('[AuthService] Error fetching user doc from Firestore:', e);
        }
      }
    });
  }

  public getCurrentUser(): User {
    const currentId = appStorage.getCurrentUserId();
    const users = appStorage.getUsers();
    const user = users.find(u => u.id === currentId);
    if (!user) {
      return users[0] || MOCK_USERS[0];
    }
    return user;
  }

  public getAllUsers(): User[] {
    return appStorage.getUsers();
  }

  /**
   * Log in using Firebase Auth or demo accounts
   */
  public async login(credentials: LoginCredentials): Promise<User> {
    const rawInput = credentials.emailOrUsername.trim();
    const password = credentials.password || '';

    // If input looks like an email and password is provided, try Firebase Auth first
    const isEmail = rawInput.includes('@');
    if (isEmail && password.length >= 6) {
      try {
        const userCredential = await signInWithEmailAndPassword(auth, rawInput, password);
        const fbUser = userCredential.user;

        // Fetch or create profile in Firestore
        const userDocRef = doc(db, 'users', fbUser.uid);
        const userSnap = await getDoc(userDocRef);

        let user: User;
        if (userSnap.exists()) {
          user = userSnap.data() as User;
        } else {
          user = {
            id: fbUser.uid,
            username: fbUser.email?.split('@')[0] || `user_${fbUser.uid.slice(0, 5)}`,
            displayName: fbUser.displayName || fbUser.email?.split('@')[0] || 'Користувач',
            email: fbUser.email || rawInput,
            avatar: fbUser.photoURL || `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80`,
            isOnline: true,
            streak: 1,
            bio: 'Користувач Aether Messenger',
            createdAt: new Date().toISOString()
          };
          await setDoc(userDocRef, user);
        }

        // Cache locally
        const users = appStorage.getUsers();
        const existingIdx = users.findIndex(u => u.id === user.id);
        if (existingIdx >= 0) {
          users[existingIdx] = user;
        } else {
          users.unshift(user);
        }
        appStorage.saveUsers(users);
        appStorage.setCurrentUserId(user.id);
        return user;
      } catch (fbError: any) {
        // If it's a real auth error (wrong password or user not found), format clear message
        if (
          fbError.code === 'auth/wrong-password' ||
          fbError.code === 'auth/invalid-credential'
        ) {
          throw new Error('Невірний пароль або email.');
        } else if (fbError.code === 'auth/user-not-found') {
          throw new Error('Користувача з таким email не знайдено.');
        }
        console.warn('[AuthService] Firebase login error, checking local demo users:', fbError);
      }
    }

    // Fallback: Check local/demo users by username or email
    const query = rawInput.toLowerCase().replace('@', '');
    const users = appStorage.getUsers();
    const found = users.find(
      u => u.username.toLowerCase() === query || (u.email && u.email.toLowerCase() === query)
    );

    if (found) {
      appStorage.setCurrentUserId(found.id);
      return found;
    }

    // Default fallback to first demo user
    const fallback = users[0] || MOCK_USERS[0];
    appStorage.setCurrentUserId(fallback.id);
    return fallback;
  }

  /**
   * Register with Firebase Auth & Firestore database
   */
  public async register(data: RegisterData): Promise<User> {
    const email = data.email.trim();
    const password = data.password && data.password.length >= 6 ? data.password : '123456';
    const cleanUsername = data.username.trim().toLowerCase().replace('@', '');
    const displayName = data.displayName.trim();

    try {
      // 1. Create User in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const fbUser = userCredential.user;

      // 2. Update Firebase Auth Profile
      await updateFirebaseAuthProfile(fbUser, {
        displayName: displayName
      });

      // 3. Construct canonical User entity
      const newUser: User = {
        id: fbUser.uid,
        username: cleanUsername,
        displayName: displayName,
        email: email,
        avatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80`,
        bio: 'Користувач Aether Messenger',
        isOnline: true,
        streak: 1,
        createdAt: new Date().toISOString()
      };

      // 4. Persist to Firestore database
      const userDocRef = doc(db, 'users', fbUser.uid);
      await setDoc(userDocRef, newUser);

      // 5. Update local storage cache
      const users = appStorage.getUsers();
      users.unshift(newUser);
      appStorage.saveUsers(users);
      appStorage.setCurrentUserId(newUser.id);

      return newUser;
    } catch (fbError: any) {
      if (fbError.code === 'auth/email-already-in-use') {
        throw new Error('Користувач із цією електронною адресою вже зареєстрований.');
      } else if (fbError.code === 'auth/weak-password') {
        throw new Error('Пароль має містити щонайменше 6 символів.');
      } else if (fbError.code === 'auth/invalid-email') {
        throw new Error('Введіть коректну адресу електронної пошти.');
      }

      console.warn('[AuthService] Firebase register error, fallback to local persistence:', fbError);

      // Local fallback in case of network constraint
      const fallbackUser: User = {
        id: `user_${Date.now()}`,
        username: cleanUsername,
        displayName: displayName,
        email: email,
        avatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80`,
        bio: 'Користувач Aether Messenger',
        isOnline: true,
        streak: 1,
        createdAt: new Date().toISOString()
      };

      const users = appStorage.getUsers();
      users.unshift(fallbackUser);
      appStorage.saveUsers(users);
      appStorage.setCurrentUserId(fallbackUser.id);
      return fallbackUser;
    }
  }

  public switchUser(userId: string): User | null {
    const users = appStorage.getUsers();
    const user = users.find(u => u.id === userId);
    if (user) {
      appStorage.setCurrentUserId(userId);
      return user;
    }
    return null;
  }

  public updateProfile(updates: Partial<User>): User {
    const current = this.getCurrentUser();
    const updated = { ...current, ...updates };

    // Update in Firestore asynchronously if signed in
    if (auth.currentUser && auth.currentUser.uid === current.id) {
      const userDocRef = doc(db, 'users', current.id);
      setDoc(userDocRef, updated, { merge: true }).catch(e => {
        console.warn('[AuthService] Could not sync profile update to Firestore:', e);
      });
    }

    const users = appStorage.getUsers().map(u => (u.id === current.id ? updated : u));
    appStorage.saveUsers(users);
    return updated;
  }

  public async logout(): Promise<void> {
    try {
      await signOut(auth);
    } catch (e) {
      console.warn('[AuthService] Sign out error:', e);
    }
    appStorage.setCurrentUserId('user_current');
  }
}

export const authService = new AuthService();
