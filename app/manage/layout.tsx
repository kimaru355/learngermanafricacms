import Content from "@/components/manage/content";

export default function Dashboard({ children }: { children: React.ReactNode }) {
    return (
        <section className="lg:px-8">
            <Content />
            {children}
        </section>
    );
}
