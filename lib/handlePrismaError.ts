import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { ResponseType } from "@/lib/interfaces/ResponseType";
import { NextResponse } from "next/server";

export const handlePrismaError = <T>(
    error: PrismaClientKnownRequestError
): NextResponse<ResponseType<T | null>> => {
    if (error.message.includes("Unique constraint failed")) {
        return NextResponse.json({
            success: false,
            message: "A record with specified input already exists",
            data: null,
        });
    }
    return NextResponse.json({
        success: false,
        message: "An error occurred.",
        data: null,
    });
};
