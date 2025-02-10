// editor/components/menus/AlignmentMenu.tsx
import { Editor } from "@tiptap/react";
import { Button } from "../ui/Button";
import { AlignLeft, AlignCenter, AlignRight, AlignJustify } from "lucide-react";

const ALIGNMENTS = [
    { value: "left", icon: <AlignLeft className="w-4 h-4" /> },
    { value: "center", icon: <AlignCenter className="w-4 h-4" /> },
    { value: "right", icon: <AlignRight className="w-4 h-4" /> },
    { value: "justify", icon: <AlignJustify className="w-4 h-4" /> },
];

export const AlignmentMenu: React.FC<{ editor: Editor }> = ({ editor }) => {
    return (
        <>
            {ALIGNMENTS.map((align) => (
                <Button
                    key={align.value}
                    toolTip={"Align " + align.value}
                    onClick={() =>
                        editor.chain().focus().setTextAlign(align.value).run()
                    }
                    active={editor.isActive({ textAlign: align.value })}
                >
                    {align.icon}
                </Button>
            ))}
        </>
    );
};
