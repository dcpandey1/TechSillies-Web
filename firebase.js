// firebase.js
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage, isSupported } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyA5hBIYk8h7H9XMOLnkj_7Xys_gASSMxTw",
  authDomain: "techsillies-939cd.firebaseapp.com",
  projectId: "techsillies-939cd",
  storageBucket: "techsillies-939cd.firebasestorage.app",
  messagingSenderId: "592155127034",
  appId: "1:592155127034:web:22ca6c2a2b0b11001d2d43",
};

const app = initializeApp(firebaseConfig);

// Make messaging load *asynchronously*
const messagingPromise = isSupported().then((supported) => {
  if (supported) {
    return getMessaging(app);
  } else {
    console.warn("❌ FCM not supported in this browser");
    return null;
  }
});

export { app, messagingPromise, getToken, onMessage };
