import { getText, portfolioContent } from "./content.js";
import { initializeLanguage } from "./language.js";
import { initializeNavigation } from "./navigation.js";
import { initializeReveal } from "./reveal.js";
import { initializeTranscript } from "./transcript.js";

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

function replaceFailedProjectImage(image) {
  if (!image.parentNode) return;

  const placeholder = document.createElement("div");
  placeholder.className = "project-placeholder project-image-fallback";
  if (image.classList.contains("project-media-image--contain")) {
    placeholder.classList.add("project-media-image--contain");
  }
  placeholder.dataset.projectImage = image.dataset.projectImage;
  placeholder.dataset.projectMediaId = image.dataset.projectMediaId;
  placeholder.dataset.projectImageAltKey = image.dataset.projectImageAltKey;
  placeholder.setAttribute("role", "img");
  const language = document.documentElement.lang
    || portfolioContent.defaultLanguage;
  placeholder.setAttribute(
    "aria-label",
    `${image.alt}. ${getText(language, "project.imageUnavailable")}`
  );

  const status = document.createElement("span");
  status.dataset.i18n = "project.imageUnavailable";
  status.dataset.projectImageStatus = "";
  status.textContent = getText(language, "project.imageUnavailable");
  placeholder.append(status);
  image.replaceWith(placeholder);
}

function createProjectMedia(project, language) {
  const gallery = document.createElement("div");
  gallery.className = "project-media";
  gallery.dataset.projectMediaGallery = project.id;

  for (const media of project.media) {
    const figure = document.createElement("figure");
    figure.className = "project-media-item";
    figure.dataset.projectMedia = media.id;

    const image = document.createElement("img");
    image.className = `project-media-image project-media-image--${media.fit}`;
    image.src = media.src;
    image.alt = getText(language, media.altKey);
    image.dataset.projectImage = project.id;
    image.dataset.projectMediaId = media.id;
    image.dataset.projectImageAltKey = media.altKey;
    image.addEventListener(
      "error",
      () => replaceFailedProjectImage(image),
      { once: true }
    );
    figure.append(image);

    if (media.captionKey) {
      const caption = document.createElement("figcaption");
      caption.dataset.i18n = media.captionKey;
      caption.textContent = getText(language, media.captionKey);
      figure.append(caption);
    }
    gallery.append(figure);
  }
  return gallery;
}

function renderProjects() {
  const list = document.querySelector("[data-project-list]");
  list.replaceChildren(
    ...portfolioContent.projects.map((project) => {
      const article = document.createElement("article");
      article.className = "project-row reveal";
      article.dataset.project = project.id;
      const language = portfolioContent.defaultLanguage;
      const projectMedia = createProjectMedia(project, language);

      const content = document.createElement("div");
      const type = document.createElement("p");
      type.className = "project-type";
      type.dataset.projectType = project.id;
      type.textContent = getText(language, project.typeKey);

      const title = document.createElement("h3");
      title.dataset.projectTitle = project.id;
      title.textContent = getText(language, project.titleKey);

      const capabilitySection = document.createElement("section");
      capabilitySection.className = "project-detail";
      const capabilityLabel = document.createElement("h4");
      capabilityLabel.dataset.projectCapabilityLabel = project.id;
      capabilityLabel.textContent = getText(language, project.capabilityLabelKey);
      const capability = document.createElement("p");
      capability.dataset.projectCapability = project.id;
      capability.textContent = getText(language, project.capabilityKey);
      capabilitySection.append(capabilityLabel, capability);

      const contributionSection = document.createElement("section");
      contributionSection.className = "project-detail";
      const contributionLabel = document.createElement("h4");
      contributionLabel.dataset.projectContributionLabel = project.id;
      contributionLabel.textContent = getText(language, project.contributionLabelKey);
      const contributionList = document.createElement("ul");
      contributionList.className = "contribution-list";
      for (const key of project.contributionKeys) {
        const item = document.createElement("li");
        item.dataset.projectContribution = project.id;
        item.dataset.i18nKey = key;
        item.textContent = getText(language, key);
        contributionList.append(item);
      }
      contributionSection.append(contributionLabel, contributionList);

      const technologyList = document.createElement("ul");
      technologyList.className = "tech-list";
      for (const technology of project.technologies) {
        const item = document.createElement("li");
        item.textContent = technology;
        technologyList.append(item);
      }

      content.append(
        type,
        title,
        capabilitySection,
        contributionSection,
        technologyList
      );
      if (project.github) {
        const link = document.createElement("a");
        link.className = "text-link";
        link.href = project.github;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        link.textContent = getText(language, "project.github");
        content.append(link);
      }
      article.append(projectMedia, content);
      return article;
    })
  );
}

renderSkills();
renderProjects();
initializeLanguage();
initializeTranscript();
initializeNavigation();
initializeReveal();
