import { handlePrismaError } from "@/lib/handlePrismaError";
import { ResponseType } from "@/lib/interfaces/ResponseType";
import { TopicWithNotesCount } from "@/lib/interfaces/topicWithNotesCount";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { NextResponse } from "next/server";
import prisma from "@/utils/prisma";

export async function GET(): Promise<
    NextResponse<ResponseType<TopicWithNotesCount[] | null>>
> {
    try {
        const topics = await prisma.topic.findMany();
        const topicsWithNoteCount = await Promise.all(
            topics.map(async (topic) => {
                const noteCount = await prisma.note.count({
                    where: {
                        topicId: topic.id,
                    },
                });
                return {
                    topic,
                    noteCount,
                };
            })
        );
        const response: ResponseType<TopicWithNotesCount[]> = {
            success: true,
            message: "All Topics found.",
            data: topicsWithNoteCount,
        };
        return NextResponse.json(response);
    } catch (error: unknown) {
        if (error instanceof PrismaClientKnownRequestError) {
            return handlePrismaError(error);
        }
        return NextResponse.json({
            success: false,
            message: "An error occurred while registering user.",
            data: null,
        });
    }
}
