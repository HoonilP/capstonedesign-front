// src/app/api/register-fcm-token/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json(
        { success: false, message: 'FCM 토큰이 제공되지 않았습니다.' },
        { status: 400 }
      );
    }

    // TODO: 여기에서 토큰을 데이터베이스에 저장하는 코드를 구현하세요
    // 예: 사용자 ID와 FCM 토큰을 연결하여 저장

    console.log('FCM 토큰 등록:', token);

    return NextResponse.json(
      { success: true, message: 'FCM 토큰이 성공적으로 등록되었습니다.' },
      { status: 200 }
    );
  } catch (error) {
    console.error('FCM 토큰 등록 중 오류 발생:', error);
    
    return NextResponse.json(
      { success: false, message: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}