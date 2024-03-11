import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyBS2fHk659LnxBV6eXLKUM7VjZNwz-XpKo",
  authDomain: "awaas-portal.firebaseapp.com",
  projectId: "awaas-portal",
  storageBucket: "awaas-portal.appspot.com",
  messagingSenderId: "323723568514",
  appId: "1:323723568514:web:f1b79bca7fc15e2fe39b9b",
  measurementId: "G-BMBHCX13PG",
};

const app = initializeApp(firebaseConfig);
export default app;
