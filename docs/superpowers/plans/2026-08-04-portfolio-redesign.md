# Recruiter-first Portfolio Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the portfolio as a bilingual recruiter-first Software Developer Intern site with a minimal visual system, balanced motion, and resilient static fallbacks while preserving verified content and media.

**Architecture:** Keep the Vite static-site architecture and semantic Thai HTML baseline. Use focused ES modules for content rendering, language, navigation, Resume behavior, and Motion-powered progressive enhancement; CSS remains split into global tokens, section styling, and responsive rules.

**Tech Stack:** Vite 7, semantic HTML, CSS, JavaScript ES modules, Motion 12.43.0, Node test runner, Playwright.

## Global Constraints

- Replace the existing markup, styling, and behavior; preserve only verified bilingual facts and existing media assets.
- Keep the site static and Vite-based; do not migrate to React or another UI framework.
- Default to Thai and preserve a complete readable Thai fallback when JavaScript fails.
- Keep Thai and English synchronized and never invent experience, metrics, testimonials, employment, or availability dates.
- Use Recruiter-first Minimal styling with light neutral surfaces, dark navy text, and restrained cobalt accents.
- Use Balanced Motion only for hierarchy and feedback; motion must never be required to understand or use the site.
- Disable parallax, pulsing, staged reveals, and decorative transforms under `prefers-reduced-motion: reduce`.
- Keep touch targets at least 44 by 44 CSS pixels and meet WCAG AA contrast.
- Preserve project screenshots, profile image, social preview, Resume PDF, verified contact details, and safe external links.
- Record every new external dependency or adapted code block in `THIRD_PARTY_NOTICES.md`.
- Finish only after `npm run check` passes and 390x844, 768x1024, and 1440x900 production layouts are visually inspected.

## File Structure

- Create `AGENTS.md`: durable project rules for factual integrity, bilingual parity, licensing, TDD, fallback behavior, and verification.
- Create `THIRD_PARTY_NOTICES.md`: attribution record for Motion and any external code actually adapted.
- Modify `.gitignore`: ignore `.superpowers/` visual-brainstorm artifacts.
- Modify `package.json` and `package-lock.json`: pin Motion 12.43.0.
- Modify `index.html`: complete semantic Thai fallback and new recruiter-first structure.
- Modify `css/global.css`: tokens, reset, typography, focus, buttons, reveal defaults, and reduced-motion policy.
- Modify `css/sections.css`: new header, hero, skills, projects, profile, education, contact, and footer components.
- Modify `css/responsive.css`: mobile menu, touch layout, tablet/desktop grids, and hover-capability rules.
- Modify `js/content.js`: preserve verified data while adding keys needed by the new hierarchy.
- Modify `js/app.js`: render skills/projects, install image fallbacks, and coordinate enhancements.
- Modify `js/language.js`: translate text, labels, rendered content, and safe persistence.
- Modify `js/navigation.js`: mobile menu and current-section state.
- Modify `js/resume.js`: keep the Resume CTA progressive and bilingual.
- Replace `js/reveal.js` with `js/motion.js`: Motion-based entrances, scroll progress, pointer effects, and reduced-motion fallback.
- Modify `tests/content.test.mjs`: protect factual content, bilingual parity, source notices, and shell structure.
- Modify `tests/deployment-config.test.mjs`: protect the pinned dependency and quality gate.
- Modify `tests/site.spec.js`: assert the new information architecture, enhancement behavior, accessibility, resilience, and responsive behavior.
- Modify `tests/asset-scan.test.mjs`: continue verifying preserved production assets.
- Modify `README.md`: document the new structure and quality workflow.

---

### Task 1: Project Guardrails and Licensed Motion Dependency

**Files:**
- Create: `AGENTS.md`
- Create: `THIRD_PARTY_NOTICES.md`
- Modify: `.gitignore`
- Modify: `package.json`
- Modify: `package-lock.json`
- Modify: `tests/deployment-config.test.mjs`

