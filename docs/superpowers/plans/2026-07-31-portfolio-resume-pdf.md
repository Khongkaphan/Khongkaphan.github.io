# Portfolio Resume PDF Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** เพิ่ม Resume PDF หน้าเดียวลงใน Portfolio และเปิดใช้งานปุ่ม Resume ทั้งภาษาไทยและภาษาอังกฤษ

**Architecture:** สร้าง PDF ขนาด A4 จากภาพต้นฉบับและเก็บเป็น static asset ภายใต้ `public/assets/resume` จากนั้นตั้งค่า `portfolioContent.resume.href` ให้โมดูล Resume เดิมเปลี่ยนปุ่ม disabled เป็นลิงก์เปิด PDF ในแท็บใหม่ การทดสอบครอบคลุมความถูกต้องของ asset, production build, สถานะสองภาษา และเส้นทาง PDF จริง

**Tech Stack:** PNG, PDF/A4, JavaScript ES Modules, Vite, Node.js test runner, Playwright

## Global Constraints

- ใช้ `C:\Users\khongkaphan\Downloads\Blue and White Geometric Graphic Designer Resume Poster (1).png` เป็นต้นฉบับ
- สร้าง PDF ขนาด A4 แนวตั้งจำนวนหนึ่งหน้า
- รักษาภาพ สี ข้อความ และการจัดวางจากต้นฉบับโดยไม่แก้เนื้อหา
- วางภาพเต็มพื้นที่หน้าโดยรักษาอัตราส่วนและไม่ตัดขอบเนื้อหา
- บันทึกเป็น `portfolio-site/public/assets/resume/resume.pdf`
- ปุ่ม Resume เปิด PDF ในแท็บใหม่และใช้ `rel="noopener noreferrer"`
- แก้เฉพาะไฟล์ PDF, การตั้งค่า Resume และการทดสอบที่เกี่ยวข้อง
- ไม่แก้เนื้อหา Resume, รูปโปรไฟล์, รายละเอียดโครงการ หรือ StockFlow
- ทำ local commits ได้ แต่ไม่ push หรือเผยแพร่ขึ้น GitHub ในรอบนี้

---

### Task 1: Create and validate the Resume PDF asset

**Files:**
- Source: `C:\Users\khongkaphan\Downloads\Blue and White Geometric Graphic Designer Resume Poster (1).png`
- Create: `portfolio-site/public/assets/resume/resume.pdf`
- Modify: `portfolio-site/tests/asset-scan.test.mjs`
- Verify: rendered PDF page PNG in the task's temporary verification directory

**Interfaces:**
- Consumes: PNG Resume ต้นฉบับขนาดแนวตั้ง
- Produces: `/assets/resume/resume.pdf` ซึ่ง Vite ส่งผ่านแบบ byte-for-byte

- [ ] **Step 1: Add the PDF to the passthrough asset test**

เพิ่มรายการต่อไปนี้ใน `passthroughAssets` ภายใน `portfolio-site/tests/asset-scan.test.mjs`:

```js
"assets/resume/resume.pdf",
```

รายการต้องอยู่ร่วมกับ asset เดิมโดยไม่ลบ `.gitkeep` หรือการตรวจ certificates

- [ ] **Step 2: Run the asset test to verify the missing PDF fails**

Run:

```powershell
npm run build
npm run test:assets
```

Working directory: `D:\project-forio\.worktrees\resume-pdf-local\portfolio-site`

Expected: `test:assets` fails because `assets/resume/resume.pdf` does not exist under `public/`

- [ ] **Step 3: Generate the one-page A4 PDF**

ใช้ PDF workflow สร้าง `portfolio-site/public/assets/resume/resume.pdf` จาก PNG ต้นฉบับ โดยกำหนด:

```text
Page size: A4 portrait (595.2756 × 841.8898 PDF points)
Page count: 1
Image placement: centered, aspect ratio preserved, fully contained
Margins: only any sub-pixel padding required by the source/A4 ratio
Content changes: none
```

ห้าม rasterize ซ้ำที่ความละเอียดต่ำกว่าต้นฉบับ และห้ามแก้ข้อความ สี หรือกราฟิกในภาพ

- [ ] **Step 4: Validate and visually inspect the PDF**

ตรวจด้วย PDF tooling:

```powershell
pdfinfo "portfolio-site\public\assets\resume\resume.pdf"
pdftoppm -png -f 1 -singlefile -r 144 "portfolio-site\public\assets\resume\resume.pdf" "D:\project-forio\.superpowers\sdd\2026-07-31-portfolio-resume-pdf\pdf-verification\resume-page"
```

Expected from `pdfinfo`:

```text
Pages:           1
Page size:       595.276 x 841.89 pts (A4)
```

เปิด `resume-page.png` ด้วย image viewer และยืนยันว่าภาพครบทั้งหน้า ไม่มีข้อความ กราฟิก หรือขอบ Resume ถูกตัด

- [ ] **Step 5: Run the production asset checks**

Run:

```powershell
npm run build
npm run test:assets
```

Expected: build ผ่าน และ asset tests ผ่านทั้งหมด รวมการเปรียบเทียบ PDF ใน `public` กับ `dist` แบบ byte-for-byte

- [ ] **Step 6: Commit the PDF asset task locally**

```powershell
git add -- portfolio-site/public/assets/resume/resume.pdf portfolio-site/tests/asset-scan.test.mjs
git commit -m "feat(portfolio): add Resume PDF asset"
```

ห้าม push commit นี้

---

### Task 2: Enable and verify the Portfolio Resume link

**Files:**
- Modify: `portfolio-site/js/content.js`
- Modify: `portfolio-site/tests/content.test.mjs`
- Modify: `portfolio-site/tests/site.spec.js`
- Test: `portfolio-site/tests/asset-scan.test.mjs`

**Interfaces:**
- Consumes: `/assets/resume/resume.pdf` จาก Task 1
- Produces: `portfolioContent.resume.href === "/assets/resume/resume.pdf"` และลิงก์ Resume สองภาษาที่เปิดแท็บใหม่

- [ ] **Step 1: Update the content test for the configured Resume**

เปลี่ยน test เดิมใน `portfolio-site/tests/content.test.mjs` เป็น:

```js
test("Resume is configured and the certificate feature is absent", () => {
  assert.equal(
    portfolioContent.resume.href,
    "/assets/resume/resume.pdf"
  );
  assert.equal("certificates" in portfolioContent, false);

  for (const language of ["th", "en"]) {
    const certificateKeys = Object.keys(
      portfolioContent.translations[language]
    ).filter((key) => key.toLowerCase().includes("certificate"));
    assert.deepEqual(certificateKeys, []);
  }
});
```

- [ ] **Step 2: Update the browser tests for available and unavailable states**

ใน test `resume module owns unavailable and configured bilingual states` ให้ intercept `js/content.js` เฉพาะ development fixture เพื่อแทนค่าการตั้งค่า Resume เป็น `null` ก่อนโหลดหน้า:

```js
await page.route("**/js/content.js", async (route) => {
  const response = await route.fetch();
  const body = await response.text();
  await route.fulfill({
    response,
    body: body.replace(
      'resume: { href: "/assets/resume/resume.pdf" }',
      "resume: { href: null }"
    )
  });
});
```

คง assertion เดิมที่ทดสอบ unavailable state แล้วเปลี่ยนเป็น configured state เพื่อรักษาการครอบคลุมทั้งสองกรณี

แทน test `shows an honest bilingual state for a missing Resume` ด้วย:

```js
test("exposes the configured Resume in Thai and English", async ({ page }) => {
  await page.goto("/");

  const control = page.locator("[data-resume-link]");
  await expect(control).toHaveText("ดาวน์โหลด Resume");
  await expect(control).toHaveAttribute("href", "/assets/resume/resume.pdf");
  await expect(control).toHaveAttribute("target", "_blank");
  await expect(control).toHaveAttribute("rel", "noopener noreferrer");
  await expect(page.locator("[data-resume-status]")).toBeEmpty();

  const response = await page.request.get("/assets/resume/resume.pdf");
  expect(response.ok()).toBe(true);
  expect(response.headers()["content-type"]).toContain("application/pdf");
  expect((await response.body()).subarray(0, 5).toString()).toBe("%PDF-");

  await page.getByRole("button", { name: "EN" }).click();
  await expect(control).toHaveText("Download Resume");
});
```

- [ ] **Step 3: Run the targeted tests to verify they fail**

Run:

```powershell
npm test
npx playwright test -g "Resume|resume"
```

Expected: tests fail because `portfolioContent.resume.href` is still `null` and production still renders the disabled button

- [ ] **Step 4: Configure the Resume href**

เปลี่ยนค่าที่ท้าย `portfolio-site/js/content.js` จาก:

```js
resume: { href: null },
```

เป็น:

```js
resume: { href: "/assets/resume/resume.pdf" },
```

ไม่แก้ `portfolio-site/js/resume.js` เพราะโมดูลเดิมรองรับ link, target, rel และภาษาไทย/อังกฤษครบแล้ว

- [ ] **Step 5: Run the full Portfolio checks**

Run:

```powershell
npm run check
```

Expected:

- Node tests ผ่านทั้งหมด
- Vite production build ผ่าน
- asset tests ผ่านทั้งหมด
- Playwright tests ผ่านทั้งหมด
- ไม่มี warning หรือ error ใหม่

- [ ] **Step 6: Commit the Resume link task locally**

```powershell
git add -- portfolio-site/js/content.js portfolio-site/tests/content.test.mjs portfolio-site/tests/site.spec.js
git commit -m "feat(portfolio): enable Resume download"
```

ห้าม stage `portfolio-site/public/assets/avatar.jpg`, ไฟล์ StockFlow หรือไฟล์อื่นของผู้ใช้ และห้าม push
