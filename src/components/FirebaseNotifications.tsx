'use client';

import { useEffect } from 'react';
import { toast } from 'sonner';
import { requestFCMToken, setupMessageListener } from '@/lib/firebase';
import { MessagePayload } from 'firebase/messaging';

// FCM 토큰을 서버에 등록하는 함수
const registerTokenWithServer = async (token: string) => {
  try {
    // 여기에 서버로 토큰을 보내는 코드를 작성하세요
    // 예시:
    // await fetch('/api/register-fcm-token', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ token }),
    // });
    
    console.log('토큰이 서버에 등록되었습니다:', token);
    return true;
  } catch (error) {
    console.error('토큰 등록 실패:', error);
    return false;
  }
};

export default function FirebaseNotifications() {
  useEffect(() => {
    const initializeFCM = async () => {
      // 서비스 워커가 지원되는지 확인
      if (!('serviceWorker' in navigator)) {
        console.log('이 브라우저는 서비스 워커를 지원하지 않습니다.');
        return;
      }

      try {
        // SW 등록 확인
        const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js', {
          scope: '/'
        });
        console.log('서비스 워커 등록 성공:', registration);

        // 권한이 granted면 토큰 요청
        if (Notification.permission === 'granted') {
          const token = await requestFCMToken();
          if (token) {
            await registerTokenWithServer(token);
          }
        }

        // 포그라운드 메시지 리스너 설정
        setupMessageListener((payload: MessagePayload) => {
          // notification 객체가 존재하는지 확인
          if (payload.notification) {
            toast(payload.notification.title || '새 알림', {
              description: payload.notification.body || '',
              duration: 5000,
            });
          } else {
            // notification 객체가 없는 경우 data 속성을 사용할 수 있음
            if (payload.data) {
              const title = payload.data.title || '새 알림';
              const body = payload.data.body || '';
              toast(title, {
                description: body,
                duration: 5000,
              });
            } else {
              // notification과 data 모두 없는 경우
              toast('새 메시지가 도착했습니다', {
                duration: 5000,
              });
            }
          }
        });
      } catch (error) {
        console.error('FCM 초기화 중 오류 발생:', error);
      }
    };

    initializeFCM();
  }, []);

  // 컴포넌트는 UI를 렌더링하지 않고 기능만 수행합니다
  return null;
}