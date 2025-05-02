'use client';

import { useEffect, useState, useCallback } from 'react';
import { toast } from 'sonner';

// BeforeInstallPromptEvent 인터페이스 정의
interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

// window 인터페이스 확장
declare global {
  interface WindowEventMap {
    beforeinstallprompt: BeforeInstallPromptEvent;
    appinstalled: Event;
  }
  
  interface Navigator {
    standalone?: boolean;
  }
}

export default function PWADetector() {
  const [isInstalled, setIsInstalled] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);

  // useCallback을 사용하여 installPWA 함수 메모이제이션
  const installPWA = useCallback(async (promptEvent: BeforeInstallPromptEvent | null = deferredPrompt) => {
    if (!promptEvent) {
      console.log('설치 프롬프트를 사용할 수 없습니다.');
      return;
    }

    try {
      // 설치 프롬프트 표시
      await promptEvent.prompt();
      
      // 사용자의 프롬프트 응답을 기다립니다.
      const choiceResult = await promptEvent.userChoice;
      
      if (choiceResult.outcome === 'accepted') {
        console.log('사용자가 PWA 설치를 수락했습니다.');
      } else {
        console.log('사용자가 PWA 설치를 거부했습니다.');
      }
      
      // prompt()는 한 번만 호출할 수 있으므로 더 이상 사용할 수 없습니다.
      setDeferredPrompt(null);
    } catch (error) {
      console.error('PWA 설치 중 오류 발생:', error);
    }
  }, [deferredPrompt]);

  useEffect(() => {
    // PWA가 이미 설치되었는지 확인
    const checkIfPWAInstalled = () => {
      if (window.matchMedia('(display-mode: standalone)').matches || 
          window.navigator.standalone === true) {
        setIsInstalled(true);
      }
    };

    checkIfPWAInstalled();

    // beforeinstallprompt 이벤트 리스너 추가
    const handleBeforeInstallPrompt = (e: BeforeInstallPromptEvent) => {
      // Chrome 76+ 이상에서는 자동으로 설치 프롬프트가 표시되지 않습니다.
      // 이벤트를 저장하여 나중에 사용자가 버튼을 클릭했을 때 프롬프트를 표시할 수 있습니다.
      e.preventDefault();
      setDeferredPrompt(e);
      
      // 설치 알림 표시
      if (!isInstalled) {
        toast.info('앱을 설치하면 더 편리하게 이용할 수 있어요', {
          action: {
            label: '설치하기',
            onClick: () => installPWA(e),
          },
          duration: 10000,
        });
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // appinstalled 이벤트 리스너 추가
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
      toast.success('앱이 성공적으로 설치되었습니다!');
    };

    window.addEventListener('appinstalled', handleAppInstalled);

    // 컴포넌트 언마운트 시 이벤트 리스너 제거
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, [isInstalled, installPWA]); // installPWA를 의존성 배열에 추가

  // UI를 렌더링하지 않고 기능만 제공합니다
  return null;
}