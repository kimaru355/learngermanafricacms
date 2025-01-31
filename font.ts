import { Montserrat } from "next/font/google";

export const montserrat = Montserrat({
    subsets: ["latin"],
    variable: "--font-montserrat",
    // Optional configurations:
    weight: ["400", "500", "700"], // Specify needed weights
    display: "swap", // Better performance
});
