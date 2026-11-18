const API_BASE = '/api/cursos';

async function requisitar(url) {
  const resposta = await fetch(url, {
    headers: { Accept: 'application/json' }
  });

  if (resposta.status === 404) return null;

  if (!resposta.ok) {
    throw new Error(`A API respondeu com status ${resposta.status}.`);
  }

  return resposta.json();
}

export async function listarCursos(filtros = {}) {
  const parametros = new URLSearchParams();

  Object.entries(filtros).forEach(([chave, valor]) => {
    const texto = String(valor ?? '').trim();
    if (texto) parametros.set(chave, texto);
  });

  const query = parametros.toString();
  return requisitar(query ? `${API_BASE}?${query}` : API_BASE);
}

export function obterCursoPorId(id) {
  return requisitar(`${API_BASE}/${encodeURIComponent(id)}`);
}
