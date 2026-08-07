import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyAlZ8ABshX1qELu8X82ls6UDNhLdMx4qLc",
  authDomain: "gen-lang-client-0576582933.firebaseapp.com",
  projectId: "gen-lang-client-0576582933",
  storageBucket: "gen-lang-client-0576582933.firebasestorage.app",
  messagingSenderId: "122595688318",
  appId: "1:122595688318:web:1afeebee0c48e68e31bd2f",
  measurementId: "G-1M9SBS8WLP"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, "ai-studio-azmgroupb2bplatf-c0638043-266f-426d-9543-8bd6f1f7acb3");
export const auth = getAuth(app);
