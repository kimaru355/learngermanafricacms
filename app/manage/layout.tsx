// import ManageFilter from "@/components/manage/filter";
import ManageHero from "@/components/manage/hero";

export default function Dashboard({ children }: { children: React.ReactNode }) {
    return (
        <section className="lg:px-8">
            <ManageHero />
            <div className="flex lg:flex-row flex-col lg:space-x-4">
                {/* <ManageFilter /> */}
                {children}
            </div>
        </section>
    );
}
