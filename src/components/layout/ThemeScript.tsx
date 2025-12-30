import Script from "next/script";

const themeScript = `
(() => {
  try {
    const storedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const isDark = storedTheme ? storedTheme === "dark" : prefersDark;
    const root = document.documentElement;
    root.classList.toggle("dark", isDark);
    root.style.colorScheme = isDark ? "dark" : "light";
  } catch (error) {
    console.warn("Theme initialization skipped.", error);
  }
})();
`;

export default function ThemeScript() {
  return (
    <Script
      id="theme-init"
      strategy="beforeInteractive"
      dangerouslySetInnerHTML={{ __html: themeScript }}
    />
  );
}
