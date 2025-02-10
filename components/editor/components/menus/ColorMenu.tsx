// editor/components/menus/ColorMenu.tsx
import { Editor } from "@tiptap/react";
import { Button } from "../ui/Button";
import { PaintBucket } from "lucide-react";
import { cn } from "@/lib/utils"; // Assuming you have a utility class function

const COLORS = [
    "#000000",
    "#FFFFFF",
    "#FF0000",
    "#00FF00",
    "#0000FF",
    "#FFFF00",
    "#FF00FF",
];

export const ColorMenu: React.FC<{ editor: Editor }> = ({ editor }) => {
    const currentColor = editor.getAttributes("textStyle").color || "#000000";

    return (
        <div className="group relative">
            <Button active={!!currentColor} toolTip="color" className="gap-1">
                <PaintBucket className="w-4 h-4" />
                <div
                    className="border rounded w-3 h-3"
                    style={{ backgroundColor: currentColor }}
                />
            </Button>

            <div className="group-hover:flex z-20 absolute gap-1 hidden bg-white shadow-md p-2 border rounded">
                {COLORS.map((color) => (
                    <button
                        key={color}
                        onClick={() =>
                            editor.chain().focus().setColor(color).run()
                        }
                        className={cn(
                            "h-6 w-6 rounded border hover:scale-110 transition-transform",
                            currentColor === color ? "ring-2 ring-offset-1" : ""
                        )}
                        style={{ backgroundColor: color }}
                    />
                ))}
                <Button
                    toolTip="Default"
                    onClick={() => editor.chain().focus().unsetColor().run()}
                    className="px-2 h-6 text-xs"
                >
                    Default
                </Button>
            </div>
        </div>
    );
};
