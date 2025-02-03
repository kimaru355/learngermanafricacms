// 'use client';

// import { redirect } from "next/navigation";
// import { ResponseType } from "@/lib/interfaces/ResponseType";
// import Link from "next/link";
// import EmailVerified from "@/components/auth/EmailVerfied";

// export default function Page({
//     params,
// }: {
//     params: Promise<{ code: string }>;
// }) {
//     const { code } = await params;
//     if (!code) {
//         redirect("/auth/verify-email");
//     }
//     const sendEmail = async () => {
//         const response = await fetch("/api/auth/verify-email/" + code);
//     }

//     return <EmailVerified />;
// }

export default function Page() {
    return <div></div>;
}
