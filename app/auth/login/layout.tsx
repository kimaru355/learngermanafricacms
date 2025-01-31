import SearchParamsFallback from "@/components/fallback/searchParamsFallback";
import { Suspense } from "react";

export default function Layout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="bg-gray-100 w-full h-screen">
            <Suspense fallback={<SearchParamsFallback />}>{children}</Suspense>
        </div>
    );
}
