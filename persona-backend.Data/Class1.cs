using Microsoft.EntityFrameworkCore;

namespace persona_backend.Data;

public class Cliente
{
    public int Id { get; set; } // Identificador único para cada cliente
    public string NombreCompleto { get; set; }
    public string Identificacion { get; set; }
    public int Edad { get; set; }
    public string Genero { get; set; }
    public string Estado { get; set; } // 'Activo' o 'No activo'
    public string AtributosAdicionales { get; set; }
    public bool Maneja { get; set; }
    public bool UsaLentes { get; set; }
    public bool Diabetico { get; set; }
    public string EnfermedadesAdicionales { get; set; }
}


public class AppDbContext : DbContext
{
    public DbSet<Cliente> Clientes { get; set; }

    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }
}