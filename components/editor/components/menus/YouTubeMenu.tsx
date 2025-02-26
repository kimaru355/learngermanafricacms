import { Editor } from "@tiptap/react";
import { Button } from "../ui/Button";
import { Youtube } from "lucide-react";

export const YouTubeMenu: React.FC<{ editor: Editor }> = ({ editor }) => {
    const handleInsertYouTube = () => {
        const url = prompt("Enter YouTube URL:");
        if (!url) return;

        editor.chain().focus().setYouTube(url).run();
    };

    return (
        <Button onClick={handleInsertYouTube} toolTip="Add YouTube">
            <Youtube stroke="red" />
        </Button>
    );
};
