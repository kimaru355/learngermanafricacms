import { NextResponse } from "next/server";
import prisma from "@/utils/prisma";
import { ResponseType } from "@/lib/interfaces/ResponseType";

export async function PUT(
    req: Request
): Promise<NextResponse<ResponseType<null>>> {
    try {
        const { email, code } = await req.json();
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
