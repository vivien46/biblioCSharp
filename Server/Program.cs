using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.EntityFrameworkCore;
using Server.Database;

var builder = WebApplication.CreateBuilder(args);

// Connexion DB - valeur dans les variables d'environnement Azure en prod
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

builder.Services.AddDbContext<DataContext>(options =>
{
    options.UseNpgsql(connectionString);
});

// Services
builder.Services.AddControllers().AddJsonOptions(options =>
{
    options.JsonSerializerOptions.ReferenceHandler =
        System.Text.Json.Serialization.ReferenceHandler.Preserve;
});

// Authentification par cookie (HttpOnly) : le front ne peut plus fabriquer son rôle
builder.Services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
    .AddCookie(options =>
    {
        options.Cookie.Name = ".BiblioAuth";
        options.Cookie.HttpOnly = true;
        // Front (Vercel) et API sont sur des domaines différents : cookie cross-site
        options.Cookie.SameSite = SameSiteMode.None;
        options.Cookie.SecurePolicy = CookieSecurePolicy.Always;
        options.ExpireTimeSpan = TimeSpan.FromMinutes(15);
        options.SlidingExpiration = true;
        // API : 401 / 403 au lieu d'une redirection vers une page de login
        options.Events.OnRedirectToLogin = ctx =>
        {
            ctx.Response.StatusCode = StatusCodes.Status401Unauthorized;
            return Task.CompletedTask;
        };
        options.Events.OnRedirectToAccessDenied = ctx =>
        {
            ctx.Response.StatusCode = StatusCodes.Status403Forbidden;
            return Task.CompletedTask;
        };
    });

builder.Services.AddAuthorization();

// Origines autorisées : CORS et contrôle CSRF utilisent la même liste
var allowedOrigins = new[]
{
    "https://mokarube46-biblio.vercel.app",
    "http://localhost:5173",
    "http://localhost:3000"
};

// CORS - autorise Vercel + local
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.WithOrigins(allowedOrigins)
        .AllowAnyMethod()
        .AllowAnyHeader()
        .AllowCredentials();
    });
});

var app = builder.Build();

if (!app.Environment.IsDevelopment())
{
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseCors("AllowAll");

// Protection CSRF : le cookie d'auth part aussi avec les requêtes cross-site (SameSite=None).
// Une requête qui modifie des données, authentifiée par cookie, doit venir d'une origine autorisée.
// Un navigateur envoie toujours l'en-tête Origin sur ce type de requête cross-origin.
app.Use(async (context, next) =>
{
    var method = context.Request.Method;
    var isSafeMethod = HttpMethods.IsGet(method) || HttpMethods.IsHead(method) || HttpMethods.IsOptions(method);
    var hasAuthCookie = context.Request.Cookies.ContainsKey(".BiblioAuth");
    var origin = context.Request.Headers["Origin"].ToString();

    if (!isSafeMethod && hasAuthCookie && origin != "" && !allowedOrigins.Contains(origin))
    {
        context.Response.StatusCode = StatusCodes.Status403Forbidden;
        await context.Response.WriteAsync("Origine non autorisée");
        return;
    }

    await next();
});

app.UseAuthentication();
app.UseAuthorization();

app.MapGet("/health", () => Results.Ok("healthy"));

app.MapControllers();
app.Run();