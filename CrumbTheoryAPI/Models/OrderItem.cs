namespace CrumbTheoryAPI.Models;

public class OrderItem
{
    public string Id { get; set; } = Guid.NewGuid().ToString();
    public string OrderId { get; set; } = null!;
    public required string BakeryItemId { get; set; }

    // Name and price are copied at order time so later product edits don't change past orders
    public required string ItemName { get; set; }
    public decimal UnitPrice { get; set; }
    public int Quantity { get; set; }
}
