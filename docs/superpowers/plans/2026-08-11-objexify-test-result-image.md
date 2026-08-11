# Objexify Test Result Image Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add the approved YOLO11m detection-result screenshot as a second, captioned Objexify image while preserving the existing screenshot and bilingual accessible behavior.

**Architecture:** Store the approved PNG under Vite's public assets and model project media as an ordered array. Render each media item as an independent `<figure>` so the overview and result screenshot can use separate alt text, captions, fit modes, and failure placeholders without adding an interactive gallery.

**Tech Stack:** HTML5, CSS, JavaScript ES modules, Vite, Node.js test runner, Playwright, Git, GitHub Pages.

## Global Constraints

- Keep Objexify as the only Portfolio project and do not change its capability or personal-contribution copy.
- Keep `public/assets/projects/moderation-api.png` unchanged as the first image.
- Copy the approved source exactly from `C:\Users\KHONGK~1\AppData\Local\Temp\codex-clipboard-54bde782-0fc4-4a80-b6e3-8d44379877f2.png` to `public/assets/projects/moderation-api-result.png`.
- The approved PNG is 691×776 RGBA, 288079 bytes, SHA-256 `1e477125ed4533e364f25ec198536defd005826a6b1ece3d42a341a91e8347d2`.
- The embedded test photo is Pixabay contributor `howiekat`, image ID `487965`: `https://pixabay.com/photos/-487965/`; license summary: `https://pixabay.com/service/license-summary/`.
- The user states the photo was downloaded free from a source that permits use. The replacement Screenshot contains no visible face.
- Preserve the complete result screenshot without cropping its settings, upload controls, summary, bounding box, filename, classification, or confidence value.
- Use a vertical two-image gallery with no Modal, Slider, Carousel, zoom control, or project link.
- Use `object-fit: cover` for the overview and `object-fit: contain` for the result screenshot.
- Alt Thai exactly: `ภาพตัวอย่างผลการทดสอบโมเดล YOLO11m ที่ตรวจพบอาวุธ พร้อม Bounding Box`
- Alt English exactly: `YOLO11m test result screenshot showing a detected weapon and bounding box`
- Caption Thai exactly: `ตัวอย่างการทดสอบโมเดล YOLO11m: ระบบตรวจพบวัตถุประเภทอาวุธ พร้อมแสดง Bounding Box และค่า Confidence`
- Caption English exactly: `YOLO11m model test example: The system detected a weapon and displayed its bounding box with a confidence score.`
- A failed media item must fall back independently; the other image and the caption must remain available.
- Keep the static HTML fallback complete when JavaScript is unavailable.
- Make no changes to About, Skills, Education, Contact, Transcript, social metadata, or the existing image bytes.
- Follow strict RED-GREEN TDD for content and browser behavior. The binary-copy step is verified by a failing asset identity test before copying.
- Publish only after task reviews, final review, a clean merged-main `npm run check`, and GitHub Pages verification.

## File Structure

- Create `public/assets/projects/moderation-api-result.png`: approved result screenshot, copied byte-for-byte.
- Modify `tests/asset-scan.test.mjs`: pin the result screenshot identity and verify Vite passthrough.
- Modify `tests/content.test.mjs`: define the exact ordered `media` contract and bilingual copy.
- Modify `tests/site.spec.js`: verify two-image rendering, translation, failure isolation, static fallback, responsive layout, and public delivery.
- Modify `js/content.js`: add result translations and the ordered project `media` array.
- Modify `js/app.js`: render the accessible media gallery and per-image fallback.
- Modify `js/language.js`: update every project media alt label, including placeholders.
- Modify `index.html`: provide the complete Thai static fallback gallery.
- Modify `css/sections.css`: style the vertical gallery, distinct fit modes, caption, and placeholders.
- Modify `README.md`: document the ordered project-media workflow and approved real screenshot.

---

### Task 1: Add and Guard the Approved Screenshot Asset

**Files:**
- Create: `public/assets/projects/moderation-api-result.png`
- Modify: `tests/asset-scan.test.mjs:15-24,37-61`

**Interfaces:**
- Consumes: the approved source PNG and Vite's byte-preserving `public/` passthrough.
- Produces: `/assets/projects/moderation-api-result.png` with the pinned identity used by Task 2.

- [ ] **Step 1: Write the failing asset expectations**

Add the new path to `passthroughAssets` after the existing overview image:

```js
const passthroughAssets = [
  "assets/avatar.jpg",
  "assets/projects/moderation-api.png",
  "assets/projects/moderation-api-result.png",
  "assets/social-preview.png",
  "assets/transcript/transcript.pdf"
];
```

Add this identity beside `flattenedTranscript`:

```js
const approvedModerationResult = {
  bytes: 288079,
  sha256: "1e477125ed4533e364f25ec198536defd005826a6b1ece3d42a341a91e8347d2"
};
```

Add this test before the Transcript identity test:

```js
test("Objexify result screenshot is the approved real test capture", () => {
  const path = join(
    publicRoot,
    "assets/projects/moderation-api-result.png"
  );
  const contents = readFileSync(path);

  assert.equal(contents.length, approvedModerationResult.bytes);
  assert.equal(sha256(path), approvedModerationResult.sha256);
});
```

- [ ] **Step 2: Verify RED**

Run:

```powershell
node --test tests/asset-scan.test.mjs
```

Expected: FAIL while `public/assets/projects/moderation-api-result.png` still has the replaced screenshot identity.

- [ ] **Step 3: Copy the approved asset without transforming it**

Run from the isolated feature worktree:

```powershell
Copy-Item -LiteralPath `
  'C:\Users\KHONGK~1\AppData\Local\Temp\codex-clipboard-54bde782-0fc4-4a80-b6e3-8d44379877f2.png' `
  -Destination 'public\assets\projects\moderation-api-result.png' -Force
```

Do not resize, recompress, crop, annotate, or convert the image.

- [ ] **Step 4: Verify source identity before building**

Run:

```powershell
$asset = Get-Item -LiteralPath 'public\assets\projects\moderation-api-result.png'
$hash = Get-FileHash -Algorithm SHA256 -LiteralPath $asset.FullName
$asset.Length
$hash.Hash.ToLowerInvariant()
```

Expected: `288079` and `1e477125ed4533e364f25ec198536defd005826a6b1ece3d42a341a91e8347d2`.

- [ ] **Step 5: Verify GREEN and Vite passthrough**

Run:

```powershell
npm run build
node --test tests/asset-scan.test.mjs
```

Expected: 7 asset tests pass, including the approved screenshot identity and byte-for-byte build passthrough.

- [ ] **Step 6: Commit Task 1**

```powershell
git add -- public/assets/projects/moderation-api-result.png tests/asset-scan.test.mjs
git commit -m "feat: add approved Objexify result screenshot"
```

---

### Task 2: Render the Bilingual Two-Image Gallery

**Files:**
- Modify: `tests/content.test.mjs:18-48`
- Modify: `tests/site.spec.js:13-75,114-140,358-468,503-565`
- Modify: `js/content.js:32-44,84-96,143-165`
- Modify: `js/app.js:39-152`
- Modify: `js/language.js:27-64`
- Modify: `index.html:136-162`
- Modify: `css/sections.css:36-49`
- Modify: `README.md:48-53`

**Interfaces:**
- Consumes: `project.media: Array<{ id, src, altKey, captionKey, fit }>` and the two public PNG paths.
- Produces: `[data-project-media-gallery]`, `[data-project-media]`, `[data-project-media-id]`, `[data-project-image-alt-key]`, and localized `<figcaption data-i18n>` elements.

- [ ] **Step 1: Write the failing content contract**

Extend the approved Objexify test in `tests/content.test.mjs` with:

```js
assert.deepEqual(project.media, [
  {
    id: "overview",
    src: "/assets/projects/moderation-api.png",
    altKey: "project.moderation.overviewAlt",
    captionKey: null,
    fit: "cover"
  },
  {
    id: "result",
    src: "/assets/projects/moderation-api-result.png",
    altKey: "project.moderation.resultAlt",
    captionKey: "project.moderation.resultCaption",
    fit: "contain"
  }
]);
assert.equal("altKey" in project, false);
```

Add exact bilingual checks:

```js
assert.equal(
  getText("th", "project.moderation.resultAlt"),
  "ภาพตัวอย่างผลการทดสอบโมเดล YOLO11m ที่ตรวจพบอาวุธ พร้อม Bounding Box"
);
assert.equal(
  getText("en", "project.moderation.resultAlt"),
  "YOLO11m test result screenshot showing a detected weapon and bounding box"
);
assert.equal(
  getText("th", "project.moderation.resultCaption"),
  "ตัวอย่างการทดสอบโมเดล YOLO11m: ระบบตรวจพบวัตถุประเภทอาวุธ พร้อมแสดง Bounding Box และค่า Confidence"
);
assert.equal(
  getText("en", "project.moderation.resultCaption"),
  "YOLO11m model test example: The system detected a weapon and displayed its bounding box with a confidence score."
);
```

