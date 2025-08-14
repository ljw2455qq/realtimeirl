// Firebase 프로젝트 설정을 입력하세요.
const FIREBASE_CONFIG = {
  apiKey: "YOUR_FIREBASE_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  databaseURL: "https://YOUR_PROJECT.firebaseio.com",
  projectId: "YOUR_PROJECT",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "SENDER_ID",
  appId: "APP_ID"
};

// URL 파라미터로 driverId, zoom, style, lang, owmKey 등을 받을 수 있습니다.
// 예: index.html?driverId=driver-1&zoom=15&style=mapbox/streets-v11&lang=ko&owmKey=YOUR_OWM_KEY
const params = new URLSearchParams(location.search);
window.DRIVER_ID = params.get("driverId") || "driver-1";
window.DB_PATH = `/drivers/${window.DRIVER_ID}/location`;

window.firebaseApp = firebase.initializeApp(FIREBASE_CONFIG);
window.db = firebase.database();
