# Khongkaphan Portfolio

A bilingual Thai-first static portfolio for Khongkaphan Kiawsod, built with
Vite, HTML, CSS, and JavaScript.

## Local development

1. Install Node.js 22.
2. Run `npm ci`.
3. Run `npm run dev`.
4. Open the Local URL printed by Vite.

## Quality checks

- `npm test` runs the content tests.
- `npm run build` creates the production site in `dist`.
- `npm run test:assets` checks production asset references and public
  passthrough integrity after a build.
- `npm run test:e2e` runs the Playwright browser tests against the production
  preview, with a separate development server only for the Transcript module
  fixture.

## Publish to GitHub Pages

1. Create a public repository named `Khongkaphan.github.io`.
2. Copy the contents of `portfolio-site` to the repository root.
3. Push the `main` branch.
4. Open Settings → Pages.
5. Set Source to GitHub Actions.
6. Wait for the `Deploy Portfolio to GitHub Pages` workflow.
7. Open `https://khongkaphan.github.io/`.

## Update personal content

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

### Replace a project image

Copy the new file into `public/assets/projects`, then update the matching `src`
in `renderProjects()` inside `js/app.js`. The current Objexify image is
`public/assets/projects/moderation-api.png`. Do not label a generated visual as
a real project screenshot.
