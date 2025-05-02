// src/lib/firebase.ts
import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, MessagePayload, onMessage } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: "AIzaSyBD-5n5uT_QdPDvWgPSUEcESCUJ4UK1H6s",
  authDomain: "blockchain-ledger.firebaseapp.com",
  projectId: "blockchain-ledger",
  storageBucket: "blockchain-ledger.firebasestorage.app",
  messagingSenderId: "1014190154955",
  appId: "1:1014190154955:web:54464550af2928f214274e",
};

// Firebase 앱 초기화
const app = initializeApp(firebaseConfig);

// 브라우저에서만 실행되도록 설정
export const initMessaging = () => {
  if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
    return getMessaging(app);
  }
  return null;
};

// FCM 토큰 요청
export const requestFCMToken = async () => {
  try {
    const messaging = initMessaging();
    if (!messaging) return null;
    
    const token = await getToken(messaging, {
      vapidKey: "BFEQZonyqygHNGMuttPdcuPc0y6LhYVpKPEQOPRV4SWwIrwLpXc1KMrb7qKjwitlxAjKsyl-MYEZDS2I671aQMk", // 서버에서 얻은 VAPID 키를 여기에 입력하세요
    });
    
    if (token) {
      console.log('FCM 토큰:', token);
      return token;
    } else {
      console.log('FCM 토큰을 가져올 수 없습니다.');
      return null;
    }
  } catch (error) {
    console.error('FCM 토큰 요청 에러:', error);
    return null;
  }
};

// 포그라운드 메시지 처리
export const setupMessageListener = (callback: (payload: MessagePayload) => void) => {
  const messaging = initMessaging();
  if (!messaging) return;
  
  return onMessage(messaging, (payload) => {
    console.log('포그라운드 메시지 수신:', payload);
    callback(payload);
  });
};

export default app;