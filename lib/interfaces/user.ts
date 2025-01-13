import { GermanLevel, Role } from "@prisma/client";

export interface User {
    id: string;
    email: string;
    providerUserId: string | null;
    name: string;
    phoneNumber: string | null;
    level: GermanLevel;
    profileImageUrl: string | null;
    role: Role;
    createdAt: Date;
    updatedAt: Date;
}

export interface UserRegister {
    email: string;
    name: string;
}
export interface UserLogin {
    email: string;
    password: string;
}
