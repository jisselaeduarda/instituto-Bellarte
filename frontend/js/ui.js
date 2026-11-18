
export function escapeHtml(valor) {
  return String(valor ?? '').replace(/[&<>"']/g, caractere => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  }[caractere]));
}

export function safeAssetUrl(valor, fallback = '/assets/images/video-thumb.png') {
  const url = String(valor ?? '').trim();
  if (!url) return fallback;
  if (/^https?:\/\//i.test(url) || url.startsWith('/')) return url;
  return `/${url.replace(/^\/+/, '')}`;
}

export function formatarData(valor) {
  if (!valor) return '';
  const data = new Date(valor);
  if (Number.isNaN(data.getTime())) return String(valor);

  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(data);
}

export function mostrarToast(mensagem) {
  const toast = document.querySelector('#toast');
  if (!toast) return;

  toast.textContent = mensagem;
  toast.classList.add('show');
  window.clearTimeout(mostrarToast.timer);
  mostrarToast.timer = window.setTimeout(() => {
    toast.classList.remove('show');
  }, 2800);
}

export function configurarNavegacao({ cabecalhoTransparente = false } = {}) {
  const menuToggle = document.querySelector('#menu-toggle');
  const nav = document.querySelector('#main-nav');
  const header = document.querySelector('.site-header');

  document.querySelector('#current-year')?.replaceChildren(
    document.createTextNode(String(new Date().getFullYear()))
  );

  menuToggle?.addEventListener('click', () => {
    const aberto = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', String(!aberto));
    menuToggle.textContent = aberto ? '☰' : '×';
    nav?.classList.toggle('open', !aberto);
  });

  nav?.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      menuToggle?.setAttribute('aria-expanded', 'false');
      if (menuToggle) menuToggle.textContent = '☰';
    });
  });

  if (!cabecalhoTransparente || !header) return;

  const atualizarCabecalho = () => {
    const rolou = window.scrollY > 40;
    header.classList.toggle('header-scrolled', rolou);
  };

  window.addEventListener('scroll', atualizarCabecalho, { passive: true });
  atualizarCabecalho();
}