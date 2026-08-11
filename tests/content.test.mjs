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
    getText("th", "project.moderation.resultCaption"),
    "ตัวอย่างการทดสอบโมเดล YOLO11m: ระบบตรวจพบวัตถุประเภทอาวุธ พร้อมแสดง Bounding Box และค่า Confidence 0.71"
  );
  assert.equal(
    getText("en", "project.moderation.resultCaption"),
    "YOLO11m model test example: The system detected a weapon and displayed its bounding box with a confidence score of 0.71."
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
    { id: "tools", labelKey: "skills.group.tools", items: ["Git / GitHub", "Postman", "VS Code", "Roboflow", "Figma", "Cloudflare"] }
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
