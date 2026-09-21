using Microsoft.EntityFrameworkCore;

namespace CrumbTheoryAPI.Models;

public class DbSeeder
{
    public static async Task SeedAsync(AppDbContext context)
    {
        if (await context.BakeryItems.AnyAsync())
        {
            return;
        }

        var items = new List<BakeryItem>
        {
            new() {Name = "Red Velvet Cupcake", Price = 4.50m},
            new() {Name = "Crossaint", Price = 3.50m},
            new() {Name = "Sticky Toffee Pudding Cake", Price = 10.50m},
            new() {Name = "Plain Scone", Price = 2.50m},
            new() {Name = "Red Velvet Cake", Price = 9.50m},
        };

        await context.BakeryItems.AddRangeAsync(items);
        await context.SaveChangesAsync();
    }
}
