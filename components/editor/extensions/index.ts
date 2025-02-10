import Color from "@tiptap/extension-color";
import TextAlign from "@tiptap/extension-text-align";
import TextStyle from "@tiptap/extension-text-style";
import Underline from "@tiptap/extension-underline";
import { StarterKit } from "@tiptap/starter-kit";
import Heading from "@tiptap/extension-heading";
import Image from "@tiptap/extension-image";

export const extensions = [
    StarterKit.configure({
        heading: false,
        bulletList: {
            HTMLAttributes: {
                class: "list-disc pl-4",
            },
        },
        orderedList: {
            HTMLAttributes: {
                class: "list-decimal pl-4",
            },
        },
    }),
    Underline,
    TextStyle,
    Color,
    Image,
    TextAlign.configure({
        types: ["heading", "paragraph"],
    }),
    Heading.configure({
        levels: [1, 2, 3],
    }).extend({
        addAttributes() {
            return {
                level: {
                    default: 1,
                },
                class: {
                    default: null,
                    parseHTML: (element) => element.getAttribute("class"),
                    renderHTML: (attributes) => {
                        // Ensure level is treated as 1 | 2 | 3
                        const level = attributes.level as 1 | 2 | 3;
                        const classes: Record<1 | 2 | 3, string> = {
                            1: "text-2xl lg:text-4xl font-bold",
                            2: "text-xl lg:text-3xl font-bold",
                            3: "text-lg lg:text-2xl font-semibold",
                        };

                        return {
                            class: classes[level] || "",
                        };
                    },
                },
            };
        },
    }),
];
