import { Editor, useEditorState } from "@tiptap/react";
import { jxc } from "utilities";

export default function MenuBar({
    editor,
    isDisabled,
}: {
    editor: Editor;
    isDisabled: boolean;
}) {
    // read the current editor's state and re-render on change
    const editorState = useEditorState({
        editor,
        selector: (ctx) => {
            return {
                isBold: ctx.editor.isActive("bold") ?? false,
                canBold: ctx.editor.can().chain().toggleBold().run() ?? false,
                isItalic: ctx.editor.isActive("italic") ?? false,
                canItalic:
                    ctx.editor.can().chain().toggleItalic().run() ?? false,
                isStrike: ctx.editor.isActive("strike") ?? false,
                canStrike:
                    ctx.editor.can().chain().toggleStrike().run() ?? false,
                isCode: ctx.editor.isActive("code") ?? false,
                canCode: ctx.editor.can().chain().toggleCode().run() ?? false,
                canClearMarks:
                    ctx.editor.can().chain().unsetAllMarks().run() ?? false,
                isParagraph: ctx.editor.isActive("paragraph") ?? false,
                isHeading1:
                    ctx.editor.isActive("heading", { level: 1 }) ?? false,
                isHeading2:
                    ctx.editor.isActive("heading", { level: 2 }) ?? false,
                isHeading3:
                    ctx.editor.isActive("heading", { level: 3 }) ?? false,
                isHeading4:
                    ctx.editor.isActive("heading", { level: 4 }) ?? false,
                isHeading5:
                    ctx.editor.isActive("heading", { level: 5 }) ?? false,
                isHeading6:
                    ctx.editor.isActive("heading", { level: 6 }) ?? false,
                isBulletList: ctx.editor.isActive("bulletList") ?? false,
                isOrderedList: ctx.editor.isActive("orderedList") ?? false,
                isCodeBlock: ctx.editor.isActive("codeBlock") ?? false,
                isBlockquote: ctx.editor.isActive("blockquote") ?? false,
                canUndo: ctx.editor.can().chain().undo().run() ?? false,
                canRedo: ctx.editor.can().chain().redo().run() ?? false,
            };
        },
    });

    return (
        <div className="menuBar">
            <div className="buttonGroup">
                <button
                    onClick={() =>
                        editor.chain().focus().toggleHeading({ level: 1 }).run()
                    }
                    disabled={isDisabled}
                    className={jxc(
                        "squareButton",
                        editorState.isHeading1 && "active"
                    )}
                    title="Toggle heading 1"
                >
                    <span className="material-symbols-outlined symbol">
                        format_h1
                    </span>
                </button>
                <button
                    onClick={() =>
                        editor.chain().focus().toggleHeading({ level: 2 }).run()
                    }
                    disabled={isDisabled}
                    className={jxc(
                        "squareButton",
                        editorState.isHeading2 && "active"
                    )}
                    title="Toggle heading 2"
                >
                    <span className="material-symbols-outlined symbol">
                        format_h2
                    </span>
                </button>
                <button
                    onClick={() =>
                        editor.chain().focus().toggleHeading({ level: 3 }).run()
                    }
                    disabled={isDisabled}
                    className={jxc(
                        "squareButton",
                        editorState.isHeading3 && "active"
                    )}
                    title="Toggle heading 3"
                >
                    <span className="material-symbols-outlined symbol">
                        format_h3
                    </span>
                </button>
                <button
                    onClick={() =>
                        editor.chain().focus().toggleHeading({ level: 4 }).run()
                    }
                    disabled={isDisabled}
                    className={jxc(
                        "squareButton",
                        editorState.isHeading4 && "active"
                    )}
                    title="Toggle heading 4"
                >
                    <span className="material-symbols-outlined symbol">
                        format_h4
                    </span>
                </button>
                <button
                    onClick={() =>
                        editor.chain().focus().toggleHeading({ level: 5 }).run()
                    }
                    disabled={isDisabled}
                    className={jxc(
                        "squareButton",
                        editorState.isHeading5 && "active"
                    )}
                    title="Toggle heading 5"
                >
                    <span className="material-symbols-outlined symbol">
                        format_h5
                    </span>
                </button>
                <button
                    onClick={() =>
                        editor.chain().focus().toggleHeading({ level: 6 }).run()
                    }
                    disabled={isDisabled}
                    className={jxc(
                        "squareButton",
                        editorState.isHeading6 && "active"
                    )}
                    title="Toggle heading 6"
                >
                    <span className="material-symbols-outlined symbol">
                        format_h6
                    </span>
                </button>
            </div>

            <div className="buttonGroup">
                <button
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    disabled={isDisabled || !editorState.canBold}
                    className={jxc(
                        "squareButton",
                        editorState.isBold && "active"
                    )}
                    title="Toggle bold formatting"
                >
                    <span className="material-symbols-outlined symbol">
                        format_bold
                    </span>
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    disabled={isDisabled || !editorState.canItalic}
                    className={jxc(
                        "squareButton",
                        editorState.isItalic && "active"
                    )}
                    title="Toggle italic formatting"
                >
                    <span className="material-symbols-outlined symbol">
                        format_italic
                    </span>
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleStrike().run()}
                    disabled={isDisabled || !editorState.canStrike}
                    className={jxc(
                        "squareButton",
                        editorState.isStrike && "active"
                    )}
                    title="Toggle strikethrough formatting"
                >
                    <span className="material-symbols-outlined symbol">
                        format_strikethrough
                    </span>
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleCode().run()}
                    disabled={isDisabled || !editorState.canCode}
                    className={jxc(
                        "squareButton",
                        editorState.isCode && "active"
                    )}
                    title="Toggle inline code formatting"
                >
                    <span className="material-symbols-outlined symbol">
                        code
                    </span>
                </button>
                <button
                    onClick={() => editor.chain().focus().unsetAllMarks().run()}
                    disabled={isDisabled}
                    className={jxc("squareButton")}
                    title="Clear all text formatting (bold, italic, etc.)"
                >
                    <span className="material-symbols-outlined symbol">
                        format_clear
                    </span>
                </button>
                <button
                    onClick={() => editor.chain().focus().clearNodes().run()}
                    disabled={isDisabled}
                    className={jxc("squareButton")}
                    title="Clear all block formatting (headings, lists, etc.)"
                >
                    <span className="material-symbols-outlined symbol">
                        clear_all
                    </span>
                </button>
                <button
                    onClick={() => editor.chain().focus().setParagraph().run()}
                    disabled={isDisabled}
                    className={jxc(
                        "squareButton",
                        editorState.isParagraph && "active"
                    )}
                    title="Convert to paragraph"
                >
                    <span className="material-symbols-outlined symbol">
                        format_paragraph
                    </span>
                </button>
                <button
                    onClick={() =>
                        editor.chain().focus().toggleBulletList().run()
                    }
                    disabled={isDisabled}
                    className={jxc(
                        "squareButton",
                        editorState.isBulletList && "active"
                    )}
                    title="Toggle bullet point list"
                >
                    <span className="material-symbols-outlined symbol">
                        format_list_bulleted
                    </span>
                </button>
                <button
                    onClick={() =>
                        editor.chain().focus().toggleOrderedList().run()
                    }
                    disabled={isDisabled}
                    className={jxc(
                        "squareButton",
                        editorState.isOrderedList && "active"
                    )}
                    title="Toggle numbered list"
                >
                    <span className="material-symbols-outlined symbol">
                        format_list_numbered
                    </span>
                </button>
                <button
                    onClick={() =>
                        editor.chain().focus().toggleCodeBlock().run()
                    }
                    disabled={isDisabled}
                    className={jxc(
                        "squareButton",
                        editorState.isCodeBlock && "active"
                    )}
                    title="Toggle code block"
                >
                    <span className="material-symbols-outlined symbol">
                        code_blocks
                    </span>
                </button>
                <button
                    onClick={() =>
                        editor.chain().focus().toggleBlockquote().run()
                    }
                    disabled={isDisabled}
                    className={jxc(
                        "squareButton",
                        editorState.isBlockquote && "active"
                    )}
                    title="Toggle blockquote"
                >
                    <span className="material-symbols-outlined symbol">
                        format_quote
                    </span>
                </button>
                <button
                    onClick={() =>
                        editor.chain().focus().setHorizontalRule().run()
                    }
                    disabled={isDisabled}
                    className={jxc("squareButton")}
                    title="Insert horizontal rule (divider line)"
                >
                    <span className="material-symbols-outlined symbol">
                        horizontal_rule
                    </span>
                </button>
                <button
                    onClick={() => editor.chain().focus().setHardBreak().run()}
                    disabled={isDisabled}
                    className={jxc("squareButton")}
                    title="Insert line break"
                >
                    <span className="material-symbols-outlined symbol">
                        keyboard_return
                    </span>
                </button>
            </div>

            <div className="buttonGroup">
                <button
                    onClick={() => editor.chain().focus().undo().run()}
                    disabled={isDisabled || !editorState.canUndo}
                    className={jxc("squareButton")}
                    title="Undo last action"
                >
                    <span className="material-symbols-outlined symbol">
                        undo
                    </span>
                </button>

                <button
                    onClick={() => editor.chain().focus().redo().run()}
                    disabled={isDisabled || !editorState.canRedo}
                    className={jxc("squareButton")}
                    title="Redo last undone action"
                >
                    <span className="material-symbols-outlined symbol">
                        redo
                    </span>
                </button>
            </div>
        </div>
    );
}
