import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDaCAAotaOw7tAFe4iQ9yI6tvg4NBOwpkA",
  authDomain: "darklion-8d870.firebaseapp.com",
  projectId: "darklion-8d870",
  storageBucket: "darklion-8d870.firebasestorage.app",
  messagingSenderId: "465294537660",
  appId: "1:465294537660:web:179db3f0d7d054f3c571b9",
  measurementId: "G-XQNDSRTMKT",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth();
export default app;
