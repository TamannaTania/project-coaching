using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using ProjectCoachingAPI.Data;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Search for the actual wwwroot folder across common development and production locations
string currentDir = Directory.GetCurrentDirectory();
string baseDir = AppContext.BaseDirectory;
string defaultContentRoot = builder.Environment.ContentRootPath;

string[] candidateRoots = new[]
{
    Path.Combine(defaultContentRoot, "wwwroot"),
    Path.Combine(currentDir, "wwwroot"),
    Path.Combine(baseDir, "wwwroot"),
    defaultContentRoot,
    currentDir,
    baseDir
};

string resolvedWebRoot = candidateRoots.FirstOrDefault(p => Directory.Exists(p) && File.Exists(Path.Combine(p, "index.html")))
    ?? Path.Combine(defaultContentRoot, "wwwroot");

if (Directory.Exists(resolvedWebRoot))
{
    builder.Environment.WebRootPath = resolvedWebRoot;
    builder.Environment.WebRootFileProvider = new Microsoft.Extensions.FileProviders.PhysicalFileProvider(resolvedWebRoot);
}

// Add Database Context
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Add services for Controllers
builder.Services.AddControllers();

// Add CORS to allow requests from our HTML files
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// Add JWT Authentication
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]!))
        };
    });

builder.Services.AddOpenApi();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

var defaultFileOptions = new DefaultFilesOptions();
defaultFileOptions.DefaultFileNames.Clear();
defaultFileOptions.DefaultFileNames.Add("index.html");
app.UseDefaultFiles(defaultFileOptions);

app.UseStaticFiles();

// In case static files are also in other directories
foreach (var dir in new[] { resolvedWebRoot, baseDir, currentDir, defaultContentRoot }.Distinct())
{
    if (Directory.Exists(dir) && dir != resolvedWebRoot)
    {
        try
        {
            app.UseStaticFiles(new StaticFileOptions
            {
                FileProvider = new Microsoft.Extensions.FileProviders.PhysicalFileProvider(dir),
                RequestPath = ""
            });
        }
        catch { }
    }
}

app.UseCors("AllowAll");

// Use Authentication before Authorization
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

// Explicit handler for root / and /index.html
app.MapGet("/", async context =>
{
    string indexPath = Path.Combine(resolvedWebRoot, "index.html");
    if (!File.Exists(indexPath)) indexPath = Path.Combine(baseDir, "index.html");
    if (!File.Exists(indexPath)) indexPath = Path.Combine(currentDir, "index.html");
    if (!File.Exists(indexPath)) indexPath = Path.Combine(defaultContentRoot, "index.html");

    if (File.Exists(indexPath))
    {
        context.Response.ContentType = "text/html; charset=utf-8";
        await context.Response.SendFileAsync(indexPath);
    }
    else
    {
        context.Response.StatusCode = 404;
        await context.Response.WriteAsync("PhysicsClassroom: index.html not found.");
    }
});

app.MapGet("/index.html", async context =>
{
    string indexPath = Path.Combine(resolvedWebRoot, "index.html");
    if (!File.Exists(indexPath)) indexPath = Path.Combine(baseDir, "index.html");
    if (!File.Exists(indexPath)) indexPath = Path.Combine(currentDir, "index.html");
    if (!File.Exists(indexPath)) indexPath = Path.Combine(defaultContentRoot, "index.html");

    if (File.Exists(indexPath))
    {
        context.Response.ContentType = "text/html; charset=utf-8";
        await context.Response.SendFileAsync(indexPath);
    }
});

// Fallback to index.html for root or SPA paths
app.MapFallbackToFile("index.html");

app.Run();