**Interfaces:**
- Consumes: the approved design spec and existing npm scripts.
- Produces: exact `motion@12.43.0` dependency and project rules used by every later task.

- [ ] **Step 1: Write the failing guardrail test**

Append this test to `tests/deployment-config.test.mjs`:

```js
test("redesign guardrails and Motion dependency are pinned", async () => {
  const packageJson = JSON.parse(await readFile("package.json", "utf8"));
  assert.equal(packageJson.dependencies.motion, "12.43.0");

  const agents = await readFile("AGENTS.md", "utf8");
  assert.match(agents, /never invent experience or metrics/i);
  assert.match(agents, /Thai and English/i);
  assert.match(agents, /license/i);
  assert.match(agents, /npm run check/);

  const notices = await readFile("THIRD_PARTY_NOTICES.md", "utf8");
  assert.match(notices, /Motion/);
  assert.match(notices, /MIT/);
  assert.match(notices, /github\.com\/motiondivision\/motion/);

  const gitignore = await readFile(".gitignore", "utf8");
  assert.match(gitignore, /^\.superpowers\/$/m);
});
```

- [ ] **Step 2: Run the test and verify RED**

Run: `node --test tests/deployment-config.test.mjs`

Expected: FAIL because `packageJson.dependencies` or one of the new files does not exist.

- [ ] **Step 3: Add project guardrails and notice**

Create `AGENTS.md` with these exact rules:

```markdown
# Portfolio Project Rules

- Preserve verified personal facts. Never invent experience or metrics.
- Keep Thai and English content synchronized in the same change.
- Check the upstream license before adapting external code or assets and record retained work in `THIRD_PARTY_NOTICES.md`.
- Write a failing automated test before every behavior change or bug fix.
- Keep essential Thai content and navigation usable without JavaScript.
- Treat animation as progressive enhancement and honor `prefers-reduced-motion`.
- Verify keyboard, 390px mobile, 768px tablet, 1440px desktop, broken images, and missing browser APIs.
- Run `npm run check` before claiming completion.
```

Create `THIRD_PARTY_NOTICES.md`:

```markdown
# Third-party notices

## Motion

- Project: Motion
- Source: https://github.com/motiondivision/motion
- License: MIT
- Use: JavaScript animation dependency for entrance, scroll, and interaction feedback.

No template markup, personal copy, branding, or artwork is copied from the researched portfolio references.
```

Add `.superpowers/` as its own line in `.gitignore`.

- [ ] **Step 4: Install the exact dependency**

Run: `npm install --save-exact motion@12.43.0`

Expected: `package.json` contains `"dependencies": { "motion": "12.43.0" }` and the lockfile resolves the same version.

- [ ] **Step 5: Run the guardrail test and verify GREEN**

Run: `node --test tests/deployment-config.test.mjs`

Expected: PASS.

- [ ] **Step 6: Commit**

```powershell
git add -- .gitignore AGENTS.md THIRD_PARTY_NOTICES.md package.json package-lock.json tests/deployment-config.test.mjs
git commit -m "chore: add portfolio redesign guardrails"
```

---

### Task 2: Content Contract and Semantic Recruiter-first Shell

**Files:**
- Modify: `tests/content.test.mjs`
- Modify: `js/content.js`
- Modify: `index.html`

**Interfaces:**
- Consumes: existing verified `portfolioContent` values and public asset URLs.
- Produces: `portfolioContent`, `getText(language, key)`, section IDs `home`, `skills`, `projects`, `about`, `contact`, and stable render hooks used by Tasks 3-5.

- [ ] **Step 1: Write failing content and shell tests**

Add these assertions to `tests/content.test.mjs` using `readFile` from `node:fs/promises`:

