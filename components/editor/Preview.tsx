export default function Preview({ content }: { content: string }) {
    return (
        <div>
            <h1 className="m-2 border-b border-b-slate-400 font-bold text-2xl lg:text-4xl">
                Live Preview
            </h1>
            <div className="border-slate-400 m-2 p-4 border">
                <div
                    className="max-w-full prose"
                    dangerouslySetInnerHTML={{ __html: content }}
                />
            </div>
        </div>
    );
}
