# About Copy and Section Eyebrow Removal Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove the five repeated English section eyebrow labels and replace the bilingual About copy with the owner-approved AI, Computer Vision, Backend, and supporting software experience.

**Architecture:** Keep the existing static HTML and `data-i18n` translation architecture. Remove only the five section eyebrow elements, retain the hero role eyebrow and all localized headings/navigation, and store the two About paragraphs under `about.body` and `about.experience` in both translation dictionaries.

**Tech Stack:** HTML5, CSS, JavaScript ES modules, Node.js test runner, Playwright, Vite

## Global Constraints

- Remove only `ABOUT`, `SKILLS`, `EDUCATION`, `PROJECTS`, and `CONTACT` section eyebrow labels.
- Preserve localized section headings, navigation, layout, images, links, and language switching.
- Use the exact approved Thai copy from the design specification.
- Use the approved English translation from the design specification.
- Do not claim Full-stack experience in the About section.
- Keep the hero `Software Developer Intern` eyebrow unchanged.

---

### Task 1: Bilingual About Copy and Section Heading Cleanup

**Files:**
- Modify: `tests/content.test.mjs`
- Modify: `tests/site.spec.js`
- Modify: `index.html:65-186`
- Modify: `js/content.js:18-20,72-74`

**Interfaces:**
- Consumes: Existing `getText(language, key)` and `[data-i18n]` language switching.
- Produces: Translation keys `about.body` and `about.experience` for both `th` and `en`; five section headings without repeated eyebrow elements.

- [ ] **Step 1: Write the failing content tests**

Add a Node test that asserts the exact approved translation strings, translation-key parity, and absence of the old Full-stack About copy:

```js
test("About copy accurately represents AI, Computer Vision, and Backend experience", () => {
  assert.equal(
    getText("th", "about.body"),
    "กำลังศึกษาระดับปริญญาตรี สาขาวิชาวิทยาการคอมพิวเตอร์ คณะเทคโนโลยีสารสนเทศและการสื่อสาร มหาวิทยาลัยพะเยา มีความสนใจด้านการประยุกต์ใช้ปัญญาประดิษฐ์ (AI) และการพัฒนาซอฟต์แวร์ โดยเฉพาะงานด้าน Computer Vision และ Backend"
  );
  assert.equal(
    getText("th", "about.experience"),
    "มีประสบการณ์ในการพัฒนาและฝึกสอนโมเดล AI สำหรับตรวจจับวัตถุ การเตรียมชุดข้อมูล และการประเมินประสิทธิภาพของโมเดล รวมถึงมีประสบการณ์ใช้งาน Git, Cloudflare และออกแบบส่วนติดต่อผู้ใช้เบื้องต้น"
  );
  assert.equal(
    getText("en", "about.body"),
    "I am pursuing a bachelor's degree in Computer Science at the School of Information and Communication Technology, University of Phayao. I am interested in applying Artificial Intelligence (AI) and developing software, particularly in Computer Vision and Backend development."
  );
  assert.equal(
    getText("en", "about.experience"),
    "I have experience developing and training AI models for object detection, preparing datasets, and evaluating model performance. I also have experience using Git and Cloudflare, along with basic user interface design."
  );
  assert.doesNotMatch(
    `${getText("th", "about.body")} ${getText("th", "about.experience")} ${getText("en", "about.body")} ${getText("en", "about.experience")}`,
    /Full-stack/i
  );
});
```

- [ ] **Step 2: Write the failing browser test**

Add a Playwright test that verifies the five section eyebrow labels are absent, the hero role remains, and both About paragraphs translate:

```js
test("removes repeated section eyebrows and renders the approved bilingual About copy", async ({ page }) => {
  await page.goto("/");
  for (const sectionId of ["about", "skills", "education", "projects", "contact"]) {
    await expect(page.locator(`#${sectionId} > .container > .eyebrow, #${sectionId} .about-grid > div > .eyebrow`)).toHaveCount(0);
  }
  await expect(page.getByText("Software Developer Intern", { exact: true })).toBeVisible();
  await expect(page.locator('[data-i18n="about.body"]')).toContainText("Computer Vision และ Backend");
  await expect(page.locator('[data-i18n="about.experience"]')).toContainText("Git, Cloudflare");

  await page.getByRole("button", { name: "EN" }).click();
  await expect(page.locator('[data-i18n="about.body"]')).toContainText("Computer Vision and Backend development");
  await expect(page.locator('[data-i18n="about.experience"]')).toContainText("using Git and Cloudflare");
});
```

- [ ] **Step 3: Run the focused tests and confirm RED**

Run:

```powershell
node --test tests/content.test.mjs
npx playwright test tests/site.spec.js --grep "removes repeated section eyebrows"
```

Expected: content test fails because `about.experience` does not exist and the approved copy is absent; Playwright test fails because the five eyebrow elements still exist.

- [ ] **Step 4: Implement the minimal HTML and translation changes**

In `index.html`, delete only these five elements:

```html
<p class="eyebrow">ABOUT</p>
<p class="eyebrow">SKILLS</p>
<p class="eyebrow">EDUCATION</p>
<p class="eyebrow">PROJECTS</p>
<p class="eyebrow">CONTACT</p>
```

Replace the two About paragraphs with:

```html
<p data-i18n="about.body">กำลังศึกษาระดับปริญญาตรี สาขาวิชาวิทยาการคอมพิวเตอร์ คณะเทคโนโลยีสารสนเทศและการสื่อสาร มหาวิทยาลัยพะเยา มีความสนใจด้านการประยุกต์ใช้ปัญญาประดิษฐ์ (AI) และการพัฒนาซอฟต์แวร์ โดยเฉพาะงานด้าน Computer Vision และ Backend</p>
<p data-i18n="about.experience">มีประสบการณ์ในการพัฒนาและฝึกสอนโมเดล AI สำหรับตรวจจับวัตถุ การเตรียมชุดข้อมูล และการประเมินประสิทธิภาพของโมเดล รวมถึงมีประสบการณ์ใช้งาน Git, Cloudflare และออกแบบส่วนติดต่อผู้ใช้เบื้องต้น</p>
```

In `js/content.js`, set the exact four strings asserted in Step 1, replace `about.goal` with `about.experience` in both languages, and leave all other keys unchanged.

- [ ] **Step 5: Run the focused tests and confirm GREEN**

Run:

```powershell
node --test tests/content.test.mjs
npx playwright test tests/site.spec.js --grep "removes repeated section eyebrows"
```

Expected: all focused tests pass with zero failures.

- [ ] **Step 6: Run the full verification suite**

Run:

```powershell
npm run check
```

Expected: Node tests, Vite build, asset tests, and all Playwright tests pass with zero failures.

- [ ] **Step 7: Inspect desktop and mobile in both languages**

Start the production preview, inspect `#about`, `#skills`, `#education`, `#projects`, and `#contact` at `1440x900` and `390x844`, switch between TH and EN, and confirm:

- no repeated English eyebrow labels appear;
- the About copy has two readable paragraphs;
- headings, navigation, and hero role remain visible;
- there is no horizontal overflow.

- [ ] **Step 8: Commit the verified implementation**

```powershell
git add -- tests/content.test.mjs tests/site.spec.js index.html js/content.js
git commit -m "fix: align Portfolio About copy with experience"
```

### Task 2: Publish and Verify GitHub Pages

**Files:**
- No source files are changed in this task.

**Interfaces:**
- Consumes: Verified `main` commits and the existing GitHub Pages deployment workflow.
- Produces: Public Portfolio containing the revised bilingual About copy and cleaned section headings.

- [ ] **Step 1: Push `main`**

```powershell
git push origin main
```

Expected: remote `origin/main` advances to the local `HEAD` commit.

- [ ] **Step 2: Verify deployment and the live page**

Confirm the GitHub Pages workflow concludes with `success`, then open `https://khongkaphan.github.io/` and verify the five repeated labels are absent and the approved TH/EN About text appears.

- [ ] **Step 3: Confirm repository synchronization**

```powershell
git fetch origin
git rev-parse HEAD
git rev-parse origin/main
```

Expected: the two commit hashes are identical.
