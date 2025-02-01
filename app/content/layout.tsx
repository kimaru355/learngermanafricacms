// import ManageFilter from "@/components/content/filter";
import ManageHero from "@/components/content/hero";

export default function Dashboard({ children }: { children: React.ReactNode }) {
    return (
        <section className="lg:px-8 pt-20 md:pt-24">
            <ManageHero />
            <div className="flex lg:flex-row flex-col lg:space-x-4">
                {/* <ManageFilter /> */}
                {children}
            </div>
        </section>
    );
}
