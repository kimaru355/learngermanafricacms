import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
    interface Session {
        user: UserType;
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id: string;
        email: string;
        isEmailVerified: boolean;
        providerUserId?: string;
        name: string;
        phoneNumber?: string;
        level: string;
        profileImageUrl?: string;
        role: string;
    }
}
