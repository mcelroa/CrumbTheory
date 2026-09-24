using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CrumbTheoryAPI.Models;

namespace CrumbTheoryAPI.Controllers;

[Route("api/[controller]")]
[ApiController]
public class BakeryItemsController : ControllerBase
{
    private readonly AppDbContext _context;
    public BakeryItemsController(AppDbContext context)
    {
        _context = context;
    }

    // GET: api/BakeryItems
    [HttpGet]
    public async Task<ActionResult<IEnumerable<BakeryItemDTO>>> GetBakeryItems()
    {
        return await _context.BakeryItems
            .Select(x => ItemToDTO(x))
            .ToListAsync();
    }

    // GET: api/BakeryItems/5
    [HttpGet("{id}")]
    public async Task<ActionResult<BakeryItemDTO>> GetBakeryItem(string id)
    {
        var bakeryitem = await _context.BakeryItems.FindAsync(id);

        if (bakeryitem == null)
        {
            return NotFound();
        }

        return ItemToDTO(bakeryitem);
    }

    // PUT: api/BakeryItems/5
    [Authorize]
    [HttpPut("{id}")]
    public async Task<IActionResult> PutBakeryItem(string id, BakeryItemDTO bakeryItemDTO)
    {
        if (id != bakeryItemDTO.Id)
        {
            return BadRequest();
        }

        var bakeryItem = await _context.BakeryItems.FindAsync(id);
        if (bakeryItem == null)
        {
            return NotFound();
        }

        bakeryItem.Name = bakeryItemDTO.Name;
        bakeryItem.Price = bakeryItemDTO.Price;
        bakeryItem.Description = bakeryItemDTO.Description;
        bakeryItem.ImageUrl = bakeryItemDTO.ImageUrl;
        bakeryItem.IsAvailable = bakeryItemDTO.IsAvailable;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!BakeryItemExists(id))
            {
                return NotFound();
            }
            else
            {
                throw;
            }
        }

        return NoContent();
    }

    // POST: api/BakeryItems
    [Authorize]
    [HttpPost]
    public async Task<ActionResult<BakeryItemDTO>> PostBakeryItem(BakeryItemDTO bakeryItemDTO)
    {
        var bakeryItem = new BakeryItem
        {
            Name = bakeryItemDTO.Name,
            Price = bakeryItemDTO.Price,
            Description = bakeryItemDTO.Description,
            ImageUrl = bakeryItemDTO.ImageUrl,
            IsAvailable = bakeryItemDTO.IsAvailable,
        };

        _context.BakeryItems.Add(bakeryItem);
        await _context.SaveChangesAsync();

        return CreatedAtAction(
            nameof(GetBakeryItem),
            new { id = bakeryItem.Id },
            ItemToDTO(bakeryItem));
    }

    // DELETE: api/BakeryItems/5
    [Authorize]
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteBakeryItem(string id)
    {
        var bakeryitem = await _context.BakeryItems.FindAsync(id);
        if (bakeryitem == null)
        {
            return NotFound();
        }

        _context.BakeryItems.Remove(bakeryitem);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    private bool BakeryItemExists(string id)
    {
        return _context.BakeryItems.Any(e => e.Id == id);
    }

    private static BakeryItemDTO ItemToDTO(BakeryItem bakeryItem) =>
        new BakeryItemDTO
        {
            Id = bakeryItem.Id,
            Name = bakeryItem.Name,
            Price = bakeryItem.Price,
            Description = bakeryItem.Description,
            ImageUrl = bakeryItem.ImageUrl,
            IsAvailable = bakeryItem.IsAvailable,
        };
}
