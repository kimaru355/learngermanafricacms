import { handlePrismaError } from "@/lib/handlePrismaError";
import { GermanLevel } from "@/lib/interfaces/germanLevel";
import { Level } from "@/lib/interfaces/levels";
import { ResponseType } from "@/lib/interfaces/ResponseType";
import { Topic } from "@/lib/interfaces/topic";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { NextResponse } from "next/server";
import prisma from "@/utils/prisma";

export async function GET(
    req: Request,
    { params }: { params: Promise<{ level: GermanLevel }> }
): Promise<NextResponse<ResponseType<Topic[] | null>>> {
    try {
        const { level: germanLevel } = await params;
        if (!Object.values(GermanLevel).includes(germanLevel)) {
            const response: ResponseType<null> = {
                success: false,
                message: "Invalid level.",
                data: null,
            };
            return NextResponse.json(response, { status: 200 });
        }
        const level: Level | null = await prisma.level.findUnique({
            where: { name: germanLevel },
        });
        if (!level) {
            const response: ResponseType<null> = {
                success: false,
                message: "Level not found.",
                data: null,
            };
            return NextResponse.json(response, { status: 200 });
        }
        const topics: Topic[] = await prisma.topic.findMany({
            where: { levelId: level.id },
        });

        return NextResponse.json({
            success: true,
            message: "Topics found...",
            data: topics,
        });
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
