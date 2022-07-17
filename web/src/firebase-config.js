import { initializeApp } from "firebase/app";
import { getFirestore } from "@firebase/firestore";
import { getAuth } from "@firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyA2-hbp75CZleQKl9mVwh-BzpPm1-Bm-_A",
  authDomain: "aasanai.firebaseapp.com",
  projectId: "aasanai",
  storageBucket: "aasanai.appspot.com",
  messagingSenderId: "196459694291",
  appId: "1:196459694291:web:1ba9585d3b2165234cec26",
  measurementId: "G-B2W0DCR9SP",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
