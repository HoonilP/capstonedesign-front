'use client';

// Components: UI
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

// Next
import Image from "next/image";

// Page
import { SigninForm } from "./form"

export default function Page() {
	return (
		<div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
			<div className="w-full max-w-sm">
				<Card>
					<CardHeader>
						<div>
							<Image src="/banner.png" width={600} height={100} alt="Banner" className="object-contain" priority />
						</div>
						<CardTitle className="text-2xl">
							로그인
						</CardTitle>
						<CardDescription>
							학번과 비밀번호를 입력해 로그인하세요.
						</CardDescription>
					</CardHeader>
					<CardContent>
						<SigninForm />
					</CardContent>
				</Card>
			</div>
		</div>
	)
}
