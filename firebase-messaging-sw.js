importScripts("https://www.gstatic.com/firebasejs/9.6.1/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.6.1/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "SUA_API_KEY",
  authDomain: "barbearia-do-rei.firebaseapp.com",
  projectId: "barbearia-do-rei",
  storageBucket: "barbearia-do-rei.firebasestorage.app",
  messagingSenderId: "546744214164",
  appId: "1:546744214164:web:5bd367381afbef253d0a81"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  console.log("📩 Notificação recebida em background:", payload);

  self.registration.showNotification(
    payload.notification.title,
    {
      body: payload.notification.body,
      icon: "/icons/icon-192.png"
    }
  );
});
