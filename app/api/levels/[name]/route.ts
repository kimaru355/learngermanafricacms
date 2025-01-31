import { ResponseType } from "@/lib/interfaces/ResponseType";
import { GermanLevel } from "@prisma/client";
import { NextResponse } from "next/server";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { Level } from "@/lib/interfaces/levels";
import { handlePrismaError } from "@/lib/handlePrismaError";

import prisma from "@/utils/prisma";

// GET: Get a level by name
export async function GET(
    req: Request,
    { params }: { params: Promise<{ name: GermanLevel }> }
): Promise<NextResponse<ResponseType<Level | null>>> {
    try {
        const { name } = await params;
        const level = await prisma.level.findUnique({
            where: { name: name },
        });

        if (!level) {
            const response: ResponseType<null> = {
                success: false,
                message: "Level not found.",
                data: null,
            };
            return NextResponse.json(response, { status: 200 });
        }

        const response: ResponseType<Level> = {
            success: true,
            message: "Level found.",
            data: level,
        };
        return NextResponse.json(response);
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

// PUT: Update an existing level
export async function PUT(
    req: Request,
    { params }: { params: Promise<{ name: GermanLevel }> }
) {
    try {
        const { name } = await params;
        const body = await req.json();
        const { newName, imageUrl, description } = body;

        if (!newName || !imageUrl || !description) {
            const response: ResponseType<null> = {
                success: false,
                message:
                    "Please provide all required fields: name, imageUrl, description.",
                data: null,
            };
            return NextResponse.json(response, { status: 200 });
        }

        const updatedLevel = await prisma.level.update({
            where: { name: name },
            data: {
                name: newName,
                imageUrl,
                description,
            },
        });

        const response: ResponseType<typeof updatedLevel> = {
            success: true,
            message: "Level updated successfully.",
            data: updatedLevel,
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
