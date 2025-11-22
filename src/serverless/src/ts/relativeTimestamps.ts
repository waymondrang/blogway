function generateAbsoluteDateString(timestamp: string): string {
    const date = new Date(timestamp);
    const absoluteDateString = `${date.toLocaleDateString()} ${date.getHours()}:${date.getMinutes().toString().padStart(2, "0")}`;

    return absoluteDateString;
}

/**
 * converts a iso datestring to local relative datestring
 * @param {string} timestamp
 */
function generateRelativeDateString(timestamp: string): string {
    const previousDate = new Date(timestamp);
    const elapsedTime = new Date().getTime() - previousDate.getTime();

    const seconds = Math.floor(elapsedTime / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    let relativeDateString: string;

    // only display relative datestring for same-day posts
    if (days == 0) {
        if (hours == 0) {
            if (minutes == 0) {
                // return seconds
                if (seconds < 10) {
                    relativeDateString = "Just now";
                } else {
                    relativeDateString = `${Math.floor(seconds / 10) * 10} second${seconds > 1 ? "s" : ""} ago`;
                }
            } else {
                relativeDateString = `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
            }
        } else {
            relativeDateString = `${hours} hour${hours > 1 ? "s" : ""} ago`;
        }
    }

    return relativeDateString;
}

/**
 * queries all elements with the data-timestamp attribute
 * and generates a local relative datestring
 */
function updateRelativeTimestamps() {
    const elements = document.querySelectorAll("[data-timestamp]");

    elements.forEach((e) => {
        const timestamp = e.getAttribute("data-timestamp");
        e.classList.remove("loading");

        const relativeDateString = generateRelativeDateString(timestamp);
        const absoluteDateString = generateAbsoluteDateString(timestamp);

        e.innerHTML = relativeDateString || absoluteDateString;

        // enable hover tooltip on relative date strings
        if (relativeDateString) {
            e.setAttribute("data-tooltip-content", absoluteDateString);
        } else {
            // don't show title when data-tooltip is shown
            e.setAttribute("title", absoluteDateString);
        }
    });
}

export { updateRelativeTimestamps };
