# Arquivos de Publicação

O projeto utiliza um único pacote de publicação ASP.NET Core contendo backend e frontend.

## Gerar publicação

Na raiz do repositório:

```bash
dotnet publish backend/CTED.CatalogoCursos.csproj \
  -c Release \
  -o publish \
  /p:UseAppHost=false
```

O `csproj` inclui automaticamente o conteúdo de `frontend/` dentro de `wwwroot/` no resultado publicado.

## Conteúdo esperado

O diretório `publish/` deverá conter, entre outros arquivos gerados pelo .NET:

```text
publish/
├── CTED.CatalogoCursos.dll
├── CTED.CatalogoCursos.deps.json
├── CTED.CatalogoCursos.runtimeconfig.json
├── appsettings.json
├── wwwroot/
│   ├── index.html
│   ├── curso.html
│   ├── assets/
│   ├── css/
│   └── js/
└── demais assemblies necessários em runtime
```

O arquivo SQLite não precisa ser incluído no pacote inicial. A aplicação cria/aplica migrations e executa o seed durante a inicialização.

## Gerar ZIP

Linux/macOS:

```bash
cd publish
zip -r ../cted-catalogo-cursos-publicacao.zip .
cd ..
```

PowerShell:

```powershell
Compress-Archive -Path .\publish\* -DestinationPath .\cted-catalogo-cursos-publicacao.zip -Force
```

## Não incluir

Não devem ser adicionados manualmente ao ZIP:
- `.git/`;
- `bin/`;
- `obj/`;
- `.vs/`;
- arquivos de banco usados em desenvolvimento;
- secrets ou credenciais;
- arquivos temporários.

## Validação do pacote

Antes da entrega:
1. gerar o publish;
2. criar o ZIP;
3. extrair em outra pasta;
4. executar `dotnet CTED.CatalogoCursos.dll`;
5. validar home, API, detalhes e assets.
