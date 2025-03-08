export default function Preview({ content }: { content: string }) {
    return (
        <div className="w-full">
            <h1 className="m-2 my-6 lg:my-12 border-b border-b-slate-400 font-bold text-2xl lg:text-4xl">
                Live Preview
            </h1>
            <div className="m-2 p-4 border border-slate-400">
                <div
                    className="max-w-full prose"
                    dangerouslySetInnerHTML={{ __html: content }}
                />
            </div>
        </div>
    );
}
