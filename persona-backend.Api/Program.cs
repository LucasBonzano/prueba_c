using Microsoft.EntityFrameworkCore;
using persona_backend.Data;

var builder = WebApplication.CreateBuilder(args);

// Registra los servicios necesarios (DbContext, etc.)
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Agrega los controladores
builder.Services.AddControllers();

var app = builder.Build();

// Configura el pipeline de la aplicación
app.MapControllers(); // Asegura que los controladores se registren

app.Run();
