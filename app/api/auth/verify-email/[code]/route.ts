import { NextResponse } from "next/server";
import prisma from "@/utils/prisma";
import { ResponseType } from "@/lib/interfaces/ResponseType";
import { getEmailFromToken } from "@/lib/email/getEmailFromToken";

export async function GET(
    req: Request,
    { params }: { params: Promise<{ code: string }> }
): Promise<NextResponse<ResponseType<null>>> {
    try {
        const { code: verificationCode } = await params;
        const result = getEmailFromToken(verificationCode);
        if (!result.success || !result.data) {
            return NextResponse.json({
                success: false,
                message: result.message,
                data: null,
            });
        }
        const { email, code } = result.data;
        if (!email || !code) {
            return NextResponse.json({
                success: false,
                message: "Email and Code are required",
                data: null,
            });
        }
        const user = await prisma.user.findUnique({
            where: { email },
        });
        if (!user) {
            return NextResponse.json({
                success: false,
                message: "Invalid email",
                data: null,
            });
        }
        if (user.isEmailVerified) {
            return NextResponse.json({
                success: false,
                message: "Email already verified",
                data: null,
            });
        }
        const emailVerificationCode =
            await prisma.emailVerificationCode.findUnique({
                where: { userId: user.id },
            });
        if (
            !emailVerificationCode ||
            emailVerificationCode.code !== code ||
            emailVerificationCode.updatedAt <
                new Date(Date.now() - 1000 * 60 * 60 * 24)
        ) {
            return NextResponse.json({
                success: false,
                message: "Invalid or expired code",
                data: null,
            });
        }
        await prisma.user.update({
            where: { id: user.id },
            data: {
                isEmailVerified: true,
                emailVerified: new Date(),
            },
        });
        await prisma.emailVerificationCode.delete({
            where: { userId: user.id },
        });

        return NextResponse.json({
            success: true,
            message: "Email verified successfully",
            data: null,
        });
    } catch {
        return NextResponse.json({
            success: false,
            message: "Invalid or expired code",
            data: null,
        });
    }
}
