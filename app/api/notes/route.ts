import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { ResponseType } from "@/lib/interfaces/ResponseType";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { Note } from "@/lib/interfaces/note";
import { handlePrismaError } from "@/lib/handlePrismaError";

const prisma = new PrismaClient();

// GET: Retrieve all notes
export async function GET(): Promise<
    NextResponse<ResponseType<Note[] | null>>
> {
    try {
        const notes = await prisma.note.findMany();
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

// POST: Create a new note
export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { markdown, topicId } = body;

        if (!markdown || !topicId) {
            const response: ResponseType<null> = {
                success: false,
                message:
                    "Please provide all required fields: markdown, topicId.",
                data: null,
            };
            return NextResponse.json(response, { status: 200 });
        }

        const totalNotes = await prisma.note.count({
            where: {
                topicId,
            },
        });

        const newNote = await prisma.note.create({
            data: {
                markdown,
                number: totalNotes + 1,
                topicId,
            },
        });

        const response: ResponseType<typeof newNote> = {
            success: true,
            message: "Note created successfully.",
            data: newNote,
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
