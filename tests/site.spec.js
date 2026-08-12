import { test, expect } from "@playwright/test";

const developmentURL = "http://127.0.0.1:4174/";
const sectionIds = [
  "home",
  "about",
  "skills",
  "education",
  "projects",
  "contact"
];

async function expectProjectImagesToDecode(page) {
  const imageResults = await page.locator(
    'img[data-project-image="moderation-api"]'
  ).evaluateAll(async (images) =>
    Promise.all(images.map(async (image) => {
      await image.decode();
      return {
        complete: image.complete,
        naturalWidth: image.naturalWidth,
        naturalHeight: image.naturalHeight
      };
    }))
  );

  expect(imageResults).toHaveLength(2);
  for (const result of imageResults) {
    expect(result.complete).toBe(true);
    expect(result.naturalWidth).toBeGreaterThan(0);
    expect(result.naturalHeight).toBeGreaterThan(0);
  }
}

test("renders the Thai portfolio with approved sections", async ({ page }) => {
  await page.goto("/");

  await expect(page).toHaveTitle(/Khongkaphan/);
  await expect(page.locator('script[type="module"]')).toHaveAttribute(
    "src",
    /^\/assets\/index-[A-Za-z0-9_-]+\.js$/
  );
  await expect(
    page.getByRole("heading", { level: 1, name: "Khongkaphan Kiawsod" })
  ).toBeVisible();
  await expect(page.getByText("Software Developer Intern")).toBeVisible();
  await expect(page.getByRole("navigation")).toBeVisible();

  for (const heading of [
    "เกี่ยวกับฉัน",
    "ทักษะ",
    "การศึกษา",
    "ผลงาน",
    "ติดต่อ"
  ]) {
    await expect(page.getByRole("heading", { name: heading })).toBeVisible();
  }
});

test("removes repeated section eyebrows and renders the approved bilingual About copy", async ({ page }) => {
  await page.goto("/");

  for (const sectionId of ["about", "skills", "education", "projects", "contact"]) {
    await expect(page.locator(`#${sectionId} .eyebrow`)).toHaveCount(0);
  }
  await expect(page.getByText("Software Developer Intern", { exact: true }))
    .toBeVisible();
  await expect(page.locator('[data-i18n="about.body"]'))
    .toContainText("AI Agent, Automation");
  await expect(page.locator('[data-i18n="about.experience"]'))
    .toContainText("Git, Cloudflare");

  await page.getByRole("button", { name: "EN" }).click();
  await expect(page.locator('[data-i18n="about.body"]'))
    .toContainText("AI Agents, Automation");
  await expect(page.locator('[data-i18n="about.experience"]'))
    .toContainText("Git, Cloudflare");
});

test("production project image keeps decoding across navigations", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("img", { name: "Khongkaphan Kiawsod" }))
    .toHaveAttribute("src", /assets\/avatar\.jpg$/);
  const overview = page.locator('[data-project-media-id="overview"]');
  const result = page.locator('[data-project-media-id="result"]');
  await expect(overview)
    .toHaveAttribute("src", /assets\/projects\/moderation-api\.png$/);
  await expect(overview).toHaveCSS("object-fit", "cover");
  await expect(result)
    .toHaveAttribute("src", /assets\/projects\/moderation-api-result\.png$/);
  await expect(result).toHaveCSS("object-fit", "contain");
  await expectProjectImagesToDecode(page);

  await page.reload();
  await expectProjectImagesToDecode(page);
});

test("uses the owner-confirmed email contact", async ({ page }) => {
  await page.goto("/");
  const emailLink = page.getByRole("link", { name: /อีเมล/ });

  await expect(emailLink).toHaveAttribute(
    "href",
    "mailto:ball.56110m@gmail.com"
  );
  await expect(emailLink).toContainText("ball.56110m@gmail.com");
});

test("switches between Thai and English without reloading", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "EN" }).click();

  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(
    page.locator("#primary-navigation").getByRole("link", {
      name: "Projects",
      exact: true
    })
  ).toBeVisible();
  await expect(page.getByText("Software Developer Intern")).toBeVisible();

  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("lang", "en");

  await page.getByRole("button", { name: "TH" }).click();
  await expect(page.locator("html")).toHaveAttribute("lang", "th");
  await expect(
    page.locator("#primary-navigation").getByRole("link", {
      name: "ผลงาน",
      exact: true
    })
  ).toBeVisible();
});

test("renders one bilingual Objexify case study without project links", async ({ page }) => {
  await page.goto("/");
  const project = page.locator('[data-project="moderation-api"]');

  await expect(page.locator("[data-project]")).toHaveCount(1);
  await expect(project.locator("[data-project-type]")).toHaveText("โครงการจบแบบกลุ่ม");
  await expect(project.locator("[data-project-capability-label]")).toHaveText(
    "ความสามารถของระบบ"
  );
  await expect(project.locator("[data-project-contribution-label]")).toHaveText(
    "หน้าที่ของผม"
  );
  await expect(project.locator("[data-project-contribution]")).toHaveCount(5);
  await expect(project.getByRole("link")).toHaveCount(0);
  await expect(page.getByText("StockFlow", { exact: false })).toHaveCount(0);
  const gallery = project.locator("[data-project-media-gallery]");
  const result = project.locator('[data-project-media-id="result"]');
  await expect(gallery.locator("[data-project-media]")).toHaveCount(2);
  await expect(gallery.locator("figcaption")).toHaveText(
    "ตัวอย่างการทดสอบโมเดล YOLO11m: ระบบตรวจพบวัตถุประเภทอาวุธ พร้อมแสดง Bounding Box และค่า Confidence"
  );
  await expect(result).toHaveAttribute(
    "alt",
    "ภาพตัวอย่างผลการทดสอบโมเดล YOLO11m ที่ตรวจพบอาวุธ พร้อม Bounding Box"
  );

  await page.getByRole("button", { name: "EN" }).click();
  await expect(project.locator("[data-project-type]")).toHaveText("Group senior project");
  await expect(project.locator("[data-project-capability-label]")).toHaveText(
    "System capability"
  );
  await expect(project.locator("[data-project-contribution-label]")).toHaveText(
    "My contribution"
  );
  await expect(project.locator("[data-project-contribution]").first())
    .toContainText("four YOLO11m models");
  await expect(gallery.locator("figcaption")).toHaveText(
    "YOLO11m model test example: The system detected a weapon and displayed its bounding box with a confidence score."
  );
  await expect(result).toHaveAttribute(
    "alt",
    "YOLO11m test result screenshot showing a detected weapon and bounding box"
  );
});

test("translates accessible interface labels in both languages", async ({ page }) => {
  await page.goto("/");

  await expect(page.locator(".skip-link")).toHaveText(
    "ข้ามไปยังเนื้อหาหลัก"
  );
  await expect(page.locator("nav")).toHaveAttribute("aria-label", "เมนูหลัก");
  await expect(page.locator(".language-switch")).toHaveAttribute(
    "aria-label",
    "เลือกภาษา"
  );

  await page.getByRole("button", { name: "EN" }).click();
  await expect(page.locator(".skip-link")).toHaveText("Skip to main content");
  await expect(page.locator("nav")).toHaveAttribute(
    "aria-label",
    "Primary navigation"
  );
  await expect(page.locator(".language-switch")).toHaveAttribute(
    "aria-label",
    "Choose language"
  );

  await page.getByRole("button", { name: "TH" }).click();
  await expect(page.locator(".skip-link")).toHaveText(
    "ข้ามไปยังเนื้อหาหลัก"
  );
  await expect(page.locator("nav")).toHaveAttribute("aria-label", "เมนูหลัก");
  await expect(page.locator(".language-switch")).toHaveAttribute(
    "aria-label",
    "เลือกภาษา"
  );
});

test("renders exactly four semantic bilingual skill groups", async ({ page }) => {
  await page.goto("/");
  const skills = page.locator("#skills");
  const groups = skills.locator("[data-skill-group]");

  await expect(groups).toHaveCount(4);
  await expect(groups.getByRole("heading", { level: 3 })).toHaveText([
    "ภาษาโปรแกรม",
    "เฟรมเวิร์กและไลบรารี",
    "ฐานข้อมูลและ API",
    "เครื่องมือ"
  ]);
  await expect(groups.locator("ul")).toHaveCount(4);
  await expect(groups.locator("li")).toHaveText([
    "Python",
    "JavaScript",
    "HTML / CSS",
    "PyTorch",
    "Ultralytics (YOLO)",
    "REST API",
    "Git / GitHub",
    "VS Code",
    "Roboflow",
    "Figma",
    "Cloudflare"
  ]);

  await page.getByRole("button", { name: "EN" }).click();
  await expect(groups.getByRole("heading", { level: 3 })).toHaveText([
    "Programming Languages",
    "Frameworks and Libraries",
    "Database and API",
    "Tools"
  ]);
});

test("language switching survives unavailable localStorage", async ({ page }) => {
  await page.addInitScript(() => {
    Storage.prototype.getItem = () => {
      throw new DOMException("Storage access denied", "SecurityError");
    };
    Storage.prototype.setItem = () => {
      throw new DOMException("Storage access denied", "SecurityError");
    };
  });
  await page.goto("/");

  await page.getByRole("button", { name: "EN" }).click();
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page.locator(".skip-link")).toHaveText("Skip to main content");
});

test("mobile menu exposes navigation and closes after selection", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");

  const menuButton = page.locator("[data-mobile-menu]");
  await expect(menuButton).toHaveAccessibleName("เปิดเมนู");
  await expect(menuButton).toHaveAttribute("aria-expanded", "false");
  await menuButton.click();
  await expect(menuButton).toHaveAccessibleName("ปิดเมนู");
  await expect(menuButton).toHaveAttribute("aria-expanded", "true");
  await page.locator("#primary-navigation").getByRole("link", {
    name: "ผลงาน",
    exact: true
  }).click();
  await expect(menuButton).toHaveAccessibleName("เปิดเมนู");
  await expect(menuButton).toHaveAttribute("aria-expanded", "false");
});

test("mobile navigation and language controls have 44px touch targets", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const menuButton = page.locator("[data-mobile-menu]");
  await menuButton.click();

  const targets = [
    menuButton,
    page.getByRole("button", { name: "TH" }),
    page.getByRole("button", { name: "EN" }),
    ...(await page.locator("#primary-navigation a").all())
  ];

  for (const target of targets) {
    const box = await target.boundingBox();
    expect(box, "touch target must have a rendered box").not.toBeNull();
    expect(box.width).toBeGreaterThanOrEqual(44);
    expect(box.height).toBeGreaterThanOrEqual(44);
  }
});

test("Transcript module owns unavailable and configured bilingual states", async ({ page }) => {
  await page.route("**/js/content.js", async (route) => {
    const response = await route.fetch();
    const body = await response.text();
    await route.fulfill({
      response,
      body: body.replace(
        'transcript: { href: "/assets/transcript/transcript.pdf" }',
        "transcript: { href: null }"
      )
    });
  });
  await page.goto(developmentURL);

  const moduleExports = await page.evaluate(async () =>
    Object.keys(await import("/js/transcript.js")).sort()
  );
  expect(moduleExports).toEqual(["initializeTranscript", "updateTranscript"]);

  await expect(page.getByRole("button", { name: "Transcript" }))
    .toBeDisabled();
  await expect(page.getByText("ยังไม่ได้เพิ่มไฟล์ Transcript")).toBeVisible();

  await page.evaluate(async () => {
    const { portfolioContent } = await import("/js/content.js");
    const { updateTranscript } = await import("/js/transcript.js");
    portfolioContent.transcript.href = "/assets/transcript/transcript.pdf";
    updateTranscript("en");
    updateTranscript("en");
  });

  const control = page.locator("[data-transcript-link]");
  await expect(control).toHaveCount(1);
  await expect(control).toHaveText("Transcript");
  await expect(control).toHaveAttribute(
    "href",
    "/assets/transcript/transcript.pdf"
  );
  await expect(control).toHaveAttribute("target", "_blank");
  await expect(control).toHaveAttribute("rel", "noopener noreferrer");

  await page.evaluate(async () => {
    const { updateTranscript } = await import("/js/transcript.js");
    updateTranscript("th");
  });
  await expect(control).toHaveText("Transcript");
});

test("exposes the configured Transcript in Thai and English", async ({ page }) => {
  await page.goto("/");

  const control = page.locator("[data-transcript-link]");
  await expect(control).toHaveText("Transcript");
  await expect(control).toHaveAttribute(
    "href",
    "/assets/transcript/transcript.pdf"
  );
  await expect(control).toHaveAttribute("target", "_blank");
  await expect(control).toHaveAttribute("rel", "noopener noreferrer");
  await expect(page.locator("[data-transcript-status]")).toBeEmpty();

  const response = await page.request.get("/assets/transcript/transcript.pdf");
  expect(response.ok()).toBe(true);
  expect(response.headers()["content-type"]).toContain("application/pdf");
  expect((await response.body()).subarray(0, 5).toString()).toBe("%PDF-");

  await page.getByRole("button", { name: "EN" }).click();
  await expect(control).toHaveText("Transcript");
});

test("does not expose the removed certificate feature", async ({ page }) => {
  await page.goto("/");

  await expect(page.locator("#certificates")).toHaveCount(0);
  await expect(page.locator("[data-certificate-grid]")).toHaveCount(0);
  await expect(page.locator("[data-certificate-modal]")).toHaveCount(0);
  await expect(page.locator(
    "[data-modal-title], [data-modal-image], [data-modal-pdf], "
      + "[data-modal-download], [data-modal-close]"
  )).toHaveCount(0);
  await expect(
    page.locator('#primary-navigation a[href="#certificates"]')
  ).toHaveCount(0);
  await expect(page.getByText("ใบประกาศนียบัตร", { exact: true }))
    .toHaveCount(0);

  await page.getByRole("button", { name: "EN" }).click();
  await expect(page.getByText("Certificates", { exact: true })).toHaveCount(0);
});

test("Thai static fallback contains the complete Objexify case study and anchor navigation works when app.js is aborted", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.route("**/*", async (route) => {
    const request = route.request();
    const path = new URL(request.url()).pathname;
    const isApplicationEntry = request.resourceType() === "script"
      && (
        path.endsWith("/js/app.js")
        || /^\/assets\/index-[A-Za-z0-9_-]+\.js$/.test(path)
      );

    if (isApplicationEntry) {
      await route.abort();
      return;
    }
    await route.continue();
  });
  await page.goto("/", { waitUntil: "domcontentloaded" });

  const navigation = page.locator("#primary-navigation");
  await expect(navigation.getByRole("link")).toHaveCount(6);
  for (const link of await navigation.getByRole("link").all()) {
    await expect(link).toBeVisible();
  }
  await expect(page.locator(".skip-link")).toHaveText(
    "ข้ามไปยังเนื้อหาหลัก"
  );
  await expect(page.locator("nav")).toHaveAttribute("aria-label", "เมนูหลัก");
  await expect(page.locator(".language-switch")).toHaveAttribute(
    "aria-label",
    "เลือกภาษา"
  );
  for (const id of sectionIds) {
    await expect(page.locator(`#${id}`)).toBeVisible();
  }
  const fallbackSkillGroups = page.locator(
    "#skills [data-skill-group]"
  );
  await expect(fallbackSkillGroups).toHaveCount(4);
  await expect(
    fallbackSkillGroups.getByRole("heading", { level: 3 })
  ).toHaveText([
    "ภาษาโปรแกรม",
    "เฟรมเวิร์กและไลบรารี",
    "ฐานข้อมูลและ API",
    "เครื่องมือ"
  ]);
  await expect(fallbackSkillGroups.locator("li")).toHaveCount(11);
  await expect(page.locator("[data-project-list] article")).toHaveCount(1);
  await expect(page.locator("[data-project-media]")).toHaveCount(2);
  await expect(page.locator("[data-project-media] figcaption")).toHaveText(
    "ตัวอย่างการทดสอบโมเดล YOLO11m: ระบบตรวจพบวัตถุประเภทอาวุธ พร้อมแสดง Bounding Box และค่า Confidence"
  );
  await expect(page.getByText("ความสามารถของระบบ", { exact: true })).toBeVisible();
  await expect(page.getByText("หน้าที่ของผม", { exact: true })).toBeVisible();
  await expect(page.locator("[data-project-list] li")).toHaveCount(15);
  await expect(page.getByText("StockFlow", { exact: false })).toHaveCount(0);
  const transcriptLink = page.locator("[data-transcript-link]");
  await expect(transcriptLink).toHaveText("Transcript");
  await expect(transcriptLink).toHaveAttribute(
    "href", "/assets/transcript/transcript.pdf"
  );
  await expect(transcriptLink).toHaveAttribute("target", "_blank");
  await expect(transcriptLink).toHaveAttribute(
    "rel", "noopener noreferrer"
  );
  await expect(page.locator("[data-transcript-status]")).toBeEmpty();
  const projectsHtml = await page.locator("[data-project-list]").evaluate(
    (element) => element.innerHTML
  );
  for (const removedContent of [
    "StockFlow",
    "stockflow-dashboard.png",
    "Next.js",
    "TypeScript",
    "PostgreSQL",
    "Prisma ORM",
    "https://github.com/Phurin123/Project-Api-detect_inappropriate-main"
  ]) {
    expect(projectsHtml).not.toContain(removedContent);
  }

  await navigation.getByRole("link", { name: "ติดต่อ", exact: true }).click();
  await expect(page).toHaveURL(/#contact$/);
  await expect(page.locator("html")).not.toHaveClass(/navigation-ready/);
  await expect(page.locator("html")).not.toHaveClass(/reveal-ready/);
});

test("aborted Objexify result image keeps the overview and localized caption", async ({ page }) => {
  await page.route(
    "**/assets/projects/moderation-api-result.png",
    (route) => route.abort()
  );
  await page.goto("/");

  const project = page.locator('[data-project="moderation-api"]');
  const overview = project.locator('img[data-project-media-id="overview"]');
  const placeholder = project.locator(
    '.project-image-fallback[data-project-media-id="result"]'
  );
  const caption = project.locator('[data-project-media="result"] figcaption');

  await expect(overview).toBeVisible();
  await expect(placeholder).toHaveAttribute("role", "img");
  await expect(placeholder).toHaveAttribute(
    "aria-label",
    "ภาพตัวอย่างผลการทดสอบโมเดล YOLO11m ที่ตรวจพบอาวุธ พร้อม Bounding Box. ไม่สามารถแสดงภาพโครงการได้"
  );
  await expect(placeholder.locator("[data-project-image-status]")).toHaveText(
    "ไม่สามารถแสดงภาพโครงการได้"
  );
  await expect(caption).toContainText("ตัวอย่างการทดสอบโมเดล YOLO11m");

  await page.getByRole("button", { name: "EN" }).click();
  await expect(placeholder).toHaveAttribute(
    "aria-label",
    "YOLO11m test result screenshot showing a detected weapon and bounding box. Project image unavailable"
  );
  await expect(placeholder.locator("[data-project-image-status]")).toHaveText(
    "Project image unavailable"
  );
  await expect(caption).toContainText("YOLO11m model test example");
});

test("reduced motion reveals every section without animation dependence", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");

  await expect(page.locator("html")).toHaveClass(/reveal-ready/);
  const reveals = page.locator(".reveal");
  await expect(reveals).not.toHaveCount(0);
  for (const reveal of await reveals.all()) {
    await expect(reveal).toHaveClass(/is-visible/);
    await expect(reveal).toHaveCSS("opacity", "1");
  }
});

test("missing IntersectionObserver preserves reveals and mobile navigation", async ({ page }) => {
  await page.addInitScript(() => {
    delete window.IntersectionObserver;
  });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");

  await expect(page.locator("html")).toHaveClass(/navigation-ready/);
  await expect(page.locator("html")).toHaveClass(/reveal-ready/);
  for (const reveal of await page.locator(".reveal").all()) {
    await expect(reveal).toHaveClass(/is-visible/);
    await expect(reveal).toBeVisible();
  }

  const menuButton = page.locator("[data-mobile-menu]");
  await menuButton.click();
  await expect(menuButton).toHaveAttribute("aria-expanded", "true");
  await expect(page.locator("#primary-navigation")).toBeVisible();
});

test("has no horizontal overflow on representative viewports", async ({ page }) => {
  for (const viewport of [
    { width: 390, height: 844 },
    { width: 768, height: 1024 },
    { width: 1440, height: 900 }
  ]) {
    await page.setViewportSize(viewport);
    await page.goto("/");
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth
    );
    expect(overflow).toBe(false);
  }
});

test("featured Objexify layout adapts without horizontal overflow", async ({ page }) => {
  for (const [viewport, expectedColumns] of [
    [{ width: 1440, height: 900 }, 2],
    [{ width: 768, height: 1024 }, 1],
    [{ width: 390, height: 844 }, 1]
  ]) {
    await page.setViewportSize(viewport);
    await page.goto("/");
    const project = page.locator('[data-project="moderation-api"]');
    const columns = await project.evaluate((element) =>
      getComputedStyle(element).gridTemplateColumns.split(" ").length
    );
    expect(columns).toBe(expectedColumns);
    expect(await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth
    )).toBe(false);
  }
});

test("contact links are safe", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("link", { name: /GitHub/ }).first())
    .toHaveAttribute("rel", /noopener/);
  await expect(page.getByRole("link", { name: /Email|อีเมล/ }))
    .toHaveAttribute("href", /^mailto:/);
});

test("publishes complete sharing metadata", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator('meta[property="og:title"]'))
    .toHaveAttribute("content", /Khongkaphan/);
  await expect(page.locator('meta[property="og:image"]'))
    .toHaveAttribute("content", /assets\/social-preview\.png$/);
});

test("serves public assets from deployment-stable URLs", async ({ request }) => {
  for (const [path, contentType] of [
    ["/assets/avatar.jpg", "image/jpeg"],
    ["/assets/projects/moderation-api.png", "image/png"],
    ["/assets/projects/moderation-api-result.png", "image/png"],
    ["/assets/social-preview.png", "image/png"]
  ]) {
    const response = await request.get(path);
    expect(response.status(), `${path} status`).toBe(200);
    expect(response.headers()["content-type"], `${path} content type`).toContain(
      contentType
    );
    expect((await response.body()).byteLength, `${path} body`).toBeGreaterThan(0);
  }
});
