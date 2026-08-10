import { getText, portfolioContent } from "./content.js";

export function updateTranscript(language) {
  const control = document.querySelector("[data-transcript-link]");
  const status = document.querySelector("[data-transcript-status]");
  const href = portfolioContent.transcript.href;

  if (!href) {
    if (control instanceof HTMLAnchorElement) {
      const button = document.createElement("button");
      button.className = control.className;
      button.type = "button";
      button.dataset.transcriptLink = "";
      button.dataset.i18n = "hero.transcript";
      button.disabled = true;
      button.textContent = getText(language, "hero.transcript");
      control.replaceWith(button);
    } else if (control instanceof HTMLButtonElement) {
      control.disabled = true;
      control.textContent = getText(language, "hero.transcript");
    }
    status.textContent = getText(language, "transcript.unavailable");
    return;
  }

  if (control instanceof HTMLAnchorElement) {
    control.textContent = getText(language, "hero.transcript");
    status.textContent = "";
    return;
  }

  const link = document.createElement("a");
  link.className = control.className;
  link.dataset.transcriptLink = "";
  link.dataset.i18n = "hero.transcript";
  link.href = href;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  link.textContent = getText(language, "hero.transcript");
  control.replaceWith(link);
  status.textContent = "";
}

export function initializeTranscript() {
  updateTranscript(
    document.documentElement.lang || portfolioContent.defaultLanguage
  );
  document.addEventListener("portfolio:languagechange", (event) => {
    updateTranscript(event.detail.language);
  });
}
