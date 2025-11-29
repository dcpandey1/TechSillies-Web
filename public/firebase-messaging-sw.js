/* eslint-env serviceworker */
/* global importScripts, firebase */

importScripts("https://www.gstatic.com/firebasejs/9.6.11/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.6.11/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyA5hBIYk8h7H9XMOLnkj_7Xys_gASSMxTw",
  authDomain: "techsillies-939cd.firebaseapp.com",
  projectId: "techsillies-939cd",
  storageBucket: "techsillies-939cd.firebasestorage.app",
  messagingSenderId: "592155127034",
  appId: "1:592155127034:web:22ca6c2a2b0b11001d2d43",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log("[firebase-messaging-sw.js] Received background message:", payload);

  const notificationTitle = payload.notification?.title || "TechSillies";
  const notificationOptions = {
    body: payload.notification?.body || "",
    icon: "/favicon.svg",
    data: payload.data || {},
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = "/home";

  event.waitUntil(
    clients.matchAll({ type: "window" }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes(url) && "focus" in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) return clients.openWindow(url);
    })
  );
});
