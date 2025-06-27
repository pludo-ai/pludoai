import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyD-HzPQZhQzOQMF3qEF-dTKAqllMd8MP_s",
  authDomain: "pludoai-efb03.firebaseapp.com",
  projectId: "pludoai-efb03",
  storageBucket: "pludoai-efb03.firebasestorage.app",
  messagingSenderId: "393694557758",
  appId: "1:393694557758:web:6999a54e7e447e9cf5836f",
  measurementId: "G-L11ZCYJ12V"
};

export const app = initializeApp(firebaseConfig);

export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;