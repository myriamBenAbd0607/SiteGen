// ═══════════════════════════════════════════════════════════
// FIREBASE — Configuration projet SiteCreator
// src/firebase.js
// ═══════════════════════════════════════════════════════════
import { initializeApp } from 'firebase/app'
import { getAuth }       from 'firebase/auth'
import { getFirestore }  from 'firebase/firestore'

const firebaseConfig = {
  apiKey:            "AIzaSyCVGh7c9hcMtuolMPfgyi6CklP1_g5Buck",
  authDomain:        "sitecreator-83d4e.firebaseapp.com",
  projectId:         "sitecreator-83d4e",
  storageBucket:     "sitecreator-83d4e.firebasestorage.app",
  messagingSenderId: "838056248537",
  appId:             "1:838056248537:web:b05eacbe53d02f277feac8"
}

const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)
export const db   = getFirestore(app)