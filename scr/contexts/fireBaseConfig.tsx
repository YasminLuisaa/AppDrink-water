// Importando Firebase
import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth"; // Se for usar autenticação
import { getFirestore } from "firebase/firestore"; // Se for usar Firestore

// Configurações do Firebase (adicione suas credenciais aqui)
const firebaseConfig = {
    apiKey: "AIzaSyBwo1oY3y8W7854DnaeE8y2PUDMFgD-rBk",
  authDomain: "drinkwater-2fa9f.firebaseapp.com",
  projectId: "drinkwater-2fa9f",
  storageBucket: "drinkwater-2fa9f.firebasestorage.app",
  messagingSenderId: "691580591089",
  appId: "1:691580591089:web:cb0ff26e051c7ff9714250",
  measurementId: "G-VPWS4P3RRT"
};

// Inicializa apenas se ainda não foi iniciado
const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];

// Exporta serviços do Firebase
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