- [ ] **Step 2: Write the failing browser expectations**

Make `expectProjectImagesToDecode()` expect two images:

```js
expect(imageResults).toHaveLength(2);
```

Replace the single-image assertions in the production image test with:

```js
const overview = page.locator('[data-project-media-id="overview"]');
const result = page.locator('[data-project-media-id="result"]');
await expect(overview).toHaveAttribute(
  "src", /assets\/projects\/moderation-api\.png$/
);
await expect(overview).toHaveCSS("object-fit", "cover");
await expect(result).toHaveAttribute(
  "src", /assets\/projects\/moderation-api-result\.png$/
);
await expect(result).toHaveCSS("object-fit", "contain");
```

Extend the bilingual Objexify case-study test:

```js
const gallery = project.locator("[data-project-media-gallery]");
await expect(gallery.locator("[data-project-media]")).toHaveCount(2);
await expect(gallery.locator("figcaption")).toHaveText(
  "ตัวอย่างการทดสอบโมเดล YOLO11m: ระบบตรวจพบวัตถุประเภทอาวุธ พร้อมแสดง Bounding Box และค่า Confidence"
);
await expect(result).toHaveAttribute(
  "alt",
  "ภาพตัวอย่างผลการทดสอบโมเดล YOLO11m ที่ตรวจพบอาวุธ พร้อม Bounding Box"
);
```

After clicking `EN`, require:

```js
await expect(gallery.locator("figcaption")).toHaveText(
  "YOLO11m model test example: The system detected a weapon and displayed its bounding box with a confidence score."
);
await expect(result).toHaveAttribute(
  "alt",
  "YOLO11m test result screenshot showing a detected weapon and bounding box"
);
```

In the static-fallback test require two media items and the Thai caption:

```js
await expect(page.locator("[data-project-media]")).toHaveCount(2);
await expect(page.locator("[data-project-media] figcaption")).toHaveText(
  "ตัวอย่างการทดสอบโมเดล YOLO11m: ระบบตรวจพบวัตถุประเภทอาวุธ พร้อมแสดง Bounding Box และค่า Confidence"
);
```

Change the image-failure test to abort only `moderation-api-result.png`. Require the overview image to remain visible, the result placeholder to keep `data-project-media-id="result"`, the Thai/English result alt label and localized unavailable status to update, and the caption to remain visible in both languages.

Use this exact test body:

```js
test("aborted Objexify result image keeps the overview and localized caption", async ({ page }) => {
  await page.route(
    "**/assets/projects/moderation-api-result.png",
    (route) => route.abort()
  );
  await page.goto("/");

  const project = page.locator('[data-project="moderation-api"]');
  const overview = project.locator('img[data-project-media-id="overview"]');
  const placeholder = project.locator(
    '.project-image-fallback[data-project-media-id="result"]'
  );
  const caption = project.locator('[data-project-media="result"] figcaption');

  await expect(overview).toBeVisible();
  await expect(placeholder).toHaveAttribute("role", "img");
  await expect(placeholder).toHaveAttribute(
    "aria-label",
    "ภาพตัวอย่างผลการทดสอบโมเดล YOLO11m ที่ตรวจพบอาวุธ พร้อม Bounding Box. ไม่สามารถแสดงภาพโครงการได้"
  );
  await expect(placeholder.locator("[data-project-image-status]")).toHaveText(
    "ไม่สามารถแสดงภาพโครงการได้"
  );
  await expect(caption).toContainText("ตัวอย่างการทดสอบโมเดล YOLO11m");

  await page.getByRole("button", { name: "EN" }).click();
  await expect(placeholder).toHaveAttribute(
    "aria-label",
    "YOLO11m test result screenshot showing a detected weapon and bounding box. Project image unavailable"
  );
  await expect(placeholder.locator("[data-project-image-status]")).toHaveText(
    "Project image unavailable"
  );
  await expect(caption).toContainText("YOLO11m model test example");
});
```

Add `"/assets/projects/moderation-api-result.png", "image/png"` to the stable public-asset URL cases.

- [ ] **Step 3: Verify RED before production changes**

Run:

```powershell
node --test tests/content.test.mjs
npx playwright test tests/site.spec.js --grep "project image|Objexify case study|static fallback|moderation image|aborted Objexify result image|public assets"
```

Expected: the content test fails because `project.media` and result translation keys do not exist; browser tests fail because only one image is rendered.

- [ ] **Step 4: Add bilingual media content**

Replace the old single alt translation with these Thai keys:

