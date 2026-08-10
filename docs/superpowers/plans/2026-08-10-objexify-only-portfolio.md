# Objexify-only Portfolio Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** ปรับ Portfolio ให้เหลือ Objexify เป็นผลงานเด่นเพียงโปรเจกต์เดียว พร้อมแยกความสามารถของระบบออกจากหน้าที่ส่วนบุคคลและลบทักษะที่มาจาก StockFlow

**Architecture:** เก็บข้อมูลสองภาษาและโครงสร้างโปรเจกต์ไว้ที่ `js/content.js` แล้วให้ `js/app.js` สร้าง DOM จากข้อมูลชุดเดียว ขณะที่ `index.html` มี Thai static fallback ที่สมบูรณ์เมื่อ JavaScript ใช้งานไม่ได้ การเปลี่ยนภาษายังคงอยู่ใน `js/language.js` และ CSS ทำให้การ์ดเดียวเป็น Featured Case Study ที่ตอบสนองต่อ Desktop, Tablet และ Mobile

**Tech Stack:** Vite 7, HTML5, CSS3, JavaScript ES Modules, Node.js built-in test runner, Playwright

## Global Constraints

- ภาษาไทยเป็นภาษาเริ่มต้น และมีภาษาอังกฤษครบทุกข้อความที่เปลี่ยนภาษาได้
- แสดงเพียงโปรเจกต์ `moderation-api` ชื่อ `Objexify — บริการ API สำหรับตรวจจับวัตถุไม่เหมาะสม`
- ระบุว่าเป็น `โครงงานจบแบบกลุ่ม` และแยก `ความสามารถของระบบ` ออกจาก `หน้าที่ของผม`
- ห้ามกล่าวว่า Khongkaphan พัฒนา Backend API, Frontend หรือ MongoDB ทั้งหมดเพียงคนเดียว
- ผู้ให้บริการโดเมนคือ DigitalPlat (`dpdns.org`) ไม่ใช่ DuckDNS
- ขอบเขต Cloudflare ที่ยืนยันคือ Cloudflare DNS และ Cloudflare Tunnel ไปยัง FastAPI บน Port 5000
- ไม่แสดงปุ่ม Demo หรือ GitHub สำหรับ Objexify
- ลบ TypeScript, Next.js / React, Tailwind CSS, PostgreSQL และ Prisma ORM ออกจาก Skills
- ไม่แก้ Resume PDF และไม่แก้โปรเจกต์ StockFlow ที่ `D:\project-forio`
- ไม่ Push ขึ้น GitHub ในแผนนี้

---

### Task 1: Replace the content model with the approved Objexify facts

**Files:**
- Modify: `tests/content.test.mjs:18-124`
- Modify: `js/content.js:31-169`

**Interfaces:**
- Consumes: `getText(language, key): string` และโครงสร้าง `portfolioContent`
- Produces: โปรเจกต์เดียวที่มี `typeKey`, `capabilityLabelKey`, `capabilityKey`, `contributionLabelKey`, `contributionKeys`, `altKey`, `technologies`, `github`

- [ ] **Step 1: Replace the old two-project and skills assertions with failing approved-content tests**

