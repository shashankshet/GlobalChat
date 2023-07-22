import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "<apiKey>",
  authDomain: "<authDomain>",
  projectId: "<projectId>",
  storageBucket: "<storageBucket>",
  messagingSenderId: "<messagingSenderId>",
  appId: "<appId>"
};


export const app = initializeApp(firebaseConfig);