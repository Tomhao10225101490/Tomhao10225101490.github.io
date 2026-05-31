const CARD_PAGE_TITLES = {
  zh: "钟浩 | 数字名片",
  en: "Zhong Hao | Digital Card",
  ja: "鍾浩 | デジタル名刺",
  ko: "종하오 | 디지털 명함"
};

const CARD_META_DESCRIPTIONS = {
  zh: "钟浩的数字名片 · 华东师范大学软件工程学院 · 人工智能、机器学习、AI 交易与量化交易。",
  en: "Zhong Hao's digital card · ECNU Software Engineering · AI, ML, AI trading, and quant trading.",
  ja: "鍾浩のデジタル名刺 · 華東師範大学ソフトウェア工程学院 · 人工知能、機械学習、AI トレード、クオンツ取引。",
  ko: "종하오의 디지털 명함 · 동화사범대학교 소프트웨어공학대학 · 인공지능, 머신러닝, AI 트레이딩, 퀀트 트레이딩."
};

const CARD_TOAST_MESSAGES = {
  copySuccess: {
    zh: "链接已复制，可直接粘贴到微信或 QQ 群。",
    en: "Link copied. Paste it into WeChat, QQ, or Instagram.",
    ja: "リンクをコピーしました。WeChat や QQ に貼り付けできます。",
    ko: "링크가 복사되었습니다. WeChat, QQ, Instagram에 붙여넣으세요."
  },
  copyFallback: {
    zh: "请手动复制地址栏中的链接。",
    en: "Please copy the link from the address bar manually.",
    ja: "アドレスバーのリンクを手動でコピーしてください。",
    ko: "주소창의 링크를 직접 복사해 주세요."
  },
  contactSaved: {
    zh: "联系人文件已开始下载。",
    en: "Contact file download started.",
    ja: "連絡先ファイルのダウンロードを開始しました。",
    ko: "연락처 파일 다운로드를 시작했습니다."
  }
};

const CONTACT = {
  fullName: {
    zh: "钟浩",
    en: "Zhong Hao",
    ja: "鍾浩",
    ko: "종하오"
  },
  org: {
    zh: "华东师范大学软件工程学院",
    en: "School of Software Engineering, ECNU",
    ja: "華東師範大学ソフトウェア工程学院",
    ko: "동화사범대학교 소프트웨어공학대학"
  },
  email: "2177686531@qq.com",
  url: "https://tomhao10225101490.github.io/card.html"
};

let currentLanguage = "zh";
const toast = document.querySelector("#cardToast");
const qrModal = document.querySelector("#qrModal");
const qrModalImage = document.querySelector("#qrModalImage");
const qrModalTitle = document.querySelector("#qrModalTitle");
const qrModalClose = document.querySelector("#qrModalClose");

const showToast = (message) => {
  if (!toast || !message) {
    return;
  }

  toast.textContent = message;
  toast.classList.add("is-visible");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => {
    toast.classList.remove("is-visible");
  }, 2400);
};

const copyCurrentLink = async () => {
  const link = window.location.href.split("#")[0];
  const messages = CARD_TOAST_MESSAGES.copySuccess;

  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(link);
      showToast(messages[currentLanguage]);
      return;
    }
  } catch {
    // fall through to legacy copy
  }

  const helper = document.createElement("textarea");
  helper.value = link;
  helper.setAttribute("readonly", "");
  helper.style.position = "fixed";
  helper.style.opacity = "0";
  document.body.appendChild(helper);
  helper.select();

  try {
    const copied = document.execCommand("copy");
    showToast(copied ? messages[currentLanguage] : CARD_TOAST_MESSAGES.copyFallback[currentLanguage]);
  } catch {
    showToast(CARD_TOAST_MESSAGES.copyFallback[currentLanguage]);
  } finally {
    helper.remove();
  }
};

const buildVCard = (language) => {
  const name = CONTACT.fullName[language] || CONTACT.fullName.zh;
  const org = CONTACT.org[language] || CONTACT.org.zh;

  return [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `FN:${name}`,
    `N:;${name};;;`,
    `ORG:${org}`,
    `EMAIL;TYPE=INTERNET:${CONTACT.email}`,
    `URL:${CONTACT.url}`,
    "END:VCARD"
  ].join("\r\n");
};

const downloadContact = () => {
  const vcard = buildVCard(currentLanguage);
  const blob = new Blob([vcard], { type: "text/vcard;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "zhong-hao.vcf";
  anchor.click();
  URL.revokeObjectURL(url);
  showToast(CARD_TOAST_MESSAGES.contactSaved[currentLanguage]);
};

const openQrModal = (button) => {
  const src = button.dataset.qrSrc;
  const labelMap = {
    zh: button.dataset.qrLabelZh,
    en: button.dataset.qrLabelEn,
    ja: button.dataset.qrLabelJa,
    ko: button.dataset.qrLabelKo
  };
  const label = labelMap[currentLanguage] || labelMap.zh || "";

  if (!src || !qrModal || !qrModalImage || !qrModalTitle) {
    return;
  }

  qrModalImage.src = src;
  qrModalImage.alt = label;
  qrModalTitle.textContent = label;
  qrModal.hidden = false;
  qrModal.classList.add("is-open");
  qrModalClose?.focus();
};

const closeQrModal = () => {
  if (!qrModal) {
    return;
  }

  qrModal.classList.remove("is-open");
  qrModal.hidden = true;
  qrModalImage.src = "";
};

SiteI18n.init({
  pageTitles: CARD_PAGE_TITLES,
  metaDescriptions: CARD_META_DESCRIPTIONS,
  onLanguageChange: (language) => {
    currentLanguage = language;
  }
});

document.querySelector("#copyLinkBtn")?.addEventListener("click", copyCurrentLink);
document.querySelector("#saveContactBtn")?.addEventListener("click", downloadContact);

document.querySelectorAll(".card-social-item[data-qr-src]").forEach((button) => {
  button.addEventListener("click", () => openQrModal(button));
});

qrModalClose?.addEventListener("click", closeQrModal);
qrModal?.addEventListener("click", (event) => {
  if (event.target === qrModal) {
    closeQrModal();
  }
});

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeQrModal();
  }
});

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").catch(() => {});
  });
}
