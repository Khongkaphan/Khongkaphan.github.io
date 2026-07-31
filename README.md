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
  preview, with a separate development server only for the Resume module
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

### Add a Resume

1. Copy the PDF to `public/assets/resume/resume.pdf`.
2. Open `js/content.js`.
3. Change `resume: { href: null }` to
   `resume: { href: "/assets/resume/resume.pdf" }`.

### Replace a project image

Copy the new file into `public/assets/projects`, then update the matching `src`
in `renderProjects()` inside `js/app.js`. Do not label a generated visual as a
real project screenshot.

### Add the StockFlow repository

Open `js/content.js`, find the project with `id: "stockflow"`, and replace
`github: null` with the public GitHub repository URL.
