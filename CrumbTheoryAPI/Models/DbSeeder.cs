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
            new() {Name = "Red Velvet Cupcake", Price = 4.50m, Description = "Soft cocoa sponge topped with cream cheese frosting."},
            new() {Name = "Croissant", Price = 3.50m, Description = "Flaky, buttery layers, baked fresh in the morning."},
            new() {Name = "Sticky Toffee Pudding Cake", Price = 10.50m, Description = "Rich date sponge soaked in homemade toffee sauce."},
            new() {Name = "Plain Scone", Price = 2.50m, Description = "A classic scone, perfect with jam and clotted cream."},
            new() {Name = "Red Velvet Cake", Price = 9.50m, Description = "A full red velvet layer cake with cream cheese frosting."},
        };

        await context.BakeryItems.AddRangeAsync(items);
        await context.SaveChangesAsync();
    }
}
