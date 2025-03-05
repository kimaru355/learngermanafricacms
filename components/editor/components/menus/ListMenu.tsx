import { Editor } from "@tiptap/react";
import { Button } from "../ui/Button";
import { List, ListOrdered, ListTree, ListEnd } from "lucide-react";

export const ListMenu: React.FC<{ editor: Editor }> = ({ editor }) => {
    return (
        <div className="flex gap-1">
            <Button
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                active={editor.isActive("bulletList")}
                toolTip="Unordered List"
            >
                <List className="w-4 h-4" />
            </Button>
            <Button
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                active={editor.isActive("orderedList")}
                toolTip="Ordered List"
            >
                <ListOrdered className="w-4 h-4" />
            </Button>
            <Button
                onClick={() =>
                    editor.chain().focus().sinkListItem("listItem").run()
                }
                disabled={!editor.can().sinkListItem("listItem")}
                toolTip="Nest list"
            >
                <ListTree className="w-4 h-4" />
            </Button>
            <Button
                onClick={() =>
                    editor.chain().focus().liftListItem("listItem").run()
                }
                disabled={!editor.can().liftListItem("listItem")}
                toolTip="Unnest list"
            >
                <ListEnd className="w-4 h-4" />
            </Button>
        </div>
    );
};
