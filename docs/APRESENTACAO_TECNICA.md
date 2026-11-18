# Roteiro de Apresentação Técnica

## Versão curta — aproximadamente 3 minutos

“Eu desenvolvi um catálogo de cursos com frontend em HTML, CSS e JavaScript e backend em ASP.NET Core com Entity Framework Core e SQLite.

Durante a revisão final eu reorganizei o projeto para separar claramente `frontend` e `backend`, porque isso melhora a leitura e a manutenção. Mesmo separados no repositório, eles continuam sendo publicados juntos: o ASP.NET Core serve tanto a API quanto os arquivos estáticos do frontend. Isso evita criar duas hospedagens e CORS sem necessidade.

No backend eu mantive uma arquitetura simples: Endpoint, Service, DbContext e SQLite. Eu preferi Minimal APIs porque o projeto tem poucas rotas e elas continuam fáceis de entender. Eu não adicionei Repository Pattern, CQRS ou MediatR porque seriam complexidade desnecessária para o tamanho do case.

A API tem dois fluxos principais. `GET /api/cursos` retorna os dados necessários para a listagem e aceita pesquisa por nome e filtros de categoria, modalidade e status. Esses filtros podem ser combinados. Já `GET /api/cursos/{id}` retorna os detalhes de um curso, incluindo módulos e aulas. Assim a listagem não carrega conteúdo pesado que só é necessário na tela de detalhe.

No frontend eu separei as responsabilidades em quatro módulos. `api.js` conversa com a API, `ui.js` contém funções compartilhadas da interface, `catalogo.js` controla a home e os filtros e `curso.js` controla a página de detalhes. Isso substituiu um JavaScript maior que misturava acesso à API, renderização e correções de layout.

A página de detalhes agora recebe o ID pela URL e consulta diretamente a API por ID. Antes havia lógica duplicada e fallback por sessionStorage. Eu removi isso para manter uma única fonte de verdade.

O modelo de dados é simples: um Curso possui vários Módulos e um Módulo possui várias Aulas. O seed mantém seis cursos fictícios e garante as categorias, modalidades, status e conteúdos pedidos no desafio.

Também mantive estados de loading, erro e nenhum resultado, além de foco visível, labels, skip-link e suporte a reduced motion para acessibilidade.

Por fim, documentei a arquitetura, o uso de IA, limitações e processo de publicação e adicionei uma CI para validar restore, build, publish, JavaScript, API e Docker.

A principal decisão foi manter o código organizado, mas simples o suficiente para eu conseguir explicar e manter sem introduzir tecnologias que o problema não exige.”

## Perguntas que podem aparecer

### Por que não usou Repository Pattern?
Porque o Entity Framework Core já oferece abstração de acesso e rastreamento de dados suficiente para este case. Um repositório adicional criaria mais arquivos sem resolver um problema real.

### Por que DTOs?
Apenas para separar dois contratos que têm necessidades diferentes: a listagem não precisa de módulos e aulas; o detalhe precisa.

### Por que frontend e backend separados se o deploy é único?
Para organização do código. A separação de responsabilidades não exige separar infraestrutura.

### Por que não integrou Moodle?
Porque o enunciado trata a integração como diferencial, não requisito obrigatório. A prioridade foi garantir todos os requisitos obrigatórios com qualidade.

### Como funcionam os filtros?
O frontend monta uma query string e a API aplica categoria, modalidade e status. A pesquisa por nome é combinada com esses filtros e o resultado retornado já representa a consulta final.

### O que você melhoraria depois?
Validaria a integração real com Moodle, adicionaria testes automatizados de serviço e faria uma validação visual final mais detalhada com o Figma antes de evoluir funcionalidades.
