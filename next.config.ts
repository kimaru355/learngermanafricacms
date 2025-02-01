import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    /* config options here */
    async redirects() {
        return [
            {
                source: "/content",
                destination: "/content/levels",
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
