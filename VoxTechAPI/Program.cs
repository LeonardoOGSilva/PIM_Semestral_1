using Microsoft.EntityFrameworkCore;
using VoxTechAPI.Data;

// Configuração de inicialização do aplicativo Web API.
var builder = WebApplication.CreateBuilder(args);

// Registra os controladores do ASP.NET Core MVC
builder.Services.AddControllers();

// Configuração do Swagger para documentação e testes da API
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Configuração de CORS aberta para permitir requisições de qualquer origem
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll",
        policy =>
        {
            policy.AllowAnyOrigin()
                  .AllowAnyMethod()
                  .AllowAnyHeader();
        });
});

// Configuração do Entity Framework Core com SQL Server
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("DefaultConnection")));

var app = builder.Build();

// Ativa middleware do Swagger em desenvolvimento e produção
app.UseSwagger();
app.UseSwaggerUI();

// HTTPS redirection está disponível, mas permanece comentada por enquanto
// app.UseHttpsRedirection();

// Aplica a política de CORS configurada anteriormente
app.UseCors("AllowAll");

// Habilita autorização para endpoints que a exigem
app.UseAuthorization();

// Mapeia os controladores para as rotas HTTP
app.MapControllers();

// Executa a aplicação
app.Run();