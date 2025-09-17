import { ref } from 'vue';
import { auth, db } from '@/plugins/firebase';

// Reactive state mirroring vibed implementation but adjusted for Firebase v8 compat SDK already initialized
export const isAuthenticated = ref(false);
export const currentUser = ref(null);
export const loading = ref(true);

// Additional enable flag check (mirrors existing router guard logic)
const checkUserEnabled = async (firebaseUser) => {
  try {
    const doc = await db.collection('allow-users').doc(firebaseUser.uid).get();
    return doc.exists && doc.data().enabled;
  } catch (e) {
    console.error('Error checking enabled user:', e);
    return false;
  }
};

auth.onAuthStateChanged(async (firebaseUser) => {
  loading.value = true;
  if (firebaseUser) {
    const enabled = await checkUserEnabled(firebaseUser);
    if (!enabled) {
      alert('Your account is not enabled. Please contact support.');
      await auth.signOut();
      isAuthenticated.value = false;
      currentUser.value = null;
      loading.value = false;
      return;
    }
    currentUser.value = {
      id: firebaseUser.uid,
      displayName: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
      email: firebaseUser.email
    };
    isAuthenticated.value = true;
  } else {
    currentUser.value = null;
    isAuthenticated.value = false;
  }
  loading.value = false;
});

export const login = async (email, password) => {
  return auth.signInWithEmailAndPassword(email, password);
};

export const register = async (email, password, name) => {
  const cred = await auth.createUserWithEmailAndPassword(email, password);
  if (cred.user && name) {
    await cred.user.updateProfile({ displayName: name });
  }
};

export const logout = () => auth.signOut();