```js
test("portfolio contains only the approved Objexify group project", () => {
  assert.deepEqual(
    portfolioContent.projects.map((project) => project.id),
    ["moderation-api"]
  );

  const project = portfolioContent.projects[0];
  assert.equal(project.typeKey, "project.moderation.type");
  assert.equal(project.capabilityKey, "project.moderation.capability");
  assert.deepEqual(project.contributionKeys, [
    "project.moderation.contribution.dataset",
    "project.moderation.contribution.evaluation",
    "project.moderation.contribution.mongodb",
    "project.moderation.contribution.cloudflare",
    "project.moderation.contribution.figma"
  ]);
  assert.equal(project.github, null);
});

test("Objexify copy keeps system capability separate from personal contribution", () => {
  assert.equal(
    getText("th", "project.moderation.type"),
    "โครงงานจบแบบกลุ่ม"
  );
  assert.match(getText("th", "project.moderation.capability"), /ภาพโป๊เปลือย.*อาวุธ.*บุหรี่.*ความรุนแรง/);
  assert.match(getText("th", "project.moderation.contribution.dataset"), /YOLO11m จำนวน 4 โมเดล/);
  assert.match(getText("th", "project.moderation.contribution.cloudflare"), /DigitalPlat.*Cloudflare DNS.*Cloudflare Tunnel.*Port 5000/);
  assert.match(getText("en", "project.moderation.type"), /Group senior project/);
  assert.doesNotMatch(
    portfolioContent.projects[0].contributionKeys
      .map((key) => getText("en", key)).join(" "),
    /developed the Backend|developed the Frontend|built the entire MongoDB/i
  );
});

test("skills contain only the approved interview-safe items", () => {
  assert.deepEqual(portfolioContent.skills, [
    {
      id: "programming-languages",
      labelKey: "skills.group.programmingLanguages",
      items: ["Python", "JavaScript", "HTML / CSS"]
    },
    {
      id: "frameworks-libraries",
      labelKey: "skills.group.frameworksLibraries",
      items: ["PyTorch", "Ultralytics (YOLO)"]
    },
    {
      id: "database-api",
      labelKey: "skills.group.databaseApi",
      items: ["REST API"]
    },
    {
      id: "tools",
      labelKey: "skills.group.tools",
      items: ["Git / GitHub", "Postman", "VS Code", "Roboflow", "Figma", "Cloudflare"]
    }
  ]);
});

test("removed StockFlow content and technologies are absent", () => {
  const serialized = JSON.stringify(portfolioContent);
  for (const removed of [
    "stockflow", "StockFlow", "TypeScript", "Next.js", "React",
    "Tailwind CSS", "PostgreSQL", "Prisma ORM"
  ]) {
    assert.equal(serialized.includes(removed), false, `${removed} must be absent`);
  }
});
```

- [ ] **Step 2: Run the content test and confirm the old model fails**

Run: `node --test --test-name-pattern="Objexify|skills|StockFlow" tests/content.test.mjs tests/deployment-config.test.mjs`

Expected: FAIL because the model still contains `stockflow`, old skill items, and no structured contribution keys.

- [ ] **Step 3: Replace project translations and data in `js/content.js`**

Use these exact Thai values and matching English values:

```js
"project.moderation.title": "Objexify — บริการ API สำหรับตรวจจับวัตถุไม่เหมาะสม",
"project.moderation.type": "โครงงานจบแบบกลุ่ม",
"project.moderation.capabilityLabel": "ความสามารถของระบบ",
"project.moderation.capability": "ระบบ AI สำหรับตรวจจับวัตถุไม่เหมาะสมในภาพและวิดีโอ ได้แก่ ภาพโป๊เปลือย อาวุธ บุหรี่ และความรุนแรง โดยให้บริการผลการตรวจจับและตำแหน่ง Bounding Box ผ่าน API เพื่อให้ระบบอื่นนำไปใช้งานต่อได้",
"project.moderation.contributionLabel": "หน้าที่ของผม",
"project.moderation.contribution.dataset": "เตรียมและปรับปรุง Dataset ทำ Label และฝึกสอนโมเดล YOLO11m จำนวน 4 โมเดล",
"project.moderation.contribution.evaluation": "ประเมินโมเดลด้วย mAP50-95, Precision และ Recall พร้อมทดลองเพิ่ม Background Images เพื่อลดการตรวจจับผิดพลาด",
"project.moderation.contribution.mongodb": "มีส่วนร่วมในงานส่วนฐานข้อมูล MongoDB ของโครงงาน",
"project.moderation.contribution.cloudflare": "ตั้งค่าโดเมน objexify.dpdns.org จาก DigitalPlat ให้ใช้งานร่วมกับ Cloudflare DNS และสร้าง Cloudflare Tunnel เชื่อมไปยัง FastAPI ที่รันบน Port 5000",
"project.moderation.contribution.figma": "ออกแบบหน้าจอและ User Flow บางส่วนด้วย Figma",
"project.moderation.alt": "ภาพหน้าจอระบบ Objexify สำหรับตรวจจับวัตถุไม่เหมาะสม"
```

