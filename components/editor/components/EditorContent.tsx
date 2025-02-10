import { EditorContent } from "@tiptap/react";
import { Editor } from "@tiptap/react";

interface EditorContentProps {
    editor: Editor | null;
}

export const Content: React.FC<EditorContentProps> = ({ editor }) => {
    return (
        <div className="p-4 border border-t-0 rounded-b">
            <EditorContent editor={editor} />
        </div>
    );
};
