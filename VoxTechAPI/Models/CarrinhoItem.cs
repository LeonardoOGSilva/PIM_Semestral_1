namespace VoxTechAPI.Models;

public class CarrinhoItem
{
    public int Id { get; set; }

    public int UsuarioId { get; set; }

    public int ProdutoId { get; set; }

    public int Quantidade { get; set; } = 1;
}