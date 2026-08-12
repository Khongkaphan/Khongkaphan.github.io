import test from "node:test";
import assert from "node:assert/strict";
import { getText, portfolioContent } from "../js/content.js";

test("Thai is the default complete translation", () => {
  assert.equal(portfolioContent.defaultLanguage, "th");
  assert.equal(getText("th", "nav.projects"), "ผลงาน");
  assert.equal(getText("th", "hero.role"), "Software Developer Intern");
});

test("English and Thai expose the same translation keys", () => {
  assert.deepEqual(
    Object.keys(portfolioContent.translations.th).sort(),
    Object.keys(portfolioContent.translations.en).sort()
  );
});

test("About copy accurately represents AI, Computer Vision, and Backend experience", () => {
  assert.equal(
    getText("th", "about.body"),
    "กำลังศึกษาระดับปริญญาตรี สาขาวิชาวิทยาการคอมพิวเตอร์ คณะเทคโนโลยีสารสนเทศและการสื่อสาร มหาวิทยาลัยพะเยา มีความสนใจในการประยุกต์ใช้ปัญญาประดิษฐ์ (AI) เพื่อพัฒนาซอฟต์แวร์และระบบที่สามารถนำไปใช้งานได้จริง โดยปัจจุบันสนใจเป็นพิเศษในด้าน AI Agent, Automation และ Computer Vision"
  );
  assert.equal(
    getText("th", "about.experience"),
    "มีประสบการณ์พัฒนาโปรเจกต์ด้าน AI ตั้งแต่การเตรียมและจัดการชุดข้อมูล การฝึกสอนและประเมินประสิทธิภาพโมเดลตรวจจับวัตถุ ไปจนถึงการนำโมเดลมาให้บริการผ่าน REST API รวมถึงมีประสบการณ์ใช้งาน Git, Cloudflare และการออกแบบส่วนติดต่อผู้ใช้เบื้องต้น"
  );
  assert.equal(
    getText("en", "about.body"),
    "I am pursuing a bachelor's degree in Computer Science at the School of Information and Communication Technology, University of Phayao. I am interested in applying Artificial Intelligence (AI) to develop practical software and systems, with a current focus on AI Agents, Automation, and Computer Vision."
  );
  assert.equal(
    getText("en", "about.experience"),
    "I have experience developing AI projects ranging from dataset preparation and management, training and evaluating object detection models, to serving models via REST APIs. I also have experience using Git, Cloudflare, and basic user interface design."
  );
  assert.doesNotMatch(
    `${getText("th", "about.body")} ${getText("th", "about.experience")} ${getText("en", "about.body")} ${getText("en", "about.experience")}`,
    /Full-stack/i
  );
});

test("portfolio contains only the approved Objexify group project", () => {
  assert.deepEqual(
    portfolioContent.projects.map((project) => project.id),
    ["moderation-api"]
  );

  const project = portfolioContent.projects[0];
  assert.equal(project.typeKey, "project.moderation.type");
  assert.equal(project.capabilityKey, "project.moderation.capability");
  assert.deepEqual(project.contributionKeys, [
    "project.moderation.contribution.dataset",
    "project.moderation.contribution.evaluation",
    "project.moderation.contribution.mongodb",
    "project.moderation.contribution.cloudflare",
    "project.moderation.contribution.figma"
  ]);
  assert.deepEqual(project.media, [
    {
      id: "overview",
      src: "/assets/projects/moderation-api.png",
      altKey: "project.moderation.overviewAlt",
      captionKey: null,
      fit: "cover"
    },
    {
      id: "result",
      src: "/assets/projects/moderation-api-result.png",
      altKey: "project.moderation.resultAlt",
      captionKey: "project.moderation.resultCaption",
      fit: "contain"
    }
  ]);
  assert.equal("altKey" in project, false);
  assert.equal(project.github, null);
});

test("Objexify copy keeps system capability separate from personal contribution", () => {
  assert.equal(getText("th", "project.moderation.type"), "โครงการจบแบบกลุ่ม");
  assert.match(getText("th", "project.moderation.capability"), /ภาพโป๊เปลือย.*อาวุธ.*บุหรี่.*ความรุนแรง/);
  assert.match(getText("th", "project.moderation.contribution.dataset"), /YOLO11m จำนวน 4 โมเดล/);
  assert.match(getText("th", "project.moderation.contribution.cloudflare"), /DigitalPlat.*Cloudflare DNS.*Cloudflare Tunnel.*Port 5000/);
  assert.match(getText("en", "project.moderation.type"), /Group senior project/);
  assert.equal(
    getText("th", "project.moderation.resultAlt"),
    "ภาพตัวอย่างผลการทดสอบโมเดล YOLO11m ที่ตรวจพบอาวุธ พร้อม Bounding Box"
  );
  assert.equal(
    getText("en", "project.moderation.resultAlt"),
    "YOLO11m test result screenshot showing a detected weapon and bounding box"
  );
  assert.equal(
    getText("th", "project.moderation.resultCaption"),
    "ตัวอย่างการทดสอบโมเดล YOLO11m: ระบบตรวจพบวัตถุประเภทอาวุธ พร้อมแสดง Bounding Box และค่า Confidence"
  );
  assert.equal(
    getText("en", "project.moderation.resultCaption"),
    "YOLO11m model test example: The system detected a weapon and displayed its bounding box with a confidence score."
  );
  assert.doesNotMatch(
    portfolioContent.projects[0].contributionKeys
      .map((key) => getText("en", key)).join(" "),
    /developed the Backend|developed the Frontend|built the entire MongoDB/i
  );
});

test("Transcript is configured and Resume content is absent", () => {
  assert.equal(
    portfolioContent.transcript.href,
    "/assets/transcript/transcript.pdf"
  );
  assert.equal("resume" in portfolioContent, false);
  assert.equal(getText("th", "hero.transcript"), "Transcript");
  assert.equal(getText("en", "hero.transcript"), "Transcript");
  assert.equal(
    getText("th", "transcript.unavailable"),
    "ยังไม่ได้เพิ่มไฟล์ Transcript"
  );
  assert.equal(
    getText("en", "transcript.unavailable"),
    "Transcript file has not been added"
  );

  for (const language of ["th", "en"]) {
    const keys = Object.keys(portfolioContent.translations[language]);
    assert.equal(keys.some((key) => key.toLowerCase().includes("resume")), false);
  }
});

test("contact email uses the owner-confirmed address", () => {
  assert.equal(portfolioContent.contact.email, "ball.56110m@gmail.com");
});

test("accessible interface labels have complete Thai and English translations", () => {
  assert.deepEqual(
    {
      th: {
        skip: getText("th", "accessibility.skipToContent"),
        navigation: getText("th", "accessibility.primaryNavigation"),
        language: getText("th", "accessibility.languageSwitch")
      },
      en: {
        skip: getText("en", "accessibility.skipToContent"),
        navigation: getText("en", "accessibility.primaryNavigation"),
        language: getText("en", "accessibility.languageSwitch")
      }
    },
    {
      th: {
        skip: "ข้ามไปยังเนื้อหาหลัก",
        navigation: "เมนูหลัก",
        language: "เลือกภาษา"
      },
      en: {
        skip: "Skip to main content",
        navigation: "Primary navigation",
        language: "Choose language"
      }
    }
  );
});

test("skills contain only the approved interview-safe items", () => {
  assert.deepEqual(portfolioContent.skills, [
    { id: "programming-languages", labelKey: "skills.group.programmingLanguages", items: ["Python", "JavaScript", "HTML / CSS"] },
    { id: "frameworks-libraries", labelKey: "skills.group.frameworksLibraries", items: ["PyTorch", "Ultralytics (YOLO)"] },
    { id: "database-api", labelKey: "skills.group.databaseApi", items: ["REST API"] },
    { id: "tools", labelKey: "skills.group.tools", items: ["Git / GitHub", "VS Code", "Roboflow", "Figma", "Cloudflare"] }
  ]);
});

test("removed StockFlow content and technologies are absent", () => {
  const serialized = JSON.stringify(portfolioContent);
  for (const removed of [
    "stockflow", "StockFlow", "TypeScript", "Next.js", "React",
    "Tailwind CSS", "PostgreSQL", "Prisma ORM"
  ]) {
    assert.equal(serialized.includes(removed), false, `${removed} must be absent`);
  }
});
