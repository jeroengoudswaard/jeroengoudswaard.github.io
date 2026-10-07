// Theme (light/dark) and language (en/nl) toggles shared by every page.
// Preferences are remembered per browser; storage failures are ignored.
(function () {
  var root = document.documentElement;

  function load(key) {
    try { return localStorage.getItem(key); } catch (e) { return null; }
  }
  function save(key, value) {
    try { localStorage.setItem(key, value); } catch (e) { /* private mode */ }
  }

  // ── Language ──
  var lang = load("lang") ||
    ((navigator.language || "en").toLowerCase().indexOf("nl") === 0 ? "nl" : "en");
  function applyLang(l) {
    lang = l;
    root.setAttribute("data-lang", l);
    root.setAttribute("lang", l);
    document.querySelectorAll("[data-lang-label]").forEach(function (b) {
      b.textContent = l === "nl" ? "EN" : "NL";
      b.setAttribute("aria-label", l === "nl" ? "Switch to English" : "Schakel naar Nederlands");
    });
  }
  applyLang(lang);

  // ── Theme ──
  var theme = load("theme");
  if (theme) root.setAttribute("data-theme", theme);
  function isDark() {
    var t = root.getAttribute("data-theme");
    if (t) return t === "dark";
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  }
  function syncThemeButtons() {
    document.querySelectorAll("[data-theme-toggle]").forEach(function (b) {
      b.textContent = isDark() ? "☀" : "☾";
      b.setAttribute("aria-label", isDark() ? "Light mode" : "Dark mode");
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    applyLang(lang);
    syncThemeButtons();
    document.querySelectorAll("[data-lang-label]").forEach(function (b) {
      b.addEventListener("click", function () {
        var next = lang === "nl" ? "en" : "nl";
        save("lang", next);
        applyLang(next);
      });
    });
    document.querySelectorAll("[data-theme-toggle]").forEach(function (b) {
      b.addEventListener("click", function () {
        var next = isDark() ? "light" : "dark";
        root.setAttribute("data-theme", next);
        save("theme", next);
        syncThemeButtons();
      });
    });
    document.querySelectorAll("[data-year]").forEach(function (el) {
      el.textContent = new Date().getFullYear();
    });
  });
})();
