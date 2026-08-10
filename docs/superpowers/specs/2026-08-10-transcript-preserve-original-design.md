# Transcript Original-PDF Preservation Design

## Goal

Replace the extracted one-page Transcript with the original university PDF so
the document-level optional-content settings and digital-signature structures
remain intact. The Portfolio button continues to take visitors directly to the
academic-record page.

## Confirmed Scope

- Store the exact original three-page PDF without rewriting, splitting,
  rasterizing, cropping, or redacting it.
- Keep the public asset path
  `/assets/transcript/transcript.pdf`.
- Configure both the JavaScript-enhanced link and the static HTML fallback to
  open `/assets/transcript/transcript.pdf#page=3` in a new tab.
- Keep the visible button label `Transcript` in Thai and English.
- Remove no unrelated Portfolio content and make no visual redesign.
- Publish the verified change to the existing GitHub Pages repository.

## Privacy and Document Integrity

The downloadable file contains all three original pages, not only page 3. This
is an explicit trade-off required to preserve the original PDF byte-for-byte.
Because the file is not rewritten, its catalog-level `/OCProperties`, digital
signature data, document permissions, and other document-level structures are
retained. The `#page=3` URL fragment changes only the viewer's initial page; it
does not remove pages 1 and 2 from the downloadable file.

## Components and Data Flow

1. `public/assets/transcript/transcript.pdf` is replaced with an exact copy of
   the user-provided source PDF.
2. `js/content.js` supplies the configured Transcript URL with `#page=3`.
3. `js/transcript.js` assigns that URL to the enhanced button.
4. `index.html` contains the same URL as the no-JavaScript fallback.
5. Vite copies the original PDF unchanged into `dist` during production build.
6. GitHub Pages serves the file and the browser opens it at page 3.

## Error Handling

- Existing unavailable-state behavior remains unchanged if the configured URL
  is empty.
- The link continues to use `target="_blank"` and
  `rel="noopener noreferrer"`.
- Tests must fail if the `#page=3` fragment is removed from either configuration
  or fallback markup.
- Tests must fail if the public/build PDF differs byte-for-byte from the source
  PDF used for this migration.

## Verification

- First add a failing regression test for the page-3 URL contract.
- Confirm the current implementation fails that test because it lacks
  `#page=3`.
- Replace the asset and update only the two URL sources.
- Confirm the public asset has the same SHA-256 hash and three-page count as the
  original PDF.
- Render the original page 3 and the published page 3 for visual comparison.
- Run `npm run check` and require all unit, asset, build, and Playwright tests to
  pass before committing or publishing.

## Out of Scope

- Removing `Copy of Official Document` from PDF content.
- Recreating or flattening the registrar signature.
- Editing grades, identity data, dates, QR code, or document metadata.
- Hiding or deleting pages 1 and 2.
