# Single-Page Flattened Transcript Design

## Goal

Publish only the human-visible third page of the university PDF as a reliable
single-page Portfolio Transcript. The online file must not contain pages 1 or
2 and must not expose hidden optional-content layers in different PDF viewers.

## Approved Approach

Render page 3 of the original three-page university PDF at 300 DPI, then place
that rendered page into a new one-page A4 PDF without cropping, redacting, or
editing its visible content. This flattened PDF contains one fixed page image,
so browser PDF viewers cannot reveal the source document's hidden
`Copy of Official Document` layer.

## Document Status and Trade-Off

The new file is a visual copy for Portfolio use, not the original digitally
signed PDF. The visible registrar/signature area and QR code remain part of the
page image, but the new one-page file does not carry a cryptographically
verifiable `Signature1` field. Text selection and search are not required;
consistent visual output and one-page privacy are the priority.

## Public Interface

- Replace `public/assets/transcript/transcript.pdf` with the flattened
  one-page PDF.
- Configure `js/content.js` and the static fallback in `index.html` to use
  `/assets/transcript/transcript.pdf` without `#page=3`.
- Keep the visible label `Transcript` in Thai and English.
- Keep `target="_blank"` and `rel="noopener noreferrer"`.
- Make no unrelated Portfolio content or visual-design changes.

## Generation and Visual QA

1. Render human-visible source page 3 at 300 DPI using Poppler.
2. Wrap the rendered image in a single A4 PDF page at the source page's aspect
   ratio without margins or cropping.
3. Render the generated PDF back to PNG at 300 DPI.
4. Compare the source-page render and generated-page render visually and by
   dimensions; require sharp, complete text, tables, grades, QR code, footer,
   registrar/signature area, and no visible `Copy of Official Document` text.
5. Confirm the generated PDF contains exactly one page.

## Tests

- Update the content and Playwright expectations to the fragment-free URL.
- Replace the old three-page asset identity guard with the generated
  single-page asset's exact byte length and SHA-256.
- Keep the Vite public-passthrough hash check so `dist` is byte-identical to
  the public asset.
- Add a one-page PDF structure check to the documented verification evidence.
- Run `npm run check` before merge and again on merged `main` before Push.

## Publication

Publish only after task reviews, final review, local merge, and merged-main
verification pass. After GitHub Pages deploys, verify the online PDF hash and
one-page count and confirm the live Transcript link contains no `#page=3`.

## Out of Scope

- Preserving cryptographic signature validity.
- Publishing pages 1 or 2.
- Editing grades, personal data, QR content, dates, or visible document text.
- Reconstructing the university's hidden-layer or signature system.
