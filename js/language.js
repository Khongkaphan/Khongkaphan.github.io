import { getText, portfolioContent } from "./content.js";

const storageKey = "khongkaphan-portfolio-language";
const supported = new Set(["th", "en"]);

function readStoredLanguage() {
  try {
    return localStorage.getItem(storageKey);
  } catch {
    return null;
  }
}

function persistLanguage(language) {
  try {
    localStorage.setItem(storageKey, language);
  } catch {
    // The language still changes for this page when storage is unavailable.
  }
}

export function setLanguage(language) {
  const selected = supported.has(language)
    ? language
    : portfolioContent.defaultLanguage;

  document.documentElement.lang = selected;
  document.querySelectorAll("[data-i18n]").forEach((element) => {
    element.textContent = getText(selected, element.dataset.i18n);
  });
  document.querySelectorAll("[data-i18n-aria-label]").forEach((element) => {
    element.setAttribute(
      "aria-label",
      getText(selected, element.dataset.i18nAriaLabel)
    );
  });
  portfolioContent.projects.forEach((project) => {
    document.querySelector(`[data-project-title="${project.id}"]`).textContent =
      getText(selected, project.titleKey);
    document.querySelector(
      `[data-project-description="${project.id}"]`
    ).textContent = getText(selected, project.descriptionKey);
    document.querySelector(
      `[data-project-responsibility="${project.id}"]`
    ).textContent = getText(selected, project.responsibilityKey);

    const image = document.querySelector(`[data-project-image="${project.id}"]`);
    const alt = getText(selected, project.altKey);
    if (image instanceof HTMLImageElement) image.alt = alt;
    else image.setAttribute("aria-label", alt);
  });
  document.querySelectorAll("[data-language]").forEach((button) => {
    button.setAttribute(
      "aria-pressed",
      String(button.dataset.language === selected)
    );
  });
  persistLanguage(selected);
  document.dispatchEvent(new CustomEvent("portfolio:languagechange", {
    detail: { language: selected }
  }));
}

export function initializeLanguage() {
  const stored = readStoredLanguage();
  setLanguage(supported.has(stored) ? stored : portfolioContent.defaultLanguage);
  document.querySelectorAll("[data-language]").forEach((button) => {
    button.addEventListener("click", () => setLanguage(button.dataset.language));
  });
}
