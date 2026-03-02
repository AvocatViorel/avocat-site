const SITE_JSON = "/content/site.json";
const PHONE_DEFAULT = "+37369968269";
const SITE_DEFAULT = "https://www.vioreldodan.com";

function waLink(phone, text) {
  const msg = encodeURIComponent(text || "Bună ziua! Am nevoie de consultație juridică.");
  const digits = (phone || PHONE_DEFAULT).replace(/\D/g, "");
  return `https://wa.me/${digits}?text=${msg}`;
}
function tgLink(site, text) {
  const msg = encodeURIComponent(text || "Bună ziua! Am nevoie de consultație juridică.");
  return `https://t.me/share/url?url=${encodeURIComponent(site || SITE_DEFAULT)}&text=${msg}`;
}
function vbLink(phone) {
  return `viber://chat?number=${(phone || PHONE_DEFAULT).replace("+", "")}`;
}

function imgWithFallback(imgEl, fallback, alsoTryGaleri = false) {
  imgEl.onerror = () => {
    imgEl.onerror = null;

    // optional: if /gallery- exists not found, try /galeri-
    if (alsoTryGaleri && imgEl.src.includes("/gallery-")) {
      imgEl.src = imgEl.src.replace("/gallery-", "/galeri-");
      return;
    }
    imgEl.src = fallback;
  };
}

function setContactLinks(contact) {
  const phone = contact?.phone || PHONE_DEFAULT;
  const site = contact?.website || SITE_DEFAULT;

  document.querySelectorAll("[data-wa]").forEach(a => a.href = waLink(phone));
  document.querySelectorAll("[data-tg]").forEach(a => a.href = tgLink(site));
  document.querySelectorAll("[data-vb]").forEach(a => a.href = vbLink(phone));
}

function renderText(id, text) {
  const el = document.querySelector(`[data-bind="${id}"]`);
  if (el) el.textContent = text ?? "";
}
function renderHTML(id, html) {
  const el = document.querySelector(`[data-bind="${id}"]`);
  if (el) el.innerHTML = html ?? "";
}

