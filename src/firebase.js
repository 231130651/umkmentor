import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCgcY0HAF5JKxVI97Goh1gBUtOvh3NPKgs",
  authDomain: "umkmentor.firebaseapp.com",
  projectId: "umkmentor",
  storageBucket: "umkmentor.firebasestorage.app",
  messagingSenderId: "985519339775",
  appId: "1:985519339775:web:dc7037d6a242cfe6c634ca"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
