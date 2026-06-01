using Microsoft.AspNetCore.Mvc;
using VoxTechAPI.Data;
using VoxTechAPI.Models;

namespace VoxTechAPI.Controllers;

// Controlador de usuários que fornece endpoints para listar,
// cadastrar e autenticar usuários.
[ApiController]
[Route("api/[controller]")]
public class UsuariosController : ControllerBase
{
    private readonly AppDbContext _context;

    public UsuariosController(AppDbContext context)
    {
        _context = context;
    }

    // GET: api/Usuarios
    // Retorna todos os usuários cadastrados no sistema.
    [HttpGet]
    public IActionResult Get()
    {
        var usuarios = _context.Usuarios.ToList();

        return Ok(usuarios);
    }

    // POST: api/Usuarios
    // Cria um novo usuário e salva no banco de dados.
    [HttpPost]
    public IActionResult Post(Usuario usuario)
    {
        _context.Usuarios.Add(usuario);

        _context.SaveChanges();

        return Ok(usuario);
    }

    // POST: api/Usuarios/login
    // Autentica o usuário usando email e senha, retornando 401 em caso de falha.
    [HttpPost("login")]
    public IActionResult Login([FromBody] LoginRequest login)
    {
        var usuario = _context.Usuarios.FirstOrDefault(u =>
            u.Email == login.Email &&
            u.Senha == login.Senha);

        if (usuario == null)
        {
            return Unauthorized(new
            {
                mensagem = "Email ou senha inválidos"
            });
        }

        return Ok(new
        {
            mensagem = "Login realizado com sucesso",
            usuario
        });
    }
}

public class LoginRequest
{
    public string Email { get; set; } = string.Empty;

    public string Senha { get; set; } = string.Empty;
}