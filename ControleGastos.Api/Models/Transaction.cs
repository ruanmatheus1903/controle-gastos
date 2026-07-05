namespace ControleGastos.Api.Models;

public class Transaction
{
    // Identificador único da transação.
    public int Id { get; set; }

    // Descrição da transação cadastrada.

    public string Description { get; set; } = string.Empty;

    // Valor monetário da transação.
    public decimal Value { get; set; }

    // Tipo da transação: Receita ou Despesa.
    public string Type { get; set; } = string.Empty;

    // Chave estrangeira para associar a transação à pessoa.
    public int PersonId { get; set; }

    // Navegação para a pessoa relacionada.
    public Person? Person { get; set; }
}