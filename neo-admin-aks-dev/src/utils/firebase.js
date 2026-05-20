import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyAC2yHXIIptDFannYC-u3eI4sibErN08vA",
  authDomain: "neohelth-a97f7.firebaseapp.com",
  projectId: "neohelth-a97f7",
  storageBucket: "neohelth-a97f7.firebasestorage.app",
  messagingSenderId: "10649086040",
  appId: "1:10649086040:web:60124ab036f48647ed022d",
  measurementId: "G-TWJTBPBTHF"
};
const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

export { messaging, getToken, onMessage };
