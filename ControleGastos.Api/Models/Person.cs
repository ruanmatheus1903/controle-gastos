namespace ControleGastos.Api.Models;

public class Person
{
    // Identificador único da pessoa.
    public int Id { get; set; }

    // Nome da pessoa cadastrada.

    public string Name { get; set; } = string.Empty;

    // Idade da pessoa, usada para validar regras de negócio.
    public int Age { get; set; }

    // Lista de transações vinculadas à pessoa.
    public List<Transaction> Transactions { get; set; } = new();
}