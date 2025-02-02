using System.ComponentModel.DataAnnotations;
using System.Numerics;
using Microsoft.EntityFrameworkCore;

namespace persona_backend.Data;

public class Clientes
{
    public int Id { get; set; }
    public string NombreCompleto { get; set; }
    [Required(ErrorMessage = "El CUIT es requerido.")]
    [MaxLength(20, ErrorMessage = "El CUIT no puede exceder los {1} caracteres.")]
    public string Cuil { get; set; }
    public int Edad { get; set; }
    public string Genero { get; set; }
    public string Estado { get; set; }
    public string AtributosAdicionales { get; set; }
    public bool Maneja { get; set; }
    public bool UsaLentes { get; set; }
    public bool Diabetico { get; set; }
    public string EnfermedadesAdicionales { get; set; }
}


public class AppDbContext : DbContext
{
    public DbSet<Clientes> Clientes { get; set; }

    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }
}