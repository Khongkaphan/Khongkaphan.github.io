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
2. Push your source code to the `main` branch.
3. Open Settings → Pages.
4. Set Source to GitHub Actions.
5. Wait for the `Deploy Portfolio to GitHub Pages` workflow.
6. Open `https://khongkaphan.github.io/`.

