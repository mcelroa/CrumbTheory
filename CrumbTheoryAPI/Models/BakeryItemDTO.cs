using System.ComponentModel.DataAnnotations;

namespace CrumbTheoryAPI.Models;

public class BakeryItemDTO
{
    public string? Id { get; set; }

    [Required, MaxLength(100)]
    public required string Name { get; set; }

    [Range(0.01, 1000)]
    public decimal Price { get; set; }

    [MaxLength(1000)]
    public string? Description { get; set; }

    [Url]
    public string? ImageUrl { get; set; }

    public bool IsAvailable { get; set; } = true;
}
