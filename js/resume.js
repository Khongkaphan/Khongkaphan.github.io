import { getText, portfolioContent } from "./content.js";

export function updateResume(language) {
  const control = document.querySelector("[data-resume-link]");
  const status = document.querySelector("[data-resume-status]");
  const href = portfolioContent.resume.href;

  if (!href) {
    if (control instanceof HTMLAnchorElement) {
      const button = document.createElement("button");
      button.className = control.className;
      button.type = "button";
      button.dataset.resumeLink = "";
      button.dataset.i18n = "hero.resume";
      button.disabled = true;
      button.textContent = getText(language, "hero.resume");
      control.replaceWith(button);
    } else if (control instanceof HTMLButtonElement) {
      control.disabled = true;
      control.textContent = getText(language, "hero.resume");
    }
    status.textContent = getText(language, "resume.unavailable");
    return;
  }

  if (control instanceof HTMLAnchorElement) {
    control.textContent = getText(language, "hero.resume");
    status.textContent = "";
    return;
  }

  const link = document.createElement("a");
  link.className = control.className;
  link.dataset.resumeLink = "";
  link.dataset.i18n = "hero.resume";
  link.href = href;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  link.textContent = getText(language, "hero.resume");
  control.replaceWith(link);
  status.textContent = "";
}

export function initializeResume() {
  updateResume(
    document.documentElement.lang || portfolioContent.defaultLanguage
  );
  document.addEventListener("portfolio:languagechange", (event) => {
    updateResume(event.detail.language);
  });
}
