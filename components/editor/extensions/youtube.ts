import { Node, mergeAttributes } from "@tiptap/core";

declare module "@tiptap/core" {
    interface Commands<ReturnType> {
        youtube: {
            /** Inserts a YouTube embed */
            setYouTube: (url: string) => ReturnType;
        };
    }
}

export const YouTube = Node.create({
    name: "youtube",
    group: "block",
    atom: true,

    addAttributes() {
        return {
            src: {
                default: null,
            },
        };
    },

    parseHTML() {
        return [
            {
                tag: "iframe",
                getAttrs: (node) => {
                    if (typeof node === "string") return false;
                    const src = node.getAttribute("src");
                    return src?.includes("youtube.com") || src?.includes("youtu.be")
                        ? { src }
                        : false;
                },
            },
        ];
    },

    renderHTML({ HTMLAttributes }) {
        return [
            "iframe",
            mergeAttributes(HTMLAttributes, {
                class: "w-full max-w-[40rem] mx-10 aspect-video",
                frameborder: "0",
                allow: "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture",
                allowfullscreen: "true",
            }),
        ];
    },

    addCommands() {
        return {
            setYouTube:
                (url: string) =>
                ({ chain }) => {
                    const videoId = getYouTubeVideoId(url);
                    if (!videoId) return false;

                    return chain()
                        .insertContent({
                            type: this.name,
                            attrs: {
                                src: `https://www.youtube.com/embed/${videoId}`,
                            },
                        })
                        .focus()
                        .run();
                },
        };
    },
});

// Helper function to extract YouTube Video ID
const getYouTubeVideoId = (url: string) => {
    const match = url.match(
        /(?:youtube\.com\/(?:[^\/]+\/[^\/]+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/ ]{11})/
    );
    return match ? match[1] : null;
};
