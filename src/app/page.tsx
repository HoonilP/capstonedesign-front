// 'use client';

// import React, { useState, useEffect } from 'react';
// import { Button } from "@/components/ui/button";
// import { toast } from "sonner";
// import { requestFCMToken, setupMessageListener } from '@/lib/firebase';
// import { MessagePayload } from 'firebase/messaging';

// export default function HomePage() {
// 	const [notificationStatus, setNotificationStatus] = useState<'default' | 'granted' | 'denied'>('default');
// 	const [isLoading, setIsLoading] = useState(false);
// 	const [fcmToken, setFcmToken] = useState<string | null>(null);

// 	// 페이지 로드 시 현재 알림 권한 상태 확인 및 FCM 초기화
// 	useEffect(() => {
// 		if (typeof window !== 'undefined' && 'Notification' in window) {
// 			const currentPermission = Notification.permission as 'default' | 'granted' | 'denied';
// 			setNotificationStatus(currentPermission);

// 			// 이미 권한이 있으면 FCM 토큰 요청
// 			if (currentPermission === 'granted') {
// 				initializeFCM();
// 			}
// 		}

// 		// 컴포넌트 언마운트 시 정리
// 		return () => {
// 			// 필요한 경우 정리 코드 추가
// 		};
// 	}, []);

// 	// FCM 초기화 및 토큰 요청 함수
// 	const initializeFCM = async () => {
// 		try {
// 			// 서비스 워커가 지원되는지 확인
// 			if (!('serviceWorker' in navigator)) {
// 				console.error('이 브라우저는 서비스 워커를 지원하지 않습니다.');
// 				return;
// 			}

// 			// 서비스 워커 등록
// 			const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js', {
// 				scope: '/'
// 			});
// 			console.log('서비스 워커 등록 성공:', registration);

// 			// FCM 토큰 요청
// 			const token = await requestFCMToken();
// 			if (token) {
// 				console.log('FCM 토큰:', token);
// 				setFcmToken(token);

// 				// 서버에 토큰 등록 (필요한 경우)
// 				// await registerTokenWithServer(token);
// 			} else {
// 				console.error('FCM 토큰을 가져올 수 없습니다.');
// 			}

// 			// 포그라운드 메시지 리스너 설정
// 			setupMessageListener((payload: MessagePayload) => {
// 				console.log('포그라운드 메시지 수신:', payload);

// 				if (payload.notification) {
// 					toast(payload.notification.title || '새 알림', {
// 						description: payload.notification.body || '',
// 						duration: 5000,
// 					});
// 				} else if (payload.data) {
// 					toast(payload.data.title || '새 알림', {
// 						description: payload.data.body || '',
// 						duration: 5000,
// 					});
// 				}
// 			});

// 		} catch (error) {
// 			console.error('FCM 초기화 중 오류 발생:', error);
// 			toast.error('푸시 알림 설정 중 오류가 발생했습니다.');
// 		}
// 	};

// 	const requestPermission = async () => {
// 		if (!("Notification" in window)) {
// 			toast.error("이 브라우저는 알림을 지원하지 않습니다.");
// 			return;
// 		}

// 		setIsLoading(true);

// 		try {
// 			// 권한 요청
// 			const permission = await Notification.requestPermission();
// 			console.log("권한 상태:", permission);
// 			setNotificationStatus(permission as 'default' | 'granted' | 'denied');

// 			// 권한이 부여되면 FCM 초기화
// 			if (permission === 'granted') {
// 				toast.success("알림 권한이 허용되었습니다!");
// 				await initializeFCM();
// 			} else if (permission === 'denied') {
// 				toast.error("알림 권한이 거부되었습니다. 브라우저 설정에서 권한을 변경해주세요.");
// 			}
// 		} catch (error) {
// 			console.error("알림 권한 요청 중 오류 발생:", error);
// 			toast.error("알림 권한 요청 중 오류가 발생했습니다.");
// 		} finally {
// 			setIsLoading(false);
// 		}
// 	};

// 	// 권한 상태에 따른 버튼 텍스트
// 	const getButtonText = () => {
// 		switch (notificationStatus) {
// 			case 'granted':
// 				return '알림 권한 허용됨 ✓';
// 			case 'denied':
// 				return '알림 권한 거부됨 ✗';
// 			default:
// 				return '알림 권한 요청하기';
// 		}
// 	};

// 	return (
// 		<div className="p-4 flex flex-col items-center justify-center min-h-[80vh]">
// 			<h1 className="text-2xl font-bold mb-6">FCM 알림 테스트</h1>

// 			<div className="bg-gray-100 p-4 rounded-lg mb-6 w-full max-w-md">
// 				<h2 className="font-medium mb-2">현재 알림 권한 상태:</h2>
// 				<div className={`p-2 rounded ${notificationStatus === 'granted' ? 'bg-green-100 text-green-800' :
// 						notificationStatus === 'denied' ? 'bg-red-100 text-red-800' :
// 							'bg-yellow-100 text-yellow-800'
// 					}`}>
// 					{notificationStatus === 'granted' && '허용됨 ✓'}
// 					{notificationStatus === 'denied' && '거부됨 ✗'}
// 					{notificationStatus === 'default' && '아직 결정되지 않음'}
// 				</div>
// 			</div>

// 			<Button
// 				onClick={requestPermission}
// 				disabled={isLoading || notificationStatus === 'denied'}
// 				className="mb-4"
// 			>
// 				{isLoading ? '처리 중...' : getButtonText()}
// 			</Button>

// 			{notificationStatus === 'denied' && (
// 				<p className="text-sm text-red-500 mt-2 text-center max-w-md">
// 					알림이 차단되었습니다. 브라우저 설정에서 이 사이트의 알림 권한을 변경해주세요.
// 				</p>
// 			)}

// 			{fcmToken && (
// 				<div className="mt-6 w-full max-w-md">
// 					<h2 className="font-medium mb-2">FCM 토큰:</h2>
// 					<div className="bg-gray-50 p-3 rounded border text-xs break-all overflow-auto max-h-32">
// 						{fcmToken}
// 					</div>
// 					<Button
// 						onClick={() => {
// 							navigator.clipboard.writeText(fcmToken);
// 							toast.success('FCM 토큰이 클립보드에 복사되었습니다.');
// 						}}
// 						variant="outline"
// 						size="sm"
// 						className="mt-2"
// 					>
// 						토큰 복사
// 					</Button>
// 					<p className="text-sm text-gray-600 mt-2">
// 						이 토큰을 Firebase 콘솔에서 테스트 메시지를 보낼 때 사용하세요.
// 					</p>
// 				</div>
// 			)}

// 			<div className="mt-8 p-4 border rounded-lg bg-blue-50 max-w-md">
// 				<h3 className="font-medium mb-2">Firebase 콘솔에서 테스트 메시지 보내기:</h3>
// 				<ol className="list-decimal pl-5 text-sm space-y-2">
// 					<li>Firebase 콘솔에서 <strong>Cloud Messaging</strong> 메뉴로 이동</li>
// 					<li><strong>첫 번째 캠페인 보내기</strong> 또는 <strong>새 알림</strong> 클릭</li>
// 					<li><strong>테스트 메시지 보내기</strong> 선택</li>
// 					<li><strong>FCM 등록 토큰 추가</strong>에 위의 토큰 입력</li>
// 					<li>제목과 텍스트를 입력하고 테스트 메시지 보내기</li>
// 				</ol>
// 			</div>
// 		</div>
// 	);
// }



'use client';

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { requestFCMToken } from '@/lib/firebase';

interface DeviceInfo {
  isIOS: boolean;
  iOSVersion: string | null;
  browser: string;
  isPWA: boolean;
}

