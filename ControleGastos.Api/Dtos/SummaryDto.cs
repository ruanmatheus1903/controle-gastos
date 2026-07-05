namespace ControleGastos.Api.Dtos;

public class PersonSummaryDto
{
    public string Name { get; set; } = string.Empty;

    public decimal TotalReceitas { get; set; }

    public decimal TotalDespesas { get; set; }

    public decimal Saldo { get; set; }
}

public class SummaryDto
{
    public List<PersonSummaryDto> Pessoas { get; set; } = new();

    public decimal TotalReceitas { get; set; }

    public decimal TotalDespesas { get; set; }

    public decimal SaldoGeral { get; set; }
}
