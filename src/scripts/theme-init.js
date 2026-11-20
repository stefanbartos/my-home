// Apply a saved light/dark choice before first paint (see ThemeToggle.astro).
// Rendered inline by Default.astro. astro.config.mjs hashes this file for the CSP.
try {
    const theme = localStorage.getItem("theme");
    if (theme === "light" || theme === "dark") {
        document.documentElement.dataset.theme = theme;
    }
} catch {
    // Storage blocked (private mode etc.): keep the system theme.
}
