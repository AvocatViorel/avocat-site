const PHONE = "+37369968269";
const SITE = "https://www.vioreldodan.com";

function setLinks() {
  const msg = encodeURIComponent("Bună ziua! Am nevoie de consultație juridică.");
  const wa = `https://wa.me/${PHONE.replace(/\D/g, "")}?text=${msg}`;
  const tg = `https://t.me/share/url?url=${encodeURIComponent(SITE)}&text=${msg}`;
  const vb = `viber://chat?number=${PHONE.replace("+", "")}`;

  document.querySelectorAll("[data-wa]").forEach(a => a.href = wa);
  document.querySelectorAll("[data-tg]").forEach(a => a.href = tg);
  document.querySelectorAll("[data-vb]").forEach(a => a.href = vb);
}

function lightbox() {
  const box = document.querySelector(".lightbox");
  if (!box) return;
  const img = box.querySelector("img");
  const closeBtn = box.querySelector(".lb-close");

  document.querySelectorAll("[data-gallery] a").forEach(a => {
    a.addEventListener("click", (e) => {
      e.preventDefault();
      img.src = a.getAttribute("href");
      box.classList.add("open");
      box.setAttribute("aria-hidden", "false");
    });
  });

  const close = () => {
    box.classList.remove("open");
    box.setAttribute("aria-hidden", "true");
    img.removeAttribute("src");
  };

  box.addEventListener("click", (e) => {
    if (e.target === box) close();
  });
  closeBtn?.addEventListener("click", close);
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") close();
  });
}

document.addEventListener("DOMContentLoaded", () => {
  setLinks();
  lightbox();
});
