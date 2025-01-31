import { NextResponse } from "next/server";
import { ResponseType } from "@/lib/interfaces/ResponseType";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { Level } from "@/lib/interfaces/levels";
import { handlePrismaError } from "@/lib/handlePrismaError";
import prisma from "@/utils/prisma";

// GET: Retrieve all levels
export async function GET(): Promise<
    NextResponse<ResponseType<Level[] | null>>
> {
    try {
        const levels = await prisma.level.findMany();
        const response: ResponseType<typeof levels> = {
            success: true,
            message: "Levels found.",
            data: levels,
        };
        return NextResponse.json(response);
    } catch (error: unknown) {
        if (error instanceof PrismaClientKnownRequestError) {
            return handlePrismaError<Level[]>(error);
        } else {
            return NextResponse.json({
                success: false,
                message: "An error occurred.",
                data: null,
            });
        }
    }
}

// POST: Create a new level
export async function POST(
    req: Request
): Promise<NextResponse<ResponseType<null>>> {
    try {
        const body = await req.json();
        const { name, imageUrl, description } = body;

        await prisma.level.create({
            data: {
                name,
                imageUrl,
                description,
            },
        });

        const response: ResponseType<null> = {
            success: true,
            message: "Level created successfully.",
            data: null,
        };
        return NextResponse.json(response);
    } catch (error: unknown) {
        if (error instanceof PrismaClientKnownRequestError) {
            return handlePrismaError<null>(error);
        } else {
            return NextResponse.json({
                success: false,
                message: "An error occurred.",
                data: null,
            });
        }
    }
}
