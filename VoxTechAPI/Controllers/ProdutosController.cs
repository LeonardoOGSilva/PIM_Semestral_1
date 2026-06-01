using Microsoft.AspNetCore.Mvc;
using VoxTechAPI.Data;
using VoxTechAPI.Models;

namespace VoxTechAPI.Controllers;

// Controlador de produtos que expõe endpoints REST para listar,
// consultar e criar produtos no banco de dados.
[ApiController]
[Route("api/[controller]")]
public class ProdutosController : ControllerBase
{
    private readonly AppDbContext _context;

    public ProdutosController(AppDbContext context)
    {
        _context = context;
    }

    // GET: api/produtos
    // Retorna a lista completa de produtos cadastrados.
    [HttpGet]
    public IActionResult Get()
    {
        return Ok(_context.Produtos.ToList());
    }

    // GET: api/produtos/1
    // Busca um produto pelo identificador e retorna 404 se não existir.
    [HttpGet("{id}")]
    public IActionResult GetById(int id)
    {
        var produto = _context.Produtos.Find(id);

        if (produto == null)
            return NotFound();

        return Ok(produto);
    }

    // POST: api/produtos
    // Cria um novo produto no banco de dados e retorna o objeto criado.
    [HttpPost]
    public IActionResult Post(Produto produto)
    {
        _context.Produtos.Add(produto);

        _context.SaveChanges();

        return Ok(produto);
    }
}