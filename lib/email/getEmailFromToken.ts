import jwt, { JwtPayload } from "jsonwebtoken";
import { ResponseType } from "../interfaces/ResponseType";

export const getEmailFromToken = (
    token: string
): ResponseType<{ email: string; code: string } | null> => {
    try {
        const decoded: JwtPayload | string | null = jwt.verify(
            token,
            process.env.NEXTAUTH_SECRET as string
        );
        if (
            !decoded ||
            typeof decoded === "string" ||
            !decoded.email ||
            !decoded.code
        ) {
            return {
                success: false,
                message: "Invalid token",
                data: null,
            };
        }
        return {
            success: true,
            message: "Token parsed successfully",
            data: {
                email: decoded.email,
                code: decoded.code,
            },
        };
    } catch {
        return {
            success: false,
            message: "Invalid token",
            data: null,
        };
    }
};
