using ControleGastos.Api.Data;
using ControleGastos.Api.Dtos;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ControleGastos.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SummaryController : ControllerBase
{
    private readonly AppDbContext _context;

    public SummaryController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<SummaryDto>> GetSummary()
    {
        // O resumo é calculado no backend para centralizar as regras de negócio e manter a resposta consistente.
        var people = await _context.People
            .Include(p => p.Transactions)
            .ToListAsync();

        var summaries = people.Select(person =>
        {
            var receitas = person.Transactions
                .Where(t => t.Type.Equals("Receita", StringComparison.OrdinalIgnoreCase))
                .Sum(t => t.Value);

            var despesas = person.Transactions
                .Where(t => t.Type.Equals("Despesa", StringComparison.OrdinalIgnoreCase))
                .Sum(t => t.Value);

            return new PersonSummaryDto
            {
                Name = person.Name,
                TotalReceitas = receitas,
                TotalDespesas = despesas,
                Saldo = receitas - despesas
            };
        }).ToList();

        var summary = new SummaryDto
        {
            Pessoas = summaries,
            TotalReceitas = summaries.Sum(s => s.TotalReceitas),
            TotalDespesas = summaries.Sum(s => s.TotalDespesas),
            SaldoGeral = summaries.Sum(s => s.Saldo)
        };

        return Ok(summary);
    }
}
