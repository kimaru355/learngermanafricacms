import { NextResponse } from "next/server";
import prisma from "@/utils/prisma";
import { ResponseType } from "@/lib/interfaces/ResponseType";
import { sendEmailVerification } from "@/lib/email/sendEmailVerification";
import generateVerificationCode from "@/lib/email/generateVerification";

export async function PUT(
    req: Request
): Promise<NextResponse<ResponseType<null>>> {
    const body = await req.json();
    const { email } = body as { email: string };

    if (!email) {
        return NextResponse.json({
            success: false,
            message: "Email is required",
            data: null,
        });
    }

    // Find the user with the verification token
    const user = await prisma.user.findUnique({
        where: { email },
    });

    if (!user) {
        return NextResponse.json({
            success: false,
            message: "No user with provided email",
            data: null,
        });
    }

    if (user.isEmailVerified) {
        return NextResponse.json({
            success: false,
            message: "Email is already verified",
            data: null,
        });
    }

    const code = generateVerificationCode();
    const existingCode = await prisma.emailVerificationCode.findUnique({
        where: { userId: user.id },
    });
    if (existingCode) {
        await prisma.emailVerificationCode.update({
            where: { userId: user.id },
            data: { code },
        });
    } else {
        await prisma.emailVerificationCode.create({
            data: {
                code,
                userId: user.id,
            },
        });
    }

    const result: ResponseType<null> = await sendEmailVerification(email, code);
    return NextResponse.json(result);
}
