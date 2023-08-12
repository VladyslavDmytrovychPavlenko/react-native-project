// const firebaseConfig = {
//   apiKey: "AIzaSyCTBqhzEmiHep2mN6FP0xSEVltFoTu_XO4",
//   authDomain: "awesomeproject-99652.firebaseapp.com",
//   databaseURL: "https://awesomeproject-99652-default-rtdb.europe-west1.firebasedatabase.app",
//   projectId: "awesomeproject-99652",
//   storageBucket: "awesomeproject-99652.appspot.com",
//   messagingSenderId: "572145667946",
//   appId: "1:572145667946:web:8edca04b300e5b9ad91f13",
//   measurementId: "G-DFCNWCXDDW"
// };

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDCGxEI109az_W-fUihd0GlNYIYFUsnMas",
  authDomain: "varenik-92ea9.firebaseapp.com",
  databaseURL: "https://varenik-92ea9-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "varenik-92ea9",
  storageBucket: "varenik-92ea9.appspot.com",
  messagingSenderId: "980382612650",
  appId: "1:980382612650:web:66b8a7246372ba26b464d3",
  measurementId: "G-R4YWCF90MV"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
