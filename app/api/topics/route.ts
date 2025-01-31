import { NextResponse } from "next/server";
import { ResponseType } from "@/lib/interfaces/ResponseType";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { handlePrismaError } from "@/lib/handlePrismaError";
import prisma from "@/utils/prisma";

// GET: Retrieve all topics
export async function GET() {
    try {
        const topics = await prisma.topic.findMany();
        const response: ResponseType<typeof topics> = {
            success: true,
            message: "All Topics found.",
            data: topics,
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

// POST: Create a new topic
export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { name, description, imageUrl, levelId } = body;

        if (
            !name ||
            !description ||
            (!imageUrl && imageUrl != "") ||
            !levelId
        ) {
            const response: ResponseType<null> = {
                success: false,
                message:
                    "Please provide all required fields: name, description, imageUrl, levelId.",
                data: null,
            };
            return NextResponse.json(response, { status: 200 });
        }

        const newTopic = await prisma.topic.create({
            data: {
                name,
                description,
                imageUrl,
                levelId,
            },
        });

        const response: ResponseType<typeof newTopic> = {
            success: true,
            message: "Topic created successfully.",
            data: newTopic,
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
