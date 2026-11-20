/* ===== CONFIGURAÇÃO DO WHATSAPP (altere só aqui, se precisar) ===== */
const WHATSAPP_NUMBER = "5569992262400"; // 55 (Brasil) + 69 (DDD) + número
const WHATSAPP_MESSAGE =
  "Olá! Vim pelo site da Criarts Malharia e gostaria de solicitar um orçamento.";

// Aplica o link do WhatsApp em todos os botões com a classe .js-whatsapp
const whatsappUrl =
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;

document.querySelectorAll(".js-whatsapp").forEach((el) => {
  el.href = whatsappUrl;
  el.target = "_blank";
  el.rel = "noopener noreferrer";
});

/* ===== MENU MOBILE ===== */
const menuBtn = document.getElementById("menuBtn");
const nav = document.getElementById("nav");

function toggleMenu(forceClose = false) {
  const open = forceClose ? false : !nav.classList.contains("open");
  nav.classList.toggle("open", open);
  menuBtn.classList.toggle("open", open);
  menuBtn.setAttribute("aria-expanded", String(open));
}

menuBtn.addEventListener("click", () => toggleMenu());
nav.querySelectorAll("a").forEach((link) =>
  link.addEventListener("click", () => toggleMenu(true))
);

/* ===== CABEÇALHO MUDA AO ROLAR ===== */
const header = document.getElementById("header");
function onScroll() {
  header.classList.toggle("scrolled", window.scrollY > 30);
}
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

/* ===== ANIMAÇÃO DE ENTRADA (aparece ao rolar) ===== */
const revealEls = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );
  revealEls.forEach((el) => observer.observe(el));
} else {
  // Navegadores antigos: mostra tudo direto
  revealEls.forEach((el) => el.classList.add("visible"));
}

/* ===== ANO AUTOMÁTICO NO RODAPÉ ===== */
document.getElementById("year").textContent = new Date().getFullYear();
