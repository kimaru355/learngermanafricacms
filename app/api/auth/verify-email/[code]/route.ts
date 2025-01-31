import { NextResponse } from "next/server";
import prisma from "@/utils/prisma";
import { ResponseType } from "@/lib/interfaces/ResponseType";
import jwt from "jsonwebtoken";

export async function PUT(
    req: Request,
    { params }: { params: Promise<{ code: string }> }
): Promise<NextResponse<ResponseType<null>>> {
    const { code } = await params;
    if (!code) {
        return NextResponse.json(
            {
                success: false,
                message: "Code is required",
                data: null,
            },
            { status: 400 }
        );
    }

    const secret = process.env.NEXTAUTH_SECRET as string;
    try {
        const jwtPayload = jwt.verify(code, secret);
        if (typeof jwtPayload === "string" || !jwtPayload.email) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Invalid or expired code",
                    data: null,
                },
                { status: 400 }
            );
        }
        const { email } = jwtPayload;

        // Find the user with the verification token
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            return NextResponse.json(
                { success: false, message: "Invalid email", data: null },
                { status: 400 }
            );
        }

        // Mark the email as verified
        await prisma.user.update({
            where: { id: user.id },
            data: {
                isEmailVerified: true,
                emailVerified: new Date(),
            },
        });

        return NextResponse.json({
            success: true,
            message: "Email verified successfully",
            data: null,
        });
    } catch {
        return NextResponse.json(
            {
                success: false,
                message: "Invalid or expired code",
                data: null,
            },
            { status: 400 }
        );
    }
}
