import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyAeOBRj6r3asJf89FJ5zGnrF7MxOHHOfs0",
    authDomain: "ai-trip-planner-dbb83.firebaseapp.com",
    projectId: "ai-trip-planner-dbb83",
    storageBucket: "ai-trip-planner-dbb83.firebasestorage.app",
    messagingSenderId: "616453304055",
    appId: "1:616453304055:web:67008f925896d34c41adf2",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
