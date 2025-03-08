"use client";

import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ResponseType } from "@/lib/interfaces/ResponseType";
import AuthService from "@/services/authService";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function VerifyEmail() {
    const [email, setEmail] = useState<string | null>(null);
    const [code, setCode] = useState<string | null>(null);
    const { toast } = useToast();
    const [isCodeInputShown, setIsCodeInputShown] = useState(false);
    const [countdown, setCountdown] = useState(0);
    const { update } = useSession();
    const router = useRouter();

    const sendEmailVerification = async () => {
        if (!email) return;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            toast({
                title: "Invalid email",
                description: "Please enter a valid email",
                variant: "destructive",
            });
            return;
        }

        // Send Email Verification
        setCountdown(60);
        const authService = new AuthService();
        const result = await authService.sendEmailVerification(email);
        if (!result.success) {
            toast({
                title: "Error sending email",
                description: result.message,
                variant: "destructive",
            });
            if (result.message === "Email is already verified") {
                await signOut();
                router.push("/auth/login");
            }
            return;
        }
        toast({
            title: result.message,
            variant: "success",
        });
        setIsCodeInputShown(true);
    };

    const verifyEmail = async () => {
        if (!code || !email) {
            return;
        }
        const authService = new AuthService();
        const result: ResponseType<null> = await authService.verifyEmail(
            email,
            code
        );
        toast({
            title: result.message,
            variant: result.success ? "success" : "destructive",
        });
        if (result.success) {
            update();
            router.push("/auth/login");
        }
    };

    useEffect(() => {
        if (countdown === 0) {
            return;
        }
        const interval = setInterval(() => {
            setCountdown((prev) => prev - 1);
        }, 1000);
        return () => clearInterval(interval);
    }, [countdown]);

    return (
        <section className="flex justify-center items-center bg-gray-100 dark:bg-gray-950 px-4 py-12 w-full min-h-screen">
            <div className="space-y-4 w-full max-w-md">
                <Card>
                    <CardHeader className="space-y-1">
                        <CardTitle className="font-bold text-2xl">
                            Email Verification
                        </CardTitle>
                        <CardDescription>
                            {isCodeInputShown
                                ? "Enter the code sent to your email"
                                : "Enter your email to receive a verification code"}
                        </CardDescription>
                    </CardHeader>
                    {!isCodeInputShown && (
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="m@example.com"
                                    required
                                    onChange={(e) => {
                                        setEmail(e.target.value);
                                    }}
                                />
                            </div>
                            <Button
                                type="button"
                                className="w-full"
                                onClick={() => {
                                    sendEmailVerification();
                                }}
                            >
                                Send Code
                            </Button>
                        </CardContent>
                    )}
                    {isCodeInputShown && (
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="code">Code</Label>
                                <Input
                                    id="code"
                                    type="text"
                                    required
                                    onChange={(e) => {
                                        setCode(e.target.value);
                                    }}
                                />
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <p>{countdown} s</p>
                                    <Button
                                        className="bg-gray-200 font-medium text-gray-500 hover:text-white dark:hover:text-gray-50 dark:text-gray-400 text-sm underline underline-offset-2"
                                        disabled={countdown !== 0}
                                        onClick={() => {
                                            sendEmailVerification();
                                        }}
                                    >
                                        Resend Code
                                    </Button>
                                </div>
                            </div>

                            <Button
                                type="button"
                                className="w-full"
                                onClick={() => {
                                    verifyEmail();
                                }}
                            >
                                Verify
                            </Button>
                        </CardContent>
                    )}
                </Card>
            </div>
        </section>
    );
}
