
import { initializeApp } from 'firebase/app';
import { initializeFirestore, persistentLocalCache, persistentMultipleTabManager } from 'firebase/firestore';

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCVJS5Vw9heh49eCuveAAreDoxAAp6PSOE",
  authDomain: "clean-bg.firebaseapp.com",
  projectId: "clean-bg",
  storageBucket: "clean-bg.firebasestorage.app",
  messagingSenderId: "704900850160",
  appId: "1:704900850160:web:560b6976016cac79a03d35",
  measurementId: "G-M5CYF183K9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service.
// This new method replaces the deprecated `enableIndexedDbPersistence()`.
// It enables offline persistence with support for multiple tabs, which helps prevent
// issues when the app is open in more than one browser tab. This is the modern,
// recommended way to set up Firestore with offline capabilities.
const db = initializeFirestore(app, {
    localCache: persistentLocalCache({ tabManager: persistentMultipleTabManager() })
});

console.log("Firestore initialized with persistent cache for multiple tabs.");


export { db };