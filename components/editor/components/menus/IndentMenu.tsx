// IndentMenu.tsx
import { Editor } from "@tiptap/react";
import { IndentIncrease, IndentDecrease } from "lucide-react"; // or use any icons you prefer
import { Button } from "../ui/Button";

interface IndentMenuProps {
    editor: Editor;
}

export const IndentMenu: React.FC<IndentMenuProps> = ({ editor }) => {
    return (
        <>
            <Button
                toolTip="Indent"
                onClick={() => editor.chain().focus().indent().run()}
            >
                <IndentIncrease className="w-4 h-4" />
            </Button>
            <Button
                toolTip="Outdent"
                onClick={() => editor.chain().focus().outdent().run()}
            >
                <IndentDecrease className="w-4 h-4" />
            </Button>
        </>
    );
};
