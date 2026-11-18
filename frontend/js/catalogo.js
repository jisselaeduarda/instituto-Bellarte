import { listarCursos } from './api.js';
import { configurarNavegacao, escapeHtml, safeAssetUrl } from './ui.js';

const lista = document.querySelector('#course-rail');
const contador = document.querySelector('#result-count');
const formulario = document.querySelector('#course-filters');
const limpar = document.querySelector('#clear-filters');
const anterior = document.querySelector('#course-prev');
const proximo = document.querySelector('#course-next');

function obterFiltros() {
  return {
    busca: document.querySelector('#busca')?.value ?? '',
    categoria: document.querySelector('#categoria')?.value ?? '',
    modalidade: document.querySelector('#modalidade')?.value ?? '',
    status: document.querySelector('#status')?.value ?? ''
  };
}

function renderizarCursos(cursos) {
  contador.textContent = `${cursos.length} ${cursos.length === 1 ? 'curso encontrado' : 'cursos encontrados'}`;

  if (!cursos.length) {
    lista.innerHTML = `
      <div class="empty-state">
        <strong>Nenhum curso encontrado.</strong>
        <p>Tente alterar a pesquisa ou os filtros.</p>
      </div>`;
    return;
  }

  lista.innerHTML = cursos.map(curso => {
    const imagem = safeAssetUrl(curso.imagemUrl);
    return `
      <a class="course-card" href="/curso.html?id=${encodeURIComponent(curso.id)}"
         style="--card-image:url('${escapeHtml(imagem)}')"
         aria-label="Ver detalhes do curso ${escapeHtml(curso.nomeCompleto)}">
        <span class="course-tag">${escapeHtml(curso.categoria)}</span>
        <h3 class="course-title">${escapeHtml(curso.nomeResumido)}</h3>
        <p class="course-description">${escapeHtml(curso.descricao)}</p>
        <p class="course-card-meta">${escapeHtml(curso.modalidade)} · ${escapeHtml(curso.cargaHoraria)}h</p>
      </a>`;
  }).join('');
}

async function carregarCursos() {
  contador.textContent = 'Carregando cursos...';
  lista.innerHTML = '<div class="state-message" role="status">Carregando cursos...</div>';

  try {
    const cursos = await listarCursos(obterFiltros());
    renderizarCursos(cursos ?? []);
  } catch (erro) {
    console.error('Falha ao carregar cursos:', erro);
    contador.textContent = 'Não foi possível carregar os cursos.';
    lista.innerHTML = `
      <div class="empty-state" role="alert">
        <strong>Não foi possível carregar os cursos.</strong>
        <p>Tente novamente em alguns instantes.</p>
        <button class="button button-red" id="retry-load" type="button">Tentar novamente</button>
      </div>`;
    document.querySelector('#retry-load')?.addEventListener('click', carregarCursos);
  }
}

let debounceTimer;
document.querySelector('#busca')?.addEventListener('input', () => {
  window.clearTimeout(debounceTimer);
  debounceTimer = window.setTimeout(carregarCursos, 300);
});

['categoria', 'modalidade', 'status'].forEach(id => {
  document.querySelector(`#${id}`)?.addEventListener('change', carregarCursos);
});

formulario?.addEventListener('submit', evento => {
  evento.preventDefault();
  carregarCursos();
});

limpar?.addEventListener('click', () => {
  formulario?.reset();
  carregarCursos();
});

anterior?.addEventListener('click', () => {
  lista.scrollBy({ left: -lista.clientWidth * 0.8, behavior: 'smooth' });
});

proximo?.addEventListener('click', () => {
  lista.scrollBy({ left: lista.clientWidth * 0.8, behavior: 'smooth' });
});

document.querySelector('#review-prev')?.addEventListener('click', () => {
  document.querySelector('#reviews-rail')?.scrollBy({ left: -280, behavior: 'smooth' });
});

document.querySelector('#review-next')?.addEventListener('click', () => {
  document.querySelector('#reviews-rail')?.scrollBy({ left: 280, behavior: 'smooth' });
});

configurarNavegacao({ cabecalhoTransparente: true });
carregarCursos();
