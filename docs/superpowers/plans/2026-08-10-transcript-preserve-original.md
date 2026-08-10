# Preserve the Original Transcript PDF Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publish the untouched three-page university PDF and make every Transcript control open it directly at page 3.

**Architecture:** Keep the original PDF as a Vite public passthrough asset so all document-level optional-content and signature structures remain byte-for-byte intact. The content configuration and static HTML fallback both append `#page=3`; the browser consumes that fragment only as an initial-view instruction while the downloadable file remains the complete original.

**Tech Stack:** HTML, JavaScript ES modules, Node.js test runner, Vite, Playwright, GitHub Pages, PDF/Poppler verification tools.

## Global Constraints

- Store the exact original three-page PDF without rewriting, splitting, rasterizing, cropping, or redacting it.
- Keep the public asset path `/assets/transcript/transcript.pdf`.
- Use `/assets/transcript/transcript.pdf#page=3` for both the JavaScript configuration and static HTML fallback.
- Keep the visible label `Transcript` in Thai and English.
- Preserve `target="_blank"` and `rel="noopener noreferrer"`.
- Do not modify unrelated Portfolio content or visual design.
- The complete three-page document is intentionally public; the fragment does not hide pages 1 and 2.
- Publish only after the full verification suite passes.

## File Structure

- Modify `tests/content.test.mjs`: protect the configured page-3 URL.
- Modify `tests/site.spec.js`: protect enhanced and no-JavaScript page-3 links.
- Modify `js/content.js`: provide the canonical Transcript page-3 URL.
- Modify `index.html`: provide the same URL without JavaScript.
- Modify `tests/asset-scan.test.mjs`: protect the exact original-PDF hash and public passthrough behavior.
- Replace `public/assets/transcript/transcript.pdf`: store the original university PDF byte-for-byte.
- Modify `README.md`: document the integrity-preserving replacement procedure.

---

### Task 1: Page-3 Transcript Link Contract

**Files:**
- Modify: `tests/content.test.mjs:50-54`
- Modify: `tests/site.spec.js:268-329, 405-407`
- Modify: `js/content.js:167`
- Modify: `index.html:54-55`

**Interfaces:**
- Consumes: `portfolioContent.transcript.href: string` and the `[data-transcript-link]` HTML contract.
- Produces: the literal URL `/assets/transcript/transcript.pdf#page=3` in configuration and static fallback markup.

- [ ] **Step 1: Write the failing configuration test**

Change the existing expectation in `tests/content.test.mjs` to the independently specified literal:

```js
assert.equal(
  portfolioContent.transcript.href,
  "/assets/transcript/transcript.pdf#page=3"
);
```

- [ ] **Step 2: Run the unit test and verify RED**

Run:

```powershell
node --test tests/content.test.mjs
```

Expected: FAIL in `Transcript is configured and Resume content is absent`, reporting actual `/assets/transcript/transcript.pdf` instead of the expected URL ending in `#page=3`.

- [ ] **Step 3: Add failing browser-contract expectations**

In `tests/site.spec.js`, change every production Transcript-link expectation to:

```js
await expect(control).toHaveAttribute(
  "href",
  "/assets/transcript/transcript.pdf#page=3"
);
```

Update the unavailable-state route replacement to search for the future configured source:

```js
body: body.replace(
  'transcript: { href: "/assets/transcript/transcript.pdf#page=3" }',
  "transcript: { href: null }"
)
```

Update the module restoration inside the test to use the same URL:

```js
portfolioContent.transcript.href =
  "/assets/transcript/transcript.pdf#page=3";
```

The asset request remains `/assets/transcript/transcript.pdf` because URL fragments are not sent to the server.

- [ ] **Step 4: Implement the minimal production change**

Change `js/content.js` to:

```js
transcript: { href: "/assets/transcript/transcript.pdf#page=3" },
```

Change the static fallback in `index.html` to:

```html
<a class="button secondary" data-transcript-link
  href="/assets/transcript/transcript.pdf#page=3"
  target="_blank" rel="noopener noreferrer"
  data-i18n="hero.transcript">Transcript</a>
```

Do not modify `js/transcript.js`; it already assigns the configured `href` when it recreates the control.

- [ ] **Step 5: Verify GREEN for link behavior**

Run:

```powershell
npm run test
npx playwright test tests/site.spec.js --grep "Transcript|static fallback"
```

