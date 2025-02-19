"use client";

import { useToast } from "@/hooks/use-toast";
import AuthService from "@/services/authService";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useSession } from "next-auth/react";

export default function Page() {
    const params = useSearchParams();
    const { toast } = useToast();
    const router = useRouter();
    const { update } = useSession();

    useEffect(() => {
        const code = params.get("code");
        if (!code) {
            return;
        }
        const verifyEmail = async () => {
            const authService = new AuthService();
            const result = await authService.verifyEmailCode(code);
            if (!result.success) {
                toast({
                    title: "Error verifying email",
                    description: result.message,
                    variant: "destructive",
                });
                if (result.message === "Email already verified") {
                    update();
                    router.push("/auth/login");
                } else {
                    router.push("/auth/verify-email");
                }
                return;
            }
            update();
            router.push("/auth/login");
            toast({
                title: result.message,
                variant: "success",
            });
        };
        verifyEmail();
    }, [params]);
}
