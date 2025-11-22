interface EnableHoverTooltipOptions {
    autoEnableForLinks: boolean;
}

const defaultOptions: EnableHoverTooltipOptions = {
    autoEnableForLinks: false,
};

function enableHoverTooltip(options?: EnableHoverTooltipOptions) {
    const tooltip = document.getElementById("hoverTooltip") as HTMLElement;

    if (!tooltip) {
        console.error("hover tooltip element not found");
        return;
    }

    // process options (note defaultOptions must be before options)
    const { autoEnableForLinks } = { ...defaultOptions, ...options };

    let targetElement: HTMLElement | null = null;
    let isTouching: boolean = false;

    function isExternalLink(url: string): boolean {
        try {
            const linkUrl = new URL(url, window.location.origin);
            return linkUrl.origin !== window.location.origin;
        } catch {
            return false;
        }
    }

    function setTooltipText(target: HTMLElement | null) {
        if (!target) {
            console.warn("trying to set tooltip text using undefined target");
            return;
        }

        let innerHTML = "";

        // Check if target is an anchor element
        if (target.tagName === "A") {
            const href = target.getAttribute("href");
            if (!href) return;

            const isExternal = isExternalLink(href);
            const targetBlank = target.getAttribute("target") === "_blank";

            innerHTML = `<div class="content">
                <span>${href}</span>
                ${
                    isExternal || targetBlank
                        ? `<span class="material-symbols-outlined symbol">arrow_outward</span>`
                        : ""
                }
            </div>`;
        } else {
            // Use data-tooltip attribute for non-anchor elements
            const tooltipContent = target.getAttribute("data-tooltip-content");
            const tooltipClass = target.getAttribute("data-tooltip-class");
            const tooltipRawContent = target.getAttribute(
                "data-tooltip-content-raw"
            );

            if (tooltipContent) {
                innerHTML = `<div class="content ${tooltipClass}">
                    <span>${tooltipContent}</span>
                </div>`;
            } else if (tooltipRawContent) {
                innerHTML = `<div class="content raw ${tooltipClass}">${tooltipRawContent}</div>`;
            }
        }

        tooltip.innerHTML = innerHTML;
    }

    function showTooltip(target: HTMLElement, event: MouseEvent | Touch): void {
        setTooltipText(target);
        tooltip.classList.add("visible");
        updateTooltip(event);
    }

    function hideTooltip(): void {
        tooltip.classList.remove("visible");
        targetElement = null;
        isTouching = false;
    }

    function updateTooltip(event: MouseEvent | Touch): void {
        if (!targetElement) {
            return;
        }

        // note: need to get rect here because of dynamic width of text
        const tooltipRect = tooltip.getBoundingClientRect();
        const padding = 10;

        let x = event.clientX + padding;
        let y = event.clientY - tooltipRect.height - padding;

        // display tooltip on left of mouse if overflowing
        if (x + tooltipRect.width + padding > window.innerWidth) {
            x = event.clientX - tooltipRect.width - padding;
        }

        // if still overflowing display as left as possible
        if (x < 0) {
            x = padding;
        }

        // display tooltip beneath mouse if overflowing or if specified by user
        if (y < 0 || targetElement.classList.contains("tooltipBottom")) {
            y = event.clientY + padding;
        }

        tooltip.style.left = `${x}px`;
        tooltip.style.top = `${y}px`;
    }

    function getHoveredElement(target: Element): HTMLElement {
        const element =
            (target.closest("[data-tooltip-content]") as HTMLElement) ??
            (autoEnableForLinks ? target.closest("a") : null);

        return element;
    }

    // desktop mouse handlers
    document.addEventListener("mouseover", (event) => {
        const target = event.target as Element;
        const hoverElement = getHoveredElement(target);

        if (hoverElement && hoverElement !== targetElement) {
            targetElement = hoverElement;
            showTooltip(hoverElement, event as MouseEvent);
        }
    });

    document.addEventListener("mouseout", (event) => {
        const relatedTarget = (event as MouseEvent).relatedTarget as Element;

        // check if we're leaving a hover link
        if (
            targetElement &&
            !targetElement.contains(relatedTarget) &&
            !tooltip.contains(relatedTarget)
        ) {
            hideTooltip();
        }
    });

    document.addEventListener("mousemove", (event) => {
        if (targetElement && tooltip.classList.contains("visible")) {
            updateTooltip(event);
        }
    });

    // touch event handlers
    document.addEventListener("touchstart", (event) => {
        const target = event.target as Element;
        const hoverElement = getHoveredElement(target);

        if (hoverElement) {
            event.preventDefault();

            targetElement = hoverElement;
            isTouching = true;

            showTooltip(hoverElement, event.touches[0]);
        } else {
            //
            if (tooltip.classList.contains("visible")) {
                hideTooltip();
            }
        }
    });

    // hide tooltip on scroll (only on mobile)
    document.addEventListener(
        "scroll",
        () => {
            if (isTouching && tooltip.classList.contains("visible")) {
                hideTooltip();
            }
        },
        { passive: true }
    );

    // hide tooltip on window resize
    window.addEventListener("resize", () => {
        if (tooltip.classList.contains("visible")) {
            hideTooltip();
        }
    });

    // subscribe to potential tooltip content changes
    document.addEventListener("updatetooltip", () => {
        setTooltipText(targetElement);
    });
}

function initializeHoverTooltip() {
    const tooltip = document.getElementById("hoverTooltip") as HTMLElement;

    if (!tooltip) {
        console.log("creating new tooltip");
        const newTooltip = document.createElement("div");
        newTooltip.id = "hoverTooltip";

        document.body.appendChild(newTooltip);
    }
}

export { enableHoverTooltip, initializeHoverTooltip };
