export default function MetadataBar({
    isDisabled,
    guestWriter,
    setGuestWriter,
    coWriters,
    setCoWriters,
}: {
    isDisabled: boolean;
    guestWriter: string;
    setGuestWriter: (writer: string) => void;
    coWriters: string;
    setCoWriters: (writers: string) => void;
}) {
    return (
        <div className="metadataBar">
            <div className="content">
                <div className="section">
                    <div className="labelContainer">
                        <label htmlFor="guestWriter">Guest writer</label>
                    </div>
                    <input
                        type="text"
                        name="guestWriter"
                        value={guestWriter}
                        onChange={(e) => setGuestWriter(e.target.value)}
                        disabled={isDisabled}
                    />
                </div>

                <div className="section">
                    <div className="labelContainer">
                        <label htmlFor="coWriters">Co-writers</label>{" "}
                        <span className="helper">(separated by comma)</span>
                    </div>
                    <input
                        type="text"
                        name="coWriters"
                        value={coWriters}
                        onChange={(e) => setCoWriters(e.target.value)}
                        disabled={isDisabled}
                    />
                </div>
            </div>
        </div>
    );
}
