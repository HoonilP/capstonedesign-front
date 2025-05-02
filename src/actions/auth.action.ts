'use server';

// Credentials
import { cookies } from 'next/headers';
import { redirect } from "next/navigation";

// Types
import { signinFormSchema, signupFormSchema, JwtData, serverActionMessage } from "@/types";
import { jwtDecode } from "jwt-decode";
import { z } from "zod";

export async function signin(_: unknown, formData: FormData): Promise<serverActionMessage> {
    const data = {
        studentId: formData.get('studentId'),
        password: formData.get('password'),
    }

    try {
        signinFormSchema.parse(data);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return {
                status: 400,
                message: error.errors.map((err) => err.message).join("\n"),
            };
        }

        return {
            status: 500,
            message: "서버 오류가 발생했습니다. 관리자에게 문의하세요.",
        };
    }

    console.log(`studentId: ${data.studentId}`)
    console.log(`password: ${data.password}`)
    const credentials = btoa(`${data.studentId}:${data.password}`);

    const response = await fetch(`${process.env.API_SERVER_URL}/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Basic ${credentials}`
        },
        credentials: 'include',
    });

    const responseData = await response.json();
    console.log(responseData)
    if (!response.ok) {
        console.log(`statusCode: ${response.status}\nstatusMessage: ${responseData.error}`)
        throw new Error('로그인에 실패하였습니다. 다시 시도해주세요.');
    }

    // 'use server'; 때문에 쿠키가 client로 저장되지 않음
    const cookieList = response.headers.getSetCookie().map((v) => v.slice(0, v.indexOf(' ') - 1).split('='));

    const cookieStore = await cookies();
    for (const cookieInfo of cookieList) {
        const decoded: JwtData = jwtDecode(cookieInfo[1]);
        cookieStore.set({
            name: cookieInfo[0],
            value: decodeURIComponent(cookieInfo[1]),
            expires: new Date((decoded.exp + 9 * 60 * 60) * 1000) // 한국: GMT +9 = 9*60*60
        });
    }

    redirect('/');
}

export async function signup(_: unknown, formData: FormData): Promise<serverActionMessage> {
    const cookieStore = await cookies();
    const credentials = cookieStore.get('access_token')?.value;

    const data = {
        username: formData.get('username'),
        email: formData.get('email'),
        phoneNumber: formData.get('phoneNumber'),
        password: formData.get('password'),
        confirmPassword: formData.get('confirmPassword'),
        studentId: formData.get('studentId'),
        role: formData.get('role') === 'on' ? 'COMMITTEE' : 'STUDENT',
    }

    try {
        signupFormSchema.parse(data);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return {
                status: 400,
                message: error.errors.map((err) => err.message).join("\n"),
            };
        }

        return {
            status: 500,
            message: "서버 오류가 발생했습니다. 관리자에게 문의하세요.",
        };
    }

    const response = await fetch(`${process.env.API_SERVER_URL}/api/auth/signup`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Basic ${credentials}`
        },
        body: JSON.stringify(data),
    });

    console.log(response.json())

    if (!response.ok) {
        console.log(`statusCode: ${response.status}\nstatusMessage: ${response.statusText}`)
        throw new Error('회원가입에 실패하였습니다. 다시 시도해주세요.');
    }

    return {
        status: 200,
        message: '회원가입 요청이 성공적으로 완료되었습니다. 관리자의 승인이 있을 때까지 기다려주세요.',
    }
}