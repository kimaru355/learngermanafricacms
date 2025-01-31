import { NextResponse } from "next/server";
import prisma from "@/utils/prisma";
import { ResponseType } from "@/lib/interfaces/ResponseType";
import { sendEmailVerification } from "@/lib/email/sendEmailVerification";

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

    const result: ResponseType<null> = await sendEmailVerification(email);
    return NextResponse.json(result);
}
