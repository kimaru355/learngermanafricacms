"use client";

import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useLayoutEffect } from "react";

export default function EmailVerified() {
    const router = useRouter();
    const { toast } = useToast();

    useLayoutEffect(() => {
        toast({
            title: "Email Verified",
            description: "Your email has been verified successfully.",
            variant: "success",
        });
        setTimeout(() => {
            router.push("/auth/login");
        }, 5000);
    });

    return (
        <div>
            <h1>Email Verified</h1>
            <p>Your email has been verified successfully.</p>
        </div>
    );
}