Expected: 10 Node tests pass, and every selected Playwright test passes with the page-3 URL while retaining safe new-tab attributes.

- [ ] **Step 6: Commit the link contract**

```powershell
git add -- tests/content.test.mjs tests/site.spec.js js/content.js index.html
git commit -m "fix: open Transcript at original page three"
```

---

### Task 2: Original PDF Integrity and Documentation

**Files:**
- Modify: `tests/asset-scan.test.mjs`
- Replace: `public/assets/transcript/transcript.pdf`
- Modify: `README.md:35-41`

**Interfaces:**
- Consumes: the university source PDF at `C:\Users\khongkaphan\Downloads\ใบรายงานผลการศึกษา ฉบับแปล (ก่อนสำเร็จการศึกษา).pdf`.
- Produces: `public/assets/transcript/transcript.pdf` with SHA-256 `3f6c0ed68ee478d3d4fa1b55de61cb642813acd274b9a03dcae908829536c1b7` and byte length `361782`.

- [ ] **Step 1: Write the failing original-document regression test**

Add this constant below `passthroughAssets` in `tests/asset-scan.test.mjs`:

```js
const originalTranscript = {
  bytes: 361782,
  sha256: "3f6c0ed68ee478d3d4fa1b55de61cb642813acd274b9a03dcae908829536c1b7"
};
```

Add this test after the public-passthrough test:

```js
test("Transcript is the untouched original university PDF", () => {
  const path = join(publicRoot, "assets/transcript/transcript.pdf");
  const contents = readFileSync(path);

  assert.equal(contents.length, originalTranscript.bytes);
  assert.equal(sha256(path), originalTranscript.sha256);
});
```

This catches replacing the original with an extracted, rewritten, rasterized, or otherwise altered PDF. The expected hash is derived independently from the user-provided source file.

- [ ] **Step 2: Build and verify RED**

Run:

```powershell
npm run build
node --test tests/asset-scan.test.mjs
```

Expected: FAIL in `Transcript is the untouched original university PDF`; the current extracted PDF is `348352` bytes and does not have the expected SHA-256.

- [ ] **Step 3: Replace the asset byte-for-byte**

Run this exact copy operation without opening the file in a PDF editor:

```powershell
Copy-Item -LiteralPath `
  'C:\Users\khongkaphan\Downloads\ใบรายงานผลการศึกษา ฉบับแปล (ก่อนสำเร็จการศึกษา).pdf' `
  -Destination 'public\assets\transcript\transcript.pdf' `
  -Force
```

- [ ] **Step 4: Update replacement instructions**

Replace the Transcript section in `README.md` with:

```markdown
### Replace the Transcript

1. Use the original university PDF without extracting, rewriting, cropping,
   rasterizing, or redacting pages.
2. Replace `public/assets/transcript/transcript.pdf` byte-for-byte.
3. Keep
   `transcript: { href: "/assets/transcript/transcript.pdf#page=3" }` in
   `js/content.js`; the fragment controls only the initially displayed page.
4. Update the expected SHA-256 and byte length in
   `tests/asset-scan.test.mjs` only when the university issues a genuinely new
   original document.
5. From the repository root, validate the replacement's structure against the
   current checkout (not another worktree):

   ```powershell
   $env:TRANSCRIPT_PDF =
     (Resolve-Path 'public\assets\transcript\transcript.pdf').Path
   @'
   import os
   from pypdf import PdfReader

   reader = PdfReader(os.environ["TRANSCRIPT_PDF"])
   assert len(reader.pages) == 3
   assert "/OCProperties" in reader.trailer["/Root"]
   assert "Signature1" in (reader.get_fields() or {})
   print("pages=3, OCProperties=present, Signature1=present")
   '@ | & 'C:\Users\khongkaphan\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe' -
   ```

   The command must report `pages=3, OCProperties=present,
   Signature1=present`.
6. Run `npm run check` before publishing.
```

- [ ] **Step 5: Verify GREEN and document integrity**

Run:

```powershell
npm run build
node --test tests/asset-scan.test.mjs
Get-FileHash -Algorithm SHA256 -LiteralPath `
  'public\assets\transcript\transcript.pdf'
Get-FileHash -Algorithm SHA256 -LiteralPath `
  'dist\assets\transcript\transcript.pdf'
```

Expected: 6 asset tests pass; both hashes equal `3F6C0ED68EE478D3D4FA1B55DE61CB642813ACD274B9A03DCAE908829536C1B7`.

- [ ] **Step 6: Verify page count, optional-content configuration, and signature field**

Run:

```powershell
$env:TRANSCRIPT_PDF =
  (Resolve-Path 'public\assets\transcript\transcript.pdf').Path
$env:PYTHONIOENCODING = 'utf-8'
@'
import os
from pypdf import PdfReader

reader = PdfReader(os.environ["TRANSCRIPT_PDF"])
assert len(reader.pages) == 3
assert "/OCProperties" in reader.trailer["/Root"]
assert "Signature1" in (reader.get_fields() or {})
print("pages=3, OCProperties=present, Signature1=present")
'@ | & 'C:\Users\khongkaphan\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe' -
```

Expected: `pages=3, OCProperties=present, Signature1=present`.

- [ ] **Step 7: Render and visually compare page 3**

Run:

```powershell
$renderer = 'C:\Users\khongkaphan\.cache\codex-runtimes\codex-primary-runtime\dependencies\native\poppler\Library\bin\pdftoppm.exe'
New-Item -ItemType Directory -Force -Path 'tmp\pdfs\original-transcript-qa' |
  Out-Null
& $renderer -f 3 -l 3 -png -r 150 `
  'public\assets\transcript\transcript.pdf' `
  'tmp\pdfs\original-transcript-qa\page'
```

Inspect `tmp/pdfs/original-transcript-qa/page-3.png`. It must match the source rendering, including the registrar/digital-signature area, and must not display the previously exposed `Copy of Official Document` layer.

- [ ] **Step 8: Commit the original asset and integrity guard**

```powershell
git add -- tests/asset-scan.test.mjs public/assets/transcript/transcript.pdf README.md
git commit -m "fix: preserve original Transcript document"
```

---

### Task 3: Full Verification Before Final Review

**Files:**
- Verify only: all tracked files from Tasks 1 and 2

**Interfaces:**
- Consumes: verified feature `HEAD` commits from the current worktree.
- Produces: a fully verified feature branch ready for the required final whole-branch review.

- [ ] **Step 1: Run the complete fresh verification suite**

```powershell
npm run check
```

Expected: 10 Node tests pass, Vite production build succeeds, 6 asset tests pass, and 22 Playwright tests pass with zero failures.

- [ ] **Step 2: Inspect the exact tracked diff and working-tree boundaries**

```powershell
git status --short --branch
git log --oneline origin/main..HEAD
git diff --check origin/main..HEAD
```

Expected: only the approved design/plan, link-contract, test, README, and Transcript asset commits are included in the `origin/main..HEAD` feature range; the ignored SDD workspace and permitted untracked `tmp/` may remain uncommitted, while tracked working-tree files remain unchanged.

- [ ] **Step 3: Record verification evidence for final review**

```powershell
git rev-parse HEAD
git status --short --branch
```

Expected: the feature branch has no tracked working-tree changes and its HEAD identifies the exact revision covered by `npm run check`.

## Post-SDD Integration and Publication

After all three tasks pass their scoped reviews and the final whole-branch
review is clean:

1. Use `superpowers:finishing-a-development-branch`.
2. Merge `codex/transcript-original` into local `main`.
3. Run `npm run check` again from the exact merged `main` revision.
4. Push `main` to `origin` only after the merged verification passes.
5. Wait for the GitHub Pages workflow to complete.
6. Verify the published PDF hash and page-3 link using the checks below.

### Published-Site Checks

After the GitHub Pages workflow completes, run:

```powershell
$online = Join-Path $env:TEMP 'portfolio-transcript-online.pdf'
Invoke-WebRequest -UseBasicParsing `
  -Uri 'https://khongkaphan.github.io/assets/transcript/transcript.pdf?integrity=20260810' `
  -OutFile $online
(Get-FileHash -Algorithm SHA256 -LiteralPath $online).Hash
```

Expected: `3F6C0ED68EE478D3D4FA1B55DE61CB642813ACD274B9A03DCAE908829536C1B7`.

Open `https://khongkaphan.github.io/`, activate `Transcript`, and verify the new tab URL ends with `/assets/transcript/transcript.pdf#page=3` and initially displays page 3 with the original signature appearance.
