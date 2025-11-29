// import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Provider } from "react-redux";
import store, { persistor } from "./utils/appStore.js";
import { PersistGate } from "redux-persist/integration/react"; // Import Gate

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    {/* Wrap App in PersistGate */}
    <PersistGate loading={null} persistor={persistor}>
      <App />
    </PersistGate>
  </Provider>
);

// // Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// // For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: "AIzaSyA5hBIYk8h7H9XMOLnkj_7Xys_gASSMxTw",
//   authDomain: "techsillies-939cd.firebaseapp.com",
//   projectId: "techsillies-939cd",
//   storageBucket: "techsillies-939cd.firebasestorage.app",
//   messagingSenderId: "592155127034",
//   appId: "1:592155127034:web:22ca6c2a2b0b11001d2d43",
//   measurementId: "G-F1V7GYX6ZK",
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

// ZCz - DmAkQMEh8UWPBw5mJJHYWyt3I7v_0srZFhG7Ihc;
