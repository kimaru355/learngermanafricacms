// components/menus/ImportWordMenu.tsx
"use client";

import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { convertToHtml } from "mammoth";
import { Editor } from "@tiptap/react";
import { Button } from "../ui/Button";
import Image from "next/image";

export const ImportWordMenu: React.FC<{ editor: Editor }> = ({ editor }) => {
    const onDrop = useCallback(
        async (acceptedFiles: File[]) => {
            const file = acceptedFiles[0];
            if (!file) return;

            try {
                const arrayBuffer = await file.arrayBuffer();
                const result = await convertToHtml({ arrayBuffer });
                editor.commands.setContent(result.value);
            } catch (error) {
                console.error("Error converting DOCX:", error);
                alert("Error converting DOCX file. Please check the format.");
            }
        },
        [editor]
    );

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: {
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
                [".docx"],
        },
        multiple: false,
    });

    return (
        <div {...getRootProps()} className="list-none">
            <input {...getInputProps()} />
            <Button
                toolTip="Import Word Document"
                className="hover:bg-gray-100"
            >
                <Image
                    src="/icons/microsoft-word-icon.svg"
                    alt="Word"
                    width={24}
                    height={24}
                    className="w-4 h-4"
                />
            </Button>
        </div>
    );
};
