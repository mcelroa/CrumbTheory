using Microsoft.EntityFrameworkCore;

namespace CrumbTheoryAPI.Models;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    { 
    }

    public DbSet<BakeryItem> BakeryItems { get; set; }
}
