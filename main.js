const SITE_JSON = "/content/site.json";
const $ = (id) => document.getElementById(id);

let DATA = null;
let LANG = "ro";

/* ============ HELPERS ============ */
function getText(val) {
  if (val == null) return "";
  if (typeof val === "string") return val;
  if (typeof val === "object") return val[LANG] || val.ro || val.ru || val.en || "";
  return String(val);
}

function getLines(val) {
  // Acceptă:
  // - ["a","b"]
  // - { ro:["a"], ru:["..."], en:["..."] }
  // - string cu linii
  if (!val) return [];
  if (Array.isArray(val)) return val.filter(Boolean);
  if (typeof val === "object") return (val[LANG] || val.ro || []).filter(Boolean);
  if (typeof val === "string") return val.split("\n").map(s => s.trim()).filter(Boolean);
  return [];
}

function safeSetText(id, text) {
  const el = $(id);
  if (!el) return;
  el.textContent = text || "";
}

function clear(node) {
  if (!node) return;
  while (node.firstChild) node.removeChild(node.firstChild);
}

function pageBySlug(slug) {
  const map = {
    italia: "/diaspora-italia.html",
    germania: "/diaspora-germania.html",
    franta: "/diaspora-franta.html",
    uk: "/diaspora-uk.html",
    usa: "/diaspora-usa.html",
    moldova: "/diaspora-moldova.html",
  };
  return map[(slug || "").toLowerCase()] || "#";
}

function setLang(lang) {
  LANG = lang;
  localStorage.setItem("lang", lang);
  renderAll();
}
window.setLang = setLang;

/* ============ LOAD ============ */
async function loadData() {
  const r = await fetch(`${SITE_JSON}?v=${Date.now()}`, { cache: "no-store" });
  if (!r.ok) throw new Error("Nu pot încărca content/site.json");
  DATA = await r.json();
  renderAll();
}

/* ============ RENDER ============ */
function renderHero() {
  const h = (DATA.hero && (DATA.hero[LANG] || DATA.hero.ro)) || DATA.hero || {};
  safeSetText("heroKicker", h.kicker || "");
  safeSetText("heroBadge", h.badge || "");
  safeSetText("heroTitle", h.title || "");
  safeSetText("heroSub", h.subtitle || "");
}

function renderAbout() {
  safeSetText("aboutTitle", getText(DATA.about?.title));
  safeSetText("aboutText", getText(DATA.about?.text));

  const ul = $("aboutBullets");
  clear(ul);
  const bullets = getLines(DATA.about?.bullets);
  bullets.forEach(b => {
    const li = document.createElement("li");
    li.textContent = b;
    ul.appendChild(li);
  });

  // dacă ai element pentru notă (opțional)
  safeSetText("aboutNote", getText(DATA.about?.note));
}

function renderServices() {
  safeSetText("servicesTitle", getText(DATA.services?.title));
  safeSetText("servicesSub", getText(DATA.services?.subtitle));

  const grid = $("servicesGrid");
  clear(grid);

  (DATA.services?.items || []).forEach(it => {
    const card = document.createElement("div");
    card.className = "card";

    const title = getText(it.title);
    const text = getText(it.text);
    const img = it.image || "";

    card.innerHTML = `
      <div class="thumb"><img src="${img}" alt=""></div>
      <div class="pad">
        <h3>${title}</h3>
        <p class="muted">${text}</p>
      </div>
    `;
    grid.appendChild(card);
  });
}

function renderDiaspora() {
  safeSetText("diasporaTitle", getText(DATA.diaspora?.title));
  safeSetText("diasporaSub", getText(DATA.diaspora?.subtitle));

  const grid = $("diasporaGrid");
  clear(grid);

  const fallback = DATA.diaspora?.fallbackImage || "/images/diaspora-default.webp";

  (DATA.diaspora?.items || []).forEach(it => {
    const a = document.createElement("a");
    a.className = "card";
    a.href = pageBySlug(it.slug);

    const name = getText(it.name || it.title || it.country);
    const desc = getText(it.desc || it.description);
    const img = it.image || fallback;

    a.innerHTML = `
      <div class="thumb"><img src="${img}" alt=""></div>
      <div class="pad">
        <h3>${name}</h3>
        <p class="muted">${desc}</p>
      </div>
    `;
    grid.appendChild(a);
  });
}

function renderGallery() {
  safeSetText("galleryTitle", getText(DATA.gallery?.title));
  safeSetText("gallerySub", getText(DATA.gallery?.subtitle));

  const grid = $("galleryGrid");
  clear(grid);

  (DATA.gallery?.items || []).forEach(src => {
    const a = document.createElement("a");
    a.href = src;
    a.innerHTML = `<img src="${src}" alt="">`;
    grid.appendChild(a);
  });

  // Lightbox (dacă există în HTML)
  const lb = $("lightbox");
  const lbImg = $("lbImg");
  const lbClose = $("lbClose");

  if (lb && lbImg) {
    grid.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        lbImg.src = link.getAttribute("href");
        lb.classList.add("open");
      });
    });
    if (lbClose) lbClose.onclick = () => lb.classList.remove("open");
    lb.onclick = (e) => { if (e.target === lb) lb.classList.remove("open"); };
  }
}

function renderContact() {
  const phone = DATA.contact?.phone || "";
  const email = DATA.contact?.email || "";
  const web = DATA.contact?.website || "";

  const p = $("phoneLink");
  const e = $("emailLink");
  const w = $("webLink");

  if (p) { p.textContent = phone; p.href = phone ? `tel:${phone}` : "#"; }
  if (e) { e.textContent = email; e.href = email ? `mailto:${email}` : "#"; }
  if (w) { w.textContent = web; w.href = web || "#"; }
}

function renderAll() {
  if (!DATA) return;
  renderHero();
  renderAbout();
  renderServices();
  renderDiaspora();
  renderGallery();
  renderContact();
}

/* ============ INIT ============ */
document.addEventListener("DOMContentLoaded", () => {
  LANG = localStorage.getItem("lang") || "ro";
  loadData().catch(err => console.error(err));
});
