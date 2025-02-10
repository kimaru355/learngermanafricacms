import { Editor } from "@tiptap/react";
import { Button } from "../ui/Button";
import {
    BoldIcon,
    ItalicIcon,
    StrikethroughIcon,
    UnderlineIcon,
} from "lucide-react";

export const FormattingMenu: React.FC<{ editor: Editor }> = ({ editor }) => {
    return (
        <>
            <Button
                onClick={() => editor.chain().focus().toggleBold().run()}
                active={editor.isActive("bold")}
                toolTip="Bold"
            >
                <BoldIcon />
            </Button>
            <Button
                onClick={() => editor.chain().focus().toggleItalic().run()}
                active={editor.isActive("italic")}
                toolTip="Italic"
            >
                <ItalicIcon />
            </Button>
            <Button
                onClick={() => editor.chain().focus().toggleStrike().run()}
                active={editor.isActive("strike")}
                toolTip="Strikethrough"
            >
                <StrikethroughIcon />
            </Button>
            <Button
                onClick={() => editor.chain().focus().toggleUnderline().run()}
                active={editor.isActive("underline")}
                toolTip="Underline"
            >
                <UnderlineIcon />
            </Button>
        </>
    );
};
