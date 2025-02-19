import { ResponseType } from "@/lib/interfaces/ResponseType";
import AuthServices from "@/lib/interfaces/services/auth";

export default class AuthService implements AuthServices {
    async sendEmailVerification(email: string): Promise<ResponseType<null>> {
        try {
            const response = await fetch("/api/auth/send-email-verification", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email }),
            });
            if (!response.ok) {
                return {
                    success: false,
                    message: "An error occurred",
                    data: null,
                };
            }
            return await response.json();
        } catch {
            return {
                success: false,
                message: "An error occurred",
                data: null,
            };
        }
    }

    async verifyEmail(
        email: string,
        code: string
    ): Promise<ResponseType<null>> {
        try {
            const response = await fetch("/api/auth/verify-email", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, code }),
            });
            if (!response.ok) {
                return {
                    success: false,
                    message: "An error occurred",
                    data: null,
                };
            }
            return await response.json();
        } catch {
            return {
                success: false,
                message: "An error occurred",
                data: null,
            };
        }
    }

    async verifyEmailCode(code: string): Promise<ResponseType<null>> {
        try {
            const response = await fetch("/api/auth/verify-email/" + code);
            if (!response.ok) {
                return {
                    success: false,
                    message: "An error occurred",
                    data: null,
                };
            }
            return await response.json();
        } catch {
            return {
                success: false,
                message: "An error occurred",
                data: null,
            };
        }
    }
}
