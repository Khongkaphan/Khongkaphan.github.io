# Portfolio Avatar Replacement Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** เปลี่ยนรูปโปรไฟล์ของ Portfolio เป็นภาพใหม่ที่ครอปสัดส่วน 4:5 โดยเน้นใบหน้าและช่วงบน

**Architecture:** ใช้เส้นทาง asset เดิม `portfolio-site/public/assets/avatar.jpg` เพื่อไม่ให้ต้องแก้ HTML หรือ CSS สร้างภาพครอปจากไฟล์ต้นฉบับโดยไม่เปลี่ยนใบหน้า สี หรือองค์ประกอบ แล้วตรวจไฟล์ การ build และการแสดงผลแบบ responsive

**Tech Stack:** JPEG asset, HTML/CSS, Vite, Node.js tests, Playwright

## Global Constraints

- ใช้ `C:\Users\khongkaphan\Downloads\สื่อ (3).jpg` เป็นต้นฉบับ
- ครอปเน้นใบหน้าและช่วงบนในสัดส่วน 4:5
- ไม่แต่งหน้า ไม่เปลี่ยนสี และไม่เพิ่มหรือลบองค์ประกอบ
- แก้เฉพาะรูปโปรไฟล์ของ Portfolio ในเครื่อง
- ไม่ commit การเปลี่ยนรูปและไม่ push หรือเผยแพร่ขึ้น GitHub ในรอบนี้
- ไม่แก้ไฟล์ StockFlow หรือการเปลี่ยนแปลงเดิมของผู้ใช้

---

### Task 1: Replace and verify the Portfolio avatar

**Files:**
- Source: `C:\Users\khongkaphan\Downloads\สื่อ (3).jpg`
- Modify: `portfolio-site/public/assets/avatar.jpg`
- Test: `portfolio-site/tests/asset-scan.test.mjs`
- Test: `portfolio-site/tests/site.spec.js`

**Interfaces:**
- Consumes: `<img src="/assets/avatar.jpg">` จาก `portfolio-site/index.html`
- Produces: JPEG สัดส่วน 4:5 ที่เส้นทางเดิมสำหรับหน้า Hero

- [ ] **Step 1: Run the current Portfolio checks**

Run:

```powershell
npm run check
```

Working directory: `D:\project-forio\portfolio-site`

Expected: Node tests, Vite build, asset tests และ Playwright tests ผ่านทั้งหมด

- [ ] **Step 2: Create the cropped avatar**

สร้างภาพจากต้นฉบับเป็น JPEG สัดส่วน 4:5 โดย:

- ตัดพื้นที่ผนังว่างด้านบนออก
- ให้ศีรษะครบ ไม่ตัดผมหรือคาง
- ให้ใบหน้าอยู่กึ่งกลางแนวนอนและอยู่เหนือกึ่งกลางแนวตั้งเล็กน้อย
- คงเสื้อเชิ้ต เนกไท และช่วงอกไว้
- ไม่สร้างรายละเอียดใหม่และไม่ปรับหน้าตา

บันทึกผลไปที่:

```text
D:\project-forio\portfolio-site\public\assets\avatar.jpg
```

- [ ] **Step 3: Inspect the output asset**

ตรวจด้วย image viewer ว่าศีรษะ ใบหน้า ไหล่ และเนกไทไม่ถูกตัดผิดตำแหน่ง และตรวจชนิดไฟล์/ขนาด:

```powershell
Add-Type -AssemblyName System.Drawing
$image = [System.Drawing.Image]::FromFile('D:\project-forio\portfolio-site\public\assets\avatar.jpg')
"$($image.Width)x$($image.Height) $($image.RawFormat)"
$image.Dispose()
```

Expected: ไฟล์อ่านได้ เป็น JPEG และ `Width / Height = 0.8`

- [ ] **Step 4: Run the full checks after replacement**

Run:

```powershell
npm run check
```

Working directory: `D:\project-forio\portfolio-site`

Expected: Node tests, Vite build, asset tests และ Playwright tests ผ่านทั้งหมด

- [ ] **Step 5: Verify desktop and mobile presentation**

เปิด Portfolio ใน local preview และตรวจหน้า Hero ที่ความกว้าง desktop และ mobile

Expected:

- รูปใหม่แสดงจาก `/assets/avatar.jpg`
- ไม่มีภาพแตกหรือ fallback
- ศีรษะและใบหน้าไม่ถูกตัด
- กรอบภาพยังใช้รูปทรง Modern Navy เดิม

- [ ] **Step 6: Leave the change local**

Run:

```powershell
git status --short -- portfolio-site/public/assets/avatar.jpg
```

Expected: แสดง `M portfolio-site/public/assets/avatar.jpg` และไม่มีการ commit หรือ push

