"use client";

import Link from "next/link";
import { signIn } from "next-auth/react";
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
import { useEffect, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function Auth() {
    const emailInputRef = useRef<HTMLInputElement>(null);
    const passwordInputRef = useRef<HTMLInputElement>(null);
    const { toast } = useToast();
    const router = useRouter();
    const path = usePathname();
    const searchParams = useSearchParams();
    const error = searchParams.get("error");

    const handleLogin = async () => {
        if (!emailInputRef.current || !passwordInputRef.current) {
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const email: string = emailInputRef.current.value;
        const password: string = passwordInputRef.current.value;

        // Validation
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

        // Use `signIn` from next-auth
        const result = await signIn("credentials", {
            redirect: false, // Prevent automatic redirect
            email,
            password,
        });
        if (result?.error) {
            router.push(result.error);
        } else {
            toast({
                title: "Login successful",
                variant: "success",
            });
            router.push("/manage"); // Redirect to the dashboard or desired page
        }
    };

    const handleGoogleLogin = async () => {
        await signIn("google");
    };

    useEffect(() => {
        if (!error) {
            return;
        }
        let message = "";
        switch (error) {
            case "missing-credentials":
                message = "Email and Password are required";
                break;
            case "invalid-email-or-password":
                message = "Invalid Email or Password";
                break;
            case "no-password-set":
                message =
                    "No password set for this account. Please use Google sign-in";
                break;
            default:
                message = "An error occurred during sign-in";
                break;
        }
        const timeout = setTimeout(() => {
            toast({
                title: "Login failed",
                description: message,
                variant: "destructive",
            });
            router.push("/auth/login");
        }, 200);
        return () => clearTimeout(timeout);
    }, [path, error, toast, router]);

    return (
        <section className="flex justify-center items-center bg-gray-100 dark:bg-gray-950 px-4 py-12 w-full min-h-screen">
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

                        <p>Or you can Sign in with Google</p>
                        <Button
                            variant="outline"
                            className="w-full"
                            onClick={handleGoogleLogin}
                        >
                            Sign in with Google
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </section>
    );
}
