import { getToken } from "firebase/messaging";
import { messaging } from "./firebase";
import api from "./axios";


export const initFCM = async () => {
  try {
    const permission = await Notification.requestPermission();
    if (permission !== "granted") return;

    const token = await getToken(messaging, { 
      vapidKey: "BE3q7ncn4UgC6EPT2Ehc8ozFDuu7tjRPV35MgbwCRV_QizDXeAH7nGtVxcStGmloWt0HQ9NfGIToPZ9EalL4Qe0"
    });

    if (token) {
      await api.post("/api/admin/save-fcm-token", { fcmToken: token });
      console.log("✅ FCM Token Saved");
    }
  } catch (err) {
    console.log("FCM error:", err);
  }
};

