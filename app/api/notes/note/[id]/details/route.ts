import { NextResponse } from "next/server";
import { ResponseType } from "@/lib/interfaces/ResponseType";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { handlePrismaError } from "@/lib/handlePrismaError";
import prisma from "@/utils/prisma";
import { NoteTopicDb } from "@/lib/interfaces/noteTopic";

// GET: Retrieve a single note by ID
export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<ResponseType<NoteTopicDb | null>>> {
    try {
        const { id } = await params;
        const note: NoteTopicDb | null = await prisma.note.findUnique({
            where: { id: id },
            include: {
                topic: {
                    include: {
                        level: true,
                    },
                },
            },
        });
        if (!note) {
            return NextResponse.json(
                { success: false, message: "Note not found.", data: null },
                { status: 200 }
            );
        }

        const response: ResponseType<typeof note> = {
            success: true,
            message: "Note found.",
            data: note,
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
