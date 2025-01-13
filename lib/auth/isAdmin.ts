import jwt from "jsonwebtoken";
import dotenv from "dotenv";

export function isAdmin(token: string | null): boolean {
    dotenv.config();
    try {
        if (!token) {
            return false;
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
        if (decoded && typeof decoded !== "string" && decoded.role) {
            return decoded.role === "ADMIN";
        } else {
            return false;
        }
    } catch {
        return false;
    }
}
