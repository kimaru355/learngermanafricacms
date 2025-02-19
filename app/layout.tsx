import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import Navbar from "@/components/navbar/Navbar";
import AuthProvider from "@/components/auth/AuthProvider";
import { montserrat } from "@/font";

export const metadata: Metadata = {
    title: "Learn German Africa CMS",
    description: "A content management system for Learn German Africa",
    icons: {
        icon: "/logo.svg",
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className={`${montserrat.variable}`}>
            <AuthProvider>
                <body className="flex flex-col items-center bg-[#F1F0F3] w-full min-h-screen text-black">
                    <div className="md:px-8 w-full max-w-[120rem]">
                        <Navbar />
                        {children}
                        <Toaster />
                    </div>
                </body>
            </AuthProvider>
        </html>
    );
}
