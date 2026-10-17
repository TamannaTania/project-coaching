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
            try
            {
                var search = (request.Email ?? "").Trim();
                var user = await _context.Users.FirstOrDefaultAsync(u => 
                    (u.Email != null && u.Email == search) || 
                    (u.Name != null && u.Name == search)
                );
                if (user == null)
                {
                    return BadRequest("User not found!");
                }

                bool passwordValid = !string.IsNullOrEmpty(user.PasswordHash) && BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash);

                if (!passwordValid)
                {
                    return BadRequest("ভুল পাসওয়ার্ড! অনুগ্রহ করে সঠিক পাসওয়ার্ড দিন।");
                }

                // --- Device Limit Logic ---
                if (user.Role != "Admin") 
                {
                    if (string.IsNullOrEmpty(request.DeviceId)) 
                    {
                        request.DeviceId = "web-" + Guid.NewGuid().ToString("N");
                    }

                    if (string.IsNullOrEmpty(user.DeviceId)) 
                    {
                        // First time login, save this device
                        user.DeviceId = request.DeviceId;
                        await _context.SaveChangesAsync();
                    }
                    else if (user.DeviceId != request.DeviceId)
                    {
                        if (request.ForceLogin)
                        {
                            // User chose to switch session to this device
                            user.DeviceId = request.DeviceId;
                            await _context.SaveChangesAsync();
                        }
                        else
                        {
                            // Logging in from a different device!
                            return BadRequest("oops! You are already logged in on another device.");
                        }
                    }
                }

                string token = CreateToken(user);

                // Return the token, username, email, and active deviceId
                return Ok(new { Token = token, Username = user.Name ?? "", Email = user.Email ?? "", DeviceId = user.DeviceId ?? "" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        private string CreateToken(User user)
        {
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Name, user.Name ?? "Student"),
                new Claim(ClaimTypes.Email, user.Email ?? ""),
                new Claim(ClaimTypes.Role, user.Role ?? "Student"),
                new Claim("DeviceId", user.DeviceId ?? "")
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

        [HttpGet("validate-session")]
        public async Task<IActionResult> ValidateSession()
        {
            string? identifier = User.FindFirstValue(ClaimTypes.Email)
                            ?? User.FindFirstValue("email")
                            ?? User.FindFirstValue(ClaimTypes.Name)
                            ?? User.FindFirstValue("name")
                            ?? User.Claims.FirstOrDefault(c => c.Type.EndsWith("/emailaddress") || c.Type == "email" || c.Type.EndsWith("/name") || c.Type == "name")?.Value;

            string? tokenDeviceId = User.FindFirstValue("DeviceId")
                                ?? User.Claims.FirstOrDefault(c => c.Type == "DeviceId" || c.Type == "deviceId")?.Value;

            if (string.IsNullOrEmpty(identifier))
            {
                var authHeader = Request.Headers["Authorization"].FirstOrDefault();
                if (!string.IsNullOrEmpty(authHeader) && authHeader.StartsWith("Bearer ", StringComparison.OrdinalIgnoreCase))
                {
                    try
                    {
                        var handler = new JwtSecurityTokenHandler();
                        var jwt = handler.ReadJwtToken(authHeader.Substring("Bearer ".Length).Trim());
                        identifier = jwt.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Email || c.Type == "email" || c.Type.EndsWith("/emailaddress"))?.Value
                                     ?? jwt.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Name || c.Type == "name" || c.Type.EndsWith("/name"))?.Value;
                        tokenDeviceId = jwt.Claims.FirstOrDefault(c => c.Type == "DeviceId" || c.Type == "deviceId")?.Value;
                    }
                    catch { }
                }
            }

            if (string.IsNullOrEmpty(identifier))
            {
                return Unauthorized(new { isValid = false, message = "No valid authentication token found." });
            }

            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email.ToLower() == identifier.ToLower() || u.Name.ToLower() == identifier.ToLower());
            if (user == null)
            {
                return Unauthorized(new { isValid = false, message = "User not found." });
            }

            if (user.Role == "Admin")
            {
                return Ok(new { isValid = true, username = user.Name, role = user.Role });
            }

            var clientDeviceId = Request.Headers["X-Device-Id"].FirstOrDefault();
            if (string.IsNullOrEmpty(clientDeviceId))
            {
                clientDeviceId = tokenDeviceId;
            }

            // If user's DeviceId in DB has changed and is different from this client's device:
            if (!string.IsNullOrEmpty(user.DeviceId) && !string.IsNullOrEmpty(clientDeviceId) && user.DeviceId != clientDeviceId)
            {
                return StatusCode(401, new {
                    isValid = false,
                    code = "SESSION_TERMINATED",
                    sessionTerminated = true,
                    message = "অন্য একটি ব্রাউজার বা ডিভাইসে লগইন করার কারণে এই সেশনটি বন্ধ করা হয়েছে।"
                });
            }

            return Ok(new { isValid = true, username = user.Name, role = user.Role, deviceId = user.DeviceId });
        }

        [HttpPost("logout")]
        public async Task<IActionResult> Logout([FromBody] LogoutDto? request = null)
        {
            string? identifier = User.FindFirstValue(ClaimTypes.Email)
                            ?? User.FindFirstValue("email")
                            ?? User.FindFirstValue(ClaimTypes.Name)
                            ?? User.FindFirstValue("name")
                            ?? User.Claims.FirstOrDefault(c => c.Type.EndsWith("/emailaddress") || c.Type == "email" || c.Type.EndsWith("/name") || c.Type == "name")?.Value;

            if (string.IsNullOrEmpty(identifier) && request != null && !string.IsNullOrEmpty(request.Email))
            {
                identifier = request.Email.Trim();
            }

            if (string.IsNullOrEmpty(identifier))
            {
                var authHeader = Request.Headers["Authorization"].FirstOrDefault();
                if (!string.IsNullOrEmpty(authHeader) && authHeader.StartsWith("Bearer ", StringComparison.OrdinalIgnoreCase))
                {
                    try
                    {
                        var handler = new JwtSecurityTokenHandler();
                        var token = handler.ReadJwtToken(authHeader.Substring("Bearer ".Length).Trim());
                        identifier = token.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Email || c.Type == "email" || c.Type.EndsWith("/emailaddress"))?.Value
                                     ?? token.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Name || c.Type == "name" || c.Type.EndsWith("/name"))?.Value;
                    }
                    catch { }
                }
            }

            User? user = null;
            if (!string.IsNullOrEmpty(identifier))
            {
                user = await _context.Users.FirstOrDefaultAsync(u => u.Email.ToLower() == identifier.ToLower() || u.Name.ToLower() == identifier.ToLower());
            }

            // Fallback: If identifier couldn't be resolved, locate by DeviceId sent in request
            if (user == null && request != null && !string.IsNullOrEmpty(request.DeviceId))
            {
                user = await _context.Users.FirstOrDefaultAsync(u => u.DeviceId == request.DeviceId);
            }

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

        [HttpGet("reset-devices")]
        public async Task<IActionResult> ResetDevices()
        {
            var users = await _context.Users.ToListAsync();
            foreach(var user in users)
            {
                user.DeviceId = null;
            }
            await _context.SaveChangesAsync();
            return Ok("All device limits have been reset! You can now log in from any device.");
        }

        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordDto dto)
        {
            var search = (dto.Email ?? "").Trim().ToLower();
            if (string.IsNullOrEmpty(search))
            {
                return BadRequest("অনুগ্রহ করে আপনার নিবন্ধিত ইমেইল বা ইউজারনেম দিন।");
            }

            var user = await _context.Users.FirstOrDefaultAsync(u => 
                (u.Email != null && u.Email.ToLower() == search) || 
                (u.Name != null && u.Name.ToLower() == search)
            );

            if (user == null)
            {
                return NotFound("এই ইমেইল বা ইউজারনেম দিয়ে কোনো অ্যাকাউন্ট খুঁজে পাওয়া যায়নি!");
            }

            return Ok(new { 
                success = true, 
                message = "অ্যাকাউন্ট ভেরিফাই করা হয়েছে! এবার আপনার নতুন পাসওয়ার্ড দিন।",
                email = user.Email
            });
        }

        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordDto dto)
        {
            var search = (dto.Email ?? "").Trim().ToLower();
            if (string.IsNullOrEmpty(search))
            {
                return BadRequest("ইমেইল ঠিকানা দেওয়া হয়নি।");
            }

            if (string.IsNullOrEmpty(dto.NewPassword) || dto.NewPassword.Length < 4)
            {
                return BadRequest("নতুন পাসওয়ার্ড কমপক্ষে ৪ অক্ষরের হতে হবে।");
            }

            if (!string.IsNullOrEmpty(dto.ConfirmPassword) && dto.NewPassword != dto.ConfirmPassword)
            {
                return BadRequest("নতুন পাসওয়ার্ড এবং কনফার্ম পাসওয়ার্ড মিলছে না!");
            }

            var user = await _context.Users.FirstOrDefaultAsync(u => 
                (u.Email != null && u.Email.ToLower() == search) || 
                (u.Name != null && u.Name.ToLower() == search)
            );

            if (user == null)
            {
                return NotFound("ব্যবহারকারী খুঁজে পাওয়া যায়নি!");
            }

            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.NewPassword);
            await _context.SaveChangesAsync();

            return Ok(new { 
                success = true, 
                message = "আপনার পাসওয়ার্ড সফলভাবে পরিবর্তন করা হয়েছে! এখন নতুন পাসওয়ার্ড দিয়ে লগইন করুন।" 
            });
        }
    }
}
