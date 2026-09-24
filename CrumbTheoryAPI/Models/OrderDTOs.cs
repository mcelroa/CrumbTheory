using System.ComponentModel.DataAnnotations;

namespace CrumbTheoryAPI.Models;

public class CreateOrderItemRequest
{
    [Required]
    public required string BakeryItemId { get; set; }

    [Range(1, 50)]
    public int Quantity { get; set; }
}

public class CreateOrderRequest
{
    [Required, MaxLength(100)]
    public required string CustomerName { get; set; }

    [Required, EmailAddress, MaxLength(200)]
    public required string Email { get; set; }

    [Required, Phone, MaxLength(30)]
    public required string Phone { get; set; }

    public DateOnly PickupDate { get; set; }

    [MaxLength(1000)]
    public string? Notes { get; set; }

    [Required, MinLength(1)]
    public required List<CreateOrderItemRequest> Items { get; set; }
}

public class OrderItemDTO
{
    public required string BakeryItemId { get; set; }
    public required string ItemName { get; set; }
    public decimal UnitPrice { get; set; }
    public int Quantity { get; set; }
}

public class OrderDTO
{
    public required string Id { get; set; }
    public required string CustomerName { get; set; }
    public required string Email { get; set; }
    public required string Phone { get; set; }
    public DateOnly PickupDate { get; set; }
    public string? Notes { get; set; }
    public OrderStatus Status { get; set; }
    public DateTime CreatedAt { get; set; }
    public decimal Total { get; set; }
    public required List<OrderItemDTO> Items { get; set; }
}

public class UpdateOrderStatusRequest
{
    [Required]
    public OrderStatus? Status { get; set; }
}
