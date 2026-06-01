using Microsoft.EntityFrameworkCore;
using VoxTechAPI.Models;

namespace VoxTechAPI.Data;

// Contexto principal do Entity Framework para a aplicação VoxTech.
// Registra os conjuntos de entidades usados pelos controladores e
// permite que o EF Core realize consultas e operações de persistência.
public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    {
    }

    // Conjunto de produtos disponíveis na loja
    public DbSet<Produto> Produtos { get; set; }

    // Conjunto de usuários registrados no sistema
    public DbSet<Usuario> Usuarios { get; set; }

    // Conjunto de itens adicionados ao carrinho pelos usuários
    public DbSet<CarrinhoItem> CarrinhoItens { get; set; }
}