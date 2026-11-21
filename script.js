const raiz = document.documentElement;

function seguro(nome, funcao) {
  try {
    funcao();
  } catch (erro) {
    console.error("Criarts - erro em: " + nome, erro);
  }
}

function mostrar(el) {
  if (!el || !el.classList.contains("reveal") || el.classList.contains("visible")) return;
  el.classList.add("visible");
  setTimeout(() => el.classList.remove("reveal", "visible"), 1000);
}

function mostrarTudo() {
  document.querySelectorAll(".reveal").forEach(mostrar);
}

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

  setTimeout(() => {
    document.querySelectorAll("#inicio .reveal").forEach(mostrar);
  }, 60);

  if (!("IntersectionObserver" in window)) {
    mostrarTudo();
    raiz.classList.add("js-ready");
    return;
  }

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

  raiz.classList.add("js-ready");
  window.addEventListener("load", () => setTimeout(mostrarVisiveisNaTela, 800));

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

seguro("whatsapp", () => {
  const WHATSAPP_NUMBER = "5569992262400";
  const WHATSAPP_MESSAGE = "Olá! Vim pelo site da Criarts Malharia e gostaria de solicitar um orçamento.";
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;

  document.querySelectorAll(".js-whatsapp").forEach((el) => {
    el.href = whatsappUrl;
    el.target = "_blank";
    el.rel = "noopener noreferrer";
  });
});

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

  nav.querySelectorAll("a").forEach((link) =>
    link.addEventListener("click", () => alternarMenu(true))
  );

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") alternarMenu(true);
  });

  document.addEventListener("click", (e) => {
    if (!nav.classList.contains("open")) return;
    if (nav.contains(e.target) || menuBtn.contains(e.target)) return;
    alternarMenu(true);
  });
});

seguro("cabecalho", () => {
  const cabecalho = document.getElementById("header");
  if (!cabecalho) return;

  function aoRolar() {
    cabecalho.classList.toggle("scrolled", window.scrollY > 30);
  }
  window.addEventListener("scroll", aoRolar, { passive: true });
  aoRolar();
});

seguro("fotos", () => {
  document.querySelectorAll(".shot img").forEach((img) => {
    const marcarFalha = () => img.parentElement.classList.add("img-fail");
    img.addEventListener("error", marcarFalha);
    if (img.complete && img.naturalWidth === 0) marcarFalha();
  });
});

seguro("ano", () => {
  const ano = document.getElementById("year");
  if (ano) ano.textContent = new Date().getFullYear();
});
