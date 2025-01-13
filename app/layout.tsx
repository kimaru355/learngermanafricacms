import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "Learn German Africa CMS",
    description: "A content management system for Learn German Africa",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body>{children}</body>
        </html>
    );
}