function escapeHtml(s) {
  return String(s || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function renderBullets(containerSel, bullets) {
  const ul = document.querySelector(containerSel);
  if (!ul) return;
  ul.innerHTML = (bullets || []).map(b => `<li>${escapeHtml(b)}</li>`).join("");
}

function renderServices(s, contact) {
  const grid = document.querySelector('[data-services]');
  if (!grid) return;

  const phone = contact?.phone || PHONE_DEFAULT;

  grid.innerHTML = (s?.items || []).map(item => {
    const title = escapeHtml(item.title);
    const text = escapeHtml(item.text);
    const img = item.image || "/images/diaspora-default.webp";
    const wa = waLink(phone, `Bună ziua! ${item.waText ? "Scriu: " + item.waText : "Am o întrebare."}`);

    return `
      <article class="card">
        <div class="thumb"><img src="${escapeHtml(img)}" alt="${title}" loading="lazy"></div>
        <div class="pad">
          <h3>${title}</h3>
          <p>${text}</p>
          <div class="hr"></div>
          <a class="btn small primary" href="${wa}"><span>Scrie: „${escapeHtml(item.waText || "mesaj")}”</span></a>
        </div>
      </article>
    `;
  }).join("");
}

function renderFees(f) {
  renderText("fees.title", f?.title);
  renderText("fees.text", f?.text);

  const box = document.querySelector('[data-fees-cards]');
  if (!box) return;
  box.innerHTML = (f?.cards || []).map(c => `
    <div class="price">
      <div class="price-title">${escapeHtml(c.title)}</div>
      <div class="price-val">${escapeHtml(c.value)}</div>
      <div class="price-sub">${escapeHtml(c.sub)}</div>
    </div>
  `).join("");
}

function renderFAQ(faq) {
  renderText("faq.title", faq?.title);
  renderText("faq.subtitle", faq?.subtitle);

  const box = document.querySelector('[data-faq]');
  if (!box) return;
  box.innerHTML = (faq?.items || []).map(it => `
    <details class="faq-item">
      <summary>${escapeHtml(it.q)}</summary>
      <div class="faq-body">${escapeHtml(it.a)}</div>
    </details>
  `).join("");
}

function renderDiaspora(d, fallbackImg) {
  renderText("diaspora.title", d?.title);
  renderText("diaspora.subtitle", d?.subtitle);

  const grid = document.querySelector('[data-diaspora]');
  if (!grid) return;

  const fb = fallbackImg || "/images/diaspora-default.webp";

  grid.innerHTML = (d?.items || []).map(it => `
    <article class="card">
      <div class="thumb">
        <img data-dimg src="${escapeHtml(it.image || fb)}" alt="${escapeHtml(it.name)}" loading="lazy">
      </div>
      <div class="pad">
        <h3>${escapeHtml(it.name)}</h3>
        <p>${escapeHtml(it.desc || "")}</p>
        <div class="hr"></div>
        <a class="btn small ghost" href="#contact"><span>Contact</span></a>
      </div>
    </article>
  `).join("");

  // apply fallback on images
  document.querySelectorAll("[data-dimg]").forEach(img => imgWithFallback(img, fb));
}

function renderGallery(g, fallbackImg) {
  renderText("gallery.title", g?.title);
  renderText("gallery.subtitle", g?.subtitle);

  const box = document.querySelector('[data-gallery]');
  if (!box) return;

  const fb = fallbackImg || "/images/diaspora-default.webp";
  const items = g?.items || [];

  box.innerHTML = items.map((src, idx) => `
    <a href="${escapeHtml(src)}">
      <img data-gimg src="${escapeHtml(src)}" alt="Galerie ${idx + 1}" loading="lazy">
    </a>
  `).join("");

  // fallback: try galeri- if gallery- missing, then fallback image
  document.querySelectorAll("[data-gimg]").forEach(img => {
    img.onerror = () => {
      img.onerror = null;
      if (img.src.includes("/gallery-")) {
        img.src = img.src.replace("/gallery-", "/galeri-");
        img.closest("a").href = img.src;
        img.onerror = () => {
          img.onerror = null;
          img.src = fb;
          img.closest("a").href = fb;
        };
        return;
      }
      img.src = fb;
      img.closest("a").href = fb;
    };
  });
}

function lightbox() {
  const box = document.querySelector(".lightbox");
  if (!box) return;
  const img = box.querySelector("img");
  const closeBtn = box.querySelector(".lb-close");

  const bind = () => {
    document.querySelectorAll("[data-gallery] a").forEach(a => {
      a.addEventListener("click", (e) => {
        e.preventDefault();
        img.src = a.getAttribute("href");
        box.classList.add("open");
        box.setAttribute("aria-hidden", "false");
      });
    });
  };

  const close = () => {
    box.classList.remove("open");
    box.setAttribute("aria-hidden", "true");
    img.removeAttribute("src");
  };

  box.addEventListener("click", (e) => { if (e.target === box) close(); });
  closeBtn?.addEventListener("click", close);
  window.addEventListener("keydown", (e) => { if (e.key === "Escape") close(); });

  return { bind };
}

async function loadSiteJson() {
  const url = `${SITE_JSON}?v=${Date.now()}`; // avoid cache while editing
  const r = await fetch(url, { cache: "no-store" });
  if (!r.ok) throw new Error("Cannot load site.json");
  return await r.json();
}

document.addEventListener("DOMContentLoaded", async () => {
  const lb = lightbox();

  try {
    const data = await loadSiteJson();

    setContactLinks(data.contact);

    // Hero
    renderText("hero.kicker", data.hero?.kicker);
    renderText("hero.badge", data.hero?.badge);
    renderText("hero.title", data.hero?.title);
    renderText("hero.subtitle", data.hero?.subtitle);

    // About
    renderText("about.title", data.about?.title);
    renderText("about.text", data.about?.text);
    renderBullets('[data-about-bullets]', data.about?.bullets);
    renderText("about.note", data.about?.note);

    // Services
    renderText("services.title", data.services?.title);
    renderText("services.subtitle", data.services?.subtitle);
    renderServices(data.services, data.contact);

    // Fees
    renderFees(data.fees);

    // FAQ
    renderFAQ(data.faq);

    // Diaspora + Gallery
    const fallbackImg = data.diaspora?.fallbackImage || "/images/diaspora-default.webp";
    renderDiaspora(data.diaspora, fallbackImg);
    renderGallery(data.gallery, fallbackImg);

    lb?.bind?.();
  } catch (e) {
    console.error(e);
  }
});
