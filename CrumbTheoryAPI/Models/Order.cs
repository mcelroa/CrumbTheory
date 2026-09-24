namespace CrumbTheoryAPI.Models;

public enum OrderStatus
{
    Pending,
    Confirmed,
    Ready,
    Collected,
    Cancelled,
}

public class Order
{
    public string Id { get; set; } = Guid.NewGuid().ToString();
    public required string CustomerName { get; set; }
    public required string Email { get; set; }
    public required string Phone { get; set; }
    public DateOnly PickupDate { get; set; }
    public string? Notes { get; set; }
    public OrderStatus Status { get; set; } = OrderStatus.Pending;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public decimal Total { get; set; }
    public List<OrderItem> Items { get; set; } = [];
}
