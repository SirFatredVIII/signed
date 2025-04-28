// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDTsEGnZU4v3SIiBJdEnXbwW0bbkJSqYiw",
  authDomain: "signed-raik371.firebaseapp.com",
  projectId: "signed-raik371",
  storageBucket: "signed-raik371.firebasestorage.app",
  messagingSenderId: "939666806053",
  appId: "1:939666806053:web:1bd93b0a05bb58e66536cc",
  measurementId: "G-0GPMBGW0VS"
};

// Initialize Firebase
export const config = initializeApp(firebaseConfig);
export const auth = getAuth(config);
// const analytics = getAnalytics(config);