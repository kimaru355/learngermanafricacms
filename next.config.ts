import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    /* config options here */
    async redirects() {
        return [
            {
                source: "/manage",
                destination: "/manage/levels",
                permanent: true,
            },
        ];
    },

    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "**",
            },
        ],
    },
};

export default nextConfig;
