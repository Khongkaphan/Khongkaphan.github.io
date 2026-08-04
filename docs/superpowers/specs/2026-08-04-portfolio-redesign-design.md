# Portfolio Redesign Design

## Objective

Rebuild Khongkaphan Kiawsod's portfolio as a recruiter-first website for
Software Developer Intern applications. Replace the existing markup, styling,
and behavior. Preserve only the verified bilingual content and existing media
assets: the profile photo, project screenshots, social preview, and Resume PDF.

## Design Direction

Use the approved **Recruiter-first Minimal + Balanced Motion** direction.

- Use a light neutral surface, dark navy text, and a restrained cobalt accent.
- Make the role, selected work, core skills, Resume, and contact paths scannable
  within the first viewport or immediately after it.
- Use generous spacing, strong typography, and a small number of clear actions.
- Treat motion as feedback and hierarchy, not decoration.
- Preserve Thai and English as equal first-class experiences.

## Information Architecture

The single-page site contains these sections in order:

1. **Header** — brand/name, section links, TH/EN switch, and mobile menu.
2. **Hero** — Software Developer Intern positioning, concise summary, profile
   photo, availability status, Projects CTA, Resume CTA, and Contact CTA.
3. **Skills snapshot** — the existing verified skills grouped for rapid scanning.
4. **Selected projects** — AI Moderation API and StockFlow, each showing the
   problem, Khongkaphan's role, key contribution, stack, screenshot, and valid
   repository link when one exists.
5. **About and education** — existing biography, career goal, degree,
   institution, study period, and GPA.
6. **Contact** — verified email and existing external profile links.
7. **Footer** — name, role, current year, and compact navigation.

The page must not add invented experience, project metrics, testimonials,
employment history, or availability dates.

## Architecture

Keep the site static and Vite-based. Do not migrate to React or another UI
framework. Use semantic HTML as the reliable baseline and small ES modules for
progressive enhancement.

### HTML

`index.html` contains meaningful Thai fallback content, semantic landmarks,
correct heading order, metadata, and all essential links. The site remains
readable and navigable if JavaScript fails.

### CSS

Replace the existing styles with focused layers:

- `css/global.css` — design tokens, reset, typography, shared utilities, focus
  treatment, and global motion policy.
- `css/sections.css` — header, hero, skill groups, project rows, biography,
  education, contact, and footer.
- `css/responsive.css` — mobile/tablet adaptations and input-mode behavior.

Prefer transforms and opacity for animated elements. Avoid layout-shifting
animation, custom cursors, WebGL, autoplay media, and animation that blocks
navigation or content.

### JavaScript

Replace the behavior modules while keeping responsibilities separate:

- `js/content.js` — preserved Thai/English content and asset/link data.
- `js/app.js` — rendering orchestration and safe progressive enhancement.
- `js/language.js` — language selection, persistence, and accessible labels.
- `js/navigation.js` — mobile menu and current-section state.
- `js/motion.js` — Motion-powered entrances, in-view effects, progress, and
  pointer-capability-gated project interactions.

Add the open-source `motion` package at a pinned version. Import only the APIs
needed by the site so the production bundle remains small.

## Motion System

Use the approved balanced motion level:

- Stagger the hero kicker, heading, summary, actions, and photo on initial load.
- Show a thin page progress indicator linked to document scroll.
- Pulse the availability indicator gently, without conveying critical state
  through animation alone.
- Reveal sections once as they enter the viewport.
- On fine-pointer hover, slightly scale/translate project screenshots, lift the
  row surface, and move the outbound arrow.
- Give buttons brief spring-like press and hover feedback.
- Keep individual transitions short and avoid continuous movement except for
  the subtle availability pulse and scroll-linked progress.

When `prefers-reduced-motion: reduce` is active, show all content immediately,
disable parallax and decorative transforms, stop pulsing, and retain only
instant state feedback. Motion must never be required to understand or use the
site.

## Data Flow and Resilience

1. Thai semantic HTML renders first.
2. `app.js` reads the local content model and enhances repeated project/skill
   structures without removing the fallback until replacement is ready.
3. `language.js` applies the stored language when storage is available;
   otherwise it keeps Thai and allows in-session switching.
4. `motion.js` runs only after content is ready and only when required browser
   capabilities exist.

If a project image fails, replace it with a localized accessible placeholder
while preserving the project text and links. If Motion, IntersectionObserver,
localStorage, or another enhancement is unavailable, the complete static page
remains visible and usable. External links open safely with `noopener`.

## Accessibility and Responsive Behavior

- Use semantic landmarks, one clear `h1`, logical heading order, and a skip link.
- Preserve visible focus indicators and complete keyboard operation.
- Keep interactive targets at least 44 by 44 CSS pixels on touch layouts.
- Maintain useful alternative text for meaningful images.
- Meet WCAG AA contrast for text and interactive controls.
- Use a real button for the mobile menu and language switch state.
- Avoid horizontal overflow at 390, 768, and 1440 pixel representative widths.
- Do not hide essential information behind hover.

## Open-source Reuse and Attribution

Use open-source work selectively rather than copying a full portfolio. The
implementation may adapt general layout and interaction patterns from the
researched references, but it must keep Khongkaphan's content, hierarchy, and
visual identity distinct.

For every external dependency or copied/adapted code block:

1. Verify the upstream repository and license before use.
2. Record the project, source URL, license, and adapted files in
   `THIRD_PARTY_NOTICES.md`.
3. Retain copyright/license text when the license requires it.
4. Do not copy personal copy, branding, illustrations, or unlicensed assets.

Motion is expected to be the only new runtime dependency and is MIT licensed.

## Project Instructions

Add a root `AGENTS.md` during implementation. It will instruct future agents to:

- preserve verified personal facts and never invent experience or metrics;
- keep Thai and English synchronized;
- check licenses before adapting external work;
- follow test-first development for behavior changes;
- run the complete quality gate before claiming completion;
- verify desktop, tablet, mobile, keyboard, and reduced-motion behavior;
- preserve the static fallback and progressive-enhancement boundary.

A project-specific `SKILL.md` will not be added. Project conventions belong in
`AGENTS.md`; installed reusable skills continue to govern brainstorming, TDD,
debugging, and completion verification.

## Testing and Acceptance Criteria

Rewrite tests around the new design instead of preserving old selectors or
layout assumptions.

### Automated checks

- Content tests verify every approved personal fact, both languages, Resume,
  project links, and the absence of fabricated claims.
- Asset tests verify that all referenced local images and the PDF build and load.
- Playwright tests cover section order, navigation, TH/EN switching and
  persistence, mobile menu behavior, keyboard focus, image fallbacks, safe
  external links, reduced motion, missing enhancement APIs, and no horizontal
  overflow.
- Production build and deployment configuration tests remain green.

### Visual checks

- Inspect 390x844, 768x1024, and 1440x900 layouts.
- Confirm the first viewport clearly communicates the target role and provides
  access to Projects and Resume.
- Confirm motion is smooth, restrained, and absent under reduced motion.
- Confirm both project screenshots remain legible and appropriately cropped.

The redesign is complete only when `npm run check` passes and the production
preview has been visually inspected at all representative widths.
