// "use client";

// import { useEffect, useRef, useState } from "react";
// import { useRouter } from "next/navigation";
// import { useToast } from "@/hooks/use-toast";
// import {
//     Card,
//     CardHeader,
//     CardTitle,
//     CardDescription,
//     CardContent,
// } from "@/components/ui/card";
// import { Label } from "@/components/ui/label";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { ResponseType } from "@/lib/interfaces/ResponseType";

// export default function VerifyEmail() {
//     const emailInputRef = useRef<HTMLInputElement>(null);
//     const codeInputRef = useRef<HTMLInputElement>(null);
//     const { toast } = useToast();
//     const router = useRouter();
//     const [isCodeInputShown, setIsCodeInputShown] = useState(false);
//     const [countdown, setCountdown] = useState(0);

//     const sendEmailVerification = async () => {
//         if (!emailInputRef.current) {
//             return;
//         }
//         const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//         const email: string = emailInputRef.current.value;
//         if (!emailRegex.test(email)) {
//             toast({
//                 title: "Invalid email",
//                 description: "Please enter a valid email",
//                 variant: "destructive",
//             });
//             return;
//         }

//         // Send Email Verification
//         setCountdown(60);
//         const response = await fetch("/api/auth/send-email-verification", {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json",
//             },
//             body: JSON.stringify({ email }),
//         });
//         if (!response.ok) {
//             toast({
//                 title: "Error sending email",
//                 description: "An error occurred",
//                 variant: "destructive",
//             });
//             return;
//         }
//         const result: ResponseType<null> = await response.json();
//         if (!result.success) {
//             toast({
//                 title: "Error sending email",
//                 description: result.message,
//                 variant: "destructive",
//             });
//             return;
//         }
//         toast({
//             title: result.message,
//             variant: "success",
//         });
//         emailInputRef.current.value = "";
//         setIsCodeInputShown(true);
//     };

//     const verifyEmail = async () => {
//         if (!codeInputRef.current || countdown !== 0) {
//             return;
//         }
//         const code: string = codeInputRef.current.value;
//         // Send Email Verification
//         const result: ResponseType<null> = (
//             await axios.post("/api/auth/verify-email/" + code)
//         ).data as ResponseType<null>;

//         toast({
//             title: result.message,
//             variant: result.success ? "success" : "destructive",
//         });
//         if (result.success) {
//             codeInputRef.current.value = "";
//             setTimeout(() => {
//                 router.push("/");
//             }, 5000);
//         }
//     };

//     useEffect(() => {
//         if (countdown === 0) {
//             return;
//         }
//         const interval = setInterval(() => {
//             setCountdown((prev) => prev - 1);
//         }, 1000);
//         return () => clearInterval(interval);
//     }, [countdown]);

//     return (
//         <section className="flex justify-center items-center bg-gray-100 dark:bg-gray-950 px-4 py-12 w-full min-h-screen">
//             <div className="space-y-4 w-full max-w-md">
//                 <Card>
//                     <CardHeader className="space-y-1">
//                         <CardTitle className="font-bold text-2xl">
//                             Email Verification
//                         </CardTitle>
//                         <CardDescription>
//                             {isCodeInputShown
//                                 ? "Enter the code sent to your email"
//                                 : "Enter your email to receive a verification code"}
//                         </CardDescription>
//                     </CardHeader>
//                     {!isCodeInputShown && (
//                         <CardContent className="space-y-4">
//                             <div className="space-y-2">
//                                 <Label htmlFor="email">Email</Label>
//                                 <Input
//                                     id="email"
//                                     type="email"
//                                     placeholder="m@example.com"
//                                     required
//                                     ref={emailInputRef}
//                                 />
//                             </div>
//                             <Button
//                                 type="button"
//                                 className="w-full"
//                                 onClick={sendEmailVerification}
//                             >
//                                 Send Code
//                             </Button>
//                         </CardContent>
//                     )}
//                     {isCodeInputShown && (
//                         <CardContent className="space-y-4">
//                             <div className="space-y-2">
//                                 <Label htmlFor="code">Code</Label>
//                                 <Input
//                                     id="code"
//                                     type="text"
//                                     required
//                                     ref={emailInputRef}
//                                 />
//                             </div>
//                             <div className="space-y-2">
//                                 <div className="flex justify-between items-center">
//                                     <p>{countdown} s</p>
//                                     <Button
//                                         className="bg-gray-200 font-medium text-gray-500 text-sm hover:text-white dark:hover:text-gray-50 dark:text-gray-400 underline underline-offset-2"
//                                         disabled={countdown !== 0}
//                                         onClick={sendEmailVerification}
//                                     >
//                                         Resend Code
//                                     </Button>
//                                 </div>
//                             </div>

//                             <Button
//                                 type="button"
//                                 className="w-full"
//                                 onClick={verifyEmail}
//                             >
//                                 Verify
//                             </Button>
//                         </CardContent>
//                     )}
//                 </Card>
//             </div>
//         </section>
//     );
// }

export default function Page() {
    return <div></div>;
}
