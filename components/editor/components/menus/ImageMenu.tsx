import { Editor } from "@tiptap/react";
import { Button } from "../ui/Button";
import { Image as ImageIcon } from "lucide-react";
import { CldUploadWidget } from "next-cloudinary";

interface ImageMenuProps {
    editor: Editor;
}

export const ImageMenu: React.FC<ImageMenuProps> = ({ editor }) => {
    const handleImageUpload = (url: string) => {
        if (url) {
            editor.chain().focus().setImage({ src: url }).run();
        }
    };

    return (
        <div className="flex gap-1">
            <CldUploadWidget
                uploadPreset="learn_german_africa_unsigned"
                options={{
                    sources: ["local"],
                    resourceType: "image",
                    maxFiles: 1,
                }}
                onSuccess={(result) => {
                    if (
                        !result.info ||
                        typeof result.info === "string" ||
                        !result.info.secure_url
                    ) {
                        return;
                    }
                    handleImageUpload(result.info.secure_url);
                }}
            >
                {({ open }) => {
                    return (
                        <Button
                            onClick={() => open()}
                            toolTip="Upload Image"
                            active={editor.isActive("image")}
                        >
                            <ImageIcon className="w-4 h-4" />
                        </Button>
                    );
                }}
            </CldUploadWidget>
        </div>
    );
};
