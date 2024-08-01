using Microsoft.EntityFrameworkCore;
using Server.Models;
using Server.Database;

var builder = WebApplication.CreateBuilder(args);

var livresImagesPath = Path.Combine(AppContext.BaseDirectory, "..\\Client\\public\\assets\\Images\\Livres");
var fullImagesPath = Path.GetFullPath(livresImagesPath);

builder.Environment.WebRootPath = Path.GetFullPath("..\\Client\\public");

// Add services to the container.
builder.Services.AddControllers()
.AddJsonOptions(options =>
{
    options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.Preserve;
});

builder.Services.AddDistributedMemoryCache();

// Add Session
builder.Services.AddSession(options =>
{
    options.Cookie.Name = ".BiblioSession.Session";
    options.IdleTimeout = TimeSpan.FromMinutes(15);
    options.Cookie.HttpOnly = true;
    options.Cookie.IsEssential = true;
});

// Add Database Context
builder.Services.AddDbContext<DataContext>(options =>
{
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection"));
});

// Add CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAny", 
        policy =>
    {
        policy.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod();
    });
});

builder.WebHost.ConfigureKestrel(options =>
{
    options.ListenAnyIP(5263); // HTTP
    options.ListenAnyIP(7153, listenOptions =>
    {
        listenOptions.UseHttps(); // Use the development certificate
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/error");
    app.UseHsts();
}

app.UseHttpsRedirection();

// Enable CORS
app.UseCors("AllowAny");

app.UseAuthentication();
app.UseAuthorization();

app.UseSession();

app.MapControllers();

app.Run();