```js
"project.moderation.overviewAlt": "ภาพหน้าจอระบบ Objexify สำหรับตรวจจับวัตถุไม่เหมาะสม",
"project.moderation.resultAlt": "ภาพตัวอย่างผลการทดสอบโมเดล YOLO11m ที่ตรวจพบอาวุธ พร้อม Bounding Box",
"project.moderation.resultCaption": "ตัวอย่างการทดสอบโมเดล YOLO11m: ระบบตรวจพบวัตถุประเภทอาวุธ พร้อมแสดง Bounding Box และค่า Confidence",
```

Add the matching English keys:

```js
"project.moderation.overviewAlt": "Objexify inappropriate content detection system screen",
"project.moderation.resultAlt": "YOLO11m test result screenshot showing a detected weapon and bounding box",
"project.moderation.resultCaption": "YOLO11m model test example: The system detected a weapon and displayed its bounding box with a confidence score.",
```

Replace the project's `altKey` with:

```js
media: [
  {
    id: "overview",
    src: "/assets/projects/moderation-api.png",
    altKey: "project.moderation.overviewAlt",
    captionKey: null,
    fit: "cover"
  },
  {
    id: "result",
    src: "/assets/projects/moderation-api-result.png",
    altKey: "project.moderation.resultAlt",
    captionKey: "project.moderation.resultCaption",
    fit: "contain"
  }
],
```

- [ ] **Step 5: Render independent media figures and fallbacks**

Remove `PROJECT_IMAGE_SOURCES`. Change `replaceFailedProjectImage` to consume the image's media data rather than `project.altKey`, copying `data-project-image`, `data-project-media-id`, and `data-project-image-alt-key` onto the placeholder. It must replace only the failed `<img>`, not its `<figure>`.

Use this implementation:

```js
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
```

Add this media builder before `renderProjects()`:

```js
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
```

Inside `renderProjects()`, replace the single `projectImage` creation with:

```js
const projectMedia = createProjectMedia(project, language);
```

Append `projectMedia` before the content column:

```js
article.append(projectMedia, content);
```

Remove the old single-image error listener because every image now owns its listener inside `createProjectMedia()`.

- [ ] **Step 6: Make media alt labels language-aware**

Remove the single-image block at `js/language.js:60-63`. Add this after the existing `[data-i18n-aria-label]` update:

```js
document.querySelectorAll("[data-project-image-alt-key]").forEach((element) => {
  const alt = getText(selected, element.dataset.projectImageAltKey);
  if (element instanceof HTMLImageElement) element.alt = alt;
  else {
    element.setAttribute(
      "aria-label",
      `${alt}. ${getText(selected, "project.imageUnavailable")}`
    );
  }
});
```

Captions require no special branch because their `data-i18n` values are updated by the existing generic translation loop.

- [ ] **Step 7: Add the complete static fallback**

Replace the single project `<img>` in `index.html` with:

```html
<div class="project-media" data-project-media-gallery="moderation-api">
  <figure class="project-media-item" data-project-media="overview">
    <img class="project-media-image project-media-image--cover"
      src="/assets/projects/moderation-api.png"
      data-project-image="moderation-api"
      data-project-media-id="overview"
      data-project-image-alt-key="project.moderation.overviewAlt"
      alt="ภาพหน้าจอระบบ Objexify สำหรับตรวจจับวัตถุไม่เหมาะสม">
  </figure>
  <figure class="project-media-item" data-project-media="result">
    <img class="project-media-image project-media-image--contain"
      src="/assets/projects/moderation-api-result.png"
      data-project-image="moderation-api"
      data-project-media-id="result"
      data-project-image-alt-key="project.moderation.resultAlt"
      alt="ภาพตัวอย่างผลการทดสอบโมเดล YOLO11m ที่ตรวจพบอาวุธ พร้อม Bounding Box">
    <figcaption data-i18n="project.moderation.resultCaption">ตัวอย่างการทดสอบโมเดล YOLO11m: ระบบตรวจพบวัตถุประเภทอาวุธ พร้อมแสดง Bounding Box และค่า Confidence</figcaption>
  </figure>
</div>
```

- [ ] **Step 8: Style the vertical gallery without cropping**

Replace the single-image project rules with:

```css
.project-media { display: grid; gap: 20px; min-width: 0; }
.project-media-item { display: grid; gap: 10px; margin: 0; min-width: 0; }
.project-media-image, .project-placeholder { width: 100%; aspect-ratio: 16 / 10; border-radius: var(--radius); box-shadow: var(--shadow); }
.project-media-image { object-position: center; }
.project-media-image--cover { object-fit: cover; }
.project-media-image--contain { aspect-ratio: 1 / 1; object-fit: contain; background: var(--navy-950); }
.project-media figcaption { color: var(--muted); font-size: .95rem; line-height: 1.6; }
```

