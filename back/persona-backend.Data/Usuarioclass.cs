using Microsoft.EntityFrameworkCore;

namespace persona_backend.Data.Usuario;


public class Usuario
{
    public int ID { get; set; }
    public string NombreUsuario { get; set; }
    public byte[] Contraseña { get; set; }
    public string Gmail { get; set; }
}

public class AppDbUsuario : DbContext
{
    public DbSet<Usuario> Usuario { get; set; }

    public AppDbUsuario(DbContextOptions<AppDbUsuario> options) : base(options) { }
}

public class LoginRequest
{
    public string Username { get; set; }
    public string Password { get; set; }
}

