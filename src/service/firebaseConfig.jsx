// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getFirestore} from "firebase/firestore ";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAeOBRj6r3asJf89FJ5zGnrF7MxOHHOfs0",
  authDomain: "ai-trip-planner-dbb83.firebaseapp.com",
  projectId: "ai-trip-planner-dbb83",
  storageBucket: "ai-trip-planner-dbb83.firebasestorage.app",
  messagingSenderId: "616453304055",
  appId: "1:616453304055:web:67008f925896d34c41adf2",
  measurementId: "G-9QMHYQPY2Q"
};

// Initialize Firebase
 export const app = initializeApp(firebaseConfig);
 export const db=getFirestore(app);
//const analytics = getAnalytics(app);