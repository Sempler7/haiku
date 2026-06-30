"use strict";

/* ── Config ─────────────────────────────────── */
const API_BASE = window.__API_BASE__ || "http://localhost:8000";
const HISTORY_LIMIT = 100;

/* ── Languages (12) ──────────────────────────── */
const LANGS = [
  { code: "uk", label: "Ukrainian",  native: "Українська" },
  { code: "en", label: "English",    native: "English" },
  { code: "ja", label: "Japanese",   native: "日本語" },
  { code: "de", label: "German",     native: "Deutsch" },
  { code: "fr", label: "French",     native: "Français" },
  { code: "es", label: "Spanish",    native: "Español" },
  { code: "it", label: "Italian",    native: "Italiano" },
  { code: "pt", label: "Portuguese", native: "Português" },
  { code: "zh", label: "Chinese",    native: "中文" },
  { code: "ko", label: "Korean",     native: "한국어" },
  { code: "ar", label: "Arabic",     native: "العربية" },
  { code: "pl", label: "Polish",     native: "Polski" },
];

/* ─── State ─────────────────────────────────── */
const state = {
  keywords: "",
  lang: "",
  spice: 0,
  langOpen: false,
  resultState: "empty", // empty | loading | error | done
  errorMsg: "",
  lines: [],
  doneLang: "",
  doneSpice: "",
  history: [],
};

const els = {};

/* ─── Helpers ────────────────────────────────── */
function labelOf(code) {
  const lang = LANGS.find((item) => item.code === code);
  return lang ? lang.label : "";
}

function phrases() {
  return state.keywords
    .split(/[,\n]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

/* ─── Render: result area ────────────────────── */
function renderEmpty() {
  els.resultStage.innerHTML = `
    <div class="empty-state">
      <div class="empty-ring"></div>
      <div class="empty-title">Хайку ще немає</div>
      <div class="empty-copy">Введіть слова й натисніть «Згенерувати»</div>
    </div>
  `;
  els.doneMeta.classList.add("is-hidden");
}

function renderLoading() {
  els.resultStage.innerHTML = `
    <div class="loader">
      <div class="loader-ring"></div>
      <div class="loader-text">Складаю рядки…</div>
    </div>
  `;
  els.doneMeta.classList.add("is-hidden");
}

function renderError() {
  els.resultStage.innerHTML = `
    <div class="error-state">
      <div class="error-icon">!</div>
      <div class="error-text"></div>
    </div>
  `;
  els.resultStage.querySelector(".error-text").textContent = state.errorMsg;
  els.doneMeta.classList.add("is-hidden");
}

function renderDone() {
  els.resultStage.innerHTML = '<div class="done-state"></div>';
  const wrap = els.resultStage.querySelector(".done-state");

  state.lines.forEach((line) => {
    const item = document.createElement("div");
    item.className = "haiku-line";
    item.textContent = line;
    wrap.append(item);
  });

  els.doneMeta.innerHTML = "";
  const lang = document.createElement("span");
  lang.textContent = state.doneLang;
  const spice = document.createElement("span");
  spice.textContent = state.doneSpice;
  els.doneMeta.append(lang, spice);
  els.doneMeta.classList.remove("is-hidden");
}

function renderResult() {
  if (state.resultState === "loading") renderLoading();
  else if (state.resultState === "error") renderError();
  else if (state.resultState === "done") renderDone();
  else renderEmpty();
}

/* ─── Render: keywords ───────────────────────── */
function renderKeywords() {
  if (els.keywords.value !== state.keywords) {
    els.keywords.value = state.keywords;
  }

  const count = phrases().length;
  const hasText = count > 0;

  els.countLabel.textContent =
    count === 0
      ? "Потрібно 3–7"
      : count + (count >= 3 && count <= 7 ? " із 3–7 ✓" : " із 3–7");

  // Enable / disable clear button
  els.clearKeywords.disabled = !hasText;
  els.clearKeywords.setAttribute("aria-disabled", String(!hasText));
}

/* ─── Render: language picker ────────────────── */
function renderLanguage() {
  els.languageLabel.textContent = state.lang
    ? labelOf(state.lang)
    : "Оберіть мову";
  els.languageButton.classList.toggle("has-value", Boolean(state.lang));
  els.languageButton.setAttribute("aria-expanded", String(state.langOpen));
  els.languageMenu.classList.toggle("is-hidden", !state.langOpen);
  els.languageMenu.innerHTML = "";

  LANGS.forEach((lang) => {
    const option = document.createElement("button");
    option.type = "button";
    option.className = "language-option";
    option.setAttribute("role", "option");
    option.setAttribute("aria-selected", String(state.lang === lang.code));
    option.setAttribute("aria-disabled", "false");
    option.innerHTML = `<span>${lang.label}</span><span class="language-native">${lang.native}</span>`;
    option.classList.toggle("is-selected", state.lang === lang.code);
    option.addEventListener("click", () => {
      state.lang = lang.code;
      state.langOpen = false;
      render();
    });
    els.languageMenu.append(option);
  });
}

/* ─── Render: wasabi / spice ─────────────────── */
function renderWasabi() {
  els.wasabiDots.innerHTML = "";

  for (let index = 0; index < 6; index += 1) {
    const dot = document.createElement("span");
    dot.className = "wasabi-dot";
    dot.classList.toggle("is-active", index < state.spice);
    els.wasabiDots.append(dot);
  }

  els.spiceLabel.textContent = "Рівень гостроти: " + state.spice;
  els.spiceLabel.classList.toggle("is-active", state.spice > 0);
  els.spiceMax.classList.toggle("is-hidden", state.spice !== 6);
}

/* ─── Render: history ────────────────────────── */
function renderHistory() {
  els.historyCount.textContent =
    state.history.length > 0 ? state.history.length + " збережено" : "";
  els.historyEmpty.classList.toggle("is-hidden", state.history.length > 0);
  els.historyList.classList.toggle("is-hidden", state.history.length === 0);
  els.historyList.innerHTML = "";

  state.history.forEach((item) => {
    const card = document.createElement("div");
    card.className = "history-item";

    const lines = document.createElement("div");
    lines.className = "history-lines";
    item.lines.forEach((line) => {
      const row = document.createElement("div");
      row.textContent = line;
      lines.append(row);
    });

    const tags = document.createElement("div");
    tags.className = "history-tags";
    const lang = document.createElement("span");
    lang.textContent = item.langLabel;
    const spice = document.createElement("span");
    spice.textContent = "васабі " + item.spice;
    const time = document.createElement("span");
    time.textContent = item.timeLabel;
    tags.append(lang, spice, time);

    card.append(lines, tags);
    els.historyList.append(card);
  });
}

/* ─── Render: generate button ────────────────── */
function renderGenerateButton() {
  const loading = state.resultState === "loading";
  els.generateButton.textContent = loading ? "Генерую…" : "Згенерувати хайку";
  els.generateButton.disabled = loading;
}

/* ─── Master render ──────────────────────────── */
function render() {
  renderResult();
  renderKeywords();
  renderLanguage();
  renderWasabi();
  renderHistory();
  renderGenerateButton();
}

/* ─── Generate (API call) ────────────────────── */
async function generate() {
  if (state.resultState === "loading") return;

  // ── Client-side validation ──
  const parts = phrases();
  if (parts.length < 3) {
    state.resultState = "error";
    state.errorMsg = "Введіть від 3 до 7 ключових слів або фраз";
    render();
    return;
  }
  if (parts.length > 7) {
    state.resultState = "error";
    state.errorMsg = "Забагато — максимум 7 слів або фраз";
    render();
    return;
  }
  if (!state.lang) {
    state.resultState = "error";
    state.errorMsg = "Оберіть мову генерації";
    render();
    return;
  }

  // ── Call backend ──
  const langName = labelOf(state.lang);
  state.resultState = "loading";
  state.errorMsg = "";
  render();

  try {
    const res = await fetch(API_BASE + "/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        keywords: state.keywords,
        language: state.lang,
        spice_level: state.spice,
      }),
    });

    if (!res.ok) {
      let detail = "Помилка сервера. Спробуйте ще раз.";
      try {
        const err = await res.json();
        if (err.detail) detail = err.detail;
      } catch (_) {
        /* use default */
      }
      throw new Error(detail);
    }

    const data = await res.json();
    let lines = (data.haiku || "")
      .trim()
      .split("\n")
      .map((line) => line.replace(/^[\s\-\d.)»«"']+/, "").trim())
      .filter(Boolean);

    if (lines.length === 0) {
      throw new Error("Сервер повернув порожню відповідь. Спробуйте ще раз.");
    }

    lines = lines.slice(0, 3);

    const date = new Date();
    const timeLabel =
      String(date.getHours()).padStart(2, "0") +
      ":" +
      String(date.getMinutes()).padStart(2, "0");
    const item = {
      id: Date.now(),
      lines,
      langLabel: langName,
      spice: state.spice,
      timeLabel,
    };

    // Save to localStorage (keep last 100)
    state.history = [item, ...state.history].slice(0, HISTORY_LIMIT);
    persistHistory();

    state.resultState = "done";
    state.lines = lines;
    state.doneLang = langName;
    state.doneSpice = "васабі " + state.spice;
    render();
  } catch (err) {
    // Network error / server unreachable
    if (
      err instanceof TypeError &&
      (err.message.includes("fetch") || err.message.includes("NetworkError"))
    ) {
      state.errorMsg =
        "Сервер тимчасово недоступний. Спробуйте пізніше.";
    } else {
      state.errorMsg = err.message || "Помилка генерації. Спробуйте ще раз.";
    }

    state.resultState = "error";
    render();
  }
}

/* ─── History persistence ─────────────────────── */
function persistHistory() {
  try {
    localStorage.setItem(
      "haiku50_history",
      JSON.stringify(state.history)
    );
  } catch (_) {
    /* storage full — silently ignore */
  }
}

function loadHistory() {
  try {
    const raw = localStorage.getItem("haiku50_history");
    if (raw) state.history = JSON.parse(raw);
  } catch (_) {
    /* corrupted data — start fresh */
  }
}

/* ─── DOM refs ────────────────────────────────── */
function bindElements() {
  els.resultStage = document.getElementById("result-stage");
  els.doneMeta = document.getElementById("done-meta");
  els.keywords = document.getElementById("keywords");
  els.countLabel = document.getElementById("count-label");
  els.clearKeywords = document.getElementById("clear-keywords");
  els.languageButton = document.getElementById("language-button");
  els.languageLabel = document.getElementById("language-label");
  els.languageMenu = document.getElementById("language-menu");
  els.languageCard = document.getElementById("language-card");
  els.wasabiButton = document.getElementById("wasabi-button");
  els.wasabiDots = document.getElementById("wasabi-dots");
  els.spiceLabel = document.getElementById("spice-label");
  els.spiceMax = document.getElementById("spice-max");
  els.historyCount = document.getElementById("history-count");
  els.historyEmpty = document.getElementById("history-empty");
  els.historyList = document.getElementById("history-list");
  els.generateButton = document.getElementById("generate-button");
}

/* ─── Events ──────────────────────────────────── */
function bindEvents() {
  // Keywords input → sync to state
  els.keywords.addEventListener("input", (event) => {
    state.keywords = event.target.value;
    renderKeywords();
  });

  // Clear keywords button
  els.clearKeywords.addEventListener("click", () => {
    state.keywords = "";
    els.keywords.value = "";
    els.keywords.focus();
    renderKeywords();
  });

  // Language dropdown toggle
  els.languageButton.addEventListener("click", () => {
    state.langOpen = !state.langOpen;
    renderLanguage();
  });

  // Close dropdown on outside click
  document.addEventListener("click", (event) => {
    if (!els.languageCard.contains(event.target) && state.langOpen) {
      state.langOpen = false;
      renderLanguage();
    }
  });

  // Wasabi — cycle spice 0→1→2→3→4→5→6→0
  els.wasabiButton.addEventListener("click", () => {
    state.spice = state.spice < 6 ? state.spice + 1 : 0;
    renderWasabi();
  });

  // Generate
  els.generateButton.addEventListener("click", generate);
}

/* ─── Boot ────────────────────────────────────── */
document.addEventListener("DOMContentLoaded", () => {
  bindElements();
  loadHistory();
  bindEvents();
  render();
});
