// Firebase 프로젝트 설정을 입력하세요.
const FIREBASE_CONFIG = {
    apiKey: "AIzaSyA5hMmN9QFgdFtaA5gicS_pj-blu_jJdvE",
    authDomain: "rider-bf48b.firebaseapp.com",
    databaseURL: "https://rider-bf48b-default-rtdb.firebaseio.com",
    projectId: "rider-bf48b",
    storageBucket: "rider-bf48b.firebasestorage.app",
    messagingSenderId: "1026929653322",
    appId: "1:1026929653322:web:b90541cccba5b4186198b3"
};

// URL 파라미터로 driverId, zoom, style, lang, owmKey 등을 받을 수 있습니다.
// 예: index.html?driverId=driver-1&zoom=15&style=mapbox/streets-v11&lang=ko&owmKey=YOUR_OWM_KEY
const params = new URLSearchParams(location.search);
window.DRIVER_ID = params.get("driverId") || "driver-1";
window.DB_PATH = `/drivers/${window.DRIVER_ID}/location`;

window.firebaseApp = firebase.initializeApp(FIREBASE_CONFIG);
window.db = firebase.database();
