const root = document.documentElement;
const toggle = document.querySelector("#langToggle");
const labels = document.querySelectorAll("[data-lang-label]");
const translatable = document.querySelectorAll("[data-zh][data-en]");
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

const setLanguage = (language) => {
  const nextLanguage = language === "en" ? "en" : "zh";

  root.lang = nextLanguage === "en" ? "en" : "zh-CN";
  document.title = nextLanguage === "en" ? "Zhong Hao | Tomhao10225101490" : "钟浩 | Tomhao10225101490";

  translatable.forEach((element) => {
    element.textContent = element.dataset[nextLanguage];
  });

  labels.forEach((label) => {
    label.classList.toggle("is-active", label.dataset.langLabel === nextLanguage);
  });

  toggle.setAttribute("aria-pressed", String(nextLanguage === "en"));
  window.localStorage.setItem("preferred-language", nextLanguage);
};

toggle.addEventListener("click", () => {
  const currentLanguage = root.lang === "en" ? "en" : "zh";
  setLanguage(currentLanguage === "en" ? "zh" : "en");
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
  portraitPanel.style.transform = `translate3d(${moveX}px, ${moveY}px, 0) rotateX(${-moveY * 0.8}deg) rotateY(${moveX * 0.8}deg)`;
};

const resetPointer = () => {
  root.style.setProperty("--cursor-opacity", "0");
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
let pointer = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
let animationFrame = 0;

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

  const count = Math.max(26, Math.min(74, Math.floor(width / 18)));
  particles = Array.from({ length: count }, (_, index) => ({
    x: (index * 97) % width,
    y: (index * 53) % height,
    vx: (Math.sin(index * 12.989) * 0.18) + 0.12,
    vy: (Math.cos(index * 78.233) * 0.16) + 0.08,
    size: 1 + (index % 3) * 0.45
  }));
};

const drawParticles = () => {
  if (!canvas || !context || !canAnimate) {
    return;
  }

  const width = document.documentElement.clientWidth;
  const height = window.innerHeight;
  context.clearRect(0, 0, width, height);
  context.fillStyle = "rgba(245, 241, 232, 0.54)";
  context.strokeStyle = "rgba(87, 199, 162, 0.12)";
  context.lineWidth = 1;

  particles.forEach((particle, index) => {
    const dx = pointer.x - particle.x;
    const dy = pointer.y - particle.y;
    const distance = Math.hypot(dx, dy);
    const pull = distance < 180 ? (180 - distance) / 180 : 0;

    particle.x += particle.vx + dx * pull * 0.002;
    particle.y += particle.vy + dy * pull * 0.002;

    if (particle.x > width + 20) particle.x = -20;
    if (particle.y > height + 20) particle.y = -20;
    if (particle.x < -20) particle.x = width + 20;
    if (particle.y < -20) particle.y = height + 20;

    context.beginPath();
    context.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
    context.fill();

    for (let nextIndex = index + 1; nextIndex < particles.length; nextIndex += 1) {
      const next = particles[nextIndex];
      const gap = Math.hypot(next.x - particle.x, next.y - particle.y);
      if (gap < 115) {
        context.globalAlpha = (1 - gap / 115) * 0.8;
        context.beginPath();
        context.moveTo(particle.x, particle.y);
        context.lineTo(next.x, next.y);
        context.stroke();
      }
    }
    context.globalAlpha = 1;
  });

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