// 명시적인 Window 인터페이스 확장
interface ExtendedNavigator extends Navigator {
  standalone?: boolean;
}

export default function HomePage() {
  const [notificationStatus, setNotificationStatus] = useState<'default' | 'granted' | 'denied' | 'unsupported'>('default');
  const [isLoading, setIsLoading] = useState(false);
  const [fcmToken, setFcmToken] = useState<string | null>(null);
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>({
    isIOS: false,
    iOSVersion: null,
    browser: '',
    isPWA: false
  });

  // 페이지 로드 시 디바이스 정보 및 알림 지원 여부 확인
  useEffect(() => {
    // 디바이스 및 브라우저 감지
    const userAgent = window.navigator.userAgent;
    const isIOS = /iPad|iPhone|iPod/.test(userAgent) && !(window as Window & { MSStream?: unknown }).MSStream;
    
    // iOS 버전 감지 (iOS 16.4 이상 필요)
    let iOSVersion = null;
    if (isIOS) {
      const match = userAgent.match(/OS (\d+)_(\d+)_?(\d+)?/);
      if (match) {
        iOSVersion = `${match[1]}.${match[2]}${match[3] ? `.${match[3]}` : ''}`;
      }
    }
    
    // 브라우저 감지
    const isSafari = /^((?!chrome|android).)*safari/i.test(userAgent);
    const isChrome = /chrome/i.test(userAgent);
    const isFirefox = /firefox/i.test(userAgent);
    
    let browserName = '';
    if (isSafari) browserName = 'Safari';
    else if (isChrome) browserName = 'Chrome';
    else if (isFirefox) browserName = 'Firefox';
    else browserName = '알 수 없음';
    
    // PWA 모드인지 확인
    const isPWA = window.matchMedia('(display-mode: standalone)').matches || 
                 Boolean((window.navigator as ExtendedNavigator).standalone);
    
    setDeviceInfo({
      isIOS,
      iOSVersion,
      browser: browserName,
      isPWA
    });
    
    // 알림 API 지원 여부 확인
    if (typeof window !== 'undefined') {
      if (!('Notification' in window)) {
        setNotificationStatus('unsupported');
      } else {
        setNotificationStatus(Notification.permission as 'default' | 'granted' | 'denied');
      }
    }
  }, []);

  const requestPermission = async () => {
    // iOS Safari 제한 확인
    // if (deviceInfo.isIOS) {
    //   // iOS 버전 확인 (16.4 이상인지)
    //   const versionNumber = deviceInfo.iOSVersion ? parseFloat(deviceInfo.iOSVersion) : 0;
    //   const isSupported = versionNumber >= 16.4;
      
    //   if (!isSupported) {
    //     toast.error("iOS 16.4 이상에서만 웹 푸시 알림이 지원됩니다.", {
    //       duration: 5000
    //     });
    //     return;
    //   }
      
    //   if (deviceInfo.browser !== 'Safari') {
    //     toast.error("iOS에서는 Safari 브라우저에서만 웹 푸시 알림이 지원됩니다.", {
    //       duration: 5000
    //     });
    //     return;
    //   }
      
    //   if (!deviceInfo.isPWA) {
    //     toast.error("홈 화면에 추가한 후에 알림을 설정할 수 있습니다.", {
    //       description: "Safari의 공유 버튼을 눌러 '홈 화면에 추가'를 선택해주세요.",
    //       duration: 8000,
    //       action: {
    //         label: "방법 보기",
    //         onClick: () => showInstallInstructions()
    //       }
    //     });
    //     return;
    //   }
    // }
    
    // if (!("Notification" in window)) {
    //   toast.error("이 브라우저는 알림을 지원하지 않습니다.");
    //   return;
    // }

    setIsLoading(true);
    
    try {
      // 권한 요청
      const permission = await Notification.requestPermission();
      console.log("권한 상태:", permission);
      setNotificationStatus(permission as 'default' | 'granted' | 'denied');
      
      // 권한이 부여되면 FCM 토큰 요청
      if (permission === 'granted') {
        toast.success("알림 권한이 허용되었습니다!");
        
        // FCM 토큰 요청 시도
        const token = await requestFCMToken();
        if (token) {
          console.log("FCM 토큰 발급 성공:", token);
          setFcmToken(token);
          toast.success("푸시 알림 설정이 완료되었습니다!");
          
          // 테스트 알림 표시
          new Notification("알림 테스트", {
            body: "알림 권한이 정상적으로 허용되었습니다.",
            icon: "/icons/icon512_maskable.png"
          });
        } else {
          console.error("FCM 토큰 발급 실패");
          toast.error("푸시 알림 설정 중 오류가 발생했습니다.");
        }
      } else if (permission === 'denied') {
        toast.error("알림 권한이 거부되었습니다. 브라우저 설정에서 권한을 변경해주세요.");
      }
    } catch (error) {
      console.error("알림 권한 요청 중 오류 발생:", error);
      toast.error("알림 권한 요청 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  // 홈 화면 추가 방법 안내
  const showInstallInstructions = () => {
    toast(
      <div className="space-y-2">
        <h3 className="font-bold">iOS에서 홈 화면에 추가하는 방법</h3>
        <ol className="list-decimal pl-5 space-y-1 text-sm">
          <li>Safari 하단의 <span className="font-semibold">공유 버튼 (네모에서 화살표가 나오는 아이콘)</span>을 탭하세요.</li>
          <li><span className="font-semibold">&quot;홈 화면에 추가&quot;</span> 옵션을 선택하세요.</li>
          <li>앱 이름을 확인하고 <span className="font-semibold">&quot;추가&quot;</span> 버튼을 누르세요.</li>
          <li>홈 화면에서 앱을 실행한 후 다시 알림을 설정하세요.</li>
        </ol>
      </div>,
      {
        duration: 10000,
      }
    );
  };

  // iOS에서 알림 권한이 거부된 경우 처리하는 함수
  const showIOSPermissionInstructions = () => {
    toast(
      <div className="space-y-2">
        <h3 className="font-bold">iOS에서 알림 권한 설정 방법</h3>
        <ol className="list-decimal pl-5 space-y-1 text-sm">
          <li>iPhone의 <span className="font-semibold">설정 앱</span>을 엽니다.</li>
          <li><span className="font-semibold">Safari</span>를 찾아서 탭합니다.</li>
          <li><span className="font-semibold">고급</span>을 탭합니다.</li>
          <li><span className="font-semibold">웹사이트 데이터</span>를 탭합니다.</li>
          <li>목록에서 현재 웹사이트를 찾거나 검색합니다.</li>
          <li>웹사이트를 선택하고 <span className="font-semibold">알림</span> 설정을 변경합니다.</li>
          <li>또는 <span className="font-semibold">모든 웹사이트 데이터 제거</span>를 통해 모든 설정을 초기화하고 다시 시도할 수 있습니다.</li>
        </ol>
        <p className="text-xs mt-2">
          <span className="font-semibold">참고:</span> iOS 16.4 이상에서는 홈 화면에 추가된 앱의 경우 설정 &gt; Safari &gt; 사이트별 설정 또는 설정 &gt; 알림에서도 확인할 수 있습니다.
        </p>
      </div>,
      {
        duration: 15000,
      }
    );
  };

  // iOS에서 알림 권한을 완전히 초기화하는 방법 안내
  const showIOSResetInstructions = () => {
    toast(
      <div className="space-y-2">
        <h3 className="font-bold">iOS에서 알림 설정 완전 초기화 방법</h3>
        <p className="text-sm">
          Safari 알림 설정을 찾기 어려운 경우, 다음 방법으로 웹사이트 데이터를 초기화할 수 있습니다:
        </p>
        <ol className="list-decimal pl-5 space-y-1 text-sm">
          <li>iPhone의 <span className="font-semibold">설정 앱</span>을 엽니다.</li>
          <li><span className="font-semibold">Safari</span>를 찾아서 탭합니다.</li>
          <li>아래로 스크롤하여 <span className="font-semibold">웹사이트 데이터 지우기</span>를 탭합니다.</li>
          <li>확인 메시지가 나타나면 <span className="font-semibold">웹사이트 데이터 지우기</span>를 다시 탭합니다.</li>
          <li>홈 화면으로 돌아가 기존 앱을 삭제합니다.</li>
          <li>다시 Safari로 웹사이트에 접속하여 홈 화면에 추가한 후 알림을 설정합니다.</li>
        </ol>
        <p className="text-xs mt-2 text-orange-600">
          <span className="font-semibold">주의:</span> 이 방법은 모든 웹사이트의 캐시와 데이터를 삭제합니다. 로그인 정보 등이 초기화될 수 있습니다.
        </p>
      </div>,
      {
        duration: 15000,
      }
    );
  };

  // 전체 iOS 알림 문제 해결 가이드
  const showIOSNotificationTroubleshooting = () => {
    toast(
      <div className="space-y-3 max-w-md">
        <h3 className="font-bold text-lg">iOS 알림 문제 해결</h3>
        
        <div>
          <h4 className="font-semibold">1. 기본 요구사항 확인</h4>
          <ul className="list-disc pl-5 text-sm">
            <li>iOS 16.4 이상 버전인지 확인</li>
            <li>Safari 브라우저 사용 중인지 확인</li>
            <li>반드시 <span className="font-semibold">홈 화면에 추가된 상태</span>로 실행해야 함</li>
          </ul>
        </div>
        
        <div>
          <h4 className="font-semibold">2. 알림 권한 재설정</h4>
          <p className="text-sm">
            웹사이트 데이터를 초기화하여 알림 권한을 재설정할 수 있습니다:
          </p>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={showIOSResetInstructions}
            className="mt-1 w-full"
          >
            데이터 초기화 방법 보기
          </Button>
        </div>
        
        <div>
          <h4 className="font-semibold">3. 앱 재설치</h4>
          <p className="text-sm">
            홈 화면의 앱을 길게 눌러 삭제한 후, Safari에서 다시 웹사이트에 접속하여 홈 화면에 추가해보세요.
          </p>
        </div>
        
        <p className="text-xs mt-2 border-t pt-2">
          iOS Safari에서는 웹 알림이 제한적으로만 지원됩니다. 자세한 도움이 필요하면 관리자에게 문의하세요.
        </p>
      </div>,
      {
        duration: 0, // 사용자가 직접 닫을 때까지 유지
        action: {
          label: "닫기",
          onClick: () => {}
        }
      }
    );
  };

  return (
    <div className="p-4 flex flex-col items-center justify-center min-h-[80vh]">
      <h1 className="text-2xl font-bold mb-6">FCM 알림 테스트</h1>
      
      {/* 디바이스 정보 표시 */}
      <div className="bg-gray-50 p-3 rounded-lg border mb-4 w-full max-w-md text-sm">
        <h3 className="font-medium mb-2">디바이스 정보</h3>
        <ul className="space-y-1">
          <li><span className="font-medium">기기:</span> {deviceInfo.isIOS ? 'iOS' : 'iOS 아님'}</li>
          {deviceInfo.isIOS && <li><span className="font-medium">iOS 버전:</span> {deviceInfo.iOSVersion || '알 수 없음'}</li>}
          <li><span className="font-medium">브라우저:</span> {deviceInfo.browser}</li>
          <li><span className="font-medium">PWA 모드:</span> {deviceInfo.isPWA ? 'Yes' : 'No'}</li>
          <li><span className="font-medium">알림 지원:</span> {notificationStatus === 'unsupported' ? '미지원' : '지원'}</li>
        </ul>
      </div>
      
      {/* 알림 상태 표시 */}
      <div className="bg-gray-100 p-4 rounded-lg mb-6 w-full max-w-md">
        <h2 className="font-medium mb-2">현재 알림 권한 상태:</h2>
        <div className={`p-2 rounded ${
          notificationStatus === 'granted' ? 'bg-green-100 text-green-800' : 
          notificationStatus === 'denied' ? 'bg-red-100 text-red-800' :
          notificationStatus === 'unsupported' ? 'bg-gray-100 text-gray-800' :
          'bg-yellow-100 text-yellow-800'
        }`}>
          {notificationStatus === 'granted' && '허용됨 ✓'}
          {notificationStatus === 'denied' && '거부됨 ✗'}
          {notificationStatus === 'default' && '아직 결정되지 않음'}
          {notificationStatus === 'unsupported' && '이 브라우저에서 지원되지 않음'}
        </div>
      </div>
      
      {/* iOS 푸시 알림 가이드 */}
      {deviceInfo.isIOS && notificationStatus !== 'denied' && (
        <div className="bg-blue-50 p-4 rounded-lg mb-6 w-full max-w-md">
          <h3 className="font-medium mb-2">iOS 웹 푸시 알림 안내</h3>
          <p className="text-sm mb-3">
            iOS 16.4 이상에서는 홈 화면에 추가된 PWA에서만 푸시 알림을 받을 수 있습니다.
          </p>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={showInstallInstructions}
            className="w-full"
          >
            홈 화면에 추가하는 방법 보기
          </Button>
        </div>
      )}
      
      {/* 알림 거부 시 iOS 전용 안내 */}
      {notificationStatus === 'denied' && deviceInfo.isIOS && (
        <div className="mt-4 bg-red-50 p-4 rounded-lg w-full max-w-md mb-6">
          <h3 className="font-medium text-red-800 mb-2">알림 권한이 거부되었습니다</h3>
          <p className="text-sm text-red-700 mb-3">
            iOS에서는 알림 권한 설정을 변경하는 방법이 다소 복잡합니다. 아래 버튼을 눌러 설정 방법을 확인하세요.
          </p>
          <div className="flex flex-col space-y-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={showIOSPermissionInstructions}
            >
              알림 권한 변경 방법 보기
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={showIOSNotificationTroubleshooting}
            >
              전체 문제 해결 가이드
            </Button>
          </div>
        </div>
      )}
      
      {/* 알림 권한 요청 버튼 */}
      <Button
        onClick={requestPermission}
        // disabled={isLoading || notificationStatus === 'denied' || notificationStatus === 'unsupported'}
        className="mb-4"
      >
        {isLoading ? '처리 중...' : '알림 권한 요청하기'}
      </Button>
      
      {/* 비iOS 디바이스에서 알림 거부 메시지 */}
      {notificationStatus === 'denied' && !deviceInfo.isIOS && (
        <p className="text-sm text-red-500 mt-2 text-center max-w-md mb-4">
          알림이 차단되었습니다. 브라우저 설정에서 이 사이트의 알림 권한을 변경해주세요.
        </p>
      )}
      
      {fcmToken && (
        <div className="mt-6 w-full max-w-md">
          <h2 className="font-medium mb-2">FCM 토큰:</h2>
          <div className="bg-gray-50 p-3 rounded border text-xs break-all overflow-auto max-h-32">
            {fcmToken}
          </div>
          <Button 
            onClick={() => {
              navigator.clipboard.writeText(fcmToken);
              toast.success('FCM 토큰이 클립보드에 복사되었습니다.');
            }}
            variant="outline"
            size="sm"
            className="mt-2"
          >
            토큰 복사
          </Button>
        </div>
      )}
    </div>
  );
}