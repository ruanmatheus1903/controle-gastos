using System.ComponentModel.DataAnnotations;

namespace ControleGastos.Api.Dtos;

public class CreateTransactionDto
{
    [Required(ErrorMessage = "A descrição é obrigatória.")]
    [StringLength(200, ErrorMessage = "A descrição deve ter no máximo 200 caracteres.")]
    public string Description { get; set; } = string.Empty;

    [Range(0.01, double.MaxValue, ErrorMessage = "O valor deve ser maior que zero.")]
    public decimal Value { get; set; }

    [Required(ErrorMessage = "O tipo é obrigatório.")]
    [RegularExpression("Receita|Despesa", ErrorMessage = "O tipo deve ser Receita ou Despesa.")]
    public string Type { get; set; } = string.Empty;

    [Range(1, int.MaxValue, ErrorMessage = "O PersonId informado é inválido.")]
    public int PersonId { get; set; }
}
