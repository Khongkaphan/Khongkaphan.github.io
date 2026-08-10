# Objexify-only Portfolio Design

## Objective

ปรับ Portfolio ให้เหลือผลงานเด่นเพียงโปรเจกต์เดียวคือ Objexify ซึ่งเป็นโครงงานจบแบบกลุ่ม และนำเสนอเฉพาะหน้าที่ที่ Khongkaphan ยืนยันว่ามีส่วนร่วมจริง พร้อมนำ StockFlow และทักษะที่เพิ่มมาเพราะ StockFlow ออกจากเว็บไซต์

เอกสารนี้เป็นข้อกำหนดต่อยอดจาก `2026-08-04-portfolio-redesign-design.md` และแทนที่ข้อกำหนดเดิมเฉพาะส่วนจำนวนโปรเจกต์ รายละเอียดผลงาน และรายการทักษะ

## Approved Direction

ใช้แนวทาง **Single Featured Case Study** ภายใต้รูปแบบ Recruiter-first Minimal เดิม:

- ส่วน Projects เหลือการ์ด Objexify เพียงรายการเดียวและใช้พื้นที่กว้างขึ้น
- ระบุชัดว่าเป็น `โครงงานจบแบบกลุ่ม`
- แยก `ความสามารถของระบบ` ออกจาก `หน้าที่ของผม`
- ไม่แสดงปุ่ม Demo หรือ GitHub เพราะระบบต้องเปิด FastAPI และ Cloudflare Tunnel จึงใช้งานได้
- เก็บภาษาไทย/อังกฤษ, Resume, About, Education และ Contact เดิม

## Factual Boundaries

### Confirmed system capabilities

- ระบบใช้ FastAPI เป็น Backend API
- รับภาพและวิดีโอเพื่อประมวลผล
- ใช้โมเดล YOLO11m แยก 4 ประเภท: ภาพโป๊เปลือย อาวุธ บุหรี่ และความรุนแรง
- ส่งผลการตรวจจับและตำแหน่ง Bounding Box กลับผ่าน API
- ใช้ MongoDB/PyMongo สำหรับข้อมูลผู้ใช้ API Key ประวัติการใช้งาน คำสั่งซื้อ OTP และข้อมูลไฟล์ชั่วคราว

ความสามารถเหล่านี้อธิบายตัวระบบ แต่ไม่เท่ากับหน้าที่ส่วนบุคคลของ Khongkaphan

### Confirmed personal contributions

- เตรียมและปรับปรุง Dataset และทำ Label สำหรับโมเดลทั้ง 4 ประเภท
- ฝึกสอนโมเดล YOLO11m ทั้ง 4 โมเดล จำนวน 100 Epochs
- ประเมินผลด้วย mAP50-95, Precision และ Recall พร้อมทดลองสัดส่วน Background Images/Negative Samples
- มีส่วนร่วมในงานส่วนฐานข้อมูล MongoDB ของโครงงาน แต่ไม่กล่าวว่าออกแบบหรือเขียนระบบฐานข้อมูลทั้งหมดเพียงคนเดียว
- ลงมือตั้งค่าโดเมนฟรี `objexify.dpdns.org` จาก DigitalPlat ให้ใช้ DNS ของ Cloudflare
- สร้างและตั้งค่า Cloudflare Tunnel เพื่อส่ง Public hostname ไปยัง FastAPI ที่ `http://localhost:5000`
- ออกแบบหน้าจอและ User Flow บางส่วนด้วย Figma

### Claims that must not appear as personal contributions

- ห้ามกล่าวว่า Khongkaphan พัฒนา Backend API หรือส่วนรับภาพ/วิดีโอด้วยตนเอง
- ห้ามกล่าวว่า Khongkaphan พัฒนา Frontend จากแบบ Figma
- ห้ามกล่าวว่า Khongkaphan พัฒนา MongoDB ทั้งหมดเพียงคนเดียว
- ห้ามเรียกผู้ให้บริการโดเมนว่า DuckDNS; โดเมนจริงมาจาก DigitalPlat (`dpdns.org`)
- ห้ามกล่าวว่า Cloudflare ป้องกันความปลอดภัยทั้งระบบ; ขอบเขตที่ยืนยันคือ DNS และ Tunnel

## Approved Project Content

### Thai

**ชื่อ:** Objexify — บริการ API สำหรับตรวจจับวัตถุไม่เหมาะสม

**ประเภท:** โครงงานจบแบบกลุ่ม

**ความสามารถของระบบ:**

> ระบบ AI สำหรับตรวจจับวัตถุไม่เหมาะสมในภาพและวิดีโอ ได้แก่ ภาพโป๊เปลือย อาวุธ บุหรี่ และความรุนแรง โดยให้บริการผลการตรวจจับและตำแหน่ง Bounding Box ผ่าน API เพื่อให้ระบบอื่นนำไปใช้งานต่อได้

**หน้าที่ของผม:**

- เตรียมและปรับปรุง Dataset ทำ Label และฝึกสอนโมเดล YOLO11m จำนวน 4 โมเดล
- ประเมินโมเดลด้วย mAP50-95, Precision และ Recall พร้อมทดลองเพิ่ม Background Images เพื่อลดการตรวจจับผิดพลาด
- มีส่วนร่วมในงานส่วนฐานข้อมูล MongoDB ของโครงงาน
- ตั้งค่าโดเมน `objexify.dpdns.org` จาก DigitalPlat ให้ใช้งานร่วมกับ Cloudflare DNS และสร้าง Cloudflare Tunnel เชื่อมไปยัง FastAPI ที่รันบน Port 5000
- ออกแบบหน้าจอและ User Flow บางส่วนด้วย Figma

### English

**Title:** Objexify — Inappropriate Content Detection API

**Type:** Group senior project

**System capability:**

> An AI service that detects pornography, weapons, cigarettes, and violence in images and videos, returning detection results and bounding-box coordinates through an API for integration with other systems.

**My contribution:**

- Prepared and refined datasets, created labels, and trained four YOLO11m models.
- Evaluated the models using mAP50-95, Precision, and Recall, and experimented with background images to reduce false detections.
- Contributed to the project's MongoDB-related work.
- Configured the DigitalPlat domain `objexify.dpdns.org` with Cloudflare DNS and created a Cloudflare Tunnel to the FastAPI service running on port 5000.
- Designed selected screens and user flows in Figma.

## Skills and Technology Presentation

### Remove from the global Skills section

- TypeScript
- Next.js / React
- Tailwind CSS
- PostgreSQL
- Prisma ORM

### Keep in the global Skills section

- Python
- JavaScript
- HTML / CSS
- Ultralytics (YOLO)
- PyTorch
- Git / GitHub
- Postman
- Visual Studio Code
- Roboflow
- Figma
- Cloudflare
- REST API

### Show as Objexify project technologies

- Python
- FastAPI
- YOLO11m / Ultralytics
- PyTorch
- OpenCV
- MongoDB / PyMongo
- REST API / JSON
- Cloudflare Tunnel
- DigitalPlat DNS
- Figma

Project technologies describe the group system and must not imply sole ownership of every component.

## Components and Content Flow

1. `js/content.js` contains one project entry only: `moderation-api`/Objexify, with synchronized Thai and English keys for project type, system capability, contribution bullets, technology list, image alternative text, and unavailable-image text.
2. `index.html` contains a complete Thai static fallback for the single project so the essential content remains available without JavaScript.
3. `js/app.js` renders a one-item project list from the content model without special-casing a second empty column.
4. CSS expands the single project row/card to an intentional featured-case-study layout at desktop, tablet, and mobile widths.
5. The existing Objexify screenshot remains the project image. No project link is rendered when both live and repository URLs are absent.

## Removal Scope

- Remove the StockFlow project entry and all StockFlow translation keys.
- Remove StockFlow fallback markup from `index.html`.
- Remove `public/assets/projects/stockflow-dashboard.png` when no remaining production reference uses it.
- Remove StockFlow-specific instructions and claims from `README.md`.
- Update tests that currently require two projects or reference the StockFlow image.
- Do not modify or delete the separate StockFlow repository at `D:\project-forio`.

## Error Handling and Resilience

- If the Objexify screenshot fails, show the existing localized accessible image fallback while retaining all project text.
- If JavaScript fails, the Thai fallback must still display the complete Objexify content and Resume link.
- Language switching must update the project type, capability, contribution bullets, stack labels, and image fallback.
- Missing Demo/GitHub URLs must produce no empty, disabled, or broken controls.

## Testing and Acceptance Criteria

### Automated

- Content tests assert exactly one project with ID `moderation-api`.
- Tests assert the approved Thai and English facts and contribution boundaries.
- Tests assert StockFlow and its removed technologies are absent from content and production HTML.
- Asset tests assert the Objexify screenshot, avatar, social preview, and Resume PDF pass through the build byte-for-byte.
- Browser tests cover Thai/English switching, one featured project, no project link, broken-image fallback, static fallback, keyboard access, reduced motion, and no horizontal overflow.
- `npm run check` passes completely.

### Visual

- Inspect 390x844, 768x1024, and 1440x900 layouts.
- The single project must look intentional rather than like a missing second card.
- Long Thai and English contribution text must remain readable without clipping or horizontal scrolling.
- No StockFlow image, name, technology, or empty link may appear.

## Out of Scope

- Publishing or pushing to GitHub
- Making the Objexify Backend continuously available
- Adding a new Demo, repository link, certificate section, or new project
- Changing the Resume PDF in this scope
- Editing the separate StockFlow project
