namespace VoxTechAPI.Models;

public class Administrador : Usuario
{
    public string NivelAcesso { get; set; } = string.Empty;
}