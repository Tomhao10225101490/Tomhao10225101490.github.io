window.SiteI18n = (() => {
  const SUPPORTED_LANGUAGES = ["zh", "en", "ja", "ko"];
  const HTML_LANG = {
    zh: "zh-CN",
    en: "en",
    ja: "ja",
    ko: "ko"
  };

  const normalizeLanguage = (language) => (
    SUPPORTED_LANGUAGES.includes(language) ? language : "zh"
  );

  const init = (config) => {
    const root = document.documentElement;
    const langOptions = document.querySelectorAll(".lang-option[data-lang-label]");
    const translatable = document.querySelectorAll("[data-zh][data-en][data-ja][data-ko]");
    const attributeTargets = document.querySelectorAll("[data-i18n][data-zh][data-en][data-ja][data-ko]");
    const metaDescription = config.metaDescriptionEl || document.querySelector("#metaDescription");

    const setLanguage = (language) => {
      const nextLanguage = normalizeLanguage(language);

      root.lang = HTML_LANG[nextLanguage];
      document.title = config.pageTitles[nextLanguage];

      translatable.forEach((element) => {
        if (element.dataset.i18n) {
          return;
        }

        const copy = element.dataset[nextLanguage];
        if (typeof copy === "string") {
          element.textContent = copy;
        }
      });

      attributeTargets.forEach((element) => {
        const attributeName = element.dataset.i18n;
        const copy = element.dataset[nextLanguage];
        if (typeof copy === "string") {
          element.setAttribute(attributeName, copy);
        }
      });

      if (metaDescription && config.metaDescriptions) {
        metaDescription.setAttribute("content", config.metaDescriptions[nextLanguage]);
      }

      langOptions.forEach((option) => {
        const isActive = option.dataset.langLabel === nextLanguage;
        option.classList.toggle("is-active", isActive);
        option.setAttribute("aria-pressed", String(isActive));
      });

      window.localStorage.setItem("preferred-language", nextLanguage);

      if (typeof config.onLanguageChange === "function") {
        config.onLanguageChange(nextLanguage);
      }
    };

    langOptions.forEach((option) => {
      option.addEventListener("click", () => {
        setLanguage(option.dataset.langLabel);
      });
    });

    const storedLanguage = window.localStorage.getItem("preferred-language");
    setLanguage(storedLanguage || config.defaultLanguage || "zh");

    return { setLanguage };
  };

  return {
    SUPPORTED_LANGUAGES,
    HTML_LANG,
    normalizeLanguage,
    init
  };
})();
