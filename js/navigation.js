import { getText } from "./content.js";

export function initializeNavigation() {
  const button = document.querySelector("[data-mobile-menu]");
  const navigation = document.querySelector("#primary-navigation");

  const setOpen = (open) => {
    button.setAttribute("aria-expanded", String(open));
    navigation.dataset.open = String(open);
    const language = document.documentElement.lang || "th";
    button.setAttribute(
      "aria-label",
      getText(language, open ? "navigation.close" : "navigation.open")
    );
  };

  button.addEventListener("click", () => {
    setOpen(button.getAttribute("aria-expanded") !== "true");
  });

  navigation.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => setOpen(false));
  });
  document.addEventListener("portfolio:languagechange", () => {
    setOpen(button.getAttribute("aria-expanded") === "true");
  });
  setOpen(false);
  document.documentElement.classList.add("navigation-ready");

  if (!("IntersectionObserver" in window)) return;

  const links = new Map(
    [...navigation.querySelectorAll('a[href^="#"]')].map((link) => [
      link.getAttribute("href").slice(1),
      link
    ])
  );
  const observer = new IntersectionObserver((entries) => {
    entries
      .filter((entry) => entry.isIntersecting)
      .sort((left, right) => right.intersectionRatio - left.intersectionRatio)
      .slice(0, 1)
      .forEach((entry) => {
        links.forEach((link, id) => {
          if (id === entry.target.id) link.setAttribute("aria-current", "page");
          else link.removeAttribute("aria-current");
        });
      });
  }, { rootMargin: "-25% 0px -60%", threshold: [0.1, 0.5] });

  links.forEach((_link, id) => {
    const section = document.getElementById(id);
    if (section) observer.observe(section);
  });
}
