// firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-app.js";
import { getDatabase, ref, set, onValue } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-database.js";

// Firebase 설정값 (본인 Firebase 콘솔에서 발급받은 값으로 교체)
const firebaseConfig = {
    apiKey: "AIzaSyA5hMmN9QFgdFtaA5gicS_pj-blu_jJdvE",
    authDomain: "rider-bf48b.firebaseapp.com",
    databaseURL: "https://rider-bf48b-default-rtdb.firebaseio.com",
    projectId: "rider-bf48b",
    storageBucket: "rider-bf48b.firebasestorage.app",
    messagingSenderId: "1026929653322",
    appId: "1:1026929653322:web:b90541cccba5b4186198b3"
};

// Firebase 초기화
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export { db, ref, set, onValue };
