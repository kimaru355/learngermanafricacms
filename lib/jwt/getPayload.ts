import { JwtPayloadType } from "../interfaces/jwtPayload";
import jwt, { JwtPayload } from "jsonwebtoken";
import { NextRequest } from "next/server";

export default function getPayload(req: NextRequest): JwtPayloadType | null {
    try {
        const cookie = req.cookies.get("auth_token");
        if (!cookie || !cookie.value) {
            return null;
        }
        const auth_token = cookie.value;
        const secret = process.env.NEXTAUTH_SECRET as string;
        const jwtPayload: JwtPayload | string = jwt.verify(auth_token, secret);
        if (
            typeof jwtPayload === "string" ||
            !jwtPayload.id ||
            !jwtPayload.name ||
            !jwtPayload.email ||
            !jwtPayload.role
        ) {
            return null;
        }
        const payload: JwtPayloadType = {
            id: jwtPayload.id,
            name: jwtPayload.name,
            email: jwtPayload.email,
            role: jwtPayload.role,
        };
        return payload;
    } catch {
        return null;
    }
}
