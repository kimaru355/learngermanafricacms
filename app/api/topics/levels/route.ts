import { handlePrismaError } from "@/lib/handlePrismaError";
import { GermanLevel } from "@/lib/interfaces/germanLevel";
import { Level } from "@/lib/interfaces/levels";
import { ResponseType } from "@/lib/interfaces/ResponseType";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { NextResponse } from "next/server";
import prisma from "@/utils/prisma";
import { TopicLevel } from "@/lib/interfaces/topicLevel";

export async function PUT(
    req: Request
): Promise<NextResponse<ResponseType<TopicLevel[] | null>>> {
    try {
        const { levelNames } = (await req.json()) as {
            levelNames: GermanLevel[];
        };
        let areLevelNamesValid = true;
        levelNames.map((levelName) => {
            if (!Object.values(GermanLevel).includes(levelName)) {
                areLevelNamesValid = false;
            }
        });
        if (!areLevelNamesValid) {
            const response: ResponseType<null> = {
                success: false,
                message: "Invalid levels.",
                data: null,
            };
            return NextResponse.json(response, { status: 200 });
        }
        const levels: Level[] | null = await prisma.level.findMany({
            where: { name: { in: levelNames } },
        });
        if (!levels) {
            const response: ResponseType<null> = {
                success: false,
                message: "Levels not found.",
                data: null,
            };
            return NextResponse.json(response, { status: 200 });
        }
        const topics: TopicLevel[] = await prisma.topic.findMany({
            where: { levelId: { in: levels.map((level) => level.id) } },
            include: {
                level: true,
            },
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
            console.error(error);
            return NextResponse.json({
                success: false,
                message: "An error occurred.",
                data: null,
            });
        }
    }
}
