import { handlePrismaError } from "@/lib/handlePrismaError";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { NextResponse } from "next/server";

import prisma from "@/utils/prisma";

// get a single note using topicId and number
export async function GET(
    req: Request,
    { params }: { params: Promise<{ topicId: string; number: string }> }
) {
    try {
        const { topicId, number } = await params;
        if (!number || !topicId || isNaN(parseInt(number))) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "Please provide all required fields: number, topicId.",
                },
                { status: 200 }
            );
        }

        const note = await prisma.note.findFirst({
            where: { topicId: topicId, number: +number },
        });

        return NextResponse.json({
            success: true,
            message: "Note found",
            data: note,
        });
    } catch (error: unknown) {
        if (error instanceof PrismaClientKnownRequestError) {
            return handlePrismaError(error);
        }
        return NextResponse.json({
            success: false,
            message: "An error occurred",
            data: null,
        });
    }
}
