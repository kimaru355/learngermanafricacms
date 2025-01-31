import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import Navbar from "@/components/navbar/Navbar";
import AuthProvider from "@/components/auth/AuthProvider";

export const metadata: Metadata = {
    title: "Learn German Africa CMS",
    description: "A content management system for Learn German Africa",
    icons: {
        icon: "/logo.jpg",
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <AuthProvider>
                <body>
                    <Navbar />
                    {children}
                    <Toaster />
                </body>
            </AuthProvider>
        </html>
    );
}
