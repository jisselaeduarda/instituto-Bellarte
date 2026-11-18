# CTED — Catálogo de Cursos

Aplicação web de catálogo de cursos desenvolvida para o processo seletivo de **Desenvolvedor de Sistemas I** do CTED/SESI-SP.

A solução permite consultar cursos, pesquisar por nome, combinar filtros e abrir os detalhes de cada oferta, incluindo módulos e aulas.

## Tecnologias

### Frontend
- HTML5
- CSS3
- JavaScript ES Modules

### Backend
- C# / .NET 10
- ASP.NET Core Minimal APIs
- Entity Framework Core
- SQLite

### Infraestrutura
- Docker
- Git/GitHub
- GitHub Actions para validação da branch

## Arquitetura

A solução mantém frontend e backend separados no repositório, mas utiliza **um único deploy**. O ASP.NET Core serve a API e também os arquivos estáticos do frontend.

```text
Navegador
   ↓
Frontend estático
   ↓ HTTP
Minimal API
   ↓
CursoService
   ↓
Entity Framework Core
   ↓
SQLite
```

Não foram adotados CQRS, MediatR, Repository Pattern ou múltiplos projetos .NET porque não agregariam valor proporcional ao tamanho do case.

## Estrutura de pastas

```text
cted-catalogo-cursos/
├── frontend/
│   ├── assets/images/
│   ├── css/styles.css
│   ├── js/
│   │   ├── api.js
│   │   ├── ui.js
│   │   ├── catalogo.js
│   │   └── curso.js
│   ├── index.html
│   └── curso.html
├── backend/
│   ├── Data/
│   │   ├── Seed/CursoSeed.cs
│   │   └── CursoDbContext.cs
│   ├── DTOs/CursoResponses.cs
│   ├── Endpoints/CursoEndpoints.cs
│   ├── Migrations/
│   ├── Models/
│   │   ├── Curso.cs
│   │   ├── Modulo.cs
│   │   └── Aula.cs
│   ├── Services/CursoService.cs
│   ├── Properties/
│   ├── Program.cs
│   ├── appsettings.json
│   └── CTED.CatalogoCursos.csproj
├── docs/
│   ├── REFACTOR_LOG.md
│   ├── ARQUIVOS_PUBLICACAO.md
│   └── APRESENTACAO_TECNICA.md
├── .github/workflows/ci.yml
├── Dockerfile
├── README.md
└── USO_DE_IA.md
```

## Modelo de dados

### Curso
- Id
- Nome completo
- Nome breve
- Descrição
- Categoria
- Modalidade
- Carga horária
- Público-alvo
- Status
- Imagem de apresentação
- Data de disponibilização, quando aplicável
- Módulos

### Módulo
- Id
- Título
- Ordem
- CursoId
- Aulas

### Aula
- Id
- Título
- Descrição
- Ordem
- ModuloId

Relacionamento:

```text
Curso 1 ─── N Módulos
Módulo 1 ─── N Aulas
```

## Dados do catálogo

O seed contém dados fictícios e garante:
- 6 cursos;
- 3 categorias;
- 2 modalidades;
- 3 status;
- diferentes cargas horárias;
- diferentes públicos-alvo;
- módulos e descrições de aulas;
- datas de disponibilidade nos cursos em que são aplicáveis.

O seed é idempotente: ele adiciona registros ausentes e atualiza os dados conhecidos sem recriar indiscriminadamente o banco.

## API

### `GET /api/cursos`

Lista cursos sem carregar módulos e aulas, mantendo a resposta da listagem enxuta.

Parâmetros opcionais:
- `busca`
- `categoria`
- `modalidade`
- `status`

Exemplo:

```text
/api/cursos?busca=excel&categoria=Gestão&modalidade=Online&status=Em%20breve
```

A busca e os filtros podem ser combinados.

### `GET /api/cursos/{id}`

Retorna um curso específico com módulos e aulas.

Exemplo:

```text
/api/cursos/1
```

## Execução local

### Requisitos
- .NET SDK 10
- Git

### Passos

```bash
git clone https://github.com/anamsilva1981/cted-catalogo-cursos.git
cd cted-catalogo-cursos

dotnet restore backend/CTED.CatalogoCursos.csproj
dotnet build backend/CTED.CatalogoCursos.csproj
dotnet run --project backend/CTED.CatalogoCursos.csproj --urls http://localhost:5046
```

Acesse:

```text
http://localhost:5046
http://localhost:5046/api/cursos
http://localhost:5046/api/cursos/1
```

## Banco de dados

O banco SQLite é criado em:

```text
backend/data/cursos.db
```

O nome do arquivo pode ser alterado em `backend/appsettings.json`:

```json
{
  "Database": {
    "FileName": "cursos.db"
  }
}
```

As migrations são aplicadas durante a inicialização da aplicação.

## Frontend e integração

A home consulta `GET /api/cursos` utilizando os parâmetros informados na pesquisa e nos filtros. A página de detalhes utiliza diretamente `GET /api/cursos/{id}`.

O frontend trabalha com um contrato conhecido da própria API e não mantém aliases para vários formatos de propriedades.

## Responsividade

A interface utiliza CSS Grid, Flexbox e breakpoints para adaptar navegação, filtros, cards e detalhes. Foram considerados layouts para celular, tablet e desktop. O projeto evita usar `overflow-x: hidden` como correção genérica de responsividade.

## Acessibilidade

Decisões aplicadas:
- HTML semântico;
- skip-link;
- labels nos filtros;
- foco visível;
- `aria-live` em estados dinâmicos;
- navegação por teclado nativa em links, botões e `details`;
- textos alternativos nas imagens relevantes;
- imagens decorativas com `alt=""`;
- suporte a `prefers-reduced-motion`;
- estados de loading, vazio, erro e não encontrado.

## Publicação

O `Dockerfile` compila o projeto localizado em `backend/` e copia o frontend para o `wwwroot` do resultado publicado.

Build local do container:

```bash
docker build -t cted-catalogo-cursos .
docker run --rm -p 10000:10000 cted-catalogo-cursos
```

A aplicação fica disponível em:

```text
http://localhost:10000
```

A hospedagem pública deve utilizar uma opção gratuita. A URL pública definitiva deve ser adicionada aqui após a publicação ser validada.

## Validação automatizada

O workflow `.github/workflows/ci.yml` executa:
- `dotnet restore`;
- `dotnet build`;
- `dotnet publish`;
- `node --check` nos módulos JavaScript;
- `docker build`.

## Uso de Inteligência Artificial

O uso de IA está documentado em `USO_DE_IA.md`, incluindo objetivos, prompts, decisões aceitas/rejeitadas, validação e exemplos de correções realizadas.

## Moodle

A integração real com Moodle não foi implementada. O case define essa integração como diferencial, não como requisito obrigatório. Ela fica registrada como evolução futura para evitar aumentar o risco da entrega principal.

## Limitações conhecidas e itens não concluídos

- integração com Moodle não implementada;
- matrícula online não implementada;
- conteúdo, estatísticas e depoimentos são fictícios para demonstração;
- imagens são ilustrativas e podem ser reutilizadas entre cursos;
- publicação pública precisa ter a URL definitiva confirmada;
- diferenças visuais remanescentes em relação ao Figma devem ser identificadas durante a validação visual final.

## Arquivos de publicação

A relação dos arquivos e o procedimento para gerar o pacote estão documentados em `docs/ARQUIVOS_PUBLICACAO.md`.
