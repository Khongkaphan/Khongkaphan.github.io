export function initializeReveal() {
  const items = document.querySelectorAll(".reveal");
  if (
    matchMedia("(prefers-reduced-motion: reduce)").matches
    || !("IntersectionObserver" in window)
  ) {
    items.forEach((item) => item.classList.add("is-visible"));
    document.documentElement.classList.add("reveal-ready");
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  items.forEach((item) => observer.observe(item));
  document.documentElement.classList.add("reveal-ready");
}