```js
test("new recruiter-first copy is bilingual and factual", () => {
  for (const language of ["th", "en"]) {
    assert.equal(getText(language, "hero.role"), "Software Developer Intern");
    assert.ok(getText(language, "hero.availability").length > 0);
    assert.ok(getText(language, "projects.kicker").length > 0);
    assert.ok(getText(language, "project.roleLabel").length > 0);
  }
  assert.equal(portfolioContent.contact.email, "ball.56110m@gmail.com");
  assert.equal(portfolioContent.resume.href, "/assets/resume/resume.pdf");
});

test("semantic shell follows the approved recruiter-first order", async () => {
  const html = await readFile(new URL("../index.html", import.meta.url), "utf8");
  const ids = ["home", "skills", "projects", "about", "contact"];
  const positions = ids.map((id) => html.indexOf(`id="${id}"`));
  assert.ok(positions.every((position) => position >= 0));
  assert.deepEqual([...positions].sort((a, b) => a - b), positions);
  assert.match(html, /<h1[^>]*>\s*Khongkaphan Kiawsod\s*<\/h1>/);
  assert.match(html, /href="\/assets\/resume\/resume\.pdf"/);
  assert.match(html, /data-project-list/);
  assert.match(html, /data-skills-groups/);
  assert.doesNotMatch(html, /id="education"/);
});
```

- [ ] **Step 2: Run the tests and verify RED**

Run: `node --test tests/content.test.mjs`

Expected: FAIL because the new translation keys and section order do not exist.

- [ ] **Step 3: Extend the bilingual content model**

Keep every existing fact and add matching Thai/English keys for:

```js
{
  "nav.work": "ผลงาน" / "Work",
  "hero.availability": "กำลังมองหาโอกาสฝึกงาน" / "Open to internship opportunities",
  "hero.intro": "สวัสดี ฉันคือ" / "Hello, I am",
  "skills.kicker": "เทคโนโลยีที่ใช้งาน" / "Technologies I use",
  "projects.kicker": "ผลงานที่เลือก" / "Selected work",
  "project.roleLabel": "สิ่งที่รับผิดชอบ" / "My contribution",
  "about.kicker": "เกี่ยวกับและการศึกษา" / "About and education",
  "contact.kicker": "มาร่วมงานกัน" / "Let's work together",
  "contact.body": "กำลังมองหาโอกาสฝึกงานด้านการพัฒนาซอฟต์แวร์" / "I am looking for a software development internship opportunity.",
  "footer.backToTop": "กลับขึ้นด้านบน" / "Back to top"
}
```

Use normal JavaScript object entries; the slash notation above pairs the Thai and English values and must not appear in production code. Keep translation key parity enforced by the existing test.

- [ ] **Step 4: Replace `index.html` with the semantic baseline**

The document must use this exact hierarchy and hooks. Populate the biography,
education, project descriptions, responsibilities, and skill items by copying
the existing verified Thai strings from `index.html` and `js/content.js`
verbatim into their matching nodes:

```html
<body>
  <a class="skip-link" href="#main" data-i18n="accessibility.skipToContent">ข้ามไปยังเนื้อหาหลัก</a>
  <div class="scroll-progress" data-scroll-progress aria-hidden="true"></div>
  <header class="site-header" data-site-header>
    <nav class="container nav-shell" aria-label="เมนูหลัก" data-i18n-aria-label="accessibility.primaryNavigation">
      <a class="brand" href="#home" aria-label="Khongkaphan Kiawsod">K<span>.</span></a>
      <button class="menu-toggle" type="button" data-mobile-menu aria-expanded="false" aria-controls="primary-navigation"><span></span><span></span></button>
      <ul id="primary-navigation">
        <li><a href="#skills" data-i18n="nav.skills">ทักษะ</a></li>
        <li><a href="#projects" data-i18n="nav.work">ผลงาน</a></li>
        <li><a href="#about" data-i18n="nav.about">เกี่ยวกับฉัน</a></li>
        <li><a href="#contact" data-i18n="nav.contact">ติดต่อ</a></li>
      </ul>
      <div class="language-switch" data-language-switch><button type="button" data-language="th" aria-pressed="true">TH</button><button type="button" data-language="en" aria-pressed="false">EN</button></div>
    </nav>
  </header>
  <main id="main">
    <section id="home" class="hero section" data-motion-section>
      <p data-motion-item data-i18n="hero.availability">กำลังมองหาโอกาสฝึกงาน</p>
      <p data-motion-item data-i18n="hero.role">Software Developer Intern</p>
      <h1 data-motion-item>Khongkaphan Kiawsod</h1>
      <p data-motion-item data-i18n="hero.summary"></p>
      <a data-motion-item href="#projects" data-i18n="hero.projects">ดูผลงาน</a>
      <a data-motion-item href="/assets/resume/resume.pdf" target="_blank" rel="noopener noreferrer" data-resume-link data-i18n="hero.resume">ดาวน์โหลด Resume</a>
      <img data-motion-item src="/assets/avatar.jpg" alt="Khongkaphan Kiawsod">
    </section>
    <section id="skills" class="skills section" data-motion-section>
      <p data-i18n="skills.kicker">เทคโนโลยีที่ใช้งาน</p>
      <h2 data-i18n="skills.title">ทักษะ</h2>
      <div data-skills-groups></div>
    </section>
    <section id="projects" class="projects section" data-motion-section>
      <p data-i18n="projects.kicker">ผลงานที่เลือก</p>
      <h2 data-i18n="projects.title">ผลงาน</h2>
      <div data-project-list></div>
    </section>
    <section id="about" class="profile section" data-motion-section>
      <p data-i18n="about.kicker">เกี่ยวกับและการศึกษา</p>
      <h2 data-i18n="about.title">เกี่ยวกับฉัน</h2>
      <p data-i18n="about.body"></p>
      <p data-i18n="about.goal"></p>
      <h3 data-i18n="education.degree"></h3>
      <p data-i18n="education.institution"></p>
      <p data-i18n="education.period"></p>
      <p data-i18n="education.gpa"></p>
    </section>
    <section id="contact" class="contact section" data-motion-section>
      <p data-i18n="contact.kicker">มาร่วมงานกัน</p>
      <h2 data-i18n="contact.title">ติดต่อฉัน</h2>
      <p data-i18n="contact.body"></p>
      <a href="mailto:ball.56110m@gmail.com">ball.56110m@gmail.com</a>
      <a href="tel:0932795834">0932795834</a>
      <a href="https://github.com/Khongkaphan" target="_blank" rel="noopener noreferrer">GitHub</a>
    </section>
  </main>
  <footer class="site-footer"><a href="#home" data-i18n="footer.backToTop">กลับขึ้นด้านบน</a><p>Khongkaphan Kiawsod</p></footer>
  <script type="module" src="/js/app.js"></script>
</body>
```

The empty translated nodes are filled with their exact verified Thai values in
the production HTML so the fallback is complete. Use both existing project
image paths in the two fallback articles before `app.js` enhances the lists.

- [ ] **Step 5: Run content tests and verify GREEN**

Run: `node --test tests/content.test.mjs`

Expected: PASS with bilingual key parity and approved section order.

- [ ] **Step 6: Commit**

```powershell
git add -- index.html js/content.js tests/content.test.mjs
git commit -m "feat: add recruiter-first portfolio shell"
```

---

### Task 3: Design System and Responsive Layout

**Files:**
- Modify: `tests/site.spec.js`
- Modify: `css/global.css`
- Modify: `css/sections.css`
- Modify: `css/responsive.css`

**Interfaces:**
- Consumes: Task 2 section IDs and data hooks.
- Produces: final visual hierarchy, responsive grids, 44px controls, focus treatment, and CSS motion-safe baseline used by Tasks 4-5.

- [ ] **Step 1: Replace layout assertions with failing recruiter-first tests**

Add these Playwright tests and remove old assertions tied to the former section order:

```js
test("recruiter-first hero exposes role and primary actions", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1, name: "Khongkaphan Kiawsod" })).toBeVisible();
  await expect(page.getByText("Software Developer Intern").first()).toBeVisible();
  await expect(page.getByRole("link", { name: /ดูผลงาน/ })).toHaveAttribute("href", "#projects");
  await expect(page.getByRole("link", { name: /Resume/ })).toHaveAttribute("href", "/assets/resume/resume.pdf");
});

test("new layout keeps controls usable and avoids horizontal overflow", async ({ page }) => {
  for (const viewport of [
    { width: 390, height: 844 },
    { width: 768, height: 1024 },
    { width: 1440, height: 900 }
  ]) {
    await page.setViewportSize(viewport);
    await page.goto("/");
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
    expect(overflow).toBe(false);
    for (const control of await page.locator(".language-switch button, [data-mobile-menu]").all()) {
      if (await control.isVisible()) {
        const box = await control.boundingBox();
        expect(box.width).toBeGreaterThanOrEqual(44);
        expect(box.height).toBeGreaterThanOrEqual(44);
      }
    }
  }
});
```

- [ ] **Step 2: Run the focused browser tests and verify RED**

Run: `npx playwright test tests/site.spec.js -g "recruiter-first|new layout"`

Expected: FAIL because the new selectors and computed layout do not match yet.

- [ ] **Step 3: Replace global CSS**

Define these required tokens and global behaviors in `css/global.css`:

```css
:root {
  --ink: #142033;
  --muted: #647083;
  --accent: #245fd6;
  --accent-strong: #1748ad;
  --surface: #f8f8f3;
  --surface-raised: #ffffff;
  --surface-soft: #ecefe9;
  --border: #d8dcd5;
  --success: #23855d;
  --radius-sm: 10px;
  --radius-md: 18px;
  --shadow-lift: 0 20px 60px rgb(20 32 51 / 12%);
  --container: 1180px;
  color-scheme: light;
  font-family: "Noto Sans Thai", "Segoe UI", sans-serif;
}
```

Add a border-box reset, responsive images, `scroll-behavior: smooth`, visible 3px focus rings, `.container`, `.section`, `.eyebrow`, `.button`, `.skip-link`, and a `.motion-ready [data-motion-section]` starting state using only opacity/transform. Default content must be visible until `.motion-ready` exists.

- [ ] **Step 4: Build section and responsive styles**

Implement:

- sticky translucent header with compact `K.` brand;
- two-column desktop hero and single-column mobile hero;
- square-rounded profile image with offset accent outline;
- four scannable skill groups;
- alternating project rows with image, contribution, stack, and outbound link;
- compact biography/education grid;
- high-contrast contact panel;
- mobile menu below 760px and desktop navigation above it;
- hover effects only inside `@media (hover: hover) and (pointer: fine)`;
- reduced-motion override that removes smooth scrolling, transitions, and animations.

Use `clamp()` for headings and spacing. Do not hide content on mobile or put essential information exclusively in hover states.

- [ ] **Step 5: Run focused tests and verify GREEN**

Run: `npx playwright test tests/site.spec.js -g "recruiter-first|new layout"`

Expected: PASS at all three representative widths.

- [ ] **Step 6: Commit**

```powershell
git add -- css/global.css css/sections.css css/responsive.css tests/site.spec.js
git commit -m "feat: add recruiter-first responsive design"
```

---

### Task 4: Bilingual Navigation, Resume, Projects, and Resilient Images

**Files:**
- Modify: `tests/site.spec.js`
- Modify: `js/language.js`
- Modify: `js/navigation.js`
- Modify: `js/resume.js`
- Modify: `js/app.js`

**Interfaces:**
- Consumes: `portfolioContent`, `getText(language, key)`, Task 2 render hooks, and Task 3 classes.
- Produces: `setLanguage(language): void`, `initializeLanguage(): string`, `initializeNavigation(): void`, `initializeResume(): void`, `renderSkills(): void`, `renderProjects(): void`.

- [ ] **Step 1: Write failing enhancement and resilience tests**

Add or update Playwright tests to assert:

```js
test("switches the complete redesigned page between Thai and English", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "EN" }).click();
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page.getByText("Selected work")).toBeVisible();
  await expect(page.getByText("My contribution").first()).toBeVisible();
  await expect(page.getByText("Bachelor of Science in Computer Science")).toBeVisible();
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
});

test("broken project image keeps localized project content usable", async ({ page }) => {
  await page.route("**/assets/projects/stockflow-dashboard.png", route => route.abort());
  await page.goto("/");
  const project = page.locator('[data-project-id="stockflow"]');
  await expect(project.getByRole("img")).toHaveAttribute("aria-label", /StockFlow/);
  await expect(project).toContainText("ไม่สามารถแสดงภาพโครงการได้");
  await page.getByRole("button", { name: "EN" }).click();
  await expect(project).toContainText("Project image unavailable");
});

test("static Thai fallback survives an aborted application entry", async ({ page }) => {
  await page.route("**/js/app.js", route => route.abort());
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await expect(page.getByRole("heading", { level: 1, name: "Khongkaphan Kiawsod" })).toBeVisible();
  await expect(page.locator("#projects article")).toHaveCount(2);
  await expect(page.getByRole("link", { name: /Resume/ })).toBeVisible();
});
```

Retain tests for unavailable localStorage, mobile menu ARIA state, safe external links, and exact approved contact data, adapting selectors to the new shell.

- [ ] **Step 2: Run the enhancement tests and verify RED**

Run: `npx playwright test tests/site.spec.js -g "redesigned page|broken project|static Thai|localStorage|mobile menu|contact"`

Expected: FAIL on the new translation hooks or project fallback structure.

- [ ] **Step 3: Implement language and navigation modules**

`initializeLanguage()` must return the applied language. `setLanguage(language)` must:

1. normalize to `th` or `en`;
2. set `document.documentElement.lang`;
3. update `[data-i18n]` text and `[data-i18n-aria-label]` labels;
4. update `aria-pressed` on language buttons;
5. update the text and accessible labels inside already-rendered skill, project,
   image-fallback, and Resume nodes through their data-i18n hooks;
6. persist inside `try/catch` without preventing the visible update.

`initializeNavigation()` must toggle `aria-expanded`, the localized accessible name, and a document class; close on navigation, Escape, and desktop resize.

- [ ] **Step 4: Implement Resume and render orchestration**

Keep the static Resume anchor when configured. `updateResume(language)` changes only the translated label and preserves:

```html
href="/assets/resume/resume.pdf" target="_blank" rel="noopener noreferrer"
```

`renderSkills()` creates four semantic `<section class="skill-group">` groups with
`data-i18n` headings. `renderProjects()` creates two
`<article class="project-row" data-project-id="${project.id}">` elements using
`/assets/projects/${project.id === "stockflow" ? "stockflow-dashboard" : "moderation-api"}.png`,
translation data hooks, and a `.project-link-arrow` span inside each available
outbound link.

On image error, replace the `<img>` with:

```html
<div class="project-image-fallback" role="img" data-project-image-status></div>
```

Set `data-i18n-aria-label` to the project's alt key and `data-i18n` to
`project.imageUnavailable`; `setLanguage()` then updates the fallback after a
language switch without importing `app.js` into `language.js`.

- [ ] **Step 5: Run focused tests and verify GREEN**

Run: `npx playwright test tests/site.spec.js -g "redesigned page|broken project|static Thai|localStorage|mobile menu|contact"`

Expected: PASS.

- [ ] **Step 6: Commit**

```powershell
git add -- js/app.js js/language.js js/navigation.js js/resume.js tests/site.spec.js
git commit -m "feat: add bilingual portfolio enhancements"
```

---

### Task 5: Balanced Motion and Reduced-motion Fallback

**Files:**
- Delete: `js/reveal.js`
- Create: `js/motion.js`
- Modify: `js/app.js`
- Modify: `tests/site.spec.js`

**Interfaces:**
- Consumes: `motion` package, `[data-motion-section]`, `[data-scroll-progress]`, `.project-row`, `.project-media`, and `.availability-dot`.
- Produces: `initializeMotion(): () => void`, which returns a cleanup function and never hides content when enhancement APIs fail.

- [ ] **Step 1: Write failing motion behavior tests**

Add:

```js
test("balanced motion initializes progress and section enhancement", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("html")).toHaveClass(/motion-ready/);
  await expect(page.locator("[data-scroll-progress]")).toHaveAttribute("style", /transform/);
  await page.locator("#projects").scrollIntoViewIfNeeded();
  await expect(page.locator("#projects")).toHaveAttribute("data-motion-state", "visible");
});

test("reduced motion shows all content without decorative movement", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.locator("html")).toHaveClass(/reduced-motion/);
  for (const section of await page.locator("[data-motion-section]").all()) {
    await expect(section).toHaveCSS("opacity", "1");
    await expect(section).toHaveCSS("transform", "none");
  }
  await expect(page.locator(".availability-dot")).toHaveCSS("animation-name", "none");
});

test("missing animation capabilities preserve content", async ({ page }) => {
  await page.addInitScript(() => {
    delete window.IntersectionObserver;
    Element.prototype.animate = undefined;
  });
  await page.goto("/");
  await expect(page.locator("main")).toBeVisible();
  for (const section of await page.locator("[data-motion-section]").all()) {
    await expect(section).toBeVisible();
  }
});
```

- [ ] **Step 2: Run motion tests and verify RED**

Run: `npx playwright test tests/site.spec.js -g "balanced motion|reduced motion|missing animation"`

Expected: FAIL because `js/motion.js` and the new document state are absent.

- [ ] **Step 3: Implement `initializeMotion()`**

Use imports from the pinned dependency:

```js
import { animate, hover, inView, scroll, stagger } from "motion";
```

Use this implementation, adjusting selectors only if the final Task 2 markup
uses an equivalent data hook:

```js
export function initializeMotion() {
  const root = document.documentElement;
  const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
  const sections = document.querySelectorAll("[data-motion-section]");
  const showAll = () => {
    root.classList.remove("motion-ready");
    root.classList.add("reduced-motion");
    sections.forEach((section) => {
      section.dataset.motionState = "visible";
    });
  };

  if (reduced || typeof Element.prototype.animate !== "function") {
    showAll();
    return () => {};
  }

  const cleanups = [];
  try {
    root.classList.add("motion-ready");
    const heroItems = document.querySelectorAll("#home [data-motion-item]");
    const heroAnimation = animate(
      heroItems,
      { opacity: [0, 1], transform: ["translateY(18px)", "translateY(0)"] },
      { duration: 0.55, delay: stagger(0.08), ease: [0.16, 1, 0.3, 1] }
    );
    cleanups.push(() => heroAnimation.stop());

    const progress = document.querySelector("[data-scroll-progress]");
    if (progress) {
      const progressAnimation = animate(progress, { scaleX: [0, 1] }, { ease: "linear" });
      cleanups.push(scroll(progressAnimation));
      progress.style.transformOrigin = "0 50%";
    }

    cleanups.push(inView("[data-motion-section]", (section) => {
      section.dataset.motionState = "visible";
      const sectionAnimation = animate(
        section,
        { opacity: [0, 1], transform: ["translateY(24px)", "translateY(0)"] },
        { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
      );
      return () => sectionAnimation.stop();
    }, { amount: 0.18 }));

    if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
      document.querySelectorAll(".project-row").forEach((row) => {
        cleanups.push(hover(row, () => {
          const image = row.querySelector(".project-media img");
          const arrow = row.querySelector(".project-link-arrow");
          const imageAnimation = image
            ? animate(image, { scale: 1.05, x: 4 }, { duration: 0.35 })
            : null;
          const arrowAnimation = arrow
            ? animate(arrow, { x: 3, y: -3 }, { duration: 0.25 })
            : null;
          return () => {
            imageAnimation?.stop();
            arrowAnimation?.stop();
            if (image) animate(image, { scale: 1, x: 0 }, { duration: 0.3 });
            if (arrow) animate(arrow, { x: 0, y: 0 }, { duration: 0.2 });
          };
        }));
      });
    }

    return () => cleanups.splice(0).forEach((cleanup) => cleanup?.());
  } catch {
    cleanups.splice(0).forEach((cleanup) => cleanup?.());
    showAll();
    return () => {};
  }
}
```

- [ ] **Step 4: Wire motion after content initialization**

In `js/app.js`, initialize content, language, navigation, and Resume first. Then call `initializeMotion()` inside `try/catch`. Remove the old reveal import and delete `js/reveal.js`.

- [ ] **Step 5: Run motion tests and verify GREEN**

Run: `npx playwright test tests/site.spec.js -g "balanced motion|reduced motion|missing animation"`

Expected: PASS with content visible in every mode.

- [ ] **Step 6: Commit**

```powershell
git add -- js/app.js js/motion.js js/reveal.js tests/site.spec.js
git commit -m "feat: add balanced portfolio motion"
```

---

### Task 6: Assets, Metadata, Documentation, and Full Quality Gate

**Files:**
- Modify: `tests/asset-scan.test.mjs`
- Modify: `tests/site.spec.js`
- Modify: `README.md`
- Modify: `index.html` only if metadata tests expose a gap.
- Modify: any redesigned file only to fix a verified failure from this task.

**Interfaces:**
- Consumes: the complete redesigned site from Tasks 1-5.
- Produces: a production-ready, documented, verified artifact.

- [ ] **Step 1: Add final asset and metadata assertions**

Ensure tests explicitly cover:

```js
test("publishes recruiter-first sharing metadata", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/Khongkaphan Kiawsod.*Software Developer/);
  await expect(page.locator('meta[name="description"]')).toHaveAttribute("content", /Software Developer Intern/);
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute("content", "/assets/social-preview.png");
});
```

In `tests/asset-scan.test.mjs`, keep byte-for-byte checks for `avatar.jpg`, both project PNGs, `social-preview.png`, and `resume/resume.pdf`, and ensure every absolute production reference resolves in `dist`.

- [ ] **Step 2: Run the complete check and observe failures**

Run: `npm run check`

Expected: any remaining stale selector, metadata, asset, build, or browser issue fails with a specific message. If everything already passes, continue without manufacturing a failure because Tasks 1-5 supplied the failing tests first.

- [ ] **Step 3: Fix only verified final-gate failures**

Apply minimal corrections to the file named by each failing test. Do not add new features. Re-run the narrow failing command after every correction.

- [ ] **Step 4: Update README**

Document:

- Recruiter-first Minimal + Balanced Motion direction;
- `npm ci`, `npm run dev`, and `npm run check`;
- content updates in `js/content.js`;
- media paths under `public/assets`;
- Motion as the only runtime dependency;
- licensing workflow through `THIRD_PARTY_NOTICES.md`;
- reduced-motion and static fallback guarantees.

- [ ] **Step 5: Run the complete quality gate again**

Run: `npm run check`

Expected: all Node tests, production build, asset tests, and Playwright tests PASS with no warnings or unhandled errors.

- [ ] **Step 6: Inspect production layouts**

Run: `npm run preview`

Inspect at 390x844, 768x1024, and 1440x900. Verify role/CTA clarity, Thai and English layouts, both project crops, keyboard focus order, mobile menu, hover feedback, progress indicator, and reduced-motion presentation. Record screenshots under Playwright's ignored output directory if useful; do not commit generated screenshots.

- [ ] **Step 7: Review the diff and commit**

```powershell
git diff --check
git status --short
git diff --stat
git add -- README.md index.html css js tests package.json package-lock.json AGENTS.md THIRD_PARTY_NOTICES.md .gitignore
git commit -m "feat: rebuild software developer portfolio"
```
