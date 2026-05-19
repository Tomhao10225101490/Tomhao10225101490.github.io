const root = document.documentElement;
const toggle = document.querySelector("#langToggle");
const labels = document.querySelectorAll("[data-lang-label]");
const translatable = document.querySelectorAll("[data-zh][data-en]");
const revealItems = document.querySelectorAll(".section-reveal");

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
  { threshold: 0.16 }
);

revealItems.forEach((item) => revealObserver.observe(item));

setLanguage(window.localStorage.getItem("preferred-language") || "zh");
