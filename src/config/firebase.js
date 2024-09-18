import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAWeMxlbqqNHAdITzG0m6x0jECnKp3NzLk",
  authDomain: "chat-firebase-23a06.firebaseapp.com",
  projectId: "chat-firebase-23a06",
  storageBucket: "chat-firebase-23a06.appspot.com",
  messagingSenderId: "607223184218",
  appId: "1:607223184218:web:b6d77a3927873a3e261163",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const database = getFirestore(app);
