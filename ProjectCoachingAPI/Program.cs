using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using ProjectCoachingAPI.Data;
using System.Text;

var contentRoot = AppContext.BaseDirectory;
var wwwrootCandidate = System.IO.Path.Combine(contentRoot, "wwwroot");
var webRoot = System.IO.Directory.Exists(wwwrootCandidate) ? wwwrootCandidate : contentRoot;

var webAppOptions = new WebApplicationOptions
{
    Args = args,
    ContentRootPath = contentRoot,
    WebRootPath = webRoot
};
var builder = WebApplication.CreateBuilder(webAppOptions);

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

// Support static files placed directly in application root as well as wwwroot
try
{
    app.UseStaticFiles(new StaticFileOptions
    {
        FileProvider = new Microsoft.Extensions.FileProviders.PhysicalFileProvider(contentRoot),
        RequestPath = ""
    });
}
catch { }

app.UseCors("AllowAll");
// Do not redirect to HTTPS locally so API calls on http://localhost:3340 work seamlessly
// and avoid stripping Authorization headers in browser fetches

// Use Authentication before Authorization
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

// Explicit handler for root / and /index.html
app.MapGet("/", async context =>
{
    string indexPath = System.IO.Path.Combine(webRoot, "index.html");
    if (!System.IO.File.Exists(indexPath)) indexPath = System.IO.Path.Combine(contentRoot, "index.html");
    if (System.IO.File.Exists(indexPath))
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
    string indexPath = System.IO.Path.Combine(webRoot, "index.html");
    if (!System.IO.File.Exists(indexPath)) indexPath = System.IO.Path.Combine(contentRoot, "index.html");
    if (System.IO.File.Exists(indexPath))
    {
        context.Response.ContentType = "text/html; charset=utf-8";
        await context.Response.SendFileAsync(indexPath);
    }
});

// Fallback to index.html for root or SPA paths
app.MapFallbackToFile("index.html");

app.Run();
