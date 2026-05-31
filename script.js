const root = document.documentElement;
const langSwitcher = document.querySelector("#langSwitcher");
const langOptions = document.querySelectorAll(".lang-option[data-lang-label]");
const translatable = document.querySelectorAll("[data-zh][data-en][data-ja][data-ko]");
const attributeTargets = document.querySelectorAll("[data-i18n][data-zh][data-en][data-ja][data-ko]");
const metaDescription = document.querySelector("#metaDescription");
const revealItems = document.querySelectorAll(".section-reveal");
const progressBar = document.querySelector(".scroll-progress");
const cursorGlow = document.querySelector(".cursor-glow");
const portraitPanel = document.querySelector(".portrait-panel");
const navLinks = Array.from(document.querySelectorAll(".nav a[href^='#']"));
const sectionTargets = navLinks
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);
const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
const canAnimate = !motionQuery.matches;

const SUPPORTED_LANGUAGES = ["zh", "en", "ja", "ko"];
const HTML_LANG = {
  zh: "zh-CN",
  en: "en",
  ja: "ja",
  ko: "ko"
};
const PAGE_TITLES = {
  zh: "钟浩 | Tomhao10225101490",
  en: "Zhong Hao | Tomhao10225101490",
  ja: "鍾浩 | Tomhao10225101490",
  ko: "종하오 | Tomhao10225101490"
};
const META_DESCRIPTIONS = {
  zh: "钟浩，华东师范大学软件工程学院，人工智能、机器学习、AI 交易与量化交易方向。",
  en: "Zhong Hao, School of Software Engineering at ECNU, focused on AI, machine learning, AI trading, and quantitative trading.",
  ja: "鍾浩、華東師範大学ソフトウェア工程学院。人工知能、機械学習、AI トレード、クオンツ取引を専門としています。",
  ko: "종하오, 동화사범대학교 소프트웨어공학대학. 인공지능, 머신러닝, AI 트레이딩, 퀀트 트레이딩 분야."
};

const normalizeLanguage = (language) => (
  SUPPORTED_LANGUAGES.includes(language) ? language : "zh"
);

const setLanguage = (language) => {
  const nextLanguage = normalizeLanguage(language);

  root.lang = HTML_LANG[nextLanguage];
  document.title = PAGE_TITLES[nextLanguage];

  translatable.forEach((element) => {
    if (element.dataset.i18n) {
      return;
    }
    element.textContent = element.dataset[nextLanguage];
  });

  attributeTargets.forEach((element) => {
    const attributeName = element.dataset.i18n;
    element.setAttribute(attributeName, element.dataset[nextLanguage]);
  });

  if (metaDescription) {
    metaDescription.setAttribute("content", META_DESCRIPTIONS[nextLanguage]);
  }

  langOptions.forEach((option) => {
    const isActive = option.dataset.langLabel === nextLanguage;
    option.classList.toggle("is-active", isActive);
    option.setAttribute("aria-pressed", String(isActive));
  });

  window.localStorage.setItem("preferred-language", nextLanguage);
};

