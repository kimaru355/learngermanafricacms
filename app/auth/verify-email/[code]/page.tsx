import { redirect } from "next/navigation";
import axios from "axios";
import { ResponseType } from "@/lib/interfaces/ResponseType";
import Link from "next/link";
import EmailVerified from "@/components/auth/EmailVerfied";

export default async function Page({
    params,
}: {
    params: Promise<{ code: string }>;
}) {
    const { code } = await params;
    if (!code) {
        redirect("/auth/verify-email");
    }
    const result: ResponseType<null> = (
        await axios.put("/api/auth/verify-email/" + code)
    ).data as ResponseType<null>;
    if (!result.success) {
        return (
            <div>
                <h1>Email Verification Failed</h1>
                <p>{result.message}</p>
                <Link href="/auth/verify-email">Go Back</Link>
            </div>
        );
    }

    return <EmailVerified />;
}
