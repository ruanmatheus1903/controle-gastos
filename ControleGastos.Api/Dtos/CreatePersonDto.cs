using System.ComponentModel.DataAnnotations;

namespace ControleGastos.Api.Dtos;

public class CreatePersonDto
{
    [Required(ErrorMessage = "O nome é obrigatório.")]
    [StringLength(100, ErrorMessage = "O nome deve ter no máximo 100 caracteres.")]
    public string Name { get; set; } = string.Empty;

    [Range(0, 150, ErrorMessage = "A idade deve estar entre 0 e 150 anos.")]
    public int Age { get; set; }
}
