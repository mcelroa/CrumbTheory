using Microsoft.EntityFrameworkCore;

namespace CrumbTheoryAPI.Models;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    { 
    }

    public DbSet<BakeryItem> BakeryItems { get; set; }
    public DbSet<Order> Orders { get; set; }
    public DbSet<OrderItem> OrderItems { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // Store enum as text so the DB is readable
        modelBuilder.Entity<Order>()
            .Property(o => o.Status)
            .HasConversion<string>();

        // SQLite drops DateTimeKind, so mark it as UTC on the way out
        modelBuilder.Entity<Order>()
            .Property(o => o.CreatedAt)
            .HasConversion(v => v, v => DateTime.SpecifyKind(v, DateTimeKind.Utc));
    }
}
