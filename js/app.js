import { getText, portfolioContent } from "./content.js";
import { initializeLanguage } from "./language.js";
import { initializeNavigation } from "./navigation.js";
import { initializeReveal } from "./reveal.js";
import { initializeResume } from "./resume.js";

function renderSkills() {
  const groups = document.querySelector("[data-skills-groups]");
  groups.replaceChildren(
    ...portfolioContent.skills.map((group) => {
      const section = document.createElement("section");
      section.className = "skill-group";
      section.dataset.skillGroup = group.id;

      const heading = document.createElement("h3");
      heading.dataset.i18n = group.labelKey;
      heading.textContent = getText(
        portfolioContent.defaultLanguage,
        group.labelKey
      );

      const list = document.createElement("ul");
      list.className = "skills-list";
      list.replaceChildren(
        ...group.items.map((skill) => {
          const item = document.createElement("li");
          item.className = "skill-item";
          item.textContent = skill;
          return item;
        })
      );

      section.append(heading, list);
      return section;
    })
  );
}

function replaceFailedProjectImage(image, project) {
  if (!image.parentNode) return;

  const placeholder = document.createElement("div");
  placeholder.className = "project-placeholder project-image-fallback";
  placeholder.dataset.projectImage = project.id;
  placeholder.setAttribute("role", "img");
  placeholder.setAttribute(
    "aria-label",
    image.alt || getText(
      document.documentElement.lang || portfolioContent.defaultLanguage,
      project.altKey
    )
  );

  const status = document.createElement("span");
  status.dataset.i18n = "project.imageUnavailable";
  status.dataset.projectImageStatus = "";
  status.textContent = getText(
    document.documentElement.lang || portfolioContent.defaultLanguage,
    "project.imageUnavailable"
  );
  placeholder.append(status);
  image.replaceWith(placeholder);
}

function renderProjects() {
  const list = document.querySelector("[data-project-list]");
  list.replaceChildren(
    ...portfolioContent.projects.map((project) => {
      const article = document.createElement("article");
      article.className = "project-row reveal";
      article.dataset.project = project.id;
      const language = portfolioContent.defaultLanguage;
      const alt = getText(language, project.altKey);
      const visual = project.id === "stockflow"
        ? `<img src="/assets/projects/stockflow-dashboard.png"
            data-project-image="${project.id}" alt="${alt}">`
        : `<div class="project-placeholder" role="img"
            data-project-image="${project.id}" aria-label="${alt}">
            AI / COMPUTER VISION
            <span class="detection-frame"></span>
            <span class="detection-frame"></span>
            <span class="detection-frame"></span>
            <span class="detection-frame"></span>
          </div>`;
      article.innerHTML = `
        ${visual}
        <div>
          <h3 data-project-title="${project.id}"></h3>
          <p data-project-description="${project.id}"></p>
          <p data-project-responsibility="${project.id}"></p>
          <ul class="tech-list">${project.technologies.map(
            (technology) => `<li>${technology}</li>`
          ).join("")}</ul>
          ${project.github
            ? `<a class="text-link" href="${project.github}" target="_blank"
                rel="noopener noreferrer">GitHub</a>`
            : ""}
        </div>`;
      article.querySelector(`[data-project-title="${project.id}"]`).textContent =
        getText(language, project.titleKey);
      article.querySelector(
        `[data-project-description="${project.id}"]`
      ).textContent = getText(language, project.descriptionKey);
      article.querySelector(
        `[data-project-responsibility="${project.id}"]`
      ).textContent = getText(language, project.responsibilityKey);

      const projectImage = article.querySelector("img[data-project-image]");
      projectImage?.addEventListener(
        "error",
        () => replaceFailedProjectImage(projectImage, project),
        { once: true }
      );
      return article;
    })
  );
}

renderSkills();
renderProjects();
initializeLanguage();
initializeResume();
initializeNavigation();
initializeReveal();
