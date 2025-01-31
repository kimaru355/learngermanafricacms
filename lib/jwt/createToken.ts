import { JwtPayloadType } from "../interfaces/jwtPayload";
import jwt from "jsonwebtoken";

export default function createToken(payload: JwtPayloadType): string {
    const secret = process.env.NEXTAUTH_SECRET as string;
    const token = jwt.sign(payload, secret, { expiresIn: "7d" });
    return token;
}
