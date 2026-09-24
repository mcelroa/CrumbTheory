using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CrumbTheoryAPI.Models;

namespace CrumbTheoryAPI.Controllers;

[Route("api/[controller]")]
[ApiController]
public class OrdersController : ControllerBase
{
    private readonly AppDbContext _context;
    public OrdersController(AppDbContext context)
    {
        _context = context;
    }

    // POST: api/Orders
    // Public: customers place an order request, paid on collection
    [HttpPost]
    public async Task<ActionResult<OrderDTO>> PostOrder(CreateOrderRequest request)
    {
        var tomorrow = DateOnly.FromDateTime(DateTime.Now).AddDays(1);
        if (request.PickupDate < tomorrow)
        {
            ModelState.AddModelError(nameof(request.PickupDate), "Pickup date must be tomorrow or later.");
        }

        var itemIds = request.Items.Select(i => i.BakeryItemId).Distinct().ToList();
        var products = await _context.BakeryItems
            .Where(b => itemIds.Contains(b.Id))
            .ToDictionaryAsync(b => b.Id);

        foreach (var id in itemIds)
        {
            if (!products.TryGetValue(id, out var product))
            {
                ModelState.AddModelError(nameof(request.Items), $"Item {id} does not exist.");
            }
            else if (!product.IsAvailable)
            {
                ModelState.AddModelError(nameof(request.Items), $"{product.Name} is currently unavailable.");
            }
        }

        if (!ModelState.IsValid)
        {
            return ValidationProblem(ModelState);
        }

        // Merge duplicate lines and price everything from the DB, never from the client
        var orderItems = request.Items
            .GroupBy(i => i.BakeryItemId)
            .Select(g => new OrderItem
            {
                BakeryItemId = g.Key,
                ItemName = products[g.Key].Name,
                UnitPrice = products[g.Key].Price,
                Quantity = g.Sum(i => i.Quantity),
            })
            .ToList();

        var order = new Order
        {
            CustomerName = request.CustomerName,
            Email = request.Email,
            Phone = request.Phone,
            PickupDate = request.PickupDate,
            Notes = request.Notes,
            Items = orderItems,
            Total = orderItems.Sum(i => i.UnitPrice * i.Quantity),
        };

        _context.Orders.Add(order);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetOrder), new { id = order.Id }, OrderToDTO(order));
    }

    // GET: api/Orders?status=Pending
    [Authorize]
    [HttpGet]
    public async Task<ActionResult<IEnumerable<OrderDTO>>> GetOrders(OrderStatus? status)
    {
        var query = _context.Orders.Include(o => o.Items).AsQueryable();
        if (status != null)
        {
            query = query.Where(o => o.Status == status);
        }

        var orders = await query
            .OrderByDescending(o => o.PickupDate)
            .ThenByDescending(o => o.CreatedAt)
            .ToListAsync();

        return orders.Select(OrderToDTO).ToList();
    }

    // GET: api/Orders/5
    [Authorize]
    [HttpGet("{id}")]
    public async Task<ActionResult<OrderDTO>> GetOrder(string id)
    {
        var order = await _context.Orders
            .Include(o => o.Items)
            .FirstOrDefaultAsync(o => o.Id == id);

        if (order == null)
        {
            return NotFound();
        }

        return OrderToDTO(order);
    }

    // PATCH: api/Orders/5/status
    [Authorize]
    [HttpPatch("{id}/status")]
    public async Task<IActionResult> UpdateOrderStatus(string id, UpdateOrderStatusRequest request)
    {
        var order = await _context.Orders.FindAsync(id);
        if (order == null)
        {
            return NotFound();
        }

        order.Status = request.Status!.Value;
        await _context.SaveChangesAsync();

        return NoContent();
    }

    private static OrderDTO OrderToDTO(Order order) =>
        new OrderDTO
        {
            Id = order.Id,
            CustomerName = order.CustomerName,
            Email = order.Email,
            Phone = order.Phone,
            PickupDate = order.PickupDate,
            Notes = order.Notes,
            Status = order.Status,
            CreatedAt = order.CreatedAt,
            Total = order.Total,
            Items = order.Items.Select(i => new OrderItemDTO
            {
                BakeryItemId = i.BakeryItemId,
                ItemName = i.ItemName,
                UnitPrice = i.UnitPrice,
                Quantity = i.Quantity,
            }).ToList(),
        };
}
