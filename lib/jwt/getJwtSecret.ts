export const getJwtSecretKey = (): string => {
    const secret = process.env.NEXTAUTH_SECRET as string;
    return secret;
};
