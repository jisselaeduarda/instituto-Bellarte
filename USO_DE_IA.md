# USO DE INTELIGÊNCIA ARTIFICIAL

## Ferramenta utilizada

ChatGPT foi utilizado como ferramenta de apoio durante análise, revisão arquitetural, refatoração e documentação do projeto.

## Objetivos do uso

A IA foi utilizada para:
- revisar a estrutura existente;
- identificar duplicações e responsabilidades acumuladas;
- propor uma organização simples entre frontend e backend;
- revisar o contrato entre frontend e API;
- apoiar a refatoração de JavaScript e C#;
- revisar requisitos obrigatórios do case;
- estruturar documentação técnica;
- criar um checklist de validação.

## Prompt relevante

Um dos prompts utilizados solicitou uma revisão completa do repositório com os seguintes limites:

- preservar funcionalidades existentes;
- separar `frontend/` e `backend/`;
- manter um único deploy;
- aplicar Clean Code sem overengineering;
- manter Minimal API + Service + EF Core;
- não introduzir CQRS, MediatR, Repository Pattern, React ou outras tecnologias não exigidas;
- restaurar pesquisa, filtros, contagem, limpar filtros e estados obrigatórios;
- fazer a página de detalhes utilizar `GET /api/cursos/{id}`;
- remover duplicações, código morto e correções pós-renderização;
- documentar decisões e validar build, frontend e Docker.

## O que foi aproveitado

Foram aceitas as seguintes sugestões:
- separação física entre `frontend/` e `backend/`;
- manutenção de um único processo de publicação;
- criação de DTOs apenas para diferenciar listagem e detalhe;
- listagem sem carregar módulos/aulas;
- detalhe carregando módulos/aulas sob demanda;
- modularização do JavaScript em `api.js`, `ui.js`, `catalogo.js` e `curso.js`;
- remoção do fluxo duplicado de modal de detalhes;
- uso direto do endpoint por ID na página de detalhes;
- consolidação do seed;
- remoção de assets e CSS duplicados durante a reorganização;
- criação de CI para restore, build, publish, sintaxe JavaScript e Docker.

## O que foi descartado

Foram rejeitadas sugestões que aumentariam a complexidade sem benefício proporcional, como:
- Clean Architecture com múltiplos projetos .NET;
- CQRS;
- MediatR;
- Repository Pattern sobre Entity Framework Core;
- Unit of Work adicional;
- AutoMapper;
- React, Angular ou Vue;
- autenticação e painel administrativo;
- integração Moodle nesta etapa.

Essas decisões foram tomadas porque o case é de consulta de catálogo para uma vaga de Desenvolvedor de Sistemas I e precisa permanecer simples de explicar e manter.

## Como o conteúdo foi validado

A validação foi planejada em camadas:
- comparação do código antes/depois;
- revisão de rotas e dependências;
- validação dos requisitos obrigatórios do enunciado;
- GitHub Actions executando `dotnet restore`, `dotnet build` e `dotnet publish`;
- `node --check` nos módulos JavaScript;
- `docker build`;
- validação manual final de home, filtros, detalhes, responsividade, acessibilidade e assets.

Nenhuma validação deve ser considerada concluída apenas porque foi sugerida pela IA. O resultado real da CI e dos testes manuais precisa ser confirmado.

## Exemplo de inadequação identificada

Durante a análise, o frontend possuía uma página de detalhes e, ao mesmo tempo, mantinha lógica de detalhe em modal. Também buscava todos os cursos para localizar o selecionado, apesar de existir `GET /api/cursos/{id}`.

Esse desenho gerava duplicação e tornava o fluxo mais difícil de entender.

### Correção realizada

Foi definido um único fluxo:

```text
card do curso
→ /curso.html?id={id}
→ GET /api/cursos/{id}
→ renderização do detalhe
```

O modal e o fallback por `sessionStorage` deixaram de ser necessários.

## Outro exemplo de correção

O JavaScript aceitava vários aliases para o mesmo campo, como `nomeCompleto`, `NomeCompleto`, `nome`, `titulo` e `title`.

Como frontend e backend pertencem à mesma solução, isso mascarava inconsistências no contrato.

A refatoração passou a utilizar um contrato conhecido e único da API, com propriedades em camelCase.

## Participação humana

As decisões de arquitetura, escopo e prioridade foram revisadas considerando:
- requisitos oficiais do processo seletivo;
- nível da vaga;
- necessidade de explicação em entrevista;
- risco de regressão;
- prazo de entrega.

A IA foi utilizada como apoio e não como substituta da validação técnica da desenvolvedora.