```js
"project.moderation.title": "Objexify — Inappropriate Content Detection API",
"project.moderation.type": "Group senior project",
"project.moderation.capabilityLabel": "System capability",
"project.moderation.capability": "An AI service that detects pornography, weapons, cigarettes, and violence in images and videos, returning detection results and bounding-box coordinates through an API for integration with other systems.",
"project.moderation.contributionLabel": "My contribution",
"project.moderation.contribution.dataset": "Prepared and refined datasets, created labels, and trained four YOLO11m models.",
"project.moderation.contribution.evaluation": "Evaluated the models using mAP50-95, Precision, and Recall, and experimented with background images to reduce false detections.",
"project.moderation.contribution.mongodb": "Contributed to the project's MongoDB-related work.",
"project.moderation.contribution.cloudflare": "Configured the DigitalPlat domain objexify.dpdns.org with Cloudflare DNS and created a Cloudflare Tunnel to the FastAPI service running on port 5000.",
"project.moderation.contribution.figma": "Designed selected screens and user flows in Figma.",
"project.moderation.alt": "Objexify inappropriate content detection system screen"
```

Replace `skills` and `projects` with the exact structures asserted above. The Objexify technology list must be:

```js
technologies: [
  "Python", "FastAPI", "YOLO11m / Ultralytics", "PyTorch", "OpenCV",
  "MongoDB / PyMongo", "REST API / JSON", "Cloudflare Tunnel",
  "DigitalPlat DNS", "Figma"
],
github: null
```

- [ ] **Step 4: Run the content tests and verify they pass**

Run: `npm test`

Expected: all Node content and deployment tests PASS.

- [ ] **Step 5: Commit the content contract**

```bash
git add tests/content.test.mjs js/content.js
git commit -m "feat: focus portfolio content on Objexify"
```

---

### Task 2: Render the structured case study in JavaScript and static fallback

**Files:**
- Modify: `tests/site.spec.js:13-73,150-191,332-426,476-506`
- Modify: `js/app.js:39-113`
- Modify: `js/language.js:37-51`
- Modify: `index.html:76-168`

**Interfaces:**
- Consumes: Task 1 project fields and `getText(language, key)`
- Produces: DOM selectors `data-project-type`, `data-project-capability-label`, `data-project-capability`, `data-project-contribution-label`, and indexed `data-project-contribution`

- [ ] **Step 1: Add failing Playwright assertions for the one-project structure**

Replace tests that expect two projects and the StockFlow fallback with:

```js
test("renders one bilingual Objexify case study without project links", async ({ page }) => {
  await page.goto("/");
  const project = page.locator('[data-project="moderation-api"]');

  await expect(page.locator("[data-project]")).toHaveCount(1);
  await expect(project.locator("[data-project-type]")).toHaveText("โครงงานจบแบบกลุ่ม");
  await expect(project.locator("[data-project-capability-label]")).toHaveText("ความสามารถของระบบ");
  await expect(project.locator("[data-project-contribution-label]")).toHaveText("หน้าที่ของผม");
  await expect(project.locator("[data-project-contribution]")).toHaveCount(5);
  await expect(project.getByRole("link")).toHaveCount(0);
  await expect(page.getByText("StockFlow", { exact: false })).toHaveCount(0);

  await page.getByRole("button", { name: "EN" }).click();
  await expect(project.locator("[data-project-type]")).toHaveText("Group senior project");
  await expect(project.locator("[data-project-capability-label]")).toHaveText("System capability");
  await expect(project.locator("[data-project-contribution-label]")).toHaveText("My contribution");
  await expect(project.locator("[data-project-contribution]").first())
    .toContainText("four YOLO11m models");
});

test("Thai static fallback contains the complete Objexify case study", async ({ page }) => {
  await page.route("**/*", async (route) => {
    const request = route.request();
    const path = new URL(request.url()).pathname;
    if (request.resourceType() === "script" && (
      path.endsWith("/js/app.js") || /^\/assets\/index-[A-Za-z0-9_-]+\.js$/.test(path)
    )) return route.abort();
    await route.continue();
  });
  await page.goto("/", { waitUntil: "domcontentloaded" });

  await expect(page.locator("[data-project-list] article")).toHaveCount(1);
  await expect(page.getByText("ความสามารถของระบบ", { exact: true })).toBeVisible();
  await expect(page.getByText("หน้าที่ของผม", { exact: true })).toBeVisible();
  await expect(page.locator("[data-project-list] li")).toHaveCount(15);
  await expect(page.getByText("StockFlow", { exact: false })).toHaveCount(0);
  await expect(page.locator("[data-resume-link]")).toHaveAttribute(
    "href", "/assets/resume/resume.pdf"
  );
});
```

Update the moderation broken-image test to assert the exact localized alt/status in Thai, switch to English, and assert the English values. Remove the StockFlow broken-image test entirely.

- [ ] **Step 2: Run the focused browser tests and confirm failure**

Run: `npx playwright test -g "Objexify|static fallback|moderation image"`

Expected: FAIL because the old renderer uses description/responsibility paragraphs and still renders StockFlow and GitHub.

- [ ] **Step 3: Render the structured fields in `js/app.js`**

Keep `replaceFailedProjectImage()` and reduce `PROJECT_IMAGE_SOURCES` to:

```js
const PROJECT_IMAGE_SOURCES = Object.freeze({
  "moderation-api": "/assets/projects/moderation-api.png"
});
```

In each generated article, create this semantic content structure; set all text with `textContent`, not untrusted interpolation:

```html
<p class="project-type" data-project-type="moderation-api"></p>
<h3 data-project-title="moderation-api"></h3>
<section class="project-detail">
  <h4 data-project-capability-label="moderation-api"></h4>
  <p data-project-capability="moderation-api"></p>
</section>
<section class="project-detail">
  <h4 data-project-contribution-label="moderation-api"></h4>
  <ul class="contribution-list"></ul>
</section>
<ul class="tech-list"></ul>
```

For contribution items, assign the translation key to the element so language switching does not depend on array position alone:

```js
for (const key of project.contributionKeys) {
  const item = document.createElement("li");
  item.dataset.projectContribution = project.id;
  item.dataset.i18nKey = key;
  item.textContent = getText(language, key);
  contributionList.append(item);
}
```

Do not create any project `<a>` element when `project.github` is `null`.

- [ ] **Step 4: Update every structured field in `js/language.js`**

Replace the old description/responsibility updates with null-safe updates for the exact selectors:

```js
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
```

Keep the current image alt/fallback localization behavior.

- [ ] **Step 5: Replace the Skills and Projects static fallback in `index.html`**

The four skill groups must contain 3, 2, 1, and 6 items respectively, matching Task 1. The single Objexify fallback article must use the same selectors as the JavaScript renderer, contain five contribution `<li>` items plus ten technology `<li>` items, and contain no project link.

- [ ] **Step 6: Run content, build, and focused browser tests**

Run: `npm test && npm run build && npx playwright test -g "Objexify|static fallback|moderation image|skills"`

Expected: all selected tests PASS; generated and fallback pages both show exactly one project.

- [ ] **Step 7: Commit the structured case study rendering**

```bash
git add tests/site.spec.js js/app.js js/language.js index.html
git commit -m "feat: render Objexify as a structured case study"
```

---

### Task 3: Style the single project as an intentional Featured Case Study

**Files:**
- Modify: `tests/site.spec.js:461-474`
- Modify: `css/sections.css:36-44`
- Modify: `css/responsive.css:1-25`

**Interfaces:**
- Consumes: Task 2 classes `.project-row`, `.project-type`, `.project-detail`, `.contribution-list`, `.tech-list`
- Produces: two-column desktop layout at 1440px and one-column layout at 768px and 390px with no horizontal overflow

- [ ] **Step 1: Add failing responsive-layout assertions**

```js
test("featured Objexify layout adapts without horizontal overflow", async ({ page }) => {
  for (const [viewport, expectedColumns] of [
    [{ width: 1440, height: 900 }, 2],
    [{ width: 768, height: 1024 }, 1],
    [{ width: 390, height: 844 }, 1]
  ]) {
    await page.setViewportSize(viewport);
    await page.goto("/");
    const project = page.locator('[data-project="moderation-api"]');
    const columns = await project.evaluate((element) =>
      getComputedStyle(element).gridTemplateColumns.split(" ").length
    );
    expect(columns).toBe(expectedColumns);
    expect(await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth
    )).toBe(false);
  }
});
```

- [ ] **Step 2: Run the test and confirm the tablet layout fails**

Run: `npx playwright test -g "featured Objexify layout"`

Expected: FAIL until the featured layout rules and 768px breakpoint are explicit.

- [ ] **Step 3: Add focused case-study styles in `css/sections.css`**

Use the existing design tokens and add these responsibilities:

