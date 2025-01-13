"use client";

import Link from "next/link";
import axios from "axios";
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { ResponseType } from "@/lib/interfaces/ResponseType";

export default function Auth() {
    const emailInputRef = useRef<HTMLInputElement>(null);
    const passwordInputRef = useRef<HTMLInputElement>(null);
    const { toast } = useToast();
    const router = useRouter();

    const handleLogin = async () => {
        if (!emailInputRef.current || !passwordInputRef.current) {
            return;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const email: string = emailInputRef.current.value;

        if (!email) {
            toast({
                title: "Email is required",
                variant: "destructive",
            });
            return;
        }
        if (!emailRegex.test(email)) {
            toast({
                title: "Invalid email",
                variant: "destructive",
            });
            return;
        }
        const password: string = passwordInputRef.current.value;
        if (!password) {
            toast({
                title: "Password is required",
                variant: "destructive",
            });
            return;
        }
        if (password.length < 8) {
            toast({
                title: "Password must be at least 8 characters",
                variant: "destructive",
            });
            return;
        }

        const result: ResponseType<null> = (
            await axios.post("/api/auth/login", {
                email,
                password,
            })
        ).data;
        if (!result.success) {
            toast({
                title: "Login failed",
                description: result.message,
                variant: "destructive",
            });
        } else {
            emailInputRef.current.value = "";
            passwordInputRef.current.value = "";
            toast({
                title: "Login successful",
                variant: "success",
            });
            setTimeout(() => {
                router.push("/dashboard");
            }, 2000);
        }
    };

    return (
        <main className="flex justify-center items-center bg-gray-100 dark:bg-gray-950 px-4 py-12 w-full min-h-screen">
            <div className="space-y-4 w-full max-w-md">
                <Card>
                    <CardHeader className="space-y-1">
                        <CardTitle className="font-bold text-2xl">
                            Login
                        </CardTitle>
                        <CardDescription>
                            Enter your email and password to access your
                            account.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="m@example.com"
                                required
                                ref={emailInputRef}
                            />
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <Label htmlFor="password">Password</Label>
                                <Link
                                    href="#"
                                    className="font-medium text-gray-500 text-sm hover:text-gray-900 dark:hover:text-gray-50 dark:text-gray-400 underline underline-offset-2"
                                    prefetch={false}
                                >
                                    Forgot password?
                                </Link>
                            </div>
                            <Input
                                id="password"
                                type="password"
                                placeholder="********"
                                required
                                ref={passwordInputRef}
                            />
                        </div>

                        <Button
                            type="button"
                            className="w-full"
                            onClick={handleLogin}
                        >
                            Login
                        </Button>
                    </CardContent>
                    <CardFooter className="text-center text-sm">
                        <>
                            Don&apos;t have an account?
                            <Link
                                href="/auth/register"
                                className="ml-1 font-medium text-gray-500 hover:text-gray-900 dark:hover:text-gray-50 dark:text-gray-400 underline underline-offset-2"
                            >
                                Sign up
                            </Link>
                        </>
                    </CardFooter>
                </Card>
            </div>
        </main>
    );
}