langOptions.forEach((option) => {
  option.addEventListener("click", () => {
    setLanguage(option.dataset.langLabel);
  });
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { rootMargin: "0px 0px -8% 0px", threshold: 0.02 }
);

revealItems.forEach((item) => revealObserver.observe(item));

const updateScrollProgress = () => {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollable > 0 ? Math.min(1, Math.max(0, window.scrollY / scrollable)) : 0;
  root.style.setProperty("--scroll-progress", `${progress * 100}%`);

  let activeSection = null;
  const activationLine = Math.min(220, window.innerHeight * 0.34);
  sectionTargets.forEach((section) => {
    if (section.getBoundingClientRect().top <= activationLine) {
      activeSection = section;
    }
  });

  navLinks.forEach((link) => {
    link.classList.toggle("is-active", Boolean(activeSection) && link.getAttribute("href") === `#${activeSection.id}`);
  });
};

const setPointerPosition = (event) => {
  root.style.setProperty("--pointer-x", `${event.clientX}px`);
  root.style.setProperty("--pointer-y", `${event.clientY}px`);
  root.style.setProperty("--cursor-opacity", "1");

  if (!canAnimate || !portraitPanel) {
    return;
  }

  const rect = portraitPanel.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  const x = (event.clientX - centerX) / rect.width;
  const y = (event.clientY - centerY) / rect.height;
  const moveX = Math.max(-1, Math.min(1, x)) * 10;
  const moveY = Math.max(-1, Math.min(1, y)) * 10;
  root.style.setProperty("--orbit-shift-x", `${moveX * 0.45}px`);
  root.style.setProperty("--orbit-shift-y", `${moveY * 0.45}px`);
  portraitPanel.style.transform = `translate3d(${moveX}px, ${moveY}px, 0) rotateX(${-moveY * 0.8}deg) rotateY(${moveX * 0.8}deg)`;
};

const resetPointer = () => {
  root.style.setProperty("--cursor-opacity", "0");
  root.style.setProperty("--orbit-shift-x", "0px");
  root.style.setProperty("--orbit-shift-y", "0px");
  if (portraitPanel) {
    portraitPanel.style.transform = "";
  }
};

const tiltTargets = document.querySelectorAll(".project-card, .interest-list article, .profile-grid div, .qr-card");

tiltTargets.forEach((card) => {
  card.addEventListener("pointermove", (event) => {
    if (!canAnimate) {
      return;
    }

    const rect = card.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    const rotateY = (x - 50) / 12;
    const rotateX = (50 - y) / 14;

    card.style.setProperty("--card-x", `${x}%`);
    card.style.setProperty("--card-y", `${y}%`);
    card.style.setProperty("--card-rx", `${rotateX}deg`);
    card.style.setProperty("--card-ry", `${rotateY}deg`);
  });

  card.addEventListener("pointerleave", () => {
    card.style.setProperty("--card-rx", "0deg");
    card.style.setProperty("--card-ry", "0deg");
    card.style.setProperty("--card-x", "50%");
    card.style.setProperty("--card-y", "50%");
  });
});

const canvas = document.querySelector("#sparkCanvas");
const context = canvas?.getContext("2d");
let particles = [];
let streaks = [];
let pointer = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
let animationFrame = 0;
let particleTick = 0;

const particlePalette = [
  "102, 229, 186",
  "117, 215, 255",
  "216, 164, 95",
  "245, 241, 232"
];

const seededUnit = (seed) => {
  const value = Math.sin(seed * 127.1) * 43758.5453123;
  return value - Math.floor(value);
};

const createParticle = (index, width, height) => {
  const depth = 0.42 + seededUnit(index + 8) * 0.82;
  const speed = 0.16 + depth * 0.22;

  return {
    x: seededUnit(index + 1) * width,
    y: seededUnit(index + 2) * height,
    vx: (seededUnit(index + 3) - 0.42) * speed,
    vy: (seededUnit(index + 4) - 0.34) * speed,
    size: 0.8 + depth * 1.35,
    depth,
    color: particlePalette[index % particlePalette.length],
    phase: seededUnit(index + 5) * Math.PI * 2
  };
};

const createStreak = (index, width, height) => ({
  x: seededUnit(index + 11) * width,
  y: seededUnit(index + 12) * height,
  length: 56 + seededUnit(index + 13) * 96,
  speed: 1.4 + seededUnit(index + 14) * 1.8,
  alpha: 0.08 + seededUnit(index + 15) * 0.12,
  color: particlePalette[index % 3]
});

const resizeCanvas = () => {
  if (!canvas || !context) {
    return;
  }

  const ratio = Math.min(window.devicePixelRatio || 1, 1.6);
  const width = document.documentElement.clientWidth;
  const height = window.innerHeight;
  canvas.width = Math.floor(width * ratio);
  canvas.height = Math.floor(height * ratio);
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  context.setTransform(ratio, 0, 0, ratio, 0, 0);

  const count = Math.max(52, Math.min(150, Math.floor(width / 10)));
  const streakCount = Math.max(5, Math.min(11, Math.floor(width / 170)));
  particles = Array.from({ length: count }, (_, index) => createParticle(index, width, height));
  streaks = Array.from({ length: streakCount }, (_, index) => createStreak(index, width, height));
};

const drawParticles = () => {
  if (!canvas || !context || !canAnimate) {
    return;
  }

  const width = document.documentElement.clientWidth;
  const height = window.innerHeight;
  context.clearRect(0, 0, width, height);
  context.save();
  context.globalCompositeOperation = "lighter";
  particleTick += 0.012;

  streaks.forEach((streak, index) => {
    const endX = streak.x + streak.length;
    const endY = streak.y + streak.length * 0.28;
    const gradient = context.createLinearGradient(streak.x, streak.y, endX, endY);
    gradient.addColorStop(0, `rgba(${streak.color}, 0)`);
    gradient.addColorStop(0.5, `rgba(${streak.color}, ${streak.alpha})`);
    gradient.addColorStop(1, `rgba(${streak.color}, 0)`);

    context.strokeStyle = gradient;
    context.lineWidth = 1;
    context.beginPath();
    context.moveTo(streak.x, streak.y);
    context.lineTo(endX, endY);
    context.stroke();

    streak.x += streak.speed;
    streak.y += streak.speed * 0.28;

    if (streak.x > width + streak.length || streak.y > height + streak.length) {
      streak.x = -streak.length;
      streak.y = seededUnit(index + particleTick) * height * 0.72;
    }
  });

  particles.forEach((particle, index) => {
    const dx = pointer.x - particle.x;
    const dy = pointer.y - particle.y;
    const distance = Math.hypot(dx, dy);
    const pull = distance < 220 ? (220 - distance) / 220 : 0;
    const wave = Math.sin(particleTick * 2 + particle.phase) * 0.18;

    particle.x += particle.vx + dx * pull * 0.0026 * particle.depth + wave * 0.08;
    particle.y += particle.vy + dy * pull * 0.0026 * particle.depth + Math.cos(particleTick + particle.phase) * 0.05;

    if (particle.x > width + 20) particle.x = -20;
    if (particle.y > height + 20) particle.y = -20;
    if (particle.x < -20) particle.x = width + 20;
    if (particle.y < -20) particle.y = height + 20;

    const pulse = 0.68 + Math.sin(particleTick * 3 + particle.phase) * 0.22;
    context.fillStyle = `rgba(${particle.color}, ${0.22 + particle.depth * 0.26})`;
    context.shadowColor = `rgba(${particle.color}, 0.32)`;
    context.shadowBlur = 7 * particle.depth;
    context.beginPath();
    context.arc(particle.x, particle.y, particle.size * pulse, 0, Math.PI * 2);
    context.fill();
    context.shadowBlur = 0;

    for (let nextIndex = index + 1; nextIndex < particles.length; nextIndex += 1) {
      const next = particles[nextIndex];
      const gap = Math.hypot(next.x - particle.x, next.y - particle.y);
      const depthGap = Math.abs(next.depth - particle.depth);
      if (gap < 126 && depthGap < 0.42) {
        context.globalAlpha = (1 - gap / 126) * (0.22 + particle.depth * 0.3);
        context.strokeStyle = `rgba(${particle.color}, 0.34)`;
        context.lineWidth = 0.55 + particle.depth * 0.42;
        context.beginPath();
        context.moveTo(particle.x, particle.y);
        context.lineTo(next.x, next.y);
        context.stroke();
      }
    }
    context.globalAlpha = 1;
  });

  context.restore();

  animationFrame = window.requestAnimationFrame(drawParticles);
};

window.addEventListener("scroll", updateScrollProgress, { passive: true });
window.addEventListener("resize", () => {
  resizeCanvas();
  updateScrollProgress();
});
window.addEventListener("pointermove", (event) => {
  pointer = { x: event.clientX, y: event.clientY };
  setPointerPosition(event);
}, { passive: true });
window.addEventListener("pointerleave", resetPointer);

if (progressBar) {
  updateScrollProgress();
}

if (canvas && context && canAnimate) {
  resizeCanvas();
  drawParticles();
}

setLanguage(window.localStorage.getItem("preferred-language") || "zh");
