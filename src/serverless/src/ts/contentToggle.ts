export function initializeContentToggle(): void {
    const posts = document.querySelectorAll(".post");

    posts.forEach((post, index) => {
        const toggleContentButton = post.querySelector(
            'button[name="toggleContent"]'
        );

        if (!toggleContentButton) {
            console.error("post missing toggle content button or content!");
        }

        // Add click handler
        toggleContentButton.addEventListener("click", () => {
            const contentIsVisible = !post.classList.contains("minimized");

            if (contentIsVisible) {
                post.classList.add("minimized");
                toggleContentButton.innerHTML =
                    '<span class="material-symbols-outlined symbol">keyboard_arrow_down</span>';
            } else {
                post.classList.remove("minimized");
                toggleContentButton.innerHTML =
                    '<span class="material-symbols-outlined symbol">keyboard_arrow_up</span>';
            }
        });
    });
}
