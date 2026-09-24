using System.ComponentModel.DataAnnotations;

namespace CrumbTheoryAPI.Models;

public class LoginRequest
{
    [Required]
    public required string Username { get; set; }

    [Required]
    public required string Password { get; set; }
}

public class LoginResponse
{
    public required string Token { get; set; }
    public DateTime ExpiresAt { get; set; }
}
