// public/firebase-messaging-sw.js
importScripts('https://www.gstatic.com/firebasejs/9.0.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.2/firebase-messaging-compat.js');

firebase.initializeApp({
    apiKey: "AIzaSyBD-5n5uT_QdPDvWgPSUEcESCUJ4UK1H6s",
    authDomain: "blockchain-ledger.firebaseapp.com",
    projectId: "blockchain-ledger",
    storageBucket: "blockchain-ledger.firebasestorage.app",
    messagingSenderId: "1014190154955",
    appId: "1:1014190154955:web:54464550af2928f214274e",
});

const messaging = firebase.messaging();

// messaging.onBackgroundMessage((payload) => {
//     console.log('백그라운드 메시지 수신:', payload);

//     const notificationTitle = payload.notification.title;
//     const notificationOptions = {
//         body: payload.notification.body,
//         icon: 'icons/icon512_maskable.png'
//     };

//     self.registration.showNotification(notificationTitle, notificationOptions);
// });

self.addEventListener("install", function () {
    self.skipWaiting();
});

self.addEventListener("activate", function () {
    console.log("fcm sw activate..");
});

self.addEventListener('push', function (event) {
    console.log('Push 이벤트 수신:', event);

    // 데이터가 있는지 확인
    if (event.data) {
        try {
            // 푸시 메시지 데이터 파싱
            const data = event.data.json();
            console.log('푸시 데이터:', data);

            // 알림 데이터 설정
            const title = data.notification?.title || '새 알림';
            const options = {
                body: data.notification?.body || '새로운 메시지가 도착했습니다.',
                icon: data.notification?.icon || 'icons/icon512_maskable.png',
                badge: 'icons/badge-72x72.png',
                tag: data.notification?.tag || 'default-tag',
                data: {
                    url: data.notification?.click_action || '/',
                    ...data.data
                },
                // 진동 패턴
                vibrate: [100, 50, 100],
                // 알림 액션 버튼
                actions: [
                    {
                        action: 'open',
                        title: '열기'
                    },
                    {
                        action: 'close',
                        title: '닫기'
                    }
                ]
            };

            // 알림 표시
            event.waitUntil(
                self.registration.showNotification(title, options)
            );
        } catch (error) {
            console.error('푸시 데이터 처리 중 오류 발생:', error);

            // 오류 발생 시 기본 알림 표시
            event.waitUntil(
                self.registration.showNotification('새 알림', {
                    body: '새로운 메시지가 도착했습니다.',
                    icon: 'icons/icon512_maskable.png'
                })
            );
        }
    } else {
        console.log('푸시 이벤트에 데이터가 없습니다.');

        // 데이터가 없는 경우 기본 알림 표시
        event.waitUntil(
            self.registration.showNotification('새 알림', {
                body: '새로운 메시지가 도착했습니다.',
                icon: 'icons/icon512_maskable.png'
            })
        );
    }
});

// // 알림 클릭 이벤트 처리
// self.addEventListener('notificationclick', function (event) {
//     console.log('알림 클릭:', event);

//     // 알림 닫기
//     event.notification.close();

//     // 클릭한 액션 확인
//     if (event.action === 'close') {
//         console.log('사용자가 알림 닫기를 선택했습니다.');
//         return;
//     }

//     // 데이터 확인
//     const clickUrl = event.notification.data?.url || '/';

//     // 클라이언트 창 찾기 및 포커스 또는 새 창 열기
//     event.waitUntil(
//         clients.matchAll({
//             type: 'window',
//             includeUncontrolled: true
//         })
//             .then(function (clientList) {
//                 // 이미 열려있는 창 중에서 찾기
//                 for (let i = 0; i < clientList.length; i++) {
//                     const client = clientList[i];
//                     // URL이 같거나 루트 경로인 경우
//                     if (client.url.includes(self.registration.scope) && 'focus' in client) {
//                         // 열려있는 창 포커스
//                         client.focus();
//                         // 필요한 경우 URL 변경
//                         if (client.url !== clickUrl && 'navigate' in client) {
//                             return client.navigate(clickUrl);
//                         }
//                         return client;
//                     }
//                 }

//                 // 열린 창이 없는 경우 새 창 열기
//                 if (clients.openWindow) {
//                     return clients.openWindow(clickUrl);
//                 }
//             })
//             .catch(function (error) {
//                 console.error('알림 클릭 처리 중 오류 발생:', error);
//             })
//     );
// });