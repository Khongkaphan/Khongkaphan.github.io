# Objexify Test Result Image Design

## Goal

เพิ่มภาพตัวอย่างผลการทดสอบโมเดล YOLO11m เป็นภาพที่สองใน Project card ของ Objexify เพื่อให้ผู้ชมเห็นทั้งหน้าระบบก่อนทดสอบและผลตรวจจับจริง โดยไม่เปลี่ยนข้อความหน้าที่ของเจ้าของ Portfolio หรือส่วนอื่นของเว็บไซต์

## Approved Source and Public Asset

- ภาพต้นฉบับที่ผู้ใช้อนุมัติ: `C:\Users\KHONGK~1\AppData\Local\Temp\codex-clipboard-3ed8e71b-ae6e-4311-a559-d56b423c21a4.png`
- เก็บสำเนาสำหรับเว็บไซต์เป็น `public/assets/projects/moderation-api-result.png`
- คงภาพปัจจุบัน `public/assets/projects/moderation-api.png` เป็นภาพแรก
- ใช้ภาพผลลัพธ์ฉบับเต็มตามที่ได้รับ ไม่ครอปส่วนตั้งค่า ปุ่มอัปโหลด สรุปผล หรือการ์ดผลตรวจจับ
- ผู้ใช้ยืนยันให้เผยแพร่ Screenshot นี้ แม้ภาพทดสอบภายใน Screenshot จะมีชื่อไฟล์ที่อ้างถึง iStock

## Layout and Content

- ฝั่งภาพของ Objexify Project card แสดง Gallery แบบเรียงแนวตั้งจำนวนสองภาพ
- ภาพแรกเป็นหน้าระบบ Objexify เดิม
- ภาพที่สองเป็นตัวอย่างผลการตรวจจับใหม่ พร้อมคำบรรยายใต้ภาพ
- ไม่เพิ่ม Modal, Slider, Carousel หรือปุ่มควบคุม
- ภาพแรกใช้พฤติกรรมการแสดงผลเดิม ส่วนภาพผลลัพธ์ใช้ `object-fit: contain` เพื่อไม่ตัดข้อมูลในการ์ดผลตรวจจับ
- บนหน้าจอขนาดเล็ก ภาพและคำบรรยายยังเรียงแนวตั้งและไม่ทำให้หน้าเว็บล้นแนวนอน

คำบรรยายที่อนุมัติ:

- ไทย: **ตัวอย่างการทดสอบโมเดล YOLO11m: ระบบตรวจพบวัตถุประเภทอาวุธ พร้อมแสดง Bounding Box และค่า Confidence 0.71**
- English: **YOLO11m model test example: The system detected a weapon and displayed its bounding box with a confidence score of 0.71.**

## Data and Component Design

- เปลี่ยนข้อมูลสื่อของ Objexify จากภาพเดี่ยวเป็นรายการสื่อที่มีสองรายการ
- สื่อแต่ละรายการกำหนด `src`, `altKey`, `captionKey` และรูปแบบการ fit ของตัวเอง เพื่อให้การเพิ่มหรือปรับภาพหนึ่งไม่กระทบอีกภาพ
- ตัว render ของ Project สร้าง `<figure>` หนึ่งชุดต่อภาพ ภายในประกอบด้วย `<img>` และ `<figcaption>` เมื่อรายการนั้นมีคำบรรยาย
- Static HTML fallback ใน `index.html` ต้องมีภาพทั้งสองและคำบรรยายภาษาไทยครบ แม้ JavaScript โหลดไม่สำเร็จ
- ระบบเปลี่ยนภาษาต้องอัปเดตทั้ง `alt` และ `figcaption` ของภาพผลลัพธ์จาก translation keys เดียวกับข้อมูล Project

## Accessibility and Failure Handling

- ภาพเดิมคง alt text เดิม
- ภาพผลลัพธ์มี alt text แยกต่างหาก ซึ่งอธิบายว่าเป็น Screenshot ผลการตรวจจับอาวุธพร้อม Bounding Box และ Confidence 0.71
- หากภาพใดโหลดไม่สำเร็จ ให้แทนเฉพาะภาพนั้นด้วย placeholder ที่มีข้อความสำรองตามภาษาปัจจุบัน โดยภาพอีกใบและคำบรรยายยังทำงานตามปกติ
- Placeholder ต้องรักษาพื้นที่ของภาพและไม่ทำให้ Project card เปลี่ยนโครงสร้างอย่างรุนแรง
- คำบรรยายเป็นข้อความประกอบตัวอย่างหนึ่งครั้ง ไม่กล่าวอ้างว่า Confidence 0.71 เป็นผลประเมินประสิทธิภาพโดยรวมของโมเดล

## Testing and Acceptance Criteria

- Unit/content tests ยืนยันว่า Objexify ยังเป็น Project เดียวและมีสื่อที่อนุมัติครบสองรายการ
- Translation tests ยืนยันว่ามี alt text และ caption ครบทั้งภาษาไทยและอังกฤษ
- Browser tests ยืนยันว่ามีภาพสองภาพ เรียงตามลำดับที่กำหนด และคำบรรยายเปลี่ยนภาษาถูกต้อง
- Failure test จำลองให้ภาพผลลัพธ์โหลดไม่ได้ แล้วต้องเห็น localized placeholder โดยภาพเดิมยังแสดงได้
- Responsive tests ยืนยันว่า Gallery และ Project card ไม่ล้นแนวนอนบน viewport ที่รองรับอยู่แล้ว
- Asset tests ยืนยันว่า `moderation-api-result.png` อยู่ใน source/build และถูกส่งผ่าน Vite โดยไม่เปลี่ยน bytes
- Full verification ใช้ `npm run check` และต้องผ่านทั้งหมดก่อนรวมงานหรือเผยแพร่

## Out of Scope

- ไม่แก้ข้อความความสามารถของระบบหรือรายการหน้าที่ของผู้ใช้
- ไม่เพิ่มลิงก์ Demo, GitHub หรือ API
- ไม่แก้ภาพเดิมและไม่สร้างภาพด้วย AI
- ไม่เพิ่มระบบ Gallery แบบโต้ตอบหรือการขยายภาพ
- ไม่เปลี่ยนส่วน About, Skills, Contact หรือ Transcript
