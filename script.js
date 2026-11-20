/* ===== CONFIGURAÇÃO DO WHATSAPP (altere só aqui, se precisar) ===== */
const WHATSAPP_NUMBER = "5569999406437"; // 55 (Brasil) + 69 (DDD) + número
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

// Fecha o menu ao tocar em um link (o botão de tema fica de fora, de propósito)
nav.querySelectorAll("a").forEach((link) =>
  link.addEventListener("click", () => toggleMenu(true))
);

/* ===== TEMA: MODO ESCURO (padrão) / MODO CLARO (classe "light-theme" no body) ===== */
const THEME_KEY = "criarts-theme-v2"; // guarda "light" ou "dark"
const themeBtn = document.getElementById("themeToggle");
const themeMeta = document.querySelector('meta[name="theme-color"]');

function setTheme(theme, salvar = false) {
  const claro = theme === "light";

  // Adiciona ou remove a classe no <body>: é isso que muda o site inteiro
  document.body.classList.toggle("light-theme", claro);

  // Cor da barra do navegador no celular
  if (themeMeta) themeMeta.setAttribute("content", claro ? "#f8f9fa" : "#101018");

  // O botão mostra a opção para a qual o site vai mudar ao clicar
  if (themeBtn) {
    const icone = themeBtn.querySelector(".theme-toggle__icon");
    const texto = themeBtn.querySelector(".theme-toggle__text");
    if (icone) icone.textContent = claro ? "🌙" : "☀️";
    if (texto) texto.textContent = claro ? "Modo Escuro" : "Modo Claro";
    themeBtn.setAttribute("aria-pressed", String(claro));
  }

  if (salvar) {
    try { localStorage.setItem(THEME_KEY, theme); } catch (e) {}
  }
}

// Estado inicial: o mini script do <body> já aplicou o tema salvo; aqui só sincronizamos o botão
setTheme(document.body.classList.contains("light-theme") ? "light" : "dark");

if (themeBtn) {
  themeBtn.addEventListener("click", () => {
    const estaClaro = document.body.classList.contains("light-theme");
    setTheme(estaClaro ? "dark" : "light", true);
  });
}

/* ===== CABEÇALHO GANHA SOMBRA AO ROLAR ===== */
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

/* ===== AVISO SE UMA FOTO DA GALERIA NÃO CARREGAR ===== */
// Ajuda a descobrir erro de nome/pasta (o GitHub Pages diferencia maiúsculas de minúsculas)
document.querySelectorAll(".shot img").forEach((img) => {
  const marcarFalha = () => img.parentElement.classList.add("img-fail");
  img.addEventListener("error", marcarFalha);
  // Caso o erro tenha acontecido antes do script carregar
  if (img.complete && img.naturalWidth === 0) marcarFalha();
});

/* ===== ANO AUTOMÁTICO NO RODAPÉ ===== */
document.getElementById("year").textContent = new Date().getFullYear();
