"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useState } from "react";
import MenuBar from "./components/MenuBar";
import ActionBar from "./components/ActionBar";
import MetadataBar from "./components/MetadataBar";
import { BlogHelper } from "../utility/BlogHelper";

const extensions = [StarterKit];

export default function editorPage() {
    const [isDisabled, setIsDisabled] = useState<boolean>(false);
    const [guestWriter, setGuestWriter] = useState<string>("");
    const [coWriters, setCoWriters] = useState<string>("");
    const [isSuccess, setIsSuccess] = useState<boolean>(false);
    const [statusMessage, setStatusMessage] = useState<string>("");

    const coWritersSet = new Set(
        coWriters
            .split(",")
            .map((writer) => writer.trim())
            .filter((writer) => writer !== "")
    );

    async function handleUpload() {
        try {
            // disable inputs
            setIsDisabled(true);
            setStatusMessage("");

            const response = await BlogHelper.uploadBlog(
                editor?.getHTML() || "",
                guestWriter,
                coWriters
            );

            if (response?.ok) {
                setIsSuccess(true);
                setStatusMessage(
                    `${response.status}: Post successfully uploaded!`
                );
            } else if (response) {
                try {
                    setIsSuccess(false);
                    const body = await response.json();
                    setStatusMessage(
                        `${response.status}: ${body.error || "Unknown server error occurred."}`
                    );
                } catch (error) {
                    console.error(error);
                    setStatusMessage(
                        `${response.status}: Unknown error occurred while trying to parse response from server.`
                    );
                }
            } else {
                setIsSuccess(false);
                setStatusMessage("Failed to connect to server.");
            }
        } catch (error) {
            setIsSuccess(false);
            console.error(error);
            setStatusMessage("An unexpected error occurred during upload.");
        } finally {
            // enable inputs
            setIsDisabled(false);
        }
    }

    const editor = useEditor({
        extensions,
        content: "<h1>Hello World</h1>",
        immediatelyRender: false,
    });

    if (editor == null) {
        return <p>Editor is loading...</p>;
    }

    return (
        <>
            {editor && (
                <div id="editorPage">
                    <h1 className="pageTitle">Editor</h1>
                    <MenuBar editor={editor} isDisabled={isDisabled} />

                    <MetadataBar
                        isDisabled={isDisabled}
                        guestWriter={guestWriter}
                        setGuestWriter={setGuestWriter}
                        coWriters={coWriters}
                        setCoWriters={setCoWriters}
                    />

                    <div className="post shadowContainer">
                        <div className="header">
                            <div className="section">
                                <div className="textContainer">
                                    <span
                                        className="date loading"
                                        data-tooltip-class="monospace"
                                        data-tooltip-content="Soon, hopefully"
                                    >
                                        Right now
                                    </span>
                                </div>
                            </div>

                            {guestWriter && (
                                <div className="section">
                                    <div className="textContainer">
                                        <span className="material-symbols-outlined symbol">
                                            ink_pen
                                        </span>
                                        <span>
                                            Guest written by{" "}
                                            <span className="guestWriter">
                                                {guestWriter}
                                            </span>
                                        </span>
                                    </div>
                                </div>
                            )}

                            {coWritersSet.size > 0 && (
                                <div className="section">
                                    <div className="textContainer">
                                        <span className="material-symbols-outlined symbol">
                                            ink_pen
                                        </span>
                                        <span>
                                            Co-written with{" "}
                                            {Array.from(coWritersSet).map(
                                                (writer, index, arr) => {
                                                    const writerSpan = (
                                                        <span
                                                            key={writer}
                                                            className="coWriter"
                                                        >
                                                            {writer}
                                                        </span>
                                                    );

                                                    if (arr.length === 1) {
                                                        return writerSpan;
                                                    }

                                                    if (
                                                        index ===
                                                        arr.length - 1
                                                    ) {
                                                        return (
                                                            <span key={writer}>
                                                                and {writerSpan}
                                                            </span>
                                                        );
                                                    }

                                                    if (
                                                        index ===
                                                        arr.length - 2
                                                    ) {
                                                        return (
                                                            <span key={writer}>
                                                                {
                                                                    writerSpan
                                                                }{" "}
                                                            </span>
                                                        );
                                                    }

                                                    return (
                                                        <span key={writer}>
                                                            {writerSpan},{" "}
                                                        </span>
                                                    );
                                                }
                                            )}
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="content">
                            <EditorContent
                                disabled={isDisabled}
                                editor={editor}
                                id="editor"
                            />
                        </div>
                    </div>

                    <ActionBar
                        isDisabled={isDisabled}
                        onUpload={handleUpload}
                        isSuccess={isSuccess}
                        statusMessage={statusMessage}
                        setStatusMessage={setStatusMessage}
                    />
                </div>
            )}
        </>
    );
}
