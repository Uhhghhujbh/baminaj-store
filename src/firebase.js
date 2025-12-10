import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"; 

const firebaseConfig = {
  apiKey: "AIzaSyCrSucJ2Z7qt8fvpPTw9iMu0HcDsmZ_8gg",
  authDomain: "baminaj-store.firebaseapp.com",
  projectId: "baminaj-store",
  storageBucket: "baminaj-store.firebasestorage.app",
  messagingSenderId: "934990400868",
  appId: "1:934990400868:web:660ff0f7ecb0abe15ebe71"
};

// Initialize with Error Handling
let app;
try {
  app = initializeApp(firebaseConfig);
  console.log("✅ Firebase Service Initialized");
} catch (error) {
  console.error("❌ Firebase Initialization Error:", error);
}

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const storage = getStorage(app);