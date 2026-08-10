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
    const updateText = (selector, key) => {
      const element = document.querySelector(selector);
      if (element) element.textContent = getText(selected, key);
    };

    updateText(`[data-project-title="${project.id}"]`, project.titleKey);
    updateText(`[data-project-type="${project.id}"]`, project.typeKey);
    updateText(
      `[data-project-capability-label="${project.id}"]`,
      project.capabilityLabelKey
    );
    updateText(`[data-project-capability="${project.id}"]`, project.capabilityKey);
    updateText(
      `[data-project-contribution-label="${project.id}"]`,
      project.contributionLabelKey
    );
    document.querySelectorAll(
      `[data-project-contribution="${project.id}"]`
    ).forEach((item) => {
      item.textContent = getText(selected, item.dataset.i18nKey);
    });

    const image = document.querySelector(`[data-project-image="${project.id}"]`);
    const alt = getText(selected, project.altKey);
    if (image instanceof HTMLImageElement) image.alt = alt;
    else if (image) image.setAttribute("aria-label", alt);
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
