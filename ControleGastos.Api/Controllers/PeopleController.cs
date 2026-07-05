using ControleGastos.Api.Data;
using ControleGastos.Api.Dtos;
using ControleGastos.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ControleGastos.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
// Controlador responsável por cadastrar, listar e remover pessoas da aplicação.
public class PeopleController : ControllerBase
{
    private readonly AppDbContext _context;

    public PeopleController(AppDbContext context)
    {
        _context = context;
    }

    // Retorna todas as pessoas cadastradas em ordem alfabética.
    [HttpGet]
    public async Task<ActionResult<IEnumerable<PersonDto>>> GetAll()
    {
        var people = await _context.People
            .OrderBy(p => p.Name)
            .Select(p => new PersonDto
            {
                Id = p.Id,
                Name = p.Name,
                Age = p.Age
            })
            .ToListAsync();

        return Ok(people);
    }

    // Busca uma pessoa específica pelo identificador.
    [HttpGet("{id}")]
    public async Task<ActionResult<PersonDto>> GetById(int id)
    {
        var person = await _context.People.FindAsync(id);
        if (person == null)
        {
            return NotFound();
        }

        return Ok(new PersonDto
        {
            Id = person.Id,
            Name = person.Name,
            Age = person.Age
        });
    }

    // Cria uma nova pessoa no cadastro.
    [HttpPost]
    public async Task<ActionResult<PersonDto>> Create([FromBody] CreatePersonDto dto)
    {
        if (!ModelState.IsValid)
        {
            return ValidationProblem(ModelState);
        }

        var person = new Person
        {
            Name = dto.Name.Trim(),
            Age = dto.Age
        };

        _context.People.Add(person);
        await _context.SaveChangesAsync();

        var response = new PersonDto
        {
            Id = person.Id,
            Name = person.Name,
            Age = person.Age
        };

        return CreatedAtAction(nameof(GetById), new { id = person.Id }, response);
    }

    // Remove uma pessoa do sistema.
    [HttpDelete("{id}")]
    public async Task<ActionResult> Delete(int id)
    {
        var person = await _context.People.FindAsync(id);

        if (person == null)
        {
            return NotFound();
        }

        // Regra de negócio: ao excluir uma pessoa, todas as transações vinculadas devem ser removidas automaticamente.
        _context.People.Remove(person);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}