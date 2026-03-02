const SITE_JSON = "/content/site.json";
const $ = (id) => document.getElementById(id);

let DATA = null;
let LANG = "ro";

function ensureShape(d) {
  d.lang = d.lang || "ro";
  d.contact = d.contact || { phone: "", email: "", website: "" };

  d.hero = d.hero || {};
  d.hero.ro = d.hero.ro || { kicker: "", badge: "", title: "", subtitle: "" };
  d.hero.ru = d.hero.ru || { kicker: "", badge: "", title: "", subtitle: "" };
  d.hero.en = d.hero.en || { kicker: "", badge: "", title: "", subtitle: "" };

  d.about = d.about || {};
  d.about.title = d.about.title || { ro: "", ru: "", en: "" };
  d.about.text  = d.about.text  || { ro: "", ru: "", en: "" };
  d.about.bullets = d.about.bullets || { ro: [], ru: [], en: [] };
  d.about.note = d.about.note || { ro: "", ru: "", en: "" };

  d.services = d.services || {};
  d.services.title = d.services.title || { ro: "", ru: "", en: "" };
  d.services.subtitle = d.services.subtitle || { ro: "", ru: "", en: "" };
  d.services.items = Array.isArray(d.services.items) ? d.services.items : [];

  d.diaspora = d.diaspora || {};
  d.diaspora.title = d.diaspora.title || { ro: "", ru: "", en: "" };
  d.diaspora.subtitle = d.diaspora.subtitle || { ro: "", ru: "", en: "" };
  d.diaspora.fallbackImage = d.diaspora.fallbackImage || "/images/diaspora-default.webp";
  d.diaspora.items = Array.isArray(d.diaspora.items) ? d.diaspora.items : [];

  d.gallery = d.gallery || {};
  d.gallery.title = d.gallery.title || { ro: "", ru: "", en: "" };
  d.gallery.subtitle = d.gallery.subtitle || { ro: "", ru: "", en: "" };
  d.gallery.items = Array.isArray(d.gallery.items) ? d.gallery.items : [];

  return d;
}

function toLines(text) {
  return (text || "")
    .split("\n")
    .map(s => s.trim())
    .filter(Boolean);
}

function setActiveLang(l) {
  LANG = l;
  $("tabRO").classList.toggle("active", LANG === "ro");
  $("tabRU").classList.toggle("active", LANG === "ru");
  $("tabEN").classList.toggle("active", LANG === "en");
  fillLang();
  updatePreview();
}

function makeServiceItem(item = {}) {
  const it = {
    title: item.title || { ro: "", ru: "", en: "" },
    text: item.text || { ro: "", ru: "", en: "" },
    image: item.image || "",
    waText: item.waText || ""
  };

  const wrap = document.createElement("div");
  wrap.className = "item";
  wrap.innerHTML = `
    <h4>Serviciu</h4>
    <div class="row">
      <div><div class="tiny">Titlu (${LANG.toUpperCase()})</div><input data-k="title" value="${(it.title[LANG] || "")}"></div>
      <div><div class="tiny">WhatsApp text</div><input data-k="waText" value="${it.waText || ""}"></div>
    </div>
    <div style="margin-top:10px"><div class="tiny">Text (${LANG.toUpperCase()})</div><textarea data-k="text">${(it.text[LANG] || "")}</textarea></div>
    <div style="margin-top:10px"><div class="tiny">Imagine (path)</div><input data-k="image" value="${it.image || ""}" placeholder="/images/service-xxx.webp"></div>
    <div class="btnbar" style="margin-top:10px">
      <button class="btn ghost" type="button" data-act="remove">Șterge</button>
    </div>
  `;

  wrap._data = it;

  wrap.querySelector('[data-act="remove"]').onclick = () => {
    wrap.remove();
    updatePreview();
  };

  wrap.querySelectorAll("input,textarea").forEach(el => el.addEventListener("input", () => {
    const get = (k) => wrap.querySelector(`[data-k="${k}"]`)?.value || "";
    wrap._data.title[LANG] = get("title");
    wrap._data.text[LANG] = get("text");
    wrap._data.image = get("image");
    wrap._data.waText = get("waText");
    updatePreview();
  }));

  return wrap;
}

function makeCountryItem(item = {}) {
  const it = {
    slug: item.slug || "",
    name: item.name || { ro: "", ru: "", en: "" },
    desc: item.desc || { ro: "", ru: "", en: "" },
    image: item.image || ""
  };

  const wrap = document.createElement("div");
  wrap.className = "item";
  wrap.innerHTML = `
    <h4>Țară</h4>
    <div class="row">
      <div><div class="tiny">Slug (ex: italia)</div><input data-k="slug" value="${it.slug || ""}"></div>
      <div><div class="tiny">Imagine (path)</div><input data-k="image" value="${it.image || ""}" placeholder="/images/diaspora-italy.webp"></div>
    </div>
    <div style="margin-top:10px"><div class="tiny">Nume (${LANG.toUpperCase()})</div><input data-k="name" value="${(it.name[LANG] || "")}"></div>
    <div style="margin-top:10px"><div class="tiny">Descriere (${LANG.toUpperCase()})</div><input data-k="desc" value="${(it.desc[LANG] || "")}"></div>
    <div class="btnbar" style="margin-top:10px">
      <button class="btn ghost" type="button" data-act="remove">Șterge</button>
    </div>
  `;

  wrap._data = it;

  wrap.querySelector('[data-act="remove"]').onclick = () => {
    wrap.remove();
    updatePreview();
  };

  wrap.querySelectorAll("input").forEach(el => el.addEventListener("input", () => {
    const get = (k) => wrap.querySelector(`[data-k="${k}"]`)?.value || "";
    wrap._data.slug = get("slug");
    wrap._data.image = get("image");
    wrap._data.name[LANG] = get("name");
    wrap._data.desc[LANG] = get("desc");
    updatePreview();
  }));

  return wrap;
}

function makeGalleryItem(value = "") {
  const wrap = document.createElement("div");
  wrap.className = "item";
  wrap.innerHTML = `
    <h4>Poză</h4>
    <div><div class="tiny">Path (ex: /images/gallery-1.webp)</div><input data-k="src" value="${value}"></div>
    <div class="btnbar" style="margin-top:10px">
      <button class="btn ghost" type="button" data-act="remove">Șterge</button>
    </div>
  `;

  wrap.querySelector('[data-act="remove"]').onclick = () => {
    wrap.remove();
    updatePreview();
  };
  wrap.querySelector("input").addEventListener("input", updatePreview);
  return wrap;
}

function collectServices() {
  const box = $("servicesList");
  return Array.from(box.children).map(node => node._data);
}

function collectDiaspora() {
  const box = $("diasporaList");
  return Array.from(box.children).map(node => node._data);
}

function collectGallery() {
  const box = $("galleryList");
  return Array.from(box.children)
    .map(node => node.querySelector('[data-k="src"]')?.value || "")
    .map(s => s.trim())
    .filter(Boolean);
}

function fillGlobal() {
  $("phone").value = DATA.contact.phone || "";
  $("email").value = DATA.contact.email || "";
  $("website").value = DATA.contact.website || "";
  $("diasporaFallback").value = DATA.diaspora.fallbackImage || "/images/diaspora-default.webp";
}

function fillLang() {
  // HERO
  $("heroKicker").value = DATA.hero[LANG]?.kicker || "";
  $("heroBadge").value = DATA.hero[LANG]?.badge || "";
  $("heroTitle").value = DATA.hero[LANG]?.title || "";
  $("heroSub").value = DATA.hero[LANG]?.subtitle || "";

  // ABOUT
  $("aboutTitle").value = DATA.about.title[LANG] || "";
  $("aboutText").value = DATA.about.text[LANG] || "";
  $("aboutBullets").value = (DATA.about.bullets[LANG] || []).join("\n");
  $("aboutNote").value = DATA.about.note[LANG] || "";

  // SERVICES section
  $("servicesTitle").value = DATA.services.title[LANG] || "";
  $("servicesSub").value = DATA.services.subtitle[LANG] || "";

  // DIASPORA section
  $("diasporaTitle").value = DATA.diaspora.title[LANG] || "";
  $("diasporaSub").value = DATA.diaspora.subtitle[LANG] || "";

  // GALLERY section
  $("galleryTitle").value = DATA.gallery.title[LANG] || "";
  $("gallerySub").value = DATA.gallery.subtitle[LANG] || "";

  // Rebuild lists to show current language text
  $("servicesList").innerHTML = "";
  (DATA.services.items || []).forEach(it => $("servicesList").appendChild(makeServiceItem(it)));

  $("diasporaList").innerHTML = "";
  (DATA.diaspora.items || []).forEach(it => $("diasporaList").appendChild(makeCountryItem(it)));

  $("galleryList").innerHTML = "";
  (DATA.gallery.items || []).forEach(src => $("galleryList").appendChild(makeGalleryItem(src)));
}

function updateFromInputs() {
  // GLOBAL
  DATA.contact.phone = $("phone").value;
  DATA.contact.email = $("email").value;
  DATA.contact.website = $("website").value;
  DATA.diaspora.fallbackImage = $("diasporaFallback").value || "/images/diaspora-default.webp";

  // LANG-SPECIFIC
  DATA.hero[LANG].kicker = $("heroKicker").value;
  DATA.hero[LANG].badge = $("heroBadge").value;
  DATA.hero[LANG].title = $("heroTitle").value;
  DATA.hero[LANG].subtitle = $("heroSub").value;

  DATA.about.title[LANG] = $("aboutTitle").value;
  DATA.about.text[LANG] = $("aboutText").value;
  DATA.about.bullets[LANG] = toLines($("aboutBullets").value);
  DATA.about.note[LANG] = $("aboutNote").value;

  DATA.services.title[LANG] = $("servicesTitle").value;
  DATA.services.subtitle[LANG] = $("servicesSub").value;

  DATA.diaspora.title[LANG] = $("diasporaTitle").value;
  DATA.diaspora.subtitle[LANG] = $("diasporaSub").value;

  DATA.gallery.title[LANG] = $("galleryTitle").value;
  DATA.gallery.subtitle[LANG] = $("gallerySub").value;

  // LISTS
  DATA.services.items = collectServices();
  DATA.diaspora.items = collectDiaspora();
  DATA.gallery.items = collectGallery();
}

function updatePreview() {
  if (!DATA) return;
  updateFromInputs();
  $("jsonPreview").value = JSON.stringify(DATA, null, 2);
}

async function loadFromSite() {
  const r = await fetch(`${SITE_JSON}?v=${Date.now()}`, { cache: "no-store" });
  if (!r.ok) throw new Error("Nu pot încărca /content/site.json");
  return await r.json();
}

function downloadJson() {
  updatePreview();
  const blob = new Blob([$("jsonPreview").value], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "site.json";
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}

function copyJson() {
  updatePreview();
  navigator.clipboard.writeText($("jsonPreview").value);
}

function bindInputs() {
  document.querySelectorAll("input,textarea").forEach(el => el.addEventListener("input", updatePreview));
}

document.addEventListener("DOMContentLoaded", async () => {
  // tabs
  $("tabRO").onclick = () => setActiveLang("ro");
  $("tabRU").onclick = () => setActiveLang("ru");
  $("tabEN").onclick = () => setActiveLang("en");

  // buttons
  $("downloadBtn").onclick = downloadJson;
  $("copyBtn").onclick = copyJson;
  $("loadBtn").onclick = async () => {
    try {
      const d = await loadFromSite();
      DATA = ensureShape(d);
      fillGlobal();
      fillLang();
      updatePreview();
    } catch (e) {
      alert(e.message || String(e));
    }
  };

  // add items
  $("addService").onclick = () => {
    const newItem = { title:{ro:"",ru:"",en:""}, text:{ro:"",ru:"",en:""}, image:"/images/service-divort.webp", waText:"" };
    $("servicesList").appendChild(makeServiceItem(newItem));
    updatePreview();
  };
  $("addCountry").onclick = () => {
    const newItem = { slug:"", name:{ro:"",ru:"",en:""}, desc:{ro:"",ru:"",en:""}, image:"/images/diaspora-default.webp" };
    $("diasporaList").appendChild(makeCountryItem(newItem));
    updatePreview();
  };
  $("addGallery").onclick = () => {
    $("galleryList").appendChild(makeGalleryItem("/images/gallery-1.webp"));
    updatePreview();
  };

  bindInputs();

  // auto-load
  try {
    const d = await loadFromSite();
    DATA = ensureShape(d);
    fillGlobal();
    fillLang();
    updatePreview();
  } catch (e) {
    alert("Nu pot încărca content/site.json. Verifică dacă JSON este valid.");
  }
});
