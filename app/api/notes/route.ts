import { NextResponse } from "next/server";
import { ResponseType } from "@/lib/interfaces/ResponseType";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { NoteDb } from "@/lib/interfaces/note";
import { handlePrismaError } from "@/lib/handlePrismaError";
import prisma from "@/utils/prisma";
import { NewNote } from "@/lib/interfaces/newNote";

// GET: Retrieve all notes
export async function GET(): Promise<
    NextResponse<ResponseType<NoteDb[] | null>>
> {
    try {
        const notes: NoteDb[] = await prisma.note.findMany();
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
        const note: NewNote = body;

        if (!note.content || !note.topicId || !note.number) {
            const response: ResponseType<null> = {
                success: false,
                message:
                    "Please provide all required fields: content, topicId and number.",
                data: null,
            };
            return NextResponse.json(response, { status: 200 });
        }

        const createdNote = await prisma.note.create({
            data: note,
        });

        const response = {
            success: true,
            message: "Note created successfully.",
            data: createdNote,
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
