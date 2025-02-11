// Indent.ts
import { Extension } from "@tiptap/core";

declare module "@tiptap/core" {
    interface Commands<ReturnType> {
        indent: {
            /** Increases the indent level */
            indent: () => ReturnType;
            /** Decreases the indent level */
            outdent: () => ReturnType;
        };
    }
}

export const Indent = Extension.create({
    name: "indent",

    addOptions() {
        return {
            indentValue: 1, // Margin increment per indent level in em
            // maxIndent: 5, // Optional maximum indent level
        };
    },

    addGlobalAttributes() {
        return [
            {
                types: ["paragraph", "heading"],
                attributes: {
                    indent: {
                        default: 0,
                        parseHTML: (element) => {
                            const style = element.getAttribute("style");
                            if (style) {
                                const match = style.match(
                                    /margin-left:\s*([\d.]+)em/
                                );
                                if (match) {
                                    const value = parseFloat(match[1]);
                                    return Math.floor(
                                        value / this.options.indentValue
                                    );
                                }
                            }
                            return 0;
                        },
                        renderHTML: (attributes) => {
                            if (attributes.indent && attributes.indent > 0) {
                                return {
                                    style: `margin-left: ${
                                        attributes.indent *
                                        this.options.indentValue
                                    }em;`,
                                };
                            }
                            return {};
                        },
                    },
                },
            },
        ];
    },

    addCommands() {
        return {
            indent:
                () =>
                ({ state, dispatch }) => {
                    const { from, to } = state.selection;
                    let updated = false;
                    state.doc.nodesBetween(from, to, (node, pos) => {
                        if (["paragraph", "heading"].includes(node.type.name)) {
                            const currentIndent = node.attrs.indent || 0;
                            // if (currentIndent >= this.options.maxIndent) return;
                            const newIndent = currentIndent + 1;
                            if (dispatch) {
                                dispatch(
                                    state.tr.setNodeMarkup(pos, undefined, {
                                        ...node.attrs,
                                        indent: newIndent,
                                    })
                                );
                            }
                            updated = true;
                        }
                    });
                    return updated;
                },
            outdent:
                () =>
                ({ state, dispatch }) => {
                    const { from, to } = state.selection;
                    let updated = false;
                    state.doc.nodesBetween(from, to, (node, pos) => {
                        if (["paragraph", "heading"].includes(node.type.name)) {
                            const currentIndent = node.attrs.indent || 0;
                            const newIndent = Math.max(currentIndent - 1, 0);
                            if (dispatch) {
                                dispatch(
                                    state.tr.setNodeMarkup(pos, undefined, {
                                        ...node.attrs,
                                        indent: newIndent,
                                    })
                                );
                            }
                            updated = true;
                        }
                    });
                    return updated;
                },
        };
    },
});
