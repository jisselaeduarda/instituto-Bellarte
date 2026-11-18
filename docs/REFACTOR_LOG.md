# Memória da Refatoração

## Objetivo

Registrar as decisões tomadas na refatoração arquitetural do case CTED/SESI, preservando contexto para revisão, entrevista técnica e evolução posterior.

## Baseline

Branch de origem: `feature/detalhes-cursos`.

O projeto já possuía:
- ASP.NET Core Minimal API;
- EF Core + SQLite;
- migrations;
- 6 cursos;
- módulos e aulas;
- home e página de detalhes;
- assets do material fornecido;
- Dockerfile;
- README e USO_DE_IA.md.

Problemas encontrados:
- frontend e backend misturados na raiz;
- `app.js` e `curso.js` acumulando muitas responsabilidades;
- fluxo de detalhe duplicado entre modal e página dedicada;
- página de detalhe consultando todos os cursos em vez do endpoint por ID;
- frontend aceitando muitos aliases de propriedades;
- scripts inline após o fechamento do HTML;
- duplicação de CSS/assets em caminhos diferentes;
- filtros obrigatórios não estavam expostos na interface atual;
- seed dividido em estruturas menos explícitas;
- listagem carregava módulos e aulas desnecessariamente.

---

## Fase 1 — Separação física

### Objetivo
Separar responsabilidades sem criar dois deploys.

### Decisão
Criar `frontend/` e `backend/`, mantendo ASP.NET Core como host final.

### Motivo
A estrutura fica fácil de entender no GitHub e na entrevista, sem CORS, duas hospedagens ou duas pipelines.

### Resultado
- backend movido para `backend/`;
- frontend movido para `frontend/`;
- `csproj` passou a incluir o frontend no output/publish;
- Dockerfile ajustado;
- banco passou a usar caminho previsível dentro de `backend/data`.

---

## Fase 2 — Backend

### Objetivo
Reduzir acoplamento e payload sem aplicar arquitetura excessiva.

### Decisão
Manter:

```text
Endpoint → Service → DbContext → SQLite
```

### Alterações
- `Models/Cursos.cs` renomeado conceitualmente para `Models/Curso.cs`;
- DTOs simples para listagem e detalhe;
- listagem não carrega módulos/aulas;
- detalhe carrega módulos/aulas somente quando solicitado;
- seed consolidado em `Data/Seed/CursoSeed.cs`;
- imagens passaram a apontar para assets existentes;
- datas de disponibilidade preenchidas nos cursos em que são aplicáveis;
- endpoint `GET /api/cursos/{id}` mantido como fonte do detalhe.

### O que não foi criado
- Repository Pattern;
- Unit of Work adicional;
- CQRS;
- MediatR;
- AutoMapper;
- múltiplos projetos .NET.

Motivo: não agregariam valor proporcional ao escopo.

---

## Fase 3 — Frontend

### Objetivo
Eliminar duplicação, hotfixes e responsabilidades acumuladas.

### Estrutura

```text
api.js       → HTTP/API
ui.js        → utilitários compartilhados de interface
catalogo.js  → home, filtros e listagem
curso.js     → página de detalhes
```

### Alterações
- removido fluxo de detalhe por modal;
- removido uso de `sessionStorage` como fonte principal de dados;
- removidos aliases de campos da API;
- removidos `MutationObserver` usados como correção pós-renderização;
- removido JavaScript inline fora do HTML;
- home passou a expor pesquisa e filtros obrigatórios;
- contador e limpar filtros implementados;
- detalhe passou a usar `GET /api/cursos/{id}`;
- estados loading, vazio, erro e não encontrado mantidos/organizados;
- CSS consolidado em uma única fonte de verdade;
- assets consolidados em `frontend/assets/images`.

---

## Fase 4 — Documentação e validação

### Arquivos
- `README.md` atualizado;
- `USO_DE_IA.md` atualizado;
- `docs/ARQUIVOS_PUBLICACAO.md` criado;
- `docs/APRESENTACAO_TECNICA.md` criado;
- `.github/workflows/ci.yml` criado.

### Validação automatizada executada

A segunda execução da CI foi concluída com sucesso em 25/10/2026.

Passaram:
- `dotnet restore`;
- `dotnet build` — 0 warnings e 0 erros;
- `dotnet publish`;
- `node --check` em `api.js`, `ui.js`, `catalogo.js` e `curso.js`;
- inicialização real da aplicação;
- `GET /api/cursos`;
- `GET /api/cursos/1`;
- consulta combinando busca + categoria + modalidade + status;
- `docker build`.

### Erro encontrado pela CI e correção

A primeira execução compilou e publicou corretamente, mas falhou ao iniciar porque o ASP.NET Core tentou inicializar `backend/wwwroot` antes do servidor de arquivos estáticos externo ser configurado.

Correção:
- criado `backend/wwwroot/.gitkeep` para garantir a existência do web root padrão;
- `Program.cs` passou a usar `PhysicalFileProvider` para servir `frontend/` durante desenvolvimento;
- em publicação, o `wwwroot` gerado pelo `csproj` continua sendo usado normalmente.

Após a correção, a CI ficou verde em todas as etapas.

---

# Matriz de aderência ao case

| Requisito oficial | Status | Evidência |
|---|---|---|
| Frontend baseado no Figma | PARCIAL | visual preservado; comparação visual final ainda necessária |
| Responsividade | ATENDIDO NO CÓDIGO | breakpoints e layouts adaptativos em `frontend/css/styles.css` |
| Acessibilidade | ATENDIDO NO CÓDIGO | semântica, labels, foco, skip-link, aria-live e reduced-motion |
| Backend C#/.NET | ATENDIDO | `backend/` |
| API para consulta | ATENDIDO E VALIDADO | `GET /api/cursos` e `GET /api/cursos/{id}` testados na CI |
| Banco open source | ATENDIDO | SQLite |
| Integração frontend/API/banco | ATENDIDO | aplicação inicia e API responde com migrations/seed aplicados |
| 6 cursos | ATENDIDO | `CursoSeed.cs` |
| 3 categorias | ATENDIDO | Tecnologia, Segurança, Gestão |
| 2 modalidades | ATENDIDO | Online, Presencial |
| 3 status | ATENDIDO | Disponível, Em breve, Encerrado |
| Módulos e descrições de aulas | ATENDIDO | seed + modelo Curso/Modulo/Aula |
| Pesquisa por nome | ATENDIDO E VALIDADO | `busca` testada em consulta combinada na CI |
| Filtro categoria | ATENDIDO E VALIDADO | API + select |
| Filtro modalidade | ATENDIDO E VALIDADO | API + select |
| Filtro status | ATENDIDO E VALIDADO | API + select |
| Combinação de busca/filtros | ATENDIDO E VALIDADO | smoke test na CI |
| Contagem de resultados | ATENDIDO NO CÓDIGO | `result-count` |
| Limpar filtros | ATENDIDO NO CÓDIGO | botão `Limpar` |
| Detalhes do curso | ATENDIDO E VALIDADO | endpoint por ID respondeu na CI |
| Estado sem resultados | ATENDIDO NO CÓDIGO | empty state |
| Loading | ATENDIDO NO CÓDIGO | home e detalhe |
| Erro | ATENDIDO NO CÓDIGO | retry/estado de erro |
| README obrigatório | ATENDIDO | `README.md` |
| USO_DE_IA.md | ATENDIDO | `USO_DE_IA.md` |
| Publicação gratuita | PENDENTE | URL pública ainda precisa ser confirmada |
| Relação de arquivos de publicação | ATENDIDO | `docs/ARQUIVOS_PUBLICACAO.md` |
| Limitações conhecidas | ATENDIDO | README |
| Integração Moodle | NÃO IMPLEMENTADO — OPCIONAL | registrada como evolução futura |

## Pendências antes da entrega

1. Fazer validação visual comparando desktop/mobile com o Figma.
2. Publicar em plataforma gratuita.
3. Registrar URL pública no README.
4. Gerar ZIP de publicação conforme documentação.