Keep the existing placeholder gradient and localized failure-status rules. The result placeholder inherits the square `project-media-image--contain` class so the layout does not collapse after a load failure.

- [ ] **Step 9: Update the project-image maintenance instructions**

Replace the README's single-image note with a statement that Objexify media is an ordered `media` array in `js/content.js`, that real screenshots live in `public/assets/projects`, and that every replacement must update alt/caption translations, the approved identity when pinned, static fallback markup, and `npm run check`. Explicitly state that generated visuals must not be described as real screenshots.

Use this exact replacement:

```markdown
### Replace project media

Objexify media is an ordered `media` array in `js/content.js`. Real project
screenshots are stored under `public/assets/projects` and are also represented
in the Thai static fallback in `index.html`.

When replacing project media, update its `src`, bilingual alt/caption keys,
static fallback markup, and any pinned byte length or SHA-256 in
`tests/asset-scan.test.mjs`, then run `npm run check`. Do not describe a
generated visual as a real project screenshot.
```

- [ ] **Step 10: Verify GREEN**

Run:

```powershell
npm test
npm run build
node --test tests/asset-scan.test.mjs
npx playwright test tests/site.spec.js --grep "project image|Objexify case study|static fallback|moderation image|aborted Objexify result image|horizontal overflow|public assets"
```

Expected: 10 Node tests, 7 asset tests, and all selected Playwright cases pass. Both images decode; the result uses `contain`; both caption and alt change language; the result-only failure placeholder does not remove the overview.

- [ ] **Step 11: Commit Task 2**

```powershell
git add -- tests/content.test.mjs tests/site.spec.js js/content.js js/app.js js/language.js index.html css/sections.css README.md
git commit -m "feat: show Objexify test result in Portfolio"
```

---

### Task 3: Full Verification Before Review

**Files:**
- Verify only: the complete feature range and approved image artifacts.

**Interfaces:**
- Consumes: the exact feature `HEAD` in the isolated worktree.
- Produces: a verified branch ready for scoped task reviews and final whole-branch review.

- [ ] **Step 1: Run the complete quality gate**

```powershell
npm run check
```

Expected: 10 Node tests, Vite build, 7 asset tests, and the complete Playwright suite pass with zero failures.

- [ ] **Step 2: Verify asset identity and dimensions**

Run:

```powershell
$asset = Get-Item -LiteralPath 'public\assets\projects\moderation-api-result.png'
$hash = Get-FileHash -Algorithm SHA256 -LiteralPath $asset.FullName
$asset.Length
$hash.Hash.ToLowerInvariant()
```

Expected: 288079 bytes and SHA-256 `1e477125ed4533e364f25ec198536defd005826a6b1ece3d42a341a91e8347d2`. Inspect the file at original detail and confirm dimensions 691×776 RGBA, complete result card, visible Bounding Box, the Pixabay-derived filename, the failed-result classification, and no visible face.

- [ ] **Step 3: Verify responsive visual output**

Open the locally built site at representative 1440×900 and 390×844 viewports. Confirm the images are ordered overview then result, the complete result screenshot is not cropped, the caption is readable, the content column remains aligned, and there is no horizontal overflow.

- [ ] **Step 4: Verify the complete Git range**

```powershell
git status --short --branch
git log --oneline origin/main..HEAD
git diff --check origin/main..HEAD
git diff --stat origin/main..HEAD
git rev-parse HEAD
```

Expected: no tracked working-tree changes; only the approved design/plan and feature commits are ahead; no unrelated Portfolio sections changed; diff check emits no output.

## Post-Review Integration and Publication

After Task 1, Task 2, Task 3, scoped reviews, and final whole-branch review pass:

1. Merge the feature branch into local `main`.
2. Run `npm run check` again on merged `main`.
3. Remove only the feature worktree and its merged branch.
4. Push `main` to `origin` after user selects the publication path.
5. Wait for the `Deploy Portfolio to GitHub Pages` workflow for the exact pushed commit to succeed.
6. Verify the live HTML contains both public image paths and the approved Thai caption.
7. Download the live result PNG and require 288079 bytes and SHA-256 `1e477125ed4533e364f25ec198536defd005826a6b1ece3d42a341a91e8347d2`.
8. Confirm the live Portfolio has no horizontal overflow and the result Screenshot remains fully visible on desktop and mobile.
