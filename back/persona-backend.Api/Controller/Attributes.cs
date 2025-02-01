using System;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;

namespace persona_backend.Middleware
{
    public class TokenValidationMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<TokenValidationMiddleware> _logger;
        private readonly string _secretKey;

        public TokenValidationMiddleware(RequestDelegate next, ILogger<TokenValidationMiddleware> logger, string secretKey)
        {
            _next = next;
            _logger = logger;
            _secretKey = secretKey ?? throw new ArgumentNullException(nameof(secretKey));

            // Log the initialization
            _logger.LogInformation("TokenValidationMiddleware initialized with key length: {Length}",
                secretKey?.Length ?? 0);
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                _logger.LogInformation("Starting token validation for path: {Path}",
                    context.Request.Path);

                // Verificar si es una ruta pública
                if (IsPublicPath(context.Request.Path))
                {
                    await _next(context);
                    return;
                }

                // Obtener el token del header
                var authHeader = context.Request.Headers["Authorization"].ToString();
                _logger.LogInformation("Authorization header: {Header}", authHeader);

                if (string.IsNullOrEmpty(authHeader))
                {
                    throw new SecurityTokenException("No Authorization header present");
                }

                var token = authHeader.Replace("Bearer ", "", StringComparison.OrdinalIgnoreCase);
                _logger.LogInformation("Extracted token: {Token}", token);

                if (string.IsNullOrEmpty(token))
                {
                    throw new SecurityTokenException("Token is empty after Bearer prefix removal");
                }

                // Validar el token
                var tokenHandler = new JwtSecurityTokenHandler();
                var key = Encoding.ASCII.GetBytes(_secretKey);

                _logger.LogInformation("Attempting to validate token with key length: {Length}",
                    key.Length);

                var validationParameters = new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(key),
                    ValidateIssuer = false,  
                    ValidateAudience = false, 
                    ValidateLifetime = true,
                    ClockSkew = TimeSpan.Zero
                };

                // Intenta leer el token primero
                if (!tokenHandler.CanReadToken(token))
                {
                    _logger.LogError("Token cannot be read as JWT: {Token}", token);
                    throw new SecurityTokenException("Token format is invalid");
                }

                var principal = tokenHandler.ValidateToken(token, validationParameters, out var validatedToken);

                // Log successful validation
                _logger.LogInformation("Token validated successfully");

                context.User = principal;
                await _next(context);
            }
            catch (SecurityTokenExpiredException ex)
            {
                _logger.LogWarning(ex, "Token expired");
                await HandleError(context, StatusCodes.Status401Unauthorized, "Token expirado");
            }
            catch (SecurityTokenInvalidSignatureException ex)
            {
                _logger.LogWarning(ex, "Invalid token signature");
                await HandleError(context, StatusCodes.Status401Unauthorized, "Firma del token inválida");
            }
            catch (SecurityTokenException ex)
            {
                _logger.LogError(ex, "Security token exception");
                await HandleError(context, StatusCodes.Status401Unauthorized, $"Error de token: {ex.Message}");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unexpected error during token validation");
                await HandleError(context, StatusCodes.Status500InternalServerError,
                    $"Error interno: {ex.Message}");
            }
        }

        private bool IsPublicPath(PathString path)
        {
            var publicPaths = new[] { "/api/auth/login", "/api/auth/gettoken" };
            return publicPaths.Any(p => path.Equals(p, StringComparison.OrdinalIgnoreCase));
        }

        private async Task HandleError(HttpContext context, int statusCode, string message)
        {
            context.Response.StatusCode = statusCode;
            context.Response.ContentType = "application/json";
            await context.Response.WriteAsJsonAsync(new
            {
                message = message,
                timestamp = DateTime.UtcNow
            });
        }
    }
}