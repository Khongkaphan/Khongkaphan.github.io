# Transcript Download Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** เปลี่ยนปุ่มและระบบดาวน์โหลดเอกสารจาก Resume เป็น Transcript พร้อมเผยแพร่เฉพาะหน้าที่ 3 ของ PDF ต้นฉบับเป็นไฟล์ PDF หนึ่งหน้า

**Architecture:** คัดลอกหน้าที่ 3 จาก PDF ต้นฉบับเป็น asset ใหม่โดยไม่ rasterize แล้วเปลี่ยน content model, UI module, static fallback และ tests ให้ใช้คำว่า Transcript และ path ใหม่ทั้งหมด การลบ Resume เดิมทำหลัง UI ย้ายเสร็จเพื่อให้แต่ละ Task มีสถานะที่ build และทดสอบได้

**Tech Stack:** Vite 7, HTML5, CSS3, JavaScript ES Modules, Node.js test runner, Playwright, Python `pypdf`/`pdfplumber`, Poppler `pdftoppm`

## Global Constraints

- ปุ่มใช้ข้อความ `Transcript` เหมือนกันทั้งภาษาไทยและอังกฤษ
- Source PDF คือ `C:\Users\khongkaphan\Downloads\ใบรายงานผลการศึกษา ฉบับแปล (ก่อนสำเร็จการศึกษา).pdf`
- ใช้เฉพาะหน้าที่ 3 (zero-based index 2) และ output ต้องมีหนึ่งหน้าเท่านั้น
- Output คือ `public/assets/transcript/transcript.pdf`
- คัดลอกหน้าเดิมโดยไม่ rasterize, crop, redact หรือแก้ข้อมูล
- ผู้ใช้อนุมัติให้เผยแพร่ข้อมูลส่วนตัวในหน้าที่ 3 แบบเดิมทั้งหมด
- ลบ Resume PDF, Resume module, Resume data hooks, Resume content keys และ Resume maintenance instructions เมื่อไม่มี production reference เหลือ
- Missing Transcript href ต้องแสดง disabled button และ localized unavailable status
- Static fallback ต้องมี Transcript link ที่ทำงานได้เมื่อ JavaScript ล้ม
- ไม่เปลี่ยนเนื้อหา/ดีไซน์ส่วนอื่นของ Portfolio
- ไม่ Push หรือ deploy ไป GitHub Pages จนกว่าผู้ใช้จะยืนยันภายหลัง

---

### Task 1: Extract and validate the one-page Transcript PDF

**Files:**
- Create: `public/assets/transcript/transcript.pdf`
- Modify: `tests/asset-scan.test.mjs:15-20`
- Temporary QA output: `tmp/pdfs/transcript-download/page-3.png`

**Interfaces:**
- Consumes: source page `PdfReader(source).pages[2]`
- Produces: `/assets/transcript/transcript.pdf`, a one-page A4 PDF used by Tasks 2-3

- [ ] **Step 1: Add the missing Transcript to the passthrough asset contract**

Add the new asset while temporarily retaining the Resume asset until Task 3:

```js
const passthroughAssets = [
  "assets/avatar.jpg",
  "assets/projects/moderation-api.png",
  "assets/social-preview.png",
  "assets/resume/resume.pdf",
  "assets/transcript/transcript.pdf"
];
```

- [ ] **Step 2: Run the asset test and verify RED**

Run: `npm run build && npm run test:assets`

Expected: FAIL because `public/assets/transcript/transcript.pdf` and its production copy do not exist.

- [ ] **Step 3: Extract source page 3 without rasterizing it**

Run this PowerShell from the repository root using the bundled Python runtime:

```powershell
$env:TRANSCRIPT_SOURCE = 'C:\Users\khongkaphan\Downloads\ใบรายงานผลการศึกษา ฉบับแปล (ก่อนสำเร็จการศึกษา).pdf'
$env:TRANSCRIPT_OUTPUT = Join-Path (Get-Location).Path 'public\assets\transcript\transcript.pdf'
$pdfPython = 'C:\Users\khongkaphan\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe'
New-Item -ItemType Directory -Force -Path 'public\assets\transcript' | Out-Null
@'
import os
from pypdf import PdfReader, PdfWriter

source = PdfReader(os.environ["TRANSCRIPT_SOURCE"])
if len(source.pages) != 3:
    raise ValueError(f"Expected 3 source pages, got {len(source.pages)}")

writer = PdfWriter()
writer.add_page(source.pages[2])
with open(os.environ["TRANSCRIPT_OUTPUT"], "wb") as stream:
    writer.write(stream)
'@ | & $pdfPython -
```

- [ ] **Step 4: Validate page count, dimensions, and GPA content**

Use `pypdf` for structure and `pdfplumber` for text because the source's Thai font structure raises `/DescendantFonts` errors in `pypdf.extract_text()`:

```powershell
$env:TRANSCRIPT_SOURCE = 'C:\Users\khongkaphan\Downloads\ใบรายงานผลการศึกษา ฉบับแปล (ก่อนสำเร็จการศึกษา).pdf'
$env:TRANSCRIPT_OUTPUT = Join-Path (Get-Location).Path 'public\assets\transcript\transcript.pdf'
$pdfPython = 'C:\Users\khongkaphan\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe'
@'
import os
import pdfplumber
from pypdf import PdfReader

source = PdfReader(os.environ["TRANSCRIPT_SOURCE"])
output = PdfReader(os.environ["TRANSCRIPT_OUTPUT"])
assert len(output.pages) == 1, len(output.pages)
source_box = source.pages[2].mediabox
output_box = output.pages[0].mediabox
assert float(source_box.width) == float(output_box.width)
assert float(source_box.height) == float(output_box.height)

with pdfplumber.open(os.environ["TRANSCRIPT_OUTPUT"]) as pdf:
    text = pdf.pages[0].extract_text() or ""
assert "3.47" in text
print("validated: one page, matching dimensions, GPA 3.47 present")
'@ | & $pdfPython -
```

Expected: `validated: one page, matching dimensions, GPA 3.47 present`.

- [ ] **Step 5: Render and visually inspect the extracted page**

```powershell
$qa = 'tmp\pdfs\transcript-download'
New-Item -ItemType Directory -Force -Path $qa | Out-Null
$pdftoppm = 'C:\Users\khongkaphan\.cache\codex-runtimes\codex-primary-runtime\dependencies\native\poppler\Library\bin\pdftoppm.exe'
& $pdftoppm -f 1 -l 1 -singlefile -png -r 150 `
  'public\assets\transcript\transcript.pdf' "$qa\page-3"
```

Inspect `tmp/pdfs/transcript-download/page-3.png` with `view_image` at original detail. Confirm the university header, student data, both grade-table columns, GPA `3.47`, QR Code, footer, and visible digital-signature area are sharp and unclipped.

- [ ] **Step 6: Run the asset test and verify GREEN**

Run: `npm run build && npm run test:assets`

Expected: all asset tests PASS and the Transcript asset is byte-identical between `public` and `dist`.

- [ ] **Step 7: Commit the validated Transcript asset**

```bash
git add tests/asset-scan.test.mjs public/assets/transcript/transcript.pdf
git commit -m "feat: add one-page Transcript asset"
```

---

### Task 2: Replace the Resume content and UI module with Transcript

**Files:**
- Modify: `tests/content.test.mjs:50-61`
- Modify: `tests/site.spec.js:268-329,352-408`
- Modify: `js/content.js:16,50,68,102,167`
- Rename: `js/resume.js` to `js/transcript.js`
- Modify: `js/app.js:5,157`
- Modify: `index.html:54-58`

**Interfaces:**
- Consumes: `/assets/transcript/transcript.pdf` from Task 1
- Produces: `portfolioContent.transcript.href`, `updateTranscript(language)`, `initializeTranscript()`, `[data-transcript-link]`, `[data-transcript-status]`

- [ ] **Step 1: Write failing content-model tests**

Replace the Resume assertion with:

```js
test("Transcript is configured and Resume content is absent", () => {
  assert.equal(
    portfolioContent.transcript.href,
    "/assets/transcript/transcript.pdf"
  );
  assert.equal("resume" in portfolioContent, false);
  assert.equal(getText("th", "hero.transcript"), "Transcript");
  assert.equal(getText("en", "hero.transcript"), "Transcript");
  assert.equal(
    getText("th", "transcript.unavailable"),
    "ยังไม่ได้เพิ่มไฟล์ Transcript"
  );
  assert.equal(
    getText("en", "transcript.unavailable"),
    "Transcript file has not been added"
  );

  for (const language of ["th", "en"]) {
    const keys = Object.keys(portfolioContent.translations[language]);
    assert.equal(keys.some((key) => key.toLowerCase().includes("resume")), false);
  }
});
```

- [ ] **Step 2: Replace Resume Playwright expectations with Transcript expectations**

The unavailable/configured state test must route `js/content.js` and replace:

```js
'transcript: { href: "/assets/transcript/transcript.pdf" }'
```

with:

```js
"transcript: { href: null }"
```

It must import and assert the renamed module:

```js
const moduleExports = await page.evaluate(async () =>
  Object.keys(await import("/js/transcript.js")).sort()
);
expect(moduleExports).toEqual(["initializeTranscript", "updateTranscript"]);
```

Assert the unavailable state and the idempotent transition back to a configured link:

```js
await expect(page.getByRole("button", { name: "Transcript" })).toBeDisabled();
await expect(page.getByText("ยังไม่ได้เพิ่มไฟล์ Transcript")).toBeVisible();

await page.evaluate(async () => {
  const { portfolioContent } = await import("/js/content.js");
  const { updateTranscript } = await import("/js/transcript.js");
  portfolioContent.transcript.href = "/assets/transcript/transcript.pdf";
  updateTranscript("en");
  updateTranscript("en");
});

const control = page.locator("[data-transcript-link]");
await expect(control).toHaveCount(1);
await expect(control).toHaveText("Transcript");
await expect(control).toHaveAttribute("href", "/assets/transcript/transcript.pdf");
await expect(control).toHaveAttribute("target", "_blank");
await expect(control).toHaveAttribute("rel", "noopener noreferrer");
```

Rename the configured-document test to `exposes the configured Transcript in Thai and English`, change its selectors/path/labels, and assert the response starts with `%PDF-`. Update the no-JavaScript fallback test to use `[data-transcript-link]`, `/assets/transcript/transcript.pdf`, and `[data-transcript-status]`.

- [ ] **Step 3: Run focused tests and verify RED**

Run:

```powershell
node --test --test-name-pattern="Transcript|Resume" tests/content.test.mjs
npx playwright test -g "Transcript|static fallback"
```

Expected: FAIL because the content model, module exports, DOM hooks, labels, and href still use Resume.

- [ ] **Step 4: Replace Resume keys and config in `js/content.js`**

Use these exact keys and values in both translation maps:

```js
"hero.transcript": "Transcript",
"transcript.unavailable": "ยังไม่ได้เพิ่มไฟล์ Transcript"
```

```js
"hero.transcript": "Transcript",
"transcript.unavailable": "Transcript file has not been added"
```

Replace the config with:

```js
transcript: { href: "/assets/transcript/transcript.pdf" },
```

- [ ] **Step 5: Rename and update the document-state module**

Run `git mv js/resume.js js/transcript.js`, then replace the module with:

```js
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
```

The implementation must preserve `type="button"`, idempotent replacement, `target="_blank"`, and `rel="noopener noreferrer"` from the existing Resume module.

- [ ] **Step 6: Wire the renamed module and static fallback**

In `js/app.js`:

```js
import { initializeTranscript } from "./transcript.js";
// ...
initializeTranscript();
```

In `index.html`:

```html
<a class="button secondary" data-transcript-link
  href="/assets/transcript/transcript.pdf" target="_blank"
  rel="noopener noreferrer" data-i18n="hero.transcript">Transcript</a>
<p class="resume-status" data-transcript-status aria-live="polite"></p>
```

Keep the existing `.resume-status` CSS class because it is presentation-only and renaming it would add no user-facing value. All behavioral/data hooks must use Transcript terminology.

- [ ] **Step 7: Run content, build, and focused browser tests**

Run:

```powershell
npm test
npm run build
npx playwright test -g "Transcript|static fallback|switches between Thai and English"
```

Expected: all selected tests PASS; both languages display `Transcript`, the configured link opens the new one-page PDF, and the unavailable state uses the localized message.

- [ ] **Step 8: Commit the Transcript content and UI migration**

```bash
git add -A -- tests/content.test.mjs tests/site.spec.js js/content.js js/app.js js/transcript.js js/resume.js index.html
git commit -m "feat: replace Resume download with Transcript"
```

---

### Task 3: Remove Resume remnants, document Transcript maintenance, and verify production

**Files:**
- Modify: `tests/asset-scan.test.mjs:15-20,57-69`
- Modify: `README.md:13-45`
- Delete: `public/assets/resume/resume.pdf`
- Delete: `public/assets/resume/.gitkeep`

**Interfaces:**
- Consumes: production Transcript URL and module from Tasks 1-2
- Produces: a repository and build with no Resume asset/reference and a fully verified Transcript flow

- [ ] **Step 1: Make asset tests require removal of the old Resume asset**

Remove `assets/resume/resume.pdf` from `passthroughAssets`. Replace the old Resume-directory marker test with:

```js
test("removed Resume assets are absent from source and build", () => {
  for (const removed of [
    "assets/resume/resume.pdf",
    "assets/resume/.gitkeep"
  ]) {
    assert.equal(existsSync(join(publicRoot, removed)), false);
    assert.equal(existsSync(join(distRoot, removed)), false);
  }
});
```

Keep the certificate-directory absence assertion in its own test:

```js
test("the removed certificate feature leaves no public directory", () => {
  assert.equal(existsSync(join(publicRoot, "assets/certificates")), false);
});
```

- [ ] **Step 2: Run the asset tests and verify RED**

Run: `npm run build && npm run test:assets`

Expected: FAIL because the Resume PDF and `.gitkeep` still exist under `public/assets/resume` and are copied into `dist`.

- [ ] **Step 3: Delete only the obsolete Resume assets**

Delete these exact tracked files:

```text
public/assets/resume/resume.pdf
public/assets/resume/.gitkeep
```

Do not delete `public/assets/transcript/transcript.pdf` or any project image.

- [ ] **Step 4: Update README terminology and maintenance instructions**

Change the quality-check description to `Transcript module fixture`. Replace `### Add a Resume` with:

```markdown
### Replace the Transcript

1. Extract the approved source page as a one-page PDF.
2. Replace `public/assets/transcript/transcript.pdf`.
3. Keep `transcript: { href: "/assets/transcript/transcript.pdf" }` in
   `js/content.js`.
4. Run `npm run check` before publishing.
```

- [ ] **Step 5: Build and verify the cleaned assets**

Run: `npm run build && npm run test:assets`

Expected: all asset tests PASS; `dist/assets/transcript/transcript.pdf` exists and neither source nor `dist` contains the old Resume files.

- [ ] **Step 6: Scan production sources for stale Resume behavior**

Run:

```powershell
rg -n -i "data-resume|assets/resume/resume\.pdf|portfolioContent\.resume|hero\.resume|resume\.unavailable|js/resume\.js|Add a Resume|Download Resume|ดาวน์โหลด Resume" index.html js README.md public
```

Expected: no matches. Tests intentionally retain removed Resume paths in absence assertions and are excluded from this production-source scan. The CSS class `.resume-status` is intentionally retained as presentation-only and is excluded from this behavioral scan.

- [ ] **Step 7: Revalidate and render the final PDF asset**

Re-run Task 1's one-page/dimension/GPA validation and render command against `public/assets/transcript/transcript.pdf`. Inspect the latest PNG and confirm no clipping, blur, missing table content, broken QR Code, or missing signature area.

- [ ] **Step 8: Run the complete project verification**

Run: `npm run check`

Expected: 0 failures across Node tests, Vite build, asset tests, and Playwright tests.

- [ ] **Step 9: Verify repository scope and commit**

Run `git diff --check` and `git status --short`. Confirm only the approved Transcript/Resume cleanup files are changed and `.superpowers/` plus `tmp/` remain untracked and unstaged.

```bash
git add -A -- tests/asset-scan.test.mjs README.md public/assets/resume
git commit -m "chore: remove obsolete Resume assets"
```
