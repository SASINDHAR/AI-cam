import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database'; // <-- Import Realtime Database

const firebaseConfig = {
    apiKey: "AIzaSyB5bMKw1y39IEQ_5SbI8nZu10OuHzb8aCc",
    authDomain: "excel-a3fc8.firebaseapp.com",
    databaseURL: "https://excel-a3fc8-default-rtdb.firebaseio.com",
    projectId: "excel-a3fc8",
    storageBucket: "excel-a3fc8.firebasestorage.app",
    messagingSenderId: "940123719094",
    appId: "1:940123719094:web:b971300ddbf21673c22d17",
    measurementId: "G-M6MR18GFLG"
  };
  
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getDatabase(app); // <-- Realtime Database
