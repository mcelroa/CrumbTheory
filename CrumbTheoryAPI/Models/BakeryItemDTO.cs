namespace CrumbTheoryAPI.Models;

public class BakeryItemDTO
{
    public string Id { get; set; } = Guid.NewGuid().ToString();
    public required string Name { get; set; }
    public decimal Price { get; set; }
}
