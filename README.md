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

The public asset is an approved one-page flattened visual copy of visible
source page 3, intended for this Portfolio rather than as a signed original.

For future replacements:

1. Include only one page.
2. Render the approved visible source page without cropping or editing it.
3. Include no optional-content layers or form/signature fields.
4. Update the pinned byte length and SHA-256 in `tests/asset-scan.test.mjs`.
5. Run `npm run check` before publishing.

### Replace project media

Objexify media is an ordered `media` array in `js/content.js`. Real project
screenshots are stored under `public/assets/projects` and are also represented
in the Thai static fallback in `index.html`.

When replacing project media, update its `src`, bilingual alt/caption keys,
static fallback markup, and any pinned byte length or SHA-256 in
`tests/asset-scan.test.mjs`, then run `npm run check`. Do not describe a
generated visual as a real project screenshot. Before publishing, require
rights and privacy clearance for every public screenshot, document its source,
contributor, and applicable license reference, and confirm that any visible
faces or sensitive details are approved for public display or removed.
