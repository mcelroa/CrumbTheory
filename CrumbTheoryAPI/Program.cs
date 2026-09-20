using CrumbTheoryAPI.Models;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);
var connectionString = builder.Configuration.GetConnectionString("CrumbTheoryContext") ?? throw new InvalidOperationException("Connection string 'CrumbTheoryContext' not found.");

// Add services to the container.

builder.Services.AddControllers();
builder.Services.AddOpenApi();
builder.Services.AddDbContext<CrumbTheoryContext>(opt =>
    opt.UseInMemoryDatabase("CrumbTheory"));

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
