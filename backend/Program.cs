using CTED.CatalogoCursos.Data;
using CTED.CatalogoCursos.Data.Seed;
using CTED.CatalogoCursos.Endpoints;
using CTED.CatalogoCursos.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.FileProviders;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddOpenApi();

var databaseDirectory = Path.Combine(builder.Environment.ContentRootPath, "data");
Directory.CreateDirectory(databaseDirectory);

var databaseFileName = builder.Configuration["Database:FileName"] ?? "cursos.db";
var databasePath = Path.Combine(databaseDirectory, databaseFileName);

builder.Services.AddDbContext<CursoDbContext>(options =>
    options.UseSqlite($"Data Source={databasePath}"));

builder.Services.AddScoped<CursoService>();

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<CursoDbContext>();
    await db.Database.MigrateAsync();
    await CursoSeed.InicializarAsync(db);
}

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

var frontendPath = Path.GetFullPath(
    Path.Combine(app.Environment.ContentRootPath, "..", "frontend"));

if (Directory.Exists(frontendPath))
{
    var frontendProvider = new PhysicalFileProvider(frontendPath);
    app.UseDefaultFiles(new DefaultFilesOptions { FileProvider = frontendProvider });
    app.UseStaticFiles(new StaticFileOptions { FileProvider = frontendProvider });
}
else
{
    app.UseDefaultFiles();
    app.UseStaticFiles();
}

app.MapCursoEndpoints();

app.Run();
