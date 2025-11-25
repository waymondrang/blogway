import { jxc } from "utilities";

export default function ActionBar({
    isDisabled,
    onUpload,
    isSuccess,
    statusMessage,
    setStatusMessage,
}: {
    isDisabled: boolean;
    onUpload: () => Promise<void>;
    isSuccess: boolean;
    statusMessage: string;
    setStatusMessage: (message: string) => void;
}) {
    async function handleUploadButtonClick(e: React.MouseEvent) {
        await onUpload();
    }

    return (
        <div className="actionBar">
            <div className="buttonGroup">
                <button
                    disabled={isDisabled}
                    onClick={handleUploadButtonClick}
                    className={jxc("flexButton submit")}
                    title="Upload blog"
                >
                    <span>Upload</span>
                    <span className="material-symbols-outlined symbol">
                        upload
                    </span>
                </button>
            </div>

            {statusMessage && (
                <div className={jxc("status", isSuccess ? "success" : "error")}>
                    <div className="actions">
                        {isSuccess && (
                            <a
                                href="/"
                                className={jxc(
                                    "button squareButton",
                                    isSuccess ? "success" : "error"
                                )}
                            >
                                <span className="material-symbols-outlined symbol">
                                    home
                                </span>
                            </a>
                        )}

                        <button
                            onClick={() => setStatusMessage("")}
                            className={jxc(
                                "squareButton",
                                isSuccess ? "success" : "error"
                            )}
                        >
                            <span className="material-symbols-outlined symbol">
                                close
                            </span>
                        </button>
                    </div>

                    <div className="message">
                        <span>{statusMessage}</span>
                    </div>
                </div>
            )}
        </div>
    );
}
