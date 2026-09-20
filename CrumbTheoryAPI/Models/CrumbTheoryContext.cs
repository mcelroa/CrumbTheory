using Microsoft.EntityFrameworkCore;

namespace CrumbTheoryAPI.Models;

public class CrumbTheoryContext : DbContext
{
    public CrumbTheoryContext(DbContextOptions<CrumbTheoryContext> options)
        : base(options)
    { 
    }

    public DbSet<BakeryItem> BakeryItems { get; set; }
}
