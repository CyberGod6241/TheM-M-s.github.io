// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAMC9XOzZzf6ctYqlA6M-MfAYlZsuAP0c4",
  authDomain: "food-restaurant-f298d.firebaseapp.com",
  projectId: "food-restaurant-f298d",
  storageBucket: "food-restaurant-f298d.firebasestorage.app",
  messagingSenderId: "442118672029",
  appId: "1:442118672029:web:389b11a132a3cec0e7ce74",
  measurementId: "G-Y6B5DT1S8L",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