```css
.projects-list { display: grid; gap: 48px; }
.project-row {
  display: grid;
  grid-template-columns: minmax(0, .95fr) minmax(0, 1.05fr);
  align-items: start;
  gap: clamp(32px, 5vw, 64px);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: clamp(20px, 3vw, 36px);
  background: white;
  box-shadow: var(--shadow);
}
.project-row > div { min-width: 0; }
.project-type {
  display: inline-flex;
  margin: 0 0 12px;
  border-radius: 999px;
  padding: 6px 12px;
  background: var(--blue-100);
  color: var(--navy-800);
  font-weight: 800;
}
.project-detail { margin-top: 24px; }
.project-detail h4 { margin: 0 0 8px; color: var(--navy-950); }
.project-detail p { margin: 0; }
.contribution-list { display: grid; gap: 10px; margin: 0; padding-left: 1.25rem; }
.tech-list { margin-top: 24px; }
```

Remove the alternating-row selector because only one project remains. Preserve image `aspect-ratio: 16 / 10`, `object-fit: cover`, fallback styling, and accessible contrast.

- [ ] **Step 4: Make Tablet and Mobile explicitly one column**

In the existing `@media (max-width: 900px)` block in `css/responsive.css`, keep:

```css
.hero-grid, .about-grid, .project-row { grid-template-columns: 1fr; }
.project-row { padding: 20px; }
```

Do not add a second project-specific breakpoint or fixed height.

- [ ] **Step 5: Run responsive, reduced-motion, and overflow tests**

Run: `npx playwright test -g "featured Objexify layout|reduced motion|horizontal overflow"`

Expected: all selected tests PASS at 390x844, 768x1024, and 1440x900.

- [ ] **Step 6: Commit the featured layout**

```bash
git add tests/site.spec.js css/sections.css css/responsive.css
git commit -m "style: feature Objexify as the primary case study"
```

---

### Task 4: Remove StockFlow assets and documentation, then verify the complete site

**Files:**
- Modify: `tests/asset-scan.test.mjs:15-20`
- Modify: `tests/site.spec.js:492-506`
- Modify: `README.md:42-51`
- Delete: `public/assets/projects/stockflow-dashboard.png`

**Interfaces:**
- Consumes: production asset references after Tasks 1-3
- Produces: a build containing only current Portfolio assets and documentation with no StockFlow maintenance instructions

- [ ] **Step 1: Make asset tests require StockFlow cleanup**

Remove `assets/projects/stockflow-dashboard.png` from `passthroughAssets` and add:

```js
test("removed StockFlow asset is absent from source and build", () => {
  const removed = "assets/projects/stockflow-dashboard.png";
  assert.equal(existsSync(join(publicRoot, removed)), false);
  assert.equal(existsSync(join(distRoot, removed)), false);
});
```

Remove StockFlow from the `serves public assets from deployment-stable URLs` Playwright table.

- [ ] **Step 2: Build and run the asset test to confirm stale output fails**

Run: `npm run build && npm run test:assets`

Expected: FAIL because the source StockFlow PNG still exists and Vite still copies it to `dist`.

- [ ] **Step 3: Delete the unused StockFlow PNG and stale build output**

Delete only `public/assets/projects/stockflow-dashboard.png`. Re-run `npm run build`; Vite recreates `dist` without the removed image. Do not touch `D:\project-forio`.

- [ ] **Step 4: Remove StockFlow instructions from `README.md`**

Delete the complete `### Add the StockFlow repository` subsection. Update the project-image paragraph to state that the current Objexify image is `public/assets/projects/moderation-api.png` and its renderer mapping is in `js/app.js`.

- [ ] **Step 5: Run the full verification suite**

Run: `npm run check`

Expected: Node tests PASS, Vite production build succeeds, asset passthrough tests PASS, and all Playwright tests PASS.

- [ ] **Step 6: Scan production sources for removed claims**

Run:

```powershell
rg -n -i "stockflow|typescript|next\.js|tailwind|postgresql|prisma|duckdns" index.html js css README.md public
```

Expected: no matches. Test files and historical `docs/superpowers` specifications/plans may name removed terms to assert that they are absent or to record prior decisions.

- [ ] **Step 7: Inspect the final website at representative sizes**

Run: `npm run preview`

Open `http://127.0.0.1:4173/` and inspect 390x844, 768x1024, and 1440x900. Confirm one intentional Objexify case study, readable Thai/English text, five contribution bullets, ten technology chips, working Resume, localized broken-image fallback, and no empty Demo/GitHub control.

- [ ] **Step 8: Commit cleanup and verified documentation**

```bash
git add tests/asset-scan.test.mjs tests/site.spec.js README.md public/assets/projects/stockflow-dashboard.png
git commit -m "chore: remove StockFlow portfolio remnants"
```
