import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const config = {
  apiKey: "AIzaSyCMmGQ_kT5YYp-kQHs8gPH4OLv7ZXMTh8Y",
  authDomain: "ficha-personagem-db.firebaseapp.com",
  projectId: "ficha-personagem-db",
  storageBucket: "ficha-personagem-db.appspot.com",
  messagingSenderId: "355909031086",
  appId: "1:355909031086:web:c61ea2cee30b2a1edb493f",
  measurementId: "G-C931BVSGL8",
};

const firebase = initializeApp(config);

export const auth = getAuth(firebase);

export const firestore = getFirestore(firebase);
