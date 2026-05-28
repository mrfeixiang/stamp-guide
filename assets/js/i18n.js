/* ============================================================
   STAMP Guide — RENDER + i18n
   Reads HERO / SECTIONS / TOC from content.js, builds the DOM,
   wires the language switch, and re-typesets MathJax on switch.
   ============================================================ */

(function () {
  "use strict";

  // ---- build hero ----
  function renderHero() {
    document.getElementById("hero-eyebrow").textContent = HERO.eyebrow;
    document.getElementById("hero-title").innerHTML =
      langSpan(HERO.title, "h1inline");
    document.getElementById("hero-lead").innerHTML = langSpan(HERO.lead);
    document.getElementById("hero-reflabel").innerHTML = langSpan(HERO.refLabel);
  }

  // helper: turn {ko,zh,en} into three <span class="lang lang-*"> blocks
  function langSpan(obj, mode) {
    const tag = "span";
    return ["ko", "zh", "en"]
      .map(l => `<${tag} class="lang lang-${l}">${obj[l]}</${tag}>`)
      .join("");
  }

  // ---- build TOC ----
  function renderTOC() {
    const nav = document.getElementById("toc");
    nav.innerHTML = TOC.map(t =>
      `<a href="#${t.id}">` +
      ["ko", "zh", "en"].map(l => `<span class="lang lang-${l}">${t[l]}</span>`).join("") +
      `</a>`
    ).join("");
  }

  // ---- build sections ----
  function renderSections() {
    const host = document.getElementById("sections");
    host.innerHTML = SECTIONS.map(s => {
      const title = ["ko", "zh", "en"]
        .map(l => `<span class="lang lang-${l}">${s.title[l]}</span>`).join("");
      return `<section id="${s.id}">
        <div class="sec-head"><span class="sec-num">${s.num}</span><h2>${title}</h2></div>
        ${s.html}
      </section>`;
    }).join("");
  }

  // ---- language switching ----
  const body = document.body;
  let buttons = [];

  function setLang(l) {
    body.setAttribute("data-lang", l);
    body.setAttribute("lang", l === "zh" ? "zh-CN" : l);
    buttons.forEach(b => b.classList.toggle("active", b.dataset.set === l));
    try { localStorage.setItem("stamp-lang", l); } catch (e) {}
    if (window.MathJax && MathJax.typesetPromise) {
      MathJax.typesetPromise().catch(() => {});
    }
  }

  function wireButtons() {
    buttons = Array.prototype.slice.call(document.querySelectorAll(".langsw button"));
    buttons.forEach(b => b.addEventListener("click", () => setLang(b.dataset.set)));
  }

  // ---- init ----
  function init() {
    renderHero();
    renderTOC();
    renderSections();
    wireButtons();
    let saved = "ko";
    try { saved = localStorage.getItem("stamp-lang") || "ko"; } catch (e) {}
    setLang(saved);
    // typeset once content is in the DOM
    if (window.MathJax && MathJax.typesetPromise) {
      MathJax.typesetPromise().catch(() => {});
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
