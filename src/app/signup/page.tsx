'use client';

// Components: UI
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

// Next
import Image from "next/image";

// Page
import { SignUpForm } from "./form"

export default function Page() {
	return (
		<div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
			<div className="w-full max-w-sm">
				<Card>
					<CardHeader>
						<div>
							<Image src="/banner.png" width={600} height={100} alt="Logo" className="object-contain" priority />
						</div>
						<CardTitle className="text-2xl">
							회원가입
						</CardTitle>
						<CardDescription>
							아래 입력란을 채워 회원가입하세요.
						</CardDescription>
					</CardHeader>
					<CardContent>
						<SignUpForm />
					</CardContent>
				</Card>
			</div>
		</div>
	)
}
