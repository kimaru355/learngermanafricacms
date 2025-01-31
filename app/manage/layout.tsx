import ManageHero from "@/components/manage/hero";

export default function Dashboard({ children }: { children: React.ReactNode }) {
    return (
        <section className="lg:px-8">
            <ManageHero />
            {children}
        </section>
    );
}
