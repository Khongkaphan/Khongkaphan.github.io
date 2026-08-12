const th = {
  "nav.home": "หน้าแรก",
  "nav.about": "เกี่ยวกับฉัน",
  "nav.skills": "ทักษะ",
  "nav.education": "การศึกษา",
  "nav.projects": "ผลงาน",
  "nav.contact": "ติดต่อ",
  "navigation.open": "เปิดเมนู",
  "navigation.close": "ปิดเมนู",
  "accessibility.skipToContent": "ข้ามไปยังเนื้อหาหลัก",
  "accessibility.primaryNavigation": "เมนูหลัก",
  "accessibility.languageSwitch": "เลือกภาษา",
  "hero.role": "Software Developer Intern",
  "hero.summary": "นักศึกษาวิทยาการคอมพิวเตอร์ สนใจการพัฒนาซอฟต์แวร์ ระบบเว็บ และการประยุกต์ใช้ AI",
  "hero.projects": "ดูผลงาน",
  "hero.transcript": "Transcript",
  "hero.contact": "ติดต่อฉัน",
  "about.title": "เกี่ยวกับฉัน",
  "about.body": "กำลังศึกษาระดับปริญญาตรี สาขาวิชาวิทยาการคอมพิวเตอร์ คณะเทคโนโลยีสารสนเทศและการสื่อสาร มหาวิทยาลัยพะเยา มีความสนใจในการประยุกต์ใช้ปัญญาประดิษฐ์ (AI) เพื่อพัฒนาซอฟต์แวร์และระบบที่สามารถนำไปใช้งานได้จริง โดยปัจจุบันสนใจเป็นพิเศษในด้าน AI Agent, Automation และ Computer Vision",
  "about.experience": "มีประสบการณ์พัฒนาโปรเจกต์ด้าน AI ตั้งแต่การเตรียมและจัดการชุดข้อมูล การฝึกสอนและประเมินประสิทธิภาพโมเดลตรวจจับวัตถุ ไปจนถึงการนำโมเดลมาให้บริการผ่าน REST API รวมถึงมีประสบการณ์ใช้งาน Git, Cloudflare และการออกแบบส่วนติดต่อผู้ใช้เบื้องต้น",
  "about.goal": "ปัจจุบันต้องการเรียนรู้และต่อยอดความรู้ด้าน AI Agent และ Automation ผ่านการพัฒนาโปรเจกต์และการทำงานจริง เพื่อเพิ่มประสบการณ์ในการสร้างระบบ AI ที่สามารถทำงานร่วมกับซอฟต์แวร์และกระบวนการต่าง ๆ ได้อย่างมีประสิทธิภาพ",
  "skills.title": "ทักษะ",
  "skills.group.programmingLanguages": "ภาษาโปรแกรม",
  "skills.group.frameworksLibraries": "เฟรมเวิร์กและไลบรารี",
  "skills.group.databaseApi": "ฐานข้อมูลและ API",
  "skills.group.tools": "เครื่องมือ",
  "education.title": "การศึกษา",
  "education.degree": "วิทยาศาสตรบัณฑิต สาขาวิทยาการคอมพิวเตอร์",
  "education.institution": "มหาวิทยาลัยพะเยา",
  "education.period": "2023 - ปัจจุบัน",
  "education.gpa": "เกรดเฉลี่ยสะสม 3.47",
  "projects.title": "ผลงาน",
  "project.moderation.title": "Objexify — บริการ API สำหรับตรวจจับวัตถุไม่เหมาะสม",
  "project.moderation.type": "โครงการจบแบบกลุ่ม",
  "project.moderation.capabilityLabel": "ความสามารถของระบบ",
  "project.moderation.capability": "ระบบ AI สำหรับตรวจจับวัตถุไม่เหมาะสมในภาพและวิดีโอ ได้แก่ ภาพโป๊เปลือย อาวุธ บุหรี่ และความรุนแรง โดยให้บริการผลการตรวจจับและตำแหน่ง Bounding Box ผ่าน API เพื่อให้ระบบอื่นนำไปใช้งานต่อได้",
  "project.moderation.contributionLabel": "หน้าที่ของผม",
  "project.moderation.contribution.dataset": "เตรียมและปรับปรุง Dataset ทำ Label และฝึกสอนโมเดล YOLO11m จำนวน 4 โมเดล",
  "project.moderation.contribution.evaluation": "ประเมินโมเดลด้วย mAP50-95, Precision และ Recall พร้อมทดลองเพิ่ม Background Images เพื่อลดการตรวจจับผิดพลาด",
  "project.moderation.contribution.mongodb": "มีส่วนร่วมในงานส่วนฐานข้อมูล MongoDB ของโครงการ",
  "project.moderation.contribution.cloudflare": "ตั้งค่าโดเมน objexify.dpdns.org จาก DigitalPlat ให้ใช้งานร่วมกับ Cloudflare DNS และสร้าง Cloudflare Tunnel เชื่อมไปยัง FastAPI ที่รันบน Port 5000",
  "project.moderation.contribution.figma": "ออกแบบหน้าจอและ User Flow บางส่วนด้วย Figma",
  "project.moderation.overviewAlt": "ภาพหน้าจอระบบ Objexify สำหรับตรวจจับวัตถุไม่เหมาะสม",
  "project.moderation.resultAlt": "ภาพตัวอย่างผลการทดสอบโมเดล YOLO11m ที่ตรวจพบอาวุธ พร้อม Bounding Box",
  "project.moderation.resultCaption": "ตัวอย่างการทดสอบโมเดล YOLO11m: ระบบตรวจพบวัตถุประเภทอาวุธ พร้อมแสดง Bounding Box และค่า Confidence",
  "project.imageUnavailable": "ไม่สามารถแสดงภาพโครงการได้",
  "project.github": "เปิด GitHub",
  "contact.title": "ติดต่อฉัน",
  "contact.phone": "โทรศัพท์",
  "contact.email": "อีเมล",
  "contact.github": "GitHub",
  "footer.copy": "Khongkaphan Kiawsod",
  "transcript.unavailable": "ยังไม่ได้เพิ่มไฟล์ Transcript"
};

const en = {
  "nav.home": "Home",
  "nav.about": "About",
  "nav.skills": "Skills",
  "nav.education": "Education",
  "nav.projects": "Projects",
  "nav.contact": "Contact",
  "navigation.open": "Open menu",
  "navigation.close": "Close menu",
  "accessibility.skipToContent": "Skip to main content",
  "accessibility.primaryNavigation": "Primary navigation",
  "accessibility.languageSwitch": "Choose language",
  "hero.role": "Software Developer Intern",
  "hero.summary": "Computer Science student interested in software development, web systems, and applied AI.",
  "hero.projects": "View Projects",
  "hero.transcript": "Transcript",
  "hero.contact": "Contact Me",
  "about.title": "About Me",
  "about.body": "I am pursuing a bachelor's degree in Computer Science at the School of Information and Communication Technology, University of Phayao. I am interested in applying Artificial Intelligence (AI) to develop practical software and systems, with a current focus on AI Agents, Automation, and Computer Vision.",
  "about.experience": "I have experience developing AI projects ranging from dataset preparation and management, training and evaluating object detection models, to serving models via REST APIs. I also have experience using Git, Cloudflare, and basic user interface design.",
  "about.goal": "Currently, I am looking to expand my knowledge in AI Agents and Automation through project development and hands-on experience, aiming to efficiently build AI systems that integrate with various software and workflows.",
  "skills.title": "Skills",
  "skills.group.programmingLanguages": "Programming Languages",
  "skills.group.frameworksLibraries": "Frameworks and Libraries",
  "skills.group.databaseApi": "Database and API",
  "skills.group.tools": "Tools",
  "education.title": "Education",
  "education.degree": "Bachelor of Science in Computer Science",
  "education.institution": "University of Phayao",
  "education.period": "2023 - Present",
  "education.gpa": "GPA 3.47",
  "projects.title": "Projects",
  "project.moderation.title": "Objexify — Inappropriate Content Detection API",
  "project.moderation.type": "Group senior project",
  "project.moderation.capabilityLabel": "System capability",
  "project.moderation.capability": "An AI service that detects pornography, weapons, cigarettes, and violence in images and videos, returning detection results and bounding-box coordinates through an API for integration with other systems.",
  "project.moderation.contributionLabel": "My contribution",
  "project.moderation.contribution.dataset": "Prepared and refined datasets, created labels, and trained four YOLO11m models.",
  "project.moderation.contribution.evaluation": "Evaluated the models using mAP50-95, Precision, and Recall, and experimented with background images to reduce false detections.",
  "project.moderation.contribution.mongodb": "Contributed to the project's MongoDB-related work.",
  "project.moderation.contribution.cloudflare": "Configured the DigitalPlat domain objexify.dpdns.org with Cloudflare DNS and created a Cloudflare Tunnel to the FastAPI service running on port 5000.",
  "project.moderation.contribution.figma": "Designed selected screens and user flows in Figma.",
  "project.moderation.overviewAlt": "Objexify inappropriate content detection system screen",
  "project.moderation.resultAlt": "YOLO11m test result screenshot showing a detected weapon and bounding box",
  "project.moderation.resultCaption": "YOLO11m model test example: The system detected a weapon and displayed its bounding box with a confidence score.",
  "project.imageUnavailable": "Project image unavailable",
  "project.github": "View on GitHub",
  "contact.title": "Contact Me",
  "contact.phone": "Phone",
  "contact.email": "Email",
  "contact.github": "GitHub",
  "footer.copy": "Khongkaphan Kiawsod",
  "transcript.unavailable": "Transcript file has not been added"
};

export const portfolioContent = {
  defaultLanguage: "th",
  translations: { th, en },
  skills: [
    {
      id: "programming-languages",
      labelKey: "skills.group.programmingLanguages",
      items: ["Python", "JavaScript", "HTML / CSS"]
    },
    {
      id: "frameworks-libraries",
      labelKey: "skills.group.frameworksLibraries",
      items: ["PyTorch", "Ultralytics (YOLO)"]
    },
    {
      id: "database-api",
      labelKey: "skills.group.databaseApi",
      items: ["REST API"]
    },
    {
      id: "tools",
      labelKey: "skills.group.tools",
      items: [
        "Git / GitHub",
        "VS Code",
        "Roboflow",
        "Figma",
        "Cloudflare"
      ]
    }
  ],
  education: {
    institution: "มหาวิทยาลัยพะเยา",
    program: "วิทยาศาสตรบัณฑิต สาขาวิทยาการคอมพิวเตอร์",
    period: "2023 - ปัจจุบัน",
    gpa: "3.47"
  },
  projects: [
    {
      id: "moderation-api",
      titleKey: "project.moderation.title",
      typeKey: "project.moderation.type",
      capabilityLabelKey: "project.moderation.capabilityLabel",
      capabilityKey: "project.moderation.capability",
      contributionLabelKey: "project.moderation.contributionLabel",
      contributionKeys: [
        "project.moderation.contribution.dataset",
        "project.moderation.contribution.evaluation",
        "project.moderation.contribution.mongodb",
        "project.moderation.contribution.cloudflare",
        "project.moderation.contribution.figma"
      ],
      media: [
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
      ],
      technologies: [
        "Python", "FastAPI", "YOLO11m / Ultralytics", "PyTorch", "OpenCV",
        "MongoDB / PyMongo", "REST API / JSON", "Cloudflare Tunnel",
        "DigitalPlat DNS", "Figma"
      ],
      github: null
    }
  ],
  transcript: { href: "/assets/transcript/transcript.pdf" },
  contact: {
    phone: "0932795834",
    email: "ball.56110m@gmail.com",
    github: "https://github.com/Khongkaphan"
  }
};

export function getText(language, key) {
  return portfolioContent.translations[language]?.[key]
    ?? portfolioContent.translations.th[key]
    ?? key;
}
