using Microsoft.EntityFrameworkCore;
using persona_backend.Data;
using persona_backend.Data.Usuario;
using persona_backend.Logic;
using persona_backend.Middleware;

var builder = WebApplication.CreateBuilder(args);

// 🔹 1. Configuración de Logging
builder.Services.AddLogging(logging =>
{
    logging.ClearProviders();
    logging.AddConsole();
    logging.AddDebug();
    logging.SetMinimumLevel(LogLevel.Information);
});

// 🔹 2. Configuración de JWT
var jwtSecretKey = builder.Configuration["Jwt:SecretKey"] ??
    throw new InvalidOperationException("JWT Secret Key no está configurada");
builder.Services.AddSingleton<IJwtService, JwtService>(); ;

// 🔹 3. Configuración de Base de Datos
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddDbContext<AppDbUsuario>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// 🔹 4. Configuración de CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngularApp", policy =>
    {
        policy.WithOrigins("http://localhost:4200")
              .AllowAnyMethod()
              .AllowAnyHeader()
              .WithExposedHeaders("Authorization");
    });
});

// 🔹 5. Configuración de Servicios
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<ClienteService>();
builder.Services.AddControllers();

// 🔹 6. Configuración de Swagger (opcional pero útil para debugging)
builder.Services.AddEndpointsApiExplorer();

var app = builder.Build();

// 🔹 7. Configuración del Pipeline
if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
}

// Middleware de logging personalizado para debugging
app.Use(async (context, next) =>
{
    var logger = context.RequestServices.GetRequiredService<ILogger<Program>>();
    logger.LogInformation($"Request Path: {context.Request.Path}");
    logger.LogInformation($"Request Method: {context.Request.Method}");
    logger.LogInformation($"Request Headers: {string.Join(", ", context.Request.Headers.Select(h => $"{h.Key}: {h.Value}"))}");

    await next();
});

app.UseCors("AllowAngularApp");

// Middleware JWT con manejo de errores mejorado
app.UseMiddleware<TokenValidationMiddleware>(jwtSecretKey);

app.UseRouting();
app.UseAuthorization();
app.MapControllers();

// Log de inicio de la aplicación
var logger = app.Services.GetRequiredService<ILogger<Program>>();
logger.LogInformation("Aplicación iniciada correctamente");

app.Run();