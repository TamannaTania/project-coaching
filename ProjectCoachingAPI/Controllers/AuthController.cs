using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using ProjectCoachingAPI.Data;
using ProjectCoachingAPI.Models;
using ProjectCoachingAPI.Models.DTOs;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace ProjectCoachingAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _configuration;

        public AuthController(AppDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        [HttpPost("register")]
        public async Task<ActionResult<string>> Register(UserRegisterDto request)
        {
            var existingUser = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);
            if (existingUser != null)
            {
                return BadRequest("User with this email already exists!");
            }

            string passwordHash = BCrypt.Net.BCrypt.HashPassword(request.Password);

            var user = new User
            {
                Name = request.Name,
                Email = request.Email,
                PasswordHash = passwordHash,
                Role = "Student" 
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return Ok("Registration successful!");
        }

        [HttpPost("login")]
        public async Task<ActionResult<object>> Login(UserLoginDto request)
        {
             var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);
            if (user == null)
            {
                return BadRequest("User not found!");
            }

            if (!BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
            {
                return BadRequest("Wrong password!");
            }

            // --- Device Limit Logic ---
            if (user.Role != "Admin") 
            {
                if (string.IsNullOrEmpty(request.DeviceId)) 
                {
                    return BadRequest("ব্রাউজারের ক্যাশ (Cache) ক্লিয়ার করে পেজটি রিলোড (Ctrl+F5) দিন!");
                }

                if (string.IsNullOrEmpty(user.DeviceId)) 
                {
                    // First time login, save this device
                    user.DeviceId = request.DeviceId;
                    await _context.SaveChangesAsync();
                }
                else if (user.DeviceId != request.DeviceId)
                {
                    // Logging in from a different device!
                    return BadRequest("oops! You are already logged in on another device.");
                }
            }

            string token = CreateToken(user);

            // Return the token and username
            return Ok(new { Token = token, Username = user.Name });
        }

        private string CreateToken(User user)
        {
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.Name, user.Name),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Role, user.Role)
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(
                _configuration.GetSection("Jwt:Key").Value!));

            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256Signature);

            var token = new JwtSecurityToken(
                issuer: _configuration.GetSection("Jwt:Issuer").Value,
                audience: _configuration.GetSection("Jwt:Audience").Value,
                claims: claims,
                expires: DateTime.Now.AddDays(7),
                signingCredentials: creds
            );

            var jwt = new JwtSecurityTokenHandler().WriteToken(token);

            return jwt;
        }

        [Authorize]
        [HttpPost("logout")]
        public async Task<IActionResult> Logout()
        {
            var email = User.FindFirstValue(ClaimTypes.Email);
            if (string.IsNullOrEmpty(email)) return Unauthorized();

            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
            if (user != null)
            {
                // Clear the allowed device so they can log in from anywhere else
                user.DeviceId = null;
                await _context.SaveChangesAsync();
            }

            return Ok(new { message = "Logged out successfully" });
        }

        [Authorize]
        [HttpPut("change-password")]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordDto dto)
        {
            var email = User.FindFirstValue(ClaimTypes.Email);
            if (string.IsNullOrEmpty(email)) return Unauthorized();

            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
            if (user == null) return Unauthorized();

            if (!BCrypt.Net.BCrypt.Verify(dto.OldPassword, user.PasswordHash))
            {
                return BadRequest(new { message = "পুরানো পাসওয়ার্ডটি সঠিক নয়!" });
            }

            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.NewPassword);
            await _context.SaveChangesAsync();

            return Ok(new { message = "পাসওয়ার্ড সফলভাবে পরিবর্তন করা হয়েছে!" });
        }
    }
}
