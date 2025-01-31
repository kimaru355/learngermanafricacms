import { GermanLevel, Role } from "@prisma/client";
import { z } from "zod";

export const UserRegisterSchema = z.object({
    name: z.string(),
    email: z.string().email(),
});
export const UserLoginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
});

export const UserSchema = z.object({
    id: z.string(),
    email: z.string().email(),
    isEmailVerified: z.boolean(),
    providerUserId: z.string().optional(),
    name: z.string(),
    phoneNumber: z.string().optional(),
    level: z.enum(Object.values(GermanLevel) as [string, ...string[]]),
    profileImageUrl: z.string().optional(),
    role: z.enum(Object.values(Role) as [string, ...string[]]),
});

export type UserType = z.infer<typeof UserSchema>;
