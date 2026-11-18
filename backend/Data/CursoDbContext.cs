using CTED.CatalogoCursos.Models;
using Microsoft.EntityFrameworkCore;

namespace CTED.CatalogoCursos.Data;

public class CursoDbContext : DbContext
{
    public CursoDbContext(DbContextOptions<CursoDbContext> options)
        : base(options)
    {
    }

    public DbSet<Curso> Cursos => Set<Curso>();
    public DbSet<Modulo> Modulos => Set<Modulo>();
    public DbSet<Aula> Aulas => Set<Aula>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Curso>()
            .HasMany(curso => curso.Modulos)
            .WithOne()
            .HasForeignKey(modulo => modulo.CursoId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Modulo>()
            .HasMany(modulo => modulo.Aulas)
            .WithOne()
            .HasForeignKey(aula => aula.ModuloId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
