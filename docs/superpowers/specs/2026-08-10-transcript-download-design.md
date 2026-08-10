# Transcript Download Design

## Objective

เปลี่ยนปุ่มดาวน์โหลดเอกสารใน Portfolio จาก Resume เป็น Transcript และเผยแพร่เฉพาะหน้าที่ 3 ของไฟล์ต้นฉบับ `C:\Users\khongkaphan\Downloads\ใบรายงานผลการศึกษา ฉบับแปล (ก่อนสำเร็จการศึกษา).pdf` ซึ่งเป็นหน้ารวมรายวิชา เกรด หน่วยกิต และ GPA

## Confirmed Decisions

- ข้อความบนปุ่มใช้คำว่า `Transcript` เหมือนกันทั้งภาษาไทยและอังกฤษ
- ใช้เฉพาะหน้าที่ 3 จาก PDF ต้นฉบับทั้งหมด 3 หน้า
- คงหน้าเอกสารเดิมโดยไม่ปิดบังข้อมูลส่วนตัว
- ผู้ใช้ยืนยันว่ารับทราบว่าหน้านี้มีข้อมูลส่วนตัว เช่น วันเกิด รหัสนิสิต ศาสนา สัญชาติ QR Code และลายเซ็นดิจิทัล และเลือกเผยแพร่หน้าเดิมทั้งหมดบนเว็บไซต์สาธารณะ
- แยก PDF ด้วยการคัดลอกหน้าเดิมไปยัง PDF ใหม่ ไม่แปลงหน้าเป็นภาพ เพื่อรักษาข้อความ ตาราง QR Code และคุณภาพการพิมพ์
- ใช้ชื่อและเส้นทางใหม่ที่ตรงกับหน้าที่ของไฟล์: `public/assets/transcript/transcript.pdf`
- ลบ Resume และการอ้างอิง Resume เดิมออกจาก production Portfolio
- ไม่ Push ขึ้น GitHub จนกว่าการเปลี่ยนแปลงและการตรวจสอบทั้งหมดเสร็จ และผู้ใช้ยืนยันให้ Push

## Architecture and Components

### PDF asset

- Source: `C:\Users\khongkaphan\Downloads\ใบรายงานผลการศึกษา ฉบับแปล (ก่อนสำเร็จการศึกษา).pdf`
- Source page: the third PDF page (zero-based index 2; human-visible page 3)
- Output: `public/assets/transcript/transcript.pdf`
- Output must contain exactly one A4 page copied from source page 3 without rasterization, cropping, redaction, or content edits.
- Remove `public/assets/resume/resume.pdf` and the unused Resume asset directory when no production reference remains.

### Content model

`js/content.js` changes from Resume terminology to Transcript terminology:

- `hero.resume` becomes `hero.transcript`, with value `Transcript` in both languages.
- `resume.unavailable` becomes `transcript.unavailable`.
- Thai unavailable text: `ยังไม่ได้เพิ่มไฟล์ Transcript`
- English unavailable text: `Transcript file has not been added`
- `portfolioContent.resume` becomes `portfolioContent.transcript`.
- Configured href: `/assets/transcript/transcript.pdf`

### UI module and fallback

- Rename `js/resume.js` to `js/transcript.js`.
- Export `initializeTranscript()` and `updateTranscript(language)`.
- Rename DOM hooks to `data-transcript-link` and `data-transcript-status`.
- `js/app.js` imports and initializes the Transcript module.
- `index.html` contains a working static Transcript link so the document remains accessible if JavaScript fails.
- When the configured Transcript href is absent, JavaScript replaces the link with a disabled button and displays the localized unavailable message.
- When a href becomes available, JavaScript replaces the disabled button with a safe link using `target="_blank"` and `rel="noopener noreferrer"`.

### Documentation

- Replace the README Resume instructions with Transcript instructions.
- Document the output file path and the configured href in `js/content.js`.
- Remove instructions that tell maintainers to add a Resume.

## Data Flow

1. Extract source PDF page 3 into the one-page Transcript asset.
2. `portfolioContent.transcript.href` supplies `/assets/transcript/transcript.pdf`.
3. The static HTML fallback exposes the same URL without JavaScript.
4. The Transcript module owns unavailable/configured state transitions when JavaScript runs.
5. Asset and browser tests verify that the same one-page PDF is delivered by the production build and linked from the UI.

## Error Handling and Resilience

- A missing or null Transcript href produces a disabled button and a localized status instead of a broken link.
- Repeated language or state updates remain idempotent and do not create duplicate controls.
- The Thai static fallback retains a working Transcript link and an empty status when the PDF is configured.
- Asset tests fail if the Transcript source or production-build copy is missing.
- PDF validation fails if the output has any page count other than one.

## Testing and Acceptance Criteria

### PDF validation

- Reopen the output with `pypdf` and assert exactly one page.
- Compare the output page dimensions with source page 3.
- Extract representative text and confirm the page contains the student's grade data and cumulative GPA `3.47`.
- Render the output page to PNG and visually confirm that the header, tables, grades, QR Code, footer, and digital signature remain sharp, aligned, and unclipped.

### Automated website checks

- Content tests assert the Transcript href and the absence of Resume fields/translation keys.
- Asset tests include `assets/transcript/transcript.pdf`, verify byte-for-byte public passthrough, and assert the old Resume PDF is absent from source and build.
- Playwright tests verify the `Transcript` label in Thai and English, the new href, PDF response, configured/unavailable state transitions, static fallback, and safe link attributes.
- Production sources contain no `data-resume-*`, `/assets/resume/resume.pdf`, `portfolioContent.resume`, or Resume maintenance instructions.
- `npm run check` passes completely.

### Manual acceptance

- Clicking `Transcript` opens the one-page PDF in a new tab.
- The PDF displayed is source page 3 and contains the unchanged personal information that the user approved for public release.

## Out of Scope

- Redacting or masking any Transcript information
- Publishing pages 1 or 2
- Keeping a separate Resume button or Resume asset
- Editing grades, personal data, QR Code, signature, or visual layout inside the Transcript
- Changing the rest of the Portfolio content or design
- Pushing or deploying to GitHub Pages without a later explicit confirmation
