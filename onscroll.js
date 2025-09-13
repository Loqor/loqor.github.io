window.addEventListener("scroll", () => {
    const footer = document.querySelector("footer");
    if (footer) {
        footer.classList.toggle("hide-on-scroll", window.scrollY > 0);
    }
});