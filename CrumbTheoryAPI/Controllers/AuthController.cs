using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using CrumbTheoryAPI.Models;

namespace CrumbTheoryAPI.Controllers;

[Route("api/[controller]")]
[ApiController]
public class AuthController : ControllerBase
{
    private readonly IConfiguration _config;
    public AuthController(IConfiguration config)
    {
        _config = config;
    }

    // POST: api/Auth/login
    [HttpPost("login")]
    public ActionResult<LoginResponse> Login(LoginRequest request)
    {
        var username = _config["Admin:Username"];
        var password = _config["Admin:Password"];
        if (string.IsNullOrEmpty(username) || string.IsNullOrEmpty(password))
        {
            return Problem("Admin credentials are not configured.");
        }

        // Check both so the response time doesn't reveal which one was wrong
        var usernameOk = FixedTimeEquals(request.Username, username);
        var passwordOk = FixedTimeEquals(request.Password, password);
        if (!(usernameOk & passwordOk))
        {
            return Unauthorized();
        }

        var expiresAt = DateTime.UtcNow.AddHours(8);
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]!));
        var token = new JwtSecurityToken(
            issuer: _config["Jwt:Issuer"],
            audience: _config["Jwt:Audience"],
            claims: [new Claim(ClaimTypes.Name, username), new Claim(ClaimTypes.Role, "Admin")],
            expires: expiresAt,
            signingCredentials: new SigningCredentials(key, SecurityAlgorithms.HmacSha256));

        return new LoginResponse
        {
            Token = new JwtSecurityTokenHandler().WriteToken(token),
            ExpiresAt = expiresAt,
        };
    }

    private static bool FixedTimeEquals(string a, string b) =>
        CryptographicOperations.FixedTimeEquals(
            SHA256.HashData(Encoding.UTF8.GetBytes(a)),
            SHA256.HashData(Encoding.UTF8.GetBytes(b)));
}
