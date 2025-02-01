using Microsoft.EntityFrameworkCore;

namespace persona_backend.Data.Usuario;


public class Usuario
{
    public int ID { get; set; }  // ID del usuario
    public string NombreUsuario { get; set; }  // Nombre de usuario
    public byte[] Contraseña { get; set; }  // Contraseña hasheada
    public string Gmail { get; set; }   // Correo electrónico
}

public class AppDbUsuario : DbContext
{
    public DbSet<Usuario> Usuario { get; set; } // Asegúrate de que la propiedad sea 'Usuarios'

    public AppDbUsuario(DbContextOptions<AppDbUsuario> options) : base(options) { }
}

public class LoginRequest
{
    public string Username { get; set; }
    public string Password { get; set; }
}

