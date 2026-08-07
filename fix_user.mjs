import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, doc, setDoc } from "firebase/firestore";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAlZ8ABshX1qELu8X82ls6UDNhLdMx4qLc",
  authDomain: "gen-lang-client-0576582933.firebaseapp.com",
  projectId: "gen-lang-client-0576582933",
  storageBucket: "gen-lang-client-0576582933.firebasestorage.app",
  messagingSenderId: "122595688318",
  appId: "1:122595688318:web:1afeebee0c48e68e31bd2f"
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app, "ai-studio-azmgroupb2bplatf-c0638043-266f-426d-9543-8bd6f1f7acb3");

async function fix() {
  const users = await getDocs(collection(db, "users"));
  users.forEach(u => console.log(u.id, u.data()));
}
fix();
