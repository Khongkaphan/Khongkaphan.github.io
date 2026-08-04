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

test("portfolio contains the two approved projects", () => {
  assert.deepEqual(
    portfolioContent.projects.map((project) => project.id),
    ["moderation-api", "stockflow"]
  );
});

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

test("contact email uses the owner-confirmed address", () => {
  assert.equal(portfolioContent.contact.email, "ball.56110m@gmail.com");
});

test("technology names remain in English", () => {
  const technologies = portfolioContent.projects.flatMap(
    (project) => project.technologies
  );
  assert.ok(technologies.includes("Next.js"));
  assert.ok(technologies.includes("PostgreSQL"));
  assert.ok(technologies.includes("YOLO11m"));
  assert.ok(technologies.includes("FastAPI"));
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

test("skills use the four approved bilingual groups without adding items", () => {
  assert.deepEqual(portfolioContent.skills, [
    {
      id: "programming-languages",
      labelKey: "skills.group.programmingLanguages",
      items: ["Python", "JavaScript", "TypeScript", "HTML / CSS"]
    },
    {
      id: "frameworks-libraries",
      labelKey: "skills.group.frameworksLibraries",
      items: [
        "Next.js",
        "React",
        "Tailwind CSS",
        "PyTorch",
        "Ultralytics (YOLO)"
      ]
    },
    {
      id: "database-api",
      labelKey: "skills.group.databaseApi",
      items: ["PostgreSQL", "Prisma ORM", "REST API"]
    },
    {
      id: "tools",
      labelKey: "skills.group.tools",
      items: [
        "Git / GitHub",
        "Postman",
        "VS Code",
        "Roboflow",
        "Figma",
        "Cloudflare"
      ]
    }
  ]);

  assert.deepEqual(
    portfolioContent.skills.map(({ labelKey }) => ({
      th: getText("th", labelKey),
      en: getText("en", labelKey)
    })),
    [
      { th: "ภาษาโปรแกรม", en: "Programming Languages" },
      { th: "เฟรมเวิร์กและไลบรารี", en: "Frameworks and Libraries" },
      { th: "ฐานข้อมูลและ API", en: "Database and API" },
      { th: "เครื่องมือ", en: "Tools" }
    ]
  );
});
