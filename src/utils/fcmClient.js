/* eslint-disable no-unused-vars */
// src/utils/fcmClient.js
import axios from "axios";
import { messagingPromise, getToken, onMessage } from "../../firebase";
import { BaseURL } from "../constants/data";

export async function initFCM(currentUser) {
  const messaging = await messagingPromise;
  if (!messaging) return;

  // 1. Check permission
  const permission = await Notification.requestPermission();
  if (permission !== "granted") return;

  try {
    // 2. Get the token from Browser
    const token = await getToken(messaging, {
      vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
    });

    if (token) {
      console.log("📌 Syncing FCM token with Backend...");

      // 3. FORCE send it to the backend to ensure it is saved
      await axios.post(`${BaseURL}/user/fcm-token`, { token }, { withCredentials: true });
      console.log("✅ Token synced");
    }
  } catch (err) {
    console.error("❌ Error syncing FCM token:", err);
  }
}

export async function subscribeToForegroundMessages(callback) {
  console.log("🔔 subscribeToForegroundMessages() CALLED");

  const messaging = await messagingPromise;
  if (!messaging) return;

  onMessage(messaging, (payload) => {
    console.log("📨 Foreground message:", payload);
    callback?.(payload);
  });
}
