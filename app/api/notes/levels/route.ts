import { GermanLevel } from "@/lib/interfaces/germanLevel";
import { Level } from "@/lib/interfaces/levels";
import { NoteTopic } from "@/lib/interfaces/noteTopic";
import { ResponseType } from "@/lib/interfaces/ResponseType";
import { NextResponse } from "next/server";
import prisma from "@/utils/prisma";
import { Topic } from "@/lib/interfaces/topic";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { handlePrismaError } from "@/lib/handlePrismaError";

export async function PUT(
    req: Request
): Promise<NextResponse<ResponseType<NoteTopic[] | null>>> {
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
        const topics: Topic[] | null = await prisma.topic.findMany({
            where: { levelId: { in: levels.map((level) => level.id) } },
        });
        if (!topics) {
            const response: ResponseType<null> = {
                success: false,
                message: "Topics not found.",
                data: null,
            };
            return NextResponse.json(response, { status: 200 });
        }
        const notes = await prisma.note.findMany({
            where: {
                topicId: {
                    in: topics.map((topic) => topic.id),
                },
            },
            include: {
                topic: {
                    include: {
                        level: true,
                    },
                },
            },
        });
        const response: ResponseType<typeof notes> = {
            success: true,
            message: "Notes found.",
            data: notes,
        };
        return NextResponse.json(response);
    } catch (error: unknown) {
        if (error instanceof PrismaClientKnownRequestError) {
            return handlePrismaError(error);
        }
        return NextResponse.json({
            success: false,
            message: "An error occurred.",
            data: null,
        });
    }
}
