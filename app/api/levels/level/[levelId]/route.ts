import { handlePrismaError } from "@/lib/handlePrismaError";
import { Level } from "@/lib/interfaces/levels";
import { ResponseType } from "@/lib/interfaces/ResponseType";
import prisma from "@/utils/prisma";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { NextResponse } from "next/server";

// GET: Get a level by name
export async function GET(
    req: Request,
    { params }: { params: Promise<{ levelId: string }> }
): Promise<NextResponse<ResponseType<Level | null>>> {
    try {
        const { levelId } = await params;
        const level = await prisma.level.findUnique({
            where: { id: levelId },
        });

        if (!level) {
            const response: ResponseType<null> = {
                success: false,
                message: "Level not found.",
                data: null,
            };
            return NextResponse.json(response, { status: 200 });
        }

        const response: ResponseType<Level> = {
            success: true,
            message: "Level found.",
            data: level,
        };
        return NextResponse.json(response);
    } catch (error: unknown) {
        if (error instanceof PrismaClientKnownRequestError) {
            return handlePrismaError(error);
        } else {
            return NextResponse.json({
                success: false,
                message: "An error occurred.",
                data: null,
            });
        }
    }
}
