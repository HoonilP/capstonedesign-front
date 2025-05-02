// // React
// import type { Metadata } from "next";
// import { Geist, Geist_Mono } from "next/font/google";
// import Script from "next/script";

// // Components: UI
// import "./globals.css";
// import { Toaster } from "@/components/ui/sonner"

// const geistSans = Geist({
// 	variable: "--font-geist-sans",
// 	subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
// 	variable: "--font-geist-mono",
// 	subsets: ["latin"],
// });

// export const metadata: Metadata = {
// 	title: "Scholarly Chain",
// 	description: "Blockchain Hyperledger Service for Student Council",
// };

// export default function RootLayout({ children, }: Readonly<{
// 	children: React.ReactNode;
// }>) {
// 	return (
// 		<html lang="ko" suppressHydrationWarning>
// 			<head>
// 				<link rel="icon" href="/favicon.ico" sizes="any" />
// 			</head>
// 			<body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
// 				{children}
// 				<Script src="/service-worker.js" />
// 				<Toaster />
// 			</body>
// 		</html>
// 	);
// }


import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Suspense } from 'react';
import "./globals.css";
import FirebaseNotifications from '@/components/FirebaseNotifications';
import PWADetector from "@/components/PWADetector";
import { Toaster } from "@/components/ui/sonner"

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "Scholarly Chain",
	description: "Blockchain Hyperledger Service for Student Council",
};

export const viewport: Viewport = {
	themeColor: "#fff",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="ko" suppressHydrationWarning>
			<head>
				<link rel="icon" href="/favicon.ico" sizes="any" />
				<link rel="manifest" href="/manifest.json" crossOrigin="use-credentials" />
			</head>
			<body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
				{children}
				<Suspense fallback={null}>
					<FirebaseNotifications />
					<PWADetector />
				</Suspense>
				<Toaster />
			</body>
		</html>
	);
}