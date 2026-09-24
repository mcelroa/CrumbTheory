namespace CrumbTheoryAPI.Models;

public class BakeryItem
{
    public string Id { get; set; } = Guid.NewGuid().ToString();
    public required string Name { get; set; }
    public decimal Price { get; set; }
    public string? Description { get; set; }
    public string? ImageUrl { get; set; }
    public bool IsAvailable { get; set; } = true;
}
