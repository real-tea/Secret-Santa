import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCO2niyaqfiySOSNFpx_7hVZe18G9FzA_U",
  authDomain: "secretsanta-c6d4e.firebaseapp.com",
  projectId: "secretsanta-c6d4e",
  storageBucket: "secretsanta-c6d4e.firebasestorage.app",
  messagingSenderId: "923757728744",
  appId: "1:923757728744:web:4c2dfe33ed44a678888a5d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);

// Enable offline persistence
import { enableIndexedDbPersistence } from 'firebase/firestore';

if (typeof window !== 'undefined') {
  enableIndexedDbPersistence(db).catch((err) => {
    if (err.code === 'failed-precondition') {
      console.warn('Multiple tabs open, persistence can only be enabled in one tab at a time.');
    } else if (err.code === 'unimplemented') {
      console.warn('The current browser does not support persistence.');
    }
  });
}