importScripts("https://www.gstatic.com/firebasejs/11.0.2/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/11.0.2/firebase-messaging-compat.js");

firebase.initializeApp({
            apiKey: "AIzaSyBLBFTLC7sqM9VUhlsypPugQ-LhcX7-0Rw",
            authDomain: "barbearia-do-rei.firebaseapp.com",
            projectId: "barbearia-do-rei",
            storageBucket: "barbearia-do-rei.firebasestorage.app",
            messagingSenderId: "546744214164",
            appId: "1:546744214164:web:5bd367381afbef253d0a81"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(payload => {
  self.registration.showNotification(
    payload.notification.title,
    {
      body: payload.notification.body,
      icon: "/icon-192.png"
    }
  );
});
