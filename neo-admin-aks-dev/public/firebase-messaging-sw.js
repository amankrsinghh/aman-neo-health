importScripts("https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyAC2yHXIIptDFannYC-u3eI4sibErN08vA",
  authDomain: "neohelth-a97f7.firebaseapp.com",
  projectId: "neohelth-a97f7",
  messagingSenderId: "10649086040",
  appId: "1:10649086040:web:60124ab036f48647ed022d"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log("📩 Background push:", payload);

  const title = payload.data?.title || "NeoHealth";
  const options = {
    body: payload.data?.body || "New notification",
    icon: "/logo.png",
    badge: "/logo.png",
    data: payload.data
  };

  self.registration.showNotification(title, options);
});
