
using CTED.CatalogoCursos.Models;
using Microsoft.EntityFrameworkCore;

namespace CTED.CatalogoCursos.Data.Seed;

public static class CursoSeed
{
    public static async Task InicializarAsync(CursoDbContext db)
    {
        var cursosSeed = CriarCursos();

        var existentes = await db.Cursos
            .Include(curso => curso.Modulos)
                .ThenInclude(modulo => modulo.Aulas)
            .ToListAsync();

        foreach (var cursoSeed in cursosSeed)
        {
            var existente = existentes.FirstOrDefault(curso =>
                curso.NomeCompleto == cursoSeed.NomeCompleto);

            if (existente is null)
            {
                db.Cursos.Add(cursoSeed);
                continue;
            }

            existente.NomeResumido = cursoSeed.NomeResumido;
            existente.Descricao = cursoSeed.Descricao;
            existente.Categoria = cursoSeed.Categoria;
            existente.Modalidade = cursoSeed.Modalidade;
            existente.CargaHoraria = cursoSeed.CargaHoraria;
            existente.PublicoAlvo = cursoSeed.PublicoAlvo;
            existente.Status = cursoSeed.Status;
            existente.ImagemUrl = cursoSeed.ImagemUrl;
            existente.DataDisponibilidade = cursoSeed.DataDisponibilidade;

            if (existente.Modulos.Count == 0)
            {
                existente.Modulos = cursoSeed.Modulos;
            }
        }

        // Remover somente os seis cursos antigos da indústria.
        string[] cursosIndustriais =
        [
            "Introdução à Indústria 4.0",
            "Fundamentos de Segurança do Trabalho",
            "Excel Aplicado à Produção",
            "Automação de Processos Industriais",
            "Gestão da Qualidade Industrial",
            "Boas Práticas de Manutenção"
        ];

        var cursosAntigos = existentes
            .Where(curso => cursosIndustriais.Contains(curso.NomeCompleto))
            .ToList();

        db.Cursos.RemoveRange(cursosAntigos);

        await db.SaveChangesAsync();
    }

    private static List<Curso> CriarCursos() =>
    [
        // 1. PINTURA CLÁSSICA
        CriarCurso(
            "Pintura Clássica",
            "Pintura Clássica",
            "Explore a arte da pintura por meio das cores, da composição e das técnicas dos grandes mestres.",
            "Artes Visuais",
            "Presencial",
            40,
            "Iniciantes e amantes da pintura",
            "Disponível",
            "/assets/images/cursos/pintura-classica.jfif",
            null,
            ("Fundamentos da pintura",
                "Materiais e técnicas",
                "Teoria das cores"),
            ("Pintura clássica",
                "Luz e sombra",
                "Composição artística")
        ),

        // 2. DESENHO ARTÍSTICO
        CriarCurso(
            "Desenho Artístico",
            "Desenho Artístico",
            "Desenvolva seu olhar artístico e aprenda técnicas de proporção, perspectiva e expressão.",
            "Artes Visuais",
            "Presencial",
            32,
            "Iniciantes e estudantes de arte",
            "Disponível",
            "/assets/images/cursos/desenho-artistico.jfif",
            null,
            ("Fundamentos do desenho",
                "Traços e formas",
                "Proporção e perspectiva"),
            ("Expressão artística",
                "Luz e sombreamento",
                "Desenho de observação")
        ),

        // 3. ESCULTURA E MODELAGEM
        CriarCurso(
            "Escultura e Modelagem",
            "Escultura e Modelagem",
            "Transforme ideias em formas tridimensionais utilizando técnicas tradicionais de modelagem.",
            "Artes Visuais",
            "Presencial",
            36,
            "Interessados em artes tridimensionais",
            "Disponível",
            "/assets/images/cursos/escultura-modelagem.jfif",
            null,
            ("Introdução à escultura",
                "Materiais e ferramentas",
                "Formas e volumes"),
            ("Técnicas de modelagem",
                "Modelagem em argila",
                "Acabamento artístico")
        ),

        // 4. CALIGRAFIA ARTÍSTICA
        CriarCurso(
            "Caligrafia Artística",
            "Caligrafia Artística",
            "Descubra a elegância da escrita com pena e tinta, explorando estilos clássicos de caligrafia.",
            "Artes Visuais",
            "Presencial",
            24,
            "Iniciantes e amantes da escrita artística",
            "Disponível",
            "/assets/images/cursos/caligrafia-artistica.jfif",
            null,
            ("Introdução à caligrafia",
                "Instrumentos e materiais",
                "Traços fundamentais"),
            ("Caligrafia clássica",
                "Letras e composição",
                "Criação de peças artísticas")
        ),

        // 5. BALLET CLÁSSICO
        CriarCurso(
            "Ballet Clássico",
            "Ballet Clássico",
            "Desenvolva postura, coordenação, musicalidade e expressão por meio da dança clássica.",
            "Dança",
            "Presencial",
            48,
            "Iniciantes em dança clássica",
            "Disponível",
            "/assets/images/cursos/ballet-classico.jfif",
            null,
            ("Fundamentos do ballet",
                "Postura e posições básicas",
                "Alongamento e equilíbrio"),
            ("Técnica e expressão",
                "Movimentos clássicos",
                "Musicalidade e interpretação")
        ),

        // 6. DANÇA CONTEMPORÂNEA
        CriarCurso(
            "Dança Contemporânea",
            "Dança Contemporânea",
            "Explore a liberdade de movimento, a criatividade e a expressão corporal.",
            "Dança",
            "Presencial",
            40,
            "Iniciantes e interessados em dança",
            "Disponível",
            "/assets/images/cursos/danca-contemporanea.jfif",
            null,
            ("Expressão corporal",
                "Consciência do corpo",
                "Movimentos e espaço"),
            ("Criação coreográfica",
                "Improvisação",
                "Composição de movimentos")
        ),

        // 7. TEORIA MUSICAL E CANTO
        CriarCurso(
            "Teoria Musical e Canto",
            "Teoria Musical e Canto",
            "Descubra os fundamentos da música e desenvolva percepção auditiva, ritmo e expressão vocal.",
            "Música",
            "Presencial",
            36,
            "Iniciantes em música e canto",
            "Disponível",
            "/assets/images/cursos/teoria-musical-canto.jfif",
            null,
            ("Fundamentos musicais",
                "Notas e ritmo",
                "Percepção musical"),
            ("Técnica vocal",
                "Respiração e afinação",
                "Interpretação musical")
        ),

        // 8. INSTRUMENTOS MUSICAIS
        CriarCurso(
            "Instrumentos Musicais",
            "Instrumentos Musicais",
            "Inicie sua jornada musical com aulas de piano, violão ou violino, desenvolvendo técnica e sensibilidade.",
            "Música",
            "Presencial",
            48,
            "Iniciantes em instrumentos musicais",
            "Disponível",
            "/assets/images/cursos/instrumentos-musicais.jfif",
            null,
            ("Introdução aos instrumentos",
                "Conhecendo o instrumento",
                "Postura e técnica básica"),
            ("Prática musical",
                "Exercícios e melodias",
                "Interpretação instrumental")
        )
    ];

    private static Curso CriarCurso(
        string nomeCompleto,
        string nomeResumido,
        string descricao,
        string categoria,
        string modalidade,
        int cargaHoraria,
        string publicoAlvo,
        string status,
        string imagemUrl,
        DateTime? dataDisponibilidade,
        params (string Modulo, string Aula1, string Aula2)[] conteudo)
    {
        return new Curso
        {
            NomeCompleto = nomeCompleto,
            NomeResumido = nomeResumido,
            Descricao = descricao,
            Categoria = categoria,
            Modalidade = modalidade,
            CargaHoraria = cargaHoraria,
            PublicoAlvo = publicoAlvo,
            Status = status,
            ImagemUrl = imagemUrl,
            DataDisponibilidade = dataDisponibilidade,

            Modulos = conteudo.Select((item, indice) => new Modulo
            {
                Ordem = indice + 1,
                Titulo = item.Modulo,

                Aulas =
                [
                    new Aula
                    {
                        Ordem = 1,
                        Titulo = item.Aula1,
                        Descricao = $"Conheça os conceitos de {item.Aula1} e sua aplicação no contexto do curso."
                    },
                    new Aula
                    {
                        Ordem = 2,
                        Titulo = item.Aula2,
                        Descricao = $"Explore exemplos práticos de {item.Aula2} e sua importância para a formação."
                    }
                ]
            }).ToList()
        };
    }
}
