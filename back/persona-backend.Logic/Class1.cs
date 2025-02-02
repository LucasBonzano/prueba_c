

using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using persona_backend.Data;
using persona_backend.Data.Usuario;

namespace persona_backend.Logic
{
    public class ClienteService
    {
        private readonly AppDbContext _context;

        public ClienteService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<Clientes>> GetClientes()
        {
            return await _context.Clientes.ToListAsync();
        }

        public async Task<Clientes?> GetCliente(int id)
        {
            return await _context.Clientes.FindAsync(id);
        }

        public async Task<Clientes> CreateCliente(Clientes cliente)
        {
            _context.Clientes.Add(cliente);
            await _context.SaveChangesAsync();
            return cliente;
        }

        public async Task<bool> UpdateCliente(int id, Clientes cliente)
        {
            if (id != cliente.Id)
            {
                return false;
            }

            _context.Entry(cliente).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteCliente(int id)
        {
            var cliente = await _context.Clientes.FindAsync(id);
            if (cliente == null)
            {
                return false;
            }

            _context.Clientes.Remove(cliente);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}

public interface IJwtService
{
    string GenerateToken(string username);
    bool ValidateToken(string token);
}

public class JwtService : IJwtService
{
    private readonly string _secretKey;
    private readonly string _issuer;
    private readonly string _audience;
    private readonly int _expiryInMinutes;

    public JwtService(IConfiguration configuration)
    {
        _secretKey = configuration["Jwt:SecretKey"] ??
            throw new ArgumentNullException(nameof(_secretKey));
        _issuer = configuration["Jwt:Issuer"] ?? "DefaultIssuer";
        _audience = configuration["Jwt:Audience"] ?? "DefaultAudience";

        if (int.TryParse(configuration["Jwt:ExpiryInMinutes"], out int expiryMinutes))
        {
            _expiryInMinutes = expiryMinutes;
        }
        else
        {
            _expiryInMinutes = 60;
        }
    }

    public string GenerateToken(string username)
    {
        var tokenHandler = new JwtSecurityTokenHandler();
        var key = Encoding.ASCII.GetBytes(_secretKey);

        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(new[]
            {
                    new Claim(ClaimTypes.Name, username)
                }),
            Expires = DateTime.UtcNow.AddMinutes(_expiryInMinutes),
            Issuer = _issuer,
            Audience = _audience,
            SigningCredentials = new SigningCredentials(
                new SymmetricSecurityKey(key),
                SecurityAlgorithms.HmacSha256Signature)
        };

        var token = tokenHandler.CreateToken(tokenDescriptor);
        return tokenHandler.WriteToken(token);
    }

    public bool ValidateToken(string token)
    {
        if (string.IsNullOrEmpty(token))
            return false;

        var tokenHandler = new JwtSecurityTokenHandler();
        var key = Encoding.ASCII.GetBytes(_secretKey);

        try
        {
            tokenHandler.ValidateToken(token, new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(key),
                ValidateIssuer = !string.IsNullOrEmpty(_issuer),
                ValidIssuer = _issuer,
                ValidateAudience = !string.IsNullOrEmpty(_audience),
                ValidAudience = _audience,
                ValidateLifetime = true,
                ClockSkew = TimeSpan.Zero
            }, out SecurityToken validatedToken);

            return true;
        }
        catch
        {
            return false;
        }
    }
}
public interface IAuthService
{
    object ProcessLogin(LoginRequest request);
}

public class AuthService : IAuthService
{
    private readonly AppDbUsuario _context;
    private readonly IJwtService _jwtService;

    public AuthService(AppDbUsuario context, IJwtService jwtService)
    {
        _context = context;
        _jwtService = jwtService;
    }

    public object ProcessLogin(LoginRequest request)
    {
        // 1. Buscar al usuario por nombre de usuario
        var user = _context.Usuario.FirstOrDefault(u => u.NombreUsuario == request.Username);
        if (user == null) return null;

        // 2. Generar el token JWT antes de verificar la contraseña
        string token = _jwtService.GenerateToken(user.NombreUsuario);

        // 3. Hashear la contraseña proporcionada y compararla con la almacenada
        byte[] hashedInputPassword = HashPassword(request.Password);
        if (!hashedInputPassword.SequenceEqual(user.Contraseña)) return null;

        // 4. Si todo es correcto, devolver el token y el usuario
        return new { Token = token, User = user.NombreUsuario };
    }

    private byte[] HashPassword(string password)
    {
        using (var sha256 = SHA256.Create())
        {
            return sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
        }
    }
}




