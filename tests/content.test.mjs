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
  assert.equal(project.github, null);
});

test("Objexify copy keeps system capability separate from personal contribution", () => {
  assert.equal(getText("th", "project.moderation.type"), "โครงการจบแบบกลุ่ม");
  assert.match(getText("th", "project.moderation.capability"), /ภาพโป๊เปลือย.*อาวุธ.*บุหรี่.*ความรุนแรง/);
  assert.match(getText("th", "project.moderation.contribution.dataset"), /YOLO11m จำนวน 4 โมเดล/);
  assert.match(getText("th", "project.moderation.contribution.cloudflare"), /DigitalPlat.*Cloudflare DNS.*Cloudflare Tunnel.*Port 5000/);
  assert.match(getText("en", "project.moderation.type"), /Group senior project/);
  assert.doesNotMatch(
    portfolioContent.projects[0].contributionKeys
      .map((key) => getText("en", key)).join(" "),
    /developed the Backend|developed the Frontend|built the entire MongoDB/i
  );
});

test("Resume is configured and the certificate feature is absent", () => {
  assert.equal(portfolioContent.resume.href, "/assets/resume/resume.pdf");
  assert.equal("certificates" in portfolioContent, false);
  for (const language of ["th", "en"]) {
    const certificateKeys = Object.keys(portfolioContent.translations[language])
      .filter((key) => key.toLowerCase().includes("certificate"));
    assert.deepEqual(certificateKeys, []);
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
