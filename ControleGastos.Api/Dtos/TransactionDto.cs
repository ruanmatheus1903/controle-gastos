namespace ControleGastos.Api.Dtos;

public class TransactionDto
{
    public int Id { get; set; }

    public string Description { get; set; } = string.Empty;

    public decimal Value { get; set; }

    public string Type { get; set; } = string.Empty;

    public int PersonId { get; set; }

    public string PersonName { get; set; } = string.Empty;
}
