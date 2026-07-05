using ControleGastos.Api.Data;
using ControleGastos.Api.Dtos;
using ControleGastos.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ControleGastos.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TransactionsController : ControllerBase
{
    private readonly AppDbContext _context;

    public TransactionsController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<TransactionDto>>> GetAll()
    {
        var transactions = await _context.Transactions
            .Include(t => t.Person)
            .OrderByDescending(t => t.Id)
            .Select(t => new TransactionDto
            {
                Id = t.Id,
                Description = t.Description,
                Value = t.Value,
                Type = t.Type,
                PersonId = t.PersonId,
                PersonName = t.Person != null ? t.Person.Name : string.Empty
            })
            .ToListAsync();

        return Ok(transactions);
    }

    [HttpPost]
    public async Task<ActionResult<TransactionDto>> Create([FromBody] CreateTransactionDto dto)
    {
        if (!ModelState.IsValid)
        {
            return ValidationProblem(ModelState);
        }

        var person = await _context.People.FindAsync(dto.PersonId);
        if (person == null)
        {
            // Regra de negócio: toda transação precisa estar vinculada a uma pessoa cadastrada.
            return BadRequest("A pessoa informada não existe.");
        }

        // Regra de negócio: menores de idade não podem cadastrar receitas.
        if (person.Age < 18 && dto.Type.Equals("Receita", StringComparison.OrdinalIgnoreCase))
        {
            return BadRequest("Menores de idade só podem cadastrar despesas.");
        }

        var transaction = new Transaction
        {
            Description = dto.Description.Trim(),
            Value = dto.Value,
            Type = dto.Type.Trim(),
            PersonId = dto.PersonId
        };

        _context.Transactions.Add(transaction);
        await _context.SaveChangesAsync();

        var response = new TransactionDto
        {
            Id = transaction.Id,
            Description = transaction.Description,
            Value = transaction.Value,
            Type = transaction.Type,
            PersonId = transaction.PersonId,
            PersonName = person.Name
        };

        return CreatedAtAction(nameof(GetAll), new { id = transaction.Id }, response);
    }
}
