import { Editor } from "@tiptap/react";
import { FormattingMenu } from "./menus/FormattingMenu";
import { ColorMenu } from "./menus/ColorMenu";
import { AlignmentMenu } from "./menus/AlignmentMenu";
import { HeadingMenu } from "./menus/HeadingMenu";
import { ListMenu } from "./menus/ListMenu";
import { ImportWordMenu } from "./menus/ImportWordMenu";
import { ImageMenu } from "./menus/ImageMenu";

interface MenuBarProps {
    editor: Editor | null;
}

export const MenuBar: React.FC<MenuBarProps> = ({ editor }) => {
    if (!editor) return null;

    return (
        <div className="flex flex-wrap gap-1 p-2 border rounded-t">
            <FormattingMenu editor={editor} />
            <div className="bg-gray-200 mx-2 w-px h-6" /> {/* Separator */}
            <HeadingMenu editor={editor} />
            <div className="bg-gray-200 mx-2 w-px h-6" /> {/* Separator */}
            <ListMenu editor={editor} />
            <div className="bg-gray-200 mx-2 w-px h-6" /> {/* Separator */}
            <ColorMenu editor={editor} />
            <div className="bg-gray-200 mx-2 w-px h-6" /> {/* Separator */}
            <AlignmentMenu editor={editor} />
            <div className="bg-gray-200 mx-2 w-px h-6" /> {/* Separator */}
            <ImageMenu editor={editor} />
            <div className="bg-gray-200 mx-2 w-px h-6" /> {/* Separator */}
            <ImportWordMenu editor={editor} />
        </div>
    );
};
