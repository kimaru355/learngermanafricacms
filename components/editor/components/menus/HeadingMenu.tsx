import { Editor } from "@tiptap/react";
import { Button } from "../ui/Button";
import { Heading1, Heading2, Heading3, Text } from "lucide-react";

export const HeadingMenu: React.FC<{ editor: Editor }> = ({ editor }) => {
    const currentLevel = [1, 2, 3].find((level) =>
        editor.isActive("heading", { level })
    );

    return (
        <div className="group relative">
            <Button
                active={!!currentLevel}
                toolTip={
                    [1, 2, 3].includes(currentLevel || 0)
                        ? "Heading " + currentLevel
                        : "Paragraph"
                }
                className="gap-1"
            >
                {currentLevel ? (
                    <>
                        {currentLevel === 1 && <Heading1 className="w-4 h-4" />}
                        {currentLevel === 2 && <Heading2 className="w-4 h-4" />}
                        {currentLevel === 3 && <Heading3 className="w-4 h-4" />}
                    </>
                ) : (
                    <>
                        <Text className="w-4 h-4" />
                        <span>Paragraph</span>
                    </>
                )}
            </Button>

            <div className="group-hover:flex z-20 absolute flex-col gap-1 hidden bg-white shadow-md p-2 border rounded">
                <Button
                    onClick={() => editor.chain().focus().setParagraph().run()}
                    active={editor.isActive("paragraph")}
                    toolTip="Paragraph"
                >
                    <Text className="w-4 h-4" />
                    Paragraph
                </Button>
                <Button
                    onClick={() =>
                        editor.chain().focus().setHeading({ level: 1 }).run()
                    }
                    active={editor.isActive("heading", { level: 1 })}
                    toolTip="Heading 1"
                >
                    <Heading1 className="w-4 h-4" />
                </Button>
                <Button
                    onClick={() =>
                        editor.chain().focus().setHeading({ level: 2 }).run()
                    }
                    active={editor.isActive("heading", { level: 2 })}
                    toolTip="Heading 2"
                >
                    <Heading2 className="w-4 h-4" />
                </Button>
                <Button
                    onClick={() =>
                        editor.chain().focus().setHeading({ level: 3 }).run()
                    }
                    active={editor.isActive("heading", { level: 3 })}
                    toolTip="Heading 3"
                >
                    <Heading3 className="w-4 h-4" />
                </Button>
            </div>
        </div>
    );
};
