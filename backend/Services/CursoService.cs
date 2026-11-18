using System.Globalization;
using System.Text;
using CTED.CatalogoCursos.Data;
using CTED.CatalogoCursos.DTOs;
using CTED.CatalogoCursos.Models;
using Microsoft.EntityFrameworkCore;

namespace CTED.CatalogoCursos.Services;

public class CursoService
{
    private readonly CursoDbContext _context;

    public CursoService(CursoDbContext context)
    {
        _context = context;
    }

    public async Task<IReadOnlyList<CursoResumoResponse>> ListarAsync(
        string? busca,
        string? categoria,
        string? modalidade,
        string? status)
    {
        var consulta = _context.Cursos.AsNoTracking();

        if (!string.IsNullOrWhiteSpace(categoria))
            consulta = consulta.Where(curso => curso.Categoria == categoria);

        if (!string.IsNullOrWhiteSpace(modalidade))
            consulta = consulta.Where(curso => curso.Modalidade == modalidade);

        if (!string.IsNullOrWhiteSpace(status))
            consulta = consulta.Where(curso => curso.Status == status);

        var cursos = await consulta
            .OrderBy(curso => curso.NomeCompleto)
            .ToListAsync();

        if (!string.IsNullOrWhiteSpace(busca))
        {
            var termo = RemoverAcentos(busca.Trim());
            cursos = cursos.Where(curso =>
                Contem(curso.NomeCompleto, termo) ||
                Contem(curso.NomeResumido, termo))
                .ToList();
        }

        return cursos.Select(MapearResumo).ToList();
    }

    public async Task<CursoDetalheResponse?> ObterPorIdAsync(int id)
    {
        var curso = await _context.Cursos
            .AsNoTracking()
            .Include(item => item.Modulos)
                .ThenInclude(modulo => modulo.Aulas)
            .FirstOrDefaultAsync(item => item.Id == id);

        return curso is null ? null : MapearDetalhe(curso);
    }

    private static CursoResumoResponse MapearResumo(Curso curso) => new(
        curso.Id,
        curso.NomeCompleto,
        curso.NomeResumido,
        curso.Descricao,
        curso.Categoria,
        curso.Modalidade,
        curso.CargaHoraria,
        curso.PublicoAlvo,
        curso.Status,
        curso.ImagemUrl,
        curso.DataDisponibilidade);

    private static CursoDetalheResponse MapearDetalhe(Curso curso) => new(
        curso.Id,
        curso.NomeCompleto,
        curso.NomeResumido,
        curso.Descricao,
        curso.Categoria,
        curso.Modalidade,
        curso.CargaHoraria,
        curso.PublicoAlvo,
        curso.Status,
        curso.ImagemUrl,
        curso.DataDisponibilidade,
        curso.Modulos
            .OrderBy(modulo => modulo.Ordem)
            .Select(modulo => new ModuloResponse(
                modulo.Id,
                modulo.Titulo,
                modulo.Ordem,
                modulo.Aulas
                    .OrderBy(aula => aula.Ordem)
                    .Select(aula => new AulaResponse(
                        aula.Id,
                        aula.Titulo,
                        aula.Descricao,
                        aula.Ordem))
                    .ToList()))
            .ToList());

    private static bool Contem(string texto, string termoNormalizado) =>
        RemoverAcentos(texto)
            .Contains(termoNormalizado, StringComparison.OrdinalIgnoreCase);

    private static string RemoverAcentos(string texto)
    {
        var normalizado = texto.Normalize(NormalizationForm.FormD);
        var semAcentos = normalizado.Where(caractere =>
            CharUnicodeInfo.GetUnicodeCategory(caractere) != UnicodeCategory.NonSpacingMark);

        return string.Concat(semAcentos).Normalize(NormalizationForm.FormC);
    }
}
