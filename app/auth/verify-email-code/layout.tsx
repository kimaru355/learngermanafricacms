import SearchParamsFallback from "@/components/fallback/searchParamsFallback";
import { Suspense } from "react";

export default function Dashboard({ children }: { children: React.ReactNode }) {
    return <Suspense fallback={<SearchParamsFallback />}>{children}</Suspense>;
}
