/* =====================================================================
   1) ANIMAÇÃO DE ENTRADA (roda PRIMEIRO, para nunca deixar conteúdo invisível)
   ===================================================================== */
const raiz = document.documentElement;

// Executa uma parte do script sem deixar um erro derrubar o resto
function seguro(nome, funcao) {
  try {
    funcao();
  } catch (erro) {
    console.error("Criarts - erro em: " + nome, erro);
  }
}

// Mostra um elemento animado
function mostrar(el) {
  if (!el || !el.classList.contains("reveal") || el.classList.contains("visible")) return;
  el.classList.add("visible");
  // Depois da animação, remove as classes: o elemento volta ao estilo normal
  // (isso também libera o efeito de hover dos cards)
  setTimeout(() => el.classList.remove("reveal", "visible"), 1000);
}

function mostrarTudo() {
  document.querySelectorAll(".reveal").forEach(mostrar);
}

// Mostra o que já está dentro da tela (usado como segurança)
function mostrarVisiveisNaTela() {
  const alturaTela = window.innerHeight || document.documentElement.clientHeight;
  document.querySelectorAll(".reveal").forEach((el) => {
    const caixa = el.getBoundingClientRect();
    if (caixa.top < alturaTela && caixa.bottom > 0) mostrar(el);
  });
}

function iniciarAnimacoes() {
  const itens = document.querySelectorAll(".reveal");
  if (!itens.length) {
    raiz.classList.add("js-ready");
    return;
  }

  // Primeira dobra (Hero): aparece logo ao carregar, sem depender de rolagem
  setTimeout(() => {
    document.querySelectorAll("#inicio .reveal").forEach(mostrar);
  }, 60);

  // Navegador sem IntersectionObserver: mostra tudo de uma vez
  if (!("IntersectionObserver" in window)) {
    mostrarTudo();
    raiz.classList.add("js-ready");
    return;
  }

  // As demais seções aparecem suavemente conforme a rolagem
  let observadorRespondeu = false;
  const observador = new IntersectionObserver(
    (entradas) => {
      observadorRespondeu = true;
      entradas.forEach((entrada) => {
        if (entrada.isIntersecting) {
          mostrar(entrada.target);
          observador.unobserve(entrada.target);
        }
      });
    },
    { threshold: 0.05, rootMargin: "0px 0px -5% 0px" }
  );
  itens.forEach((el) => observador.observe(el));

  // Avisa o CSS que o script iniciou (desliga o plano B em CSS)
  raiz.classList.add("js-ready");

  // Segurança 1: depois que a página carregar, mostra o que já está na tela
  window.addEventListener("load", () => setTimeout(mostrarVisiveisNaTela, 800));

  // Segurança 2: se o observador não responder em 3 segundos, mostra tudo
  setTimeout(() => {
    if (!observadorRespondeu) mostrarTudo();
  }, 3000);
}

try {
  iniciarAnimacoes();
} catch (erro) {
  console.error("Criarts - erro nas animações (mostrando tudo):", erro);
  mostrarTudo();
}

/* =====================================================================
   2) CONFIGURAÇÃO DO WHATSAPP (altere só aqui, se precisar)
   ===================================================================== */
seguro("whatsapp", () => {
  const WHATSAPP_NUMBER = "5569992262400"; // 55 (Brasil) + 69 (DDD) + número
  const WHATSAPP_MESSAGE =
    "Olá! Vim pelo site da Criarts Malharia e gostaria de solicitar um orçamento.";

  // Aplica o link do WhatsApp em todos os botões com a classe .js-whatsapp
  // (os botões de cada serviço/produto já têm a própria mensagem direto no HTML)
  const whatsappUrl =
    `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;

  document.querySelectorAll(".js-whatsapp").forEach((el) => {
    el.href = whatsappUrl;
    el.target = "_blank";
    el.rel = "noopener noreferrer";
  });
});

/* =====================================================================
   3) MENU MOBILE (Índice + Outros)
   ===================================================================== */
seguro("menu", () => {
  const menuBtn = document.getElementById("menuBtn");
  const nav = document.getElementById("nav");
  if (!menuBtn || !nav) return;

  function alternarMenu(forcarFechar = false) {
    const abrir = forcarFechar ? false : !nav.classList.contains("open");
    nav.classList.toggle("open", abrir);
    menuBtn.classList.toggle("open", abrir);
    menuBtn.setAttribute("aria-expanded", String(abrir));
  }

  menuBtn.addEventListener("click", () => alternarMenu());

  // Fecha o menu ao tocar em qualquer link ou botão do menu (Índice, Orçamento, FAQ)
  nav.querySelectorAll("a").forEach((link) =>
    link.addEventListener("click", () => alternarMenu(true))
  );

  // Fecha o menu com a tecla ESC
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") alternarMenu(true);
  });

  // Fecha o menu ao tocar fora dele
  document.addEventListener("click", (e) => {
    if (!nav.classList.contains("open")) return;
    if (nav.contains(e.target) || menuBtn.contains(e.target)) return;
    alternarMenu(true);
  });
});

/* =====================================================================
   4) CABEÇALHO GANHA SOMBRA AO ROLAR
   ===================================================================== */
seguro("cabecalho", () => {
  const cabecalho = document.getElementById("header");
  if (!cabecalho) return;

  function aoRolar() {
    cabecalho.classList.toggle("scrolled", window.scrollY > 30);
  }
  window.addEventListener("scroll", aoRolar, { passive: true });
  aoRolar();
});

/* =====================================================================
   5) AVISO SE UMA FOTO DA GALERIA NÃO CARREGAR
   ===================================================================== */
// Ajuda a descobrir erro de nome/pasta (o GitHub Pages diferencia maiúsculas de minúsculas)
seguro("fotos", () => {
  document.querySelectorAll(".shot img").forEach((img) => {
    const marcarFalha = () => img.parentElement.classList.add("img-fail");
    img.addEventListener("error", marcarFalha);
    // Caso o erro tenha acontecido antes do script carregar
    if (img.complete && img.naturalWidth === 0) marcarFalha();
  });
});

/* =====================================================================
   6) ANO AUTOMÁTICO NO RODAPÉ
   ===================================================================== */
seguro("ano", () => {
  const ano = document.getElementById("year");
  if (ano) ano.textContent = new Date().getFullYear();
});
