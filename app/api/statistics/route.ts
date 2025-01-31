import { handlePrismaError } from "@/lib/handlePrismaError";
import { ResponseType } from "@/lib/interfaces/ResponseType";
import { Statistics } from "@/lib/interfaces/statistics";
import prisma from "@/utils/prisma";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { NextResponse } from "next/server";

export async function GET(): Promise<
    NextResponse<ResponseType<Statistics | null>>
> {
    try {
        const levelsCount = await prisma.level.count();
        const topicsCount = await prisma.topic.count();
        const notesCount = await prisma.note.count();
        const statistics: Statistics = {
            levelsCount,
            topicsCount,
            notesCount,
        };
        return NextResponse.json({
            success: true,
            message: "Statistics fetched successfully",
            data: statistics,
        });
    } catch (error: unknown) {
        if (error instanceof PrismaClientKnownRequestError) {
            return handlePrismaError<Statistics>(error);
        } else {
            return NextResponse.json({
                success: false,
                message: "An error occurred.",
                data: null,
            });
        }
    }
}
