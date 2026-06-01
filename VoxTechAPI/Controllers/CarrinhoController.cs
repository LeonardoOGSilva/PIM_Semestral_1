using Microsoft.AspNetCore.Mvc;
using VoxTechAPI.Data;
using VoxTechAPI.Models;

namespace VoxTechAPI.Controllers;

// Controlador de carrinho de compras responsável por expor
// endpoints para consultar, adicionar e remover itens do carrinho.
[ApiController]
[Route("api/[controller]")]
public class CarrinhoController : ControllerBase
{
    private readonly AppDbContext _context;

    public CarrinhoController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet("{usuarioId}")]
    // Retorna os itens do carrinho para o usuário especificado,
    // incluindo informações básicas do produto.
    public IActionResult GetCarrinho(int usuarioId)
    {
        var itens = from item in _context.CarrinhoItens
                    join produto in _context.Produtos
                    on item.ProdutoId equals produto.Id
                    where item.UsuarioId == usuarioId
                    select new
                    {
                        item.Id,
                        item.UsuarioId,
                        item.ProdutoId,
                        item.Quantidade,
                        produto.Nome,
                        produto.Preco,
                        produto.ImagemUrl
                    };

        return Ok(itens.ToList());
    }

    [HttpPost]
    // Adiciona um item ao carrinho ou atualiza a quantidade
    // caso o produto já esteja presente para o mesmo usuário.
    public IActionResult Adicionar(CarrinhoItem item)
    {
        var itemExistente = _context.CarrinhoItens.FirstOrDefault(c =>
            c.UsuarioId == item.UsuarioId &&
            c.ProdutoId == item.ProdutoId);

        if (itemExistente != null)
        {
            itemExistente.Quantidade += item.Quantidade;
        }
        else
        {
            _context.CarrinhoItens.Add(item);
        }

        _context.SaveChanges();

        return Ok(new { mensagem = "Produto adicionado ao carrinho." });
    }

    [HttpDelete("{id}")]
    // Remove um item específico do carrinho pelo seu identificador.
    public IActionResult Remover(int id)
    {
        var item = _context.CarrinhoItens.Find(id);

        if (item == null)
            return NotFound();

        _context.CarrinhoItens.Remove(item);
        _context.SaveChanges();

        return Ok(new { mensagem = "Item removido do carrinho." });
    }
}