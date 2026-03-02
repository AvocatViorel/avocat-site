const SITE_JSON = "/content/site.json";

const $ = (id) => document.getElementById(id);

function toLines(text) {
  return (text || "")
    .split("\n")
    .map(s => s.trim())
    .filter(Boolean);
}

function makeServiceItem(item = {}) {
  const wrap = document.createElement("div");
  wrap.className = "item";

  wrap.innerHTML = `
    <h4>Serviciu</h4>
    <div class="row">
      <div><div class="tiny">Titlu</div><input data-k="title" value="${item.title || ""}"></div>
      <div><div class="tiny">WhatsApp text (ex: familie)</div><input data-k="waText" value="${item.waText || ""}"></div>
    </div>
    <div style="margin-top:10px"><div class="tiny">Text</div><textarea data-k="text">${item.text || ""}</textarea></div>
    <div style="margin-top:10px"><div class="tiny">Imagine (path)</div><input data-k="image" value="${item.image || ""}" placeholder="/images/service-xxx.webp"></div>
    <div class="btnbar" style="margin-top:10px">
      <button class="btn ghost" type="button" data-act="remove">Șterge</button>
    </div>
  `;

  wrap.querySelector('[data-act="remove"]').onclick = () => {
    wrap.remove();
    updatePreview();
  };
  wrap.querySelectorAll("input,textarea").forEach(el => el.addEventListener("input", updatePreview));
  return wrap;
}

function makeCountryItem(item = {}) {
  const wrap = document.createElement("div");
  wrap.className = "item";
  wrap.innerHTML = `
    <h4>Țară</h4>
    <div class="row">
      <div><div class="tiny">Nume</div><input data-k="name" value="${item.name || ""}"></div>
      <div><div class="tiny">Imagine (path)</div><input data-k="image" value="${item.image || ""}" placeholder="/images/diaspora-france.webp"></div>
    </div>
    <div style="margin-top:10px"><div class="tiny">Descriere</div><input data-k="desc" value="${item.desc || ""}"></div>
    <div class="btnbar" style="margin-top:10px">
      <button class="btn ghost" type="button" data-act="remove">Șterge</button>
    </div>
  `;
  wrap.querySelector('[data-act="remove"]').onclick = () => {
    wrap.remove();
    updatePreview();
  };
  wrap.querySelectorAll("input,textarea").forEach(el => el.addEventListener("input", updatePreview));
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
  wrap.querySelectorAll("input").forEach(el => el.addEventListener("input", updatePreview));
  return wrap;
}

function collectList(containerId, mapFn) {
  const box = $(containerId);
  return Array.from(box.children).map(mapFn);
}

function getData() {
  const services = collectList("servicesList", (node) => {
    const get = (k) => node.querySelector(`[data-k="${k}"]`)?.value || "";
    return {
      title: get("title"),
      text: get("text"),
      image: get("image"),
      waText: get("waText")
    };
  });

  const diaspora = collectList("diasporaList", (node) => {
    const get = (k) => node.querySelector(`[data-k="${k}"]`)?.value || "";
    return {
      name: get("name"),
      desc: get("desc"),
      image: get("image")
    };
  });

  const gallery = collectList("galleryList", (node) => {
    return node.querySelector('[data-k="src"]')?.value || "";
  }).filter(Boolean);

  const data = {
    contact: {
      phone: $("phone").value,
      email: $("email").value,
      website: $("website").value
    },
    hero: {
      kicker: $("heroKicker").value,
      badge: $("heroBadge").value,
      title: $("heroTitle").value,
      subtitle: $("heroSub").value
    },
    about: {
      title: $("aboutTitle").value,
      text: $("aboutText").value,
      bullets: toLines($("aboutBullets").value),
      note: $("aboutNote").value
    },
    services: {
      title: $("servicesTitle").value,
      subtitle: $("servicesSub").value,
      items: services
    },
    fees: {
      title: "Onorarii",
      text: "Onorariile se stabilesc transparent, în funcție de complexitate și termen. Pentru diaspora, putem lucra integral online.",
      cards: [
        { title: "Consultație", value: "la cerere", sub: "Online / Chișinău" },
        { title: "Reprezentare", value: "la cerere", sub: "Dosare + instanță" },
        { title: "Diaspora", value: "la cerere", sub: "Acte + consult + strategie" }
      ]
    },
    faq: {
      title: "FAQ",
      subtitle: "Întrebări scurte, răspunsuri clare.",
      items: [
        { q: "Pot lucra cu dvs. dacă sunt în diaspora?", a: "Da. Putem face consult online, analiză acte, împuterniciri și pași concreți." },
        { q: "În cât timp primesc răspuns?", a: "De obicei rapid. Trimite mesaj pe WhatsApp și spune pe scurt problema + ce țară ești." },
        { q: "Ce documente să pregătesc?", a: "În funcție de caz. După primul mesaj îți trimit lista exactă." }
      ]
    },
    diaspora: {
      title: $("diasporaTitle").value,
      subtitle: $("diasporaSub").value,
      fallbackImage: $("diasporaFallback").value || "/images/diaspora-default.webp",
      items: diaspora
    },
    gallery: {
      title: $("galleryTitle").value,
      subtitle: $("gallerySub").value,
      items: gallery
    }
  };

  return data;
}

function updatePreview() {
  const data = getData();
  $("jsonPreview").value = JSON.stringify(data, null, 2);
}

function fill(data) {
  $("phone").value = data?.contact?.phone || "";
  $("email").value = data?.contact?.email || "";
  $("website").value = data?.contact?.website || "";

  $("heroKicker").value = data?.hero?.kicker || "";
  $("heroBadge").value = data?.hero?.badge || "";
  $("heroTitle").value = data?.hero?.title || "";
  $("heroSub").value = data?.hero?.subtitle || "";

  $("aboutTitle").value = data?.about?.title || "";
  $("aboutText").value = data?.about?.text || "";
  $("aboutBullets").value = (data?.about?.bullets || []).join("\n");
  $("aboutNote").value = data?.about?.note || "";

  $("servicesTitle").value = data?.services?.title || "";
  $("servicesSub").value = data?.services?.subtitle || "";

  $("diasporaTitle").value = data?.diaspora?.title || "";
  $("diasporaSub").value = data?.diaspora?.subtitle || "";
  $("diasporaFallback").value = data?.diaspora?.fallbackImage || "/images/diaspora-default.webp";

  $("galleryTitle").value = data?.gallery?.title || "";
  $("gallerySub").value = data?.gallery?.subtitle || "";

  // lists
  $("servicesList").innerHTML = "";
  (data?.services?.items || []).forEach(it => $("servicesList").appendChild(makeServiceItem(it)));

  $("diasporaList").innerHTML = "";
  (data?.diaspora?.items || []).forEach(it => $("diasporaList").appendChild(makeCountryItem(it)));

  $("galleryList").innerHTML = "";
  (data?.gallery?.items || []).forEach(src => $("galleryList").appendChild(makeGalleryItem(src)));

  updatePreview();
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
  $("addService").onclick = () => { $("servicesList").appendChild(makeServiceItem()); updatePreview(); };
  $("addCountry").onclick = () => { $("diasporaList").appendChild(makeCountryItem()); updatePreview(); };
  $("addGallery").onclick = () => { $("galleryList").appendChild(makeGalleryItem("/images/gallery-1.webp")); updatePreview(); };

  $("downloadBtn").onclick = downloadJson;
  $("copyBtn").onclick = copyJson;

  $("loadBtn").onclick = async () => {
    try {
      const data = await loadFromSite();
      fill(data);
    } catch (e) {
      alert(e.message || String(e));
    }
  };

  bindInputs();

  // Try auto-load
  try {
    const data = await loadFromSite();
    fill(data);
  } catch {
    // If file doesn't exist yet, just preview empty and let user type
    updatePreview();
  }
});
