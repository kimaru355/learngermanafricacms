import { handlePrismaError } from "@/lib/handlePrismaError";
import { ResponseType } from "@/lib/interfaces/ResponseType";
import { User, UserRegister } from "@/lib/interfaces/user";
import prisma from "@/utils/prisma";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

export async function GET(): Promise<
    NextResponse<ResponseType<User[] | null>>
> {
    try {
        const users: User[] = await prisma.user.findMany({
            where: {
                role: {
                    not: "OWNER",
                },
                isDeleted: false,
            },
        });
        if (!users) {
            return NextResponse.json({
                success: false,
                message: "No users found.",
                data: null,
            });
        }
        return NextResponse.json({
            success: true,
            message: "Users found.",
            data: users,
        });
    } catch (error: unknown) {
        if (error instanceof PrismaClientKnownRequestError) {
            return handlePrismaError<User[]>(error);
        }
        return NextResponse.json({
            success: false,
            message: "An error occurred.",
            data: null,
        });
    }
}

export async function POST(
    req: Request
): Promise<NextResponse<ResponseType<null>>> {
    try {
        const body = await req.json();
        const userRegister: UserRegister = body;
        if (!userRegister || !userRegister.name || userRegister.name.split(" ").length !== 2 || !userRegister.email) {
            return NextResponse.json({
                success: false,
                message: "Invalid request. Both full name and email are required.",
                data: null,
            });
        }
        const existingUser = await prisma.user.findUnique({
            where: { email: userRegister.email },
        });
        if (existingUser && existingUser.isDeleted) {
            await prisma.user.update({
                where: { email: userRegister.email },
                data: { 
                    name: userRegister.name,
                    isDeleted: false },
            });
            return NextResponse.json({
                success: true,
                message: "User created successfully.",
                data: null,
            });
            
        } else if (existingUser) {
            return NextResponse.json({
                success: false,
                message: "User already exists.",
                data: null,
            });
        };
        const newUser = {
            email: userRegister.email,
            name: userRegister.name,
            password: bcrypt.hashSync(userRegister.email.split("@")[0], 10),
        };
        await prisma.user.create({
            data: newUser,
        });
        return NextResponse.json({
            success: true,
            message: "User created successfully.",
            data: null,
        });
    } catch (error: unknown) {
        if (error instanceof PrismaClientKnownRequestError) {
            return handlePrismaError<null>(error);
        }
        return NextResponse.json({
            success: false,
            message: "An error occurred.",
            data: null,
        });
    }
}
