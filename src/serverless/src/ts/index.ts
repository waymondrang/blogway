import { updateRelativeTimestamps } from "./relativeTimestamps";
import { enableHoverTooltip, initializeHoverTooltip } from "./tooltip";
import { initializeContentToggle } from "./contentToggle";

addEventListener("DOMContentLoaded", () => {
    initializeHoverTooltip();
    initializeContentToggle();

    updateRelativeTimestamps();
    enableHoverTooltip({ autoEnableForLinks: true });

    setInterval(() => {
        updateRelativeTimestamps();
    }, 500);
});
