// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCvkNgcx8ENMyCkyzfxi_zAay7rOyrx2D8",
  authDomain: "real-estate-549ef.firebaseapp.com",
  projectId: "real-estate-549ef",
  storageBucket: "real-estate-549ef.firebasestorage.app",
  messagingSenderId: "556197555336",
  appId: "1:556197555336:web:fee7db5ea1ad1104ebc33d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db=getFirestore(app);
export { db };