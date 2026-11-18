
import { obterCursoPorId } from './api.js';
import {
  configurarNavegacao,
  escapeHtml,
  formatarData,
  mostrarToast,
  safeAssetUrl
} from './ui.js';

const root = document.querySelector('#course-detail-root');
const params = new URLSearchParams(window.location.search);
const id = Number(params.get('id'));

function renderizarModulos(modulos) {
  if (!Array.isArray(modulos) || modulos.length === 0) {
    return '<p class="detail-description">O conteúdo programático deste curso será divulgado em breve.</p>';
  }

  return `
    <div class="module-list">
      ${modulos.map((modulo, indice) => {
        const aulas = Array.isArray(modulo.aulas) ? modulo.aulas : [];

        return `
          <details class="course-accordion module-card">
            <summary>
              <span class="module-number">
                ${String(indice + 1).padStart(2, '0')}
              </span>

              <span class="module-summary-title">
                ${escapeHtml(modulo.titulo)}
              </span>

              <span class="module-count">
                ${aulas.length} ${aulas.length === 1 ? 'aula' : 'aulas'}
              </span>
            </summary>

            <ol class="lesson-list">
              ${aulas.map(aula => `
                <li>
                  <span class="lesson-mark" aria-hidden="true">✦</span>
                  <div>
                    <strong>${escapeHtml(aula.titulo)}</strong>
                    <p>${escapeHtml(aula.descricao)}</p>
                  </div>
                </li>
              `).join('')}
            </ol>
          </details>
        `;
      }).join('')}
    </div>
  `;
}

function renderizarCurso(curso) {
  const imagem = safeAssetUrl(curso.imagemUrl);

  const disponibilidade = curso.dataDisponibilidade
    ? `
      <p class="detail-availability">
        Disponibilidade a partir de
        <strong>${escapeHtml(formatarData(curso.dataDisponibilidade))}</strong>
      </p>
    `
    : '';

  root.innerHTML = `
    <div class="detail-brandline">
      <span class="detail-brand-label">INSTITUTO BELL'ARTE</span>
      <a class="detail-back" href="/index.html#cursos">
       Voltar aos cursos
       </a>
    </div>

    <section class="detail-main-grid" aria-labelledby="course-title">

      <div class="detail-intro">
        <span class="detail-status">
          ${escapeHtml(curso.status)}
        </span>

        <p class="detail-category">
          ${escapeHtml(curso.categoria)}
        </p>

        <h1 id="course-title">
          ${escapeHtml(curso.nomeCompleto)}
        </h1>

        <p class="bellarte-course-subtitle">
          Descubra novas formas de criar, aprender e se expressar.
        </p>

        <div class="detail-meta-grid">

          <span class="detail-meta-item">
            <span class="detail-meta-icon" aria-hidden="true">◷</span>
            <span>
              <small>Carga horária</small>
              <strong>${curso.cargaHoraria} horas</strong>
            </span>
          </span>

          <span class="detail-meta-item">
            <span class="detail-meta-icon" aria-hidden="true">✦</span>
            <span>
              <small>Modalidade</small>
              <strong>${escapeHtml(curso.modalidade)}</strong>
            </span>
          </span>

          <span class="detail-meta-item">
            <span class="detail-meta-icon" aria-hidden="true">✓</span>
            <span>
              <small>Certificação</small>
              <strong>Consulte as condições</strong>
            </span>
          </span>

        </div>

        ${disponibilidade}

        <p class="detail-audience">
          <strong>Para quem é este curso:</strong>
          ${escapeHtml(curso.publicoAlvo)}
        </p>

        <button class="button button-red detail-enroll" type="button" data-enroll>
          Tenho interesse <span aria-hidden="true">→</span>
        </button>
      </div>

      <div class="detail-video-wrap">
        <div class="detail-video">
          <img
            src="${escapeHtml(imagem)}"
            alt="Imagem de apresentação do curso ${escapeHtml(curso.nomeCompleto)}"
          >
          <span class="video-label">INSTITUTO BELL'ARTE</span>
        </div>

        <p class="video-caption">
          Arte, conhecimento e expressão em cada detalhe.
        </p>
      </div>

    </section>

    <section class="detail-feature-strip" aria-label="Experiência de aprendizagem">

      <article>
        <span class="bellarte-feature-icon" aria-hidden="true">✧</span>
        <div>
          <strong>Expressão artística</strong>
          <small>Descubra e desenvolva sua criatividade</small>
        </div>
      </article>

      <article>
        <span class="bellarte-feature-icon" aria-hidden="true">✦</span>
        <div>
          <strong>Conhecimento e técnica</strong>
          <small>Explore os fundamentos de cada arte</small>
        </div>
      </article>

      <article>
        <span class="bellarte-feature-icon" aria-hidden="true">❦</span>
        <div>
          <strong>Cultura e tradição</strong>
          <small>Valorize diferentes formas de expressão</small>
        </div>
      </article>

      <article>
        <span class="bellarte-feature-icon" aria-hidden="true">◇</span>
        <div>
          <strong>Jornada criativa</strong>
          <small>Aprenda e descubra novas possibilidades</small>
        </div>
      </article>

    </section>

    <section class="detail-section">
      <div class="detail-section-heading">
        <p class="eyebrow">A ARTE DE APRENDER</p>
        <h2>Sobre o curso</h2>
      </div>

      <p class="detail-description">
        ${escapeHtml(curso.descricao)}
      </p>

      <div class="detail-pills">
        <span>${escapeHtml(curso.categoria)}</span>
        <span>${escapeHtml(curso.modalidade)}</span>
        <span>${curso.cargaHoraria} horas</span>
      </div>
    </section>

    <section class="detail-section">
      <div class="detail-section-heading">
        <p class="eyebrow">SUA JORNADA ARTÍSTICA</p>
        <h2>Conteúdo programático</h2>
      </div>

      ${renderizarModulos(curso.modulos)}
    </section>

    <section class="detail-bottom-cta">
      <div>
        <p class="eyebrow eyebrow-light">INSTITUTO BELL'ARTE</p>

        <h2>Desperte a arte que existe em você.</h2>

        <p>
          Conheça novas possibilidades de expressão,
          criatividade e aprendizado.
        </p>
      </div>

      <button class="button button-light" type="button" data-enroll>
        Tenho interesse <span aria-hidden="true">→</span>
      </button>
    </section>
  `;

  root.setAttribute('aria-busy', 'false');
  document.title = `${curso.nomeCompleto} | Instituto Bell'Arte`;
}

function renderizarErro(titulo, mensagem) {
  root.innerHTML = `
    <div class="detail-error" role="alert">
      <p class="eyebrow">INSTITUTO BELL'ARTE</p>
      <h1>${escapeHtml(titulo)}</h1>
      <p>${escapeHtml(mensagem)}</p>
      <a class="button button-red" href="/index.html#cursos">
        Voltar ao catálogo
      </a>
    </div>
  `;

  root.setAttribute('aria-busy', 'false');
}

async function carregarCurso() {
  if (!Number.isInteger(id) || id <= 0) {
    renderizarErro(
      'Curso não informado',
      'Volte ao catálogo e escolha um curso para visualizar os detalhes.'
    );
    return;
  }

  try {
    const curso = await obterCursoPorId(id);

    if (!curso) {
      renderizarErro(
        'Curso não encontrado',
        'O curso solicitado não existe ou não está mais disponível.'
      );
      return;
    }

    renderizarCurso(curso);
  } catch (erro) {
    console.error('Falha ao carregar curso:', erro);

    renderizarErro(
      'Não foi possível carregar este curso',
      'Tente novamente em alguns instantes.'
    );
  }
}

root?.addEventListener('click', evento => {
  if (evento.target.closest('[data-enroll]')) {
    mostrarToast(
      'O atendimento para matrículas ainda não está disponível nesta versão do site.'
    );
  }
});

configurarNavegacao();
carregarCurso();
