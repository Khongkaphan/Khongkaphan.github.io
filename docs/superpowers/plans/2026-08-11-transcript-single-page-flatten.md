# Single-Page Flattened Transcript Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the public three-page Transcript with a visually faithful flattened PDF containing only source page 3.

**Architecture:** Render source page 3 at 300 DPI and embed that fixed image into a new one-page PDF at the source page dimensions. Keep the existing public asset path, remove the obsolete `#page=3` fragment from all link sources, and pin the generated asset's exact bytes and SHA-256 in the existing public-passthrough tests.

**Tech Stack:** HTML, JavaScript ES modules, Node.js test runner, Vite, Playwright, Poppler, Python, Pillow, ReportLab, pypdf, GitHub Pages.

## Global Constraints

- Publish only human-visible source page 3; pages 1 and 2 must not exist in the new PDF.
- Render at 300 DPI and create exactly one PDF page without cropping, redaction, or visible-text edits.
- The flattened PDF is a visual Portfolio copy, not a cryptographically signed document.
- Keep public path `/assets/transcript/transcript.pdf` and remove `#page=3` from configuration, fallback markup, and tests.
- Keep visible label `Transcript` in Thai and English.
- Preserve `target="_blank"` and `rel="noopener noreferrer"`.
- Make no unrelated Portfolio content or visual-design changes.
- The generated binary is an explicit TDD exception: its exact byte length and SHA-256 can be pinned only after generation. Link behavior still follows strict RED-GREEN TDD.
- Publish only after scoped reviews, final review, local merge, and a fresh merged-main `npm run check`.

## File Structure

- Modify `tests/content.test.mjs`: require the fragment-free Transcript URL.
- Modify `tests/site.spec.js`: require fragment-free enhanced and no-JavaScript links.
- Modify `js/content.js`: provide the fragment-free configured URL.
- Modify `index.html`: provide the same static fallback URL.
- Replace `public/assets/transcript/transcript.pdf`: store one flattened page only.
- Modify `tests/asset-scan.test.mjs`: pin the flattened artifact's identity and rename the guard.
- Modify `README.md`: document that the published asset is a one-page flattened Portfolio copy.

---

### Task 1: Remove the Obsolete Page Fragment

**Files:**
- Modify: `tests/content.test.mjs:50-54`
- Modify: `tests/site.spec.js:268-335, 411-418`
- Modify: `js/content.js:167`
- Modify: `index.html:54-55`

**Interfaces:**
- Consumes: `portfolioContent.transcript.href: string` and `[data-transcript-link]`.
- Produces: `/assets/transcript/transcript.pdf` in configuration, enhanced UI, and static fallback.

- [ ] **Step 1: Write the failing unit expectation**

Change the existing expectation in `tests/content.test.mjs` to:

```js
assert.equal(
  portfolioContent.transcript.href,
  "/assets/transcript/transcript.pdf"
);
```

- [ ] **Step 2: Verify RED**

Run:

```powershell
node --test tests/content.test.mjs
```

Expected: the Transcript configuration test fails because the current actual value ends with `#page=3`.

- [ ] **Step 3: Update browser expectations before production code**

Replace every Transcript-link expectation and test fixture value in
`tests/site.spec.js` with the literal:

```js
"/assets/transcript/transcript.pdf"
```

The unavailable-state route must search for:

```js
'transcript: { href: "/assets/transcript/transcript.pdf" }'
```

and replace it with the existing null configuration. Retain every text,
`target`, and `rel` assertion.

- [ ] **Step 4: Implement the minimal link change**

Change `js/content.js` to:

```js
transcript: { href: "/assets/transcript/transcript.pdf" },
```

Change the static fallback in `index.html` to:

```html
<a class="button secondary" data-transcript-link
  href="/assets/transcript/transcript.pdf"
  target="_blank" rel="noopener noreferrer"
  data-i18n="hero.transcript">Transcript</a>
```

Do not modify `js/transcript.js`.

- [ ] **Step 5: Verify GREEN**

Run:

```powershell
npm run test
npx playwright test tests/site.spec.js --grep "Transcript|static fallback"
```

Expected: 10 Node tests and all selected Transcript/static-fallback Playwright tests pass.

- [ ] **Step 6: Commit Task 1**

```powershell
git add -- tests/content.test.mjs tests/site.spec.js js/content.js index.html
git commit -m "fix: link directly to single-page Transcript"
```

---

### Task 2: Generate and Guard the Flattened Page

**Files:**
- Replace: `public/assets/transcript/transcript.pdf`
- Modify: `tests/asset-scan.test.mjs:21-24, 55-61`
- Modify: `README.md:35-66`
- Generate for QA only: `tmp/pdfs/transcript-single-page/source-page3-3.png`
- Generate for QA only: `tmp/pdfs/transcript-single-page/output-page1-1.png`

**Interfaces:**
- Consumes: `C:\Users\khongkaphan\Downloads\ใบรายงานผลการศึกษา ฉบับแปล (ก่อนสำเร็จการศึกษา).pdf`, human-visible page index 3.
- Produces: `public/assets/transcript/transcript.pdf`, exactly one flattened image page.

- [ ] **Step 1: Load the bundled PDF runtime paths**

Use `codex_app__load_workspace_dependencies` and record its Python executable.
Locate `pdftoppm.exe` under the returned runtime's
`dependencies/native/poppler/Library/bin/` directory. Do not commit either
machine-specific path to README.

- [ ] **Step 2: Render source page 3 at 300 DPI**

Create `tmp/pdfs/transcript-single-page/`, then run Poppler with these exact
arguments:

```powershell
& $pdftoppmExe -f 3 -l 3 -png -r 300 `
  $sourcePdf `
  'tmp\pdfs\transcript-single-page\source-page3'
```

Expected output:
`tmp/pdfs/transcript-single-page/source-page3-3.png`.

- [ ] **Step 3: Generate the one-page PDF**

Set environment variables `SOURCE_PDF`, `SOURCE_PNG`, and `OUTPUT_PDF`, then
run this script with the bundled Python executable:

```python
import os
from pathlib import Path
from PIL import Image
from pypdf import PdfReader
from reportlab.lib.utils import ImageReader
from reportlab.pdfgen.canvas import Canvas

source_pdf = Path(os.environ["SOURCE_PDF"])
source_png = Path(os.environ["SOURCE_PNG"])
output_pdf = Path(os.environ["OUTPUT_PDF"])

reader = PdfReader(str(source_pdf))
page = reader.pages[2]
width = float(page.mediabox.width)
height = float(page.mediabox.height)

with Image.open(source_png) as image:
    assert image.width > 2400
    assert image.height > 3400

canvas = Canvas(
    str(output_pdf),
    pagesize=(width, height),
    pageCompression=1,
    invariant=1,
)
canvas.setTitle("Transcript - Page 3")
canvas.setSubject("Single-page flattened visual copy for Portfolio")
canvas.drawImage(
    ImageReader(str(source_png)),
    0,
    0,
    width=width,
    height=height,
    preserveAspectRatio=False,
    mask="auto",
)
canvas.showPage()
canvas.save()
```

Set `OUTPUT_PDF` to the current worktree's
`public/assets/transcript/transcript.pdf`. Do not write to another checkout.

- [ ] **Step 4: Verify one-page privacy and fixed-layer structure**

Run with the bundled Python executable:

```python
import os
from pypdf import PdfReader

reader = PdfReader(os.environ["OUTPUT_PDF"])
assert len(reader.pages) == 1
assert "/OCProperties" not in reader.trailer["/Root"]
assert not (reader.get_fields() or {})
print("pages=1, optional-content=absent, form-fields=absent")
```

Expected: `pages=1, optional-content=absent, form-fields=absent`.

- [ ] **Step 5: Render and inspect the generated output**

```powershell
& $pdftoppmExe -f 1 -l 1 -png -r 300 `
  'public\assets\transcript\transcript.pdf' `
  'tmp\pdfs\transcript-single-page\output-page1'
```

Use `view_image` on both source and output PNGs at original detail. Confirm:

- both renders have the same dimensions and complete A4 framing;
- all tables, grades, QR code, footer, and registrar/signature area are sharp;
- no content is cropped or redacted;
- `Copy of Official Document` is not visible.

- [ ] **Step 6: Pin the generated identity**

Run:

```powershell
$asset = Get-Item -LiteralPath 'public\assets\transcript\transcript.pdf'
$hash = Get-FileHash -Algorithm SHA256 -LiteralPath $asset.FullName
$asset.Length
$hash.Hash.ToLowerInvariant()
```

Rename `originalTranscript` to `flattenedTranscript` in
`tests/asset-scan.test.mjs`, replace its `bytes` and `sha256` literals with the
exact printed values, and rename the test to:

```js
test("Transcript is the approved single-page flattened PDF", () => {
```

Keep the real length/hash assertions and the existing Vite public-passthrough
test unchanged.

- [ ] **Step 7: Update README**

Replace the Transcript instructions with a concise statement that the public
asset is an approved one-page flattened visual copy of source page 3. Document
that future replacements must:

1. contain only one page;
2. be rendered from the approved visible page without cropping or editing;
3. contain no optional-content layers or form/signature fields;
4. update the pinned byte length and SHA-256;
5. run `npm run check`.

Do not include a user-specific Python or Poppler executable path.

- [ ] **Step 8: Build and verify the asset guard**

```powershell
npm run build
node --test tests/asset-scan.test.mjs
```

Expected: 6 asset tests pass, including the renamed flattened-PDF identity
test and byte-identical Vite passthrough.

- [ ] **Step 9: Commit Task 2**

```powershell
git add -- public/assets/transcript/transcript.pdf tests/asset-scan.test.mjs README.md
git commit -m "fix: publish only flattened Transcript page three"
```

---

### Task 3: Full Verification Before Review

**Files:**
- Verify only: tracked changes from Tasks 1 and 2

**Interfaces:**
- Consumes: the exact feature `HEAD` in its isolated worktree.
- Produces: a fully verified branch ready for scoped and final review.

- [ ] **Step 1: Run the complete suite**

```powershell
npm run check
```

Expected: 10 Node tests, Vite build, 6 asset tests, and 22 Playwright tests
pass with zero failures.

- [ ] **Step 2: Verify the complete feature range**

```powershell
git status --short --branch
git log --oneline origin/main..HEAD
git diff --check origin/main..HEAD
git rev-parse HEAD
```

Expected: no tracked working-tree changes; only approved commits are ahead of
`origin/main`; diff check emits no output.

- [ ] **Step 3: Record final PDF evidence**

Record the generated PDF's exact SHA-256, byte length, one-page count, absent
`/OCProperties`, absent form fields, and successful visual QA in the Task 3
report for final review.

## Post-Review Integration and Publication

After every task review and final whole-branch review passes:

1. Merge the feature branch into local `main`.
2. Run `npm run check` again on merged `main`.
3. Remove only the feature worktree and branch after merged verification.
4. Push `main` to `origin`.
5. Wait for GitHub Pages deployment success.
6. Download the online PDF and require the pinned SHA-256 and one-page count.
7. Confirm live HTML links to `/assets/transcript/transcript.pdf` without
   `#page=3`.
