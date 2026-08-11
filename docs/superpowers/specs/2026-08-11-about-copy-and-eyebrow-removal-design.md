# About Copy and Section Eyebrow Removal Design

**Date:** 2026-08-11
**Project:** Khongkaphan Portfolio
**Status:** Approved design, awaiting written-spec confirmation

## Goal

Remove the repeated English eyebrow labels above the main Portfolio section headings and revise the About content so it accurately represents the owner's AI, Computer Vision, Backend, and supporting software experience without claiming Full-stack internship experience.

## Scope

- Remove only the five small eyebrow labels: `ABOUT`, `SKILLS`, `EDUCATION`, `PROJECTS`, and `CONTACT`.
- Keep the visible localized section titles and navigation links unchanged.
- Replace the Thai About body with the approved two-paragraph content below.
- Replace the English About body with an accurate translation of the same information.
- Preserve all other Portfolio content, layout, images, links, and language-switching behavior.

## Approved Thai About Copy

> กำลังศึกษาระดับปริญญาตรี สาขาวิชาวิทยาการคอมพิวเตอร์ คณะเทคโนโลยีสารสนเทศและการสื่อสาร มหาวิทยาลัยพะเยา มีความสนใจด้านการประยุกต์ใช้ปัญญาประดิษฐ์ (AI) และการพัฒนาซอฟต์แวร์ โดยเฉพาะงานด้าน Computer Vision และ Backend
>
> มีประสบการณ์ในการพัฒนาและฝึกสอนโมเดล AI สำหรับตรวจจับวัตถุ การเตรียมชุดข้อมูล และการประเมินประสิทธิภาพของโมเดล รวมถึงมีประสบการณ์ใช้งาน Git, Cloudflare และออกแบบส่วนติดต่อผู้ใช้เบื้องต้น

## Approved English About Copy

> I am pursuing a bachelor's degree in Computer Science at the School of Information and Communication Technology, University of Phayao. I am interested in applying Artificial Intelligence (AI) and developing software, particularly in Computer Vision and Backend development.
>
> I have experience developing and training AI models for object detection, preparing datasets, and evaluating model performance. I also have experience using Git and Cloudflare, along with basic user interface design.

## Implementation

- Delete the five eyebrow elements from `index.html` instead of hiding them with CSS.
- Update the Thai and English translation values in `js/content.js`.
- Keep the Thai fallback About text in `index.html` synchronized with the translation source.
- Render the About copy as two paragraph elements backed by separate translation entries, so the paragraph break is preserved consistently in both languages.

## Verification

- Add content tests that fail before implementation and prove the five eyebrow labels are absent.
- Test that the approved Thai and English About copy is present and the old Full-stack copy is absent.
- Run the complete project check (`npm run check`).
- Visually inspect the About and section-heading layout in Thai and English at desktop and mobile widths.
- After a clean verification, commit and push `main`, then confirm the GitHub Pages deployment succeeds and the public page shows the revised content.

## Out of Scope

- Redesigning section layouts or navigation.
- Changing skills, education, projects, contact information, images, or downloadable Transcript.
- Adding or removing technologies elsewhere in the Portfolio.
