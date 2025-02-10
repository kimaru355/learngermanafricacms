import { NoteTopicDb } from "@/lib/interfaces/noteTopic";
import { ResponseType } from "@/lib/interfaces/ResponseType";
import { NextResponse } from "next/server";
import prisma from "@/utils/prisma";
import { handlePrismaError } from "@/lib/handlePrismaError";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

export async function GET(): Promise<
    NextResponse<ResponseType<NoteTopicDb[] | null>>
> {
    try {
        const notes = await prisma.note.findMany({
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
