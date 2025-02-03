import SearchParamsFallback from "@/components/fallback/searchParamsFallback";
import ManageFilter from "@/components/manage/filter";
import ManageHero from "@/components/manage/hero";
import { Suspense } from "react";

export default function Dashboard({ children }: { children: React.ReactNode }) {
    return (
        <Suspense fallback={<SearchParamsFallback />}>
            <section className="bg-[#F1F0F3]">
                <ManageHero />
                <div className="flex lg:flex-row flex-col gap-4 md:gap-10 lg:space-x-4 mt-8 px-4 md:px-0">
                    <ManageFilter />
                    {children}
                </div>
            </section>
        </Suspense>
    );
}
