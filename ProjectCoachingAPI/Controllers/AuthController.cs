using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.IdentityModel.Tokens;
using ProjectCoachingAPI.Data;
using ProjectCoachingAPI.Models;
using ProjectCoachingAPI.Models.DTOs;
using ProjectCoachingAPI.Services;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace ProjectCoachingAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _configuration;
        private readonly IEmailService _emailService;
        private readonly ISmsService _smsService;
        private readonly IMemoryCache _cache;

        public AuthController(AppDbContext context, IConfiguration configuration, IEmailService emailService, ISmsService smsService, IMemoryCache cache)
        {
            _context = context;
            _configuration = configuration;
            _emailService = emailService;
            _smsService = smsService;
            _cache = cache;
        }

        private static string MaskEmail(string email)
        {
            if (string.IsNullOrWhiteSpace(email) || !email.Contains('@')) return email;
            var parts = email.Split('@');
            var u = parts[0];
            var d = parts[1];
            if (u.Length <= 2) return u[0] + "*@" + d;
            return u.Substring(0, 2) + new string('*', Math.Max(2, u.Length - 3)) + u[^1] + "@" + d;
        }

        [HttpPost("send-otp")]
        public async Task<IActionResult> SendOtp([FromBody] SendOtpDto request)
        {
            try
            {
                string? targetEmail = !string.IsNullOrWhiteSpace(request.Email) ? request.Email.Trim().ToLower() : null;
                string? targetName = !string.IsNullOrWhiteSpace(request.Name) ? request.Name.Trim() : "Student";
                string purpose = (request.Purpose ?? "Register").Trim();

                if (purpose.Equals("Register", StringComparison.OrdinalIgnoreCase))
                {
                    if (string.IsNullOrWhiteSpace(targetEmail))
                    {
                        return BadRequest(new { message = "অনুগ্রহ করে একটি সঠিক ইমেইল ঠিকানা দিন।" });
                    }

                    // Check email uniqueness
                    var existingEmail = await _context.Users.AnyAsync(u => u.Email != null && u.Email.ToLower() == targetEmail);
                    if (existingEmail)
                    {
                        return BadRequest(new { message = "এই ইমেইল দিয়ে ইতিমধ্যে একটি অ্যাকাউন্ট তৈরি করা আছে!" });
                    }

                    // Check phone uniqueness if provided
                    string? cleanPhone = !string.IsNullOrWhiteSpace(request.Phone) ? request.Phone.Trim() : null;
                    if (!string.IsNullOrWhiteSpace(cleanPhone))
                    {
                        if (cleanPhone.StartsWith("+88")) cleanPhone = cleanPhone.Substring(3);
                        else if (cleanPhone.StartsWith("88")) cleanPhone = cleanPhone.Substring(2);

                        var existingPhone = await _context.Users.AnyAsync(u => u.Phone != null && u.Phone == cleanPhone);
                        if (existingPhone)
                        {
                            return BadRequest(new { message = "এই মোবাইল নম্বর দিয়ে ইতিমধ্যে একটি অ্যাকাউন্ট তৈরি করা আছে!" });
                        }
                    }
                }
                else if (purpose.Equals("UpdateEmail", StringComparison.OrdinalIgnoreCase))
                {
                    if (string.IsNullOrWhiteSpace(targetEmail) || !targetEmail.Contains('@'))
                    {
                        return BadRequest(new { message = "অনুগ্রহ করে একটি সঠিক ইমেইল ঠিকানা দিন।" });
                    }

                    var existingEmail = await _context.Users.AnyAsync(u => u.Email != null && u.Email.ToLower() == targetEmail);
                    if (existingEmail)
                    {
                        return BadRequest(new { message = "এই ইমেইল দিয়ে ইতিমধ্যে একটি অ্যাকাউন্ট তৈরি করা আছে!" });
                    }
                }
                else if (purpose.Equals("ResetPassword", StringComparison.OrdinalIgnoreCase))
                {
                    var search = (request.Email ?? "").Trim().ToLower();
                    if (string.IsNullOrWhiteSpace(search))
                    {
                        return BadRequest(new { message = "অনুগ্রহ করে আপনার নিবন্ধিত ইমেইল বা মোবাইল নম্বর দিন।" });
                    }

                    string phoneSearch = search;
                    if (phoneSearch.StartsWith("+88")) phoneSearch = phoneSearch.Substring(3);
                    else if (phoneSearch.StartsWith("88")) phoneSearch = phoneSearch.Substring(2);

                    var user = await _context.Users.FirstOrDefaultAsync(u => 
                        (u.Phone != null && (u.Phone == search || u.Phone == phoneSearch)) ||
                        (u.Email != null && u.Email.ToLower() == search) || 
                        (u.Name != null && u.Name.ToLower() == search)
                    );

                    if (user == null)
                    {
                        return NotFound(new { message = "কোনো অ্যাকাউন্ট পাওয়া যায়নি! সঠিক তথ্য দিন।" });
                    }

                    if (string.IsNullOrWhiteSpace(user.Email))
                    {
                        return BadRequest(new { message = "এই অ্যাকাউন্টে কোনো ইমেইল যুক্ত করা নেই। পাসওয়ার্ড রিসেট করতে অনুগ্রহ করে এডমিনের সাথে যোগাযোগ করুন।" });
                    }

                    targetEmail = user.Email.Trim().ToLower();
                    targetName = user.Name ?? "Student";
                }
                else
                {
                    return BadRequest(new { message = "অবৈধ পারপাস।" });
                }

                // Generate 6-digit random OTP
                string otpCode = RandomNumberGenerator.GetInt32(100000, 1000000).ToString();

                // Store in Cache for 10 minutes
                string cacheKey = $"OTP:{purpose.ToUpper()}:{targetEmail}";
                _cache.Set(cacheKey, otpCode, TimeSpan.FromMinutes(10));

                // Send Email via SMTP
                var sendResult = await _emailService.SendOtpEmailAsync(targetEmail, targetName, otpCode, purpose);
                if (!sendResult.success)
                {
                    return StatusCode(500, new { message = sendResult.message });
                }

                return Ok(new { 
                    success = true, 
                    message = "আপনার ইমেইলে একটি ৬-সংখ্যার ভেরিফিকেশন ওটিপি পাঠানো হয়েছে।",
                    email = targetEmail,
                    maskedEmail = MaskEmail(targetEmail)
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "সার্ভার এরর: " + ex.Message });
            }
        }

        [HttpPost("verify-otp")]
        public IActionResult VerifyOtp([FromBody] VerifyOtpDto request)
        {
            if (string.IsNullOrWhiteSpace(request.Email) || string.IsNullOrWhiteSpace(request.OtpCode))
            {
                return BadRequest(new { message = "ইমেইল এবং ওটিপি কোড প্রদান আবশ্যক।" });
            }

            string email = request.Email.Trim().ToLower();
            string purpose = (request.Purpose ?? "Register").Trim().ToUpper();
            string cacheKey = $"OTP:{purpose}:{email}";

            if (_cache.TryGetValue(cacheKey, out string? storedOtp) && storedOtp == request.OtpCode.Trim())
            {
                // Mark as verified in cache for 15 minutes
                string verifiedKey = $"OTP_VERIFIED:{purpose}:{email}";
                _cache.Set(verifiedKey, true, TimeSpan.FromMinutes(15));
                _cache.Remove(cacheKey); // single-use OTP

                return Ok(new { success = true, message = "ওটিপি সফলভাবে যাচাই করা হয়েছে।" });
            }

            return BadRequest(new { message = "ভুল ওটিপি কোড অথবা ওটিপির মেয়াদ শেষ হয়ে গেছে। আবার চেষ্টা করুন।" });
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(UserRegisterDto request)
        {
            string? cleanPhone = !string.IsNullOrWhiteSpace(request.Phone) ? request.Phone.Trim() : null;
            if (!string.IsNullOrWhiteSpace(cleanPhone))
            {
                if (cleanPhone.StartsWith("+88"))
                {
                    cleanPhone = cleanPhone.Substring(3);
                }
                else if (cleanPhone.StartsWith("88"))
                {
                    cleanPhone = cleanPhone.Substring(2);
                }
            }

            string? cleanEmail = !string.IsNullOrWhiteSpace(request.Email) ? request.Email.Trim().ToLower() : null;

            // Must provide at least one: Phone or Email
            if (string.IsNullOrWhiteSpace(cleanPhone) && string.IsNullOrWhiteSpace(cleanEmail))
            {
                return BadRequest(new { message = "অনুগ্রহ করে মোবাইল নম্বর অথবা ইমেইল প্রদান করুন।" });
            }

            // Check mobile uniqueness if provided
            if (!string.IsNullOrWhiteSpace(cleanPhone))
            {
                var existingPhone = await _context.Users.AnyAsync(u => u.Phone != null && u.Phone == cleanPhone);
                if (existingPhone)
                {
                    return BadRequest(new { message = "এই মোবাইল নম্বর দিয়ে ইতিমধ্যে একটি অ্যাকাউন্ট তৈরি করা আছে!" });
                }
            }

            // Check email uniqueness ONLY if an email was actually provided
            if (!string.IsNullOrWhiteSpace(cleanEmail))
            {
                var existingEmail = await _context.Users.AnyAsync(u => u.Email != null && u.Email.ToLower() == cleanEmail);
                if (existingEmail)
                {
                    return BadRequest(new { message = "এই ইমেইল দিয়ে ইতিমধ্যে একটি অ্যাকাউন্ট তৈরি করা আছে!" });
                }
            }

            string passwordHash = BCrypt.Net.BCrypt.HashPassword(request.Password);
            string finalName = !string.IsNullOrWhiteSpace(request.Name) 
                ? request.Name.Trim() 
                : (!string.IsNullOrWhiteSpace(request.Username) ? request.Username.Trim() : (cleanPhone ?? cleanEmail ?? "Student"));

            string clientDeviceId = Request.Headers["X-Device-Id"].FirstOrDefault() ?? Guid.NewGuid().ToString();

            var user = new User
            {
                Name = finalName,
                Phone = cleanPhone,
                Email = cleanEmail, // NULL if not provided!
                PasswordHash = passwordHash,
                Role = "Student",
                DeviceId = clientDeviceId
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            string token = CreateToken(user);

            return Ok(new { 
                message = "Registration successful!",
                token = token,
                role = user.Role,
                username = user.Name,
                name = user.Name,
                phone = user.Phone ?? "",
                email = user.Email ?? "",
                deviceId = user.DeviceId
            });
        }

        [HttpPost("login")]
        public async Task<ActionResult<object>> Login(UserLoginDto request)
        {
            try
            {
                var search = (request.Email ?? "").Trim();
                if (string.IsNullOrWhiteSpace(search))
                {
                    return BadRequest("অনুগ্রহ করে মোবাইল নম্বর অথবা ইমেইল দিন।");
                }

                string phoneSearch = search;
                if (phoneSearch.StartsWith("+88"))
                {
                    phoneSearch = phoneSearch.Substring(3);
                }
                else if (phoneSearch.StartsWith("88"))
                {
                    phoneSearch = phoneSearch.Substring(2);
                }

                var user = await _context.Users.FirstOrDefaultAsync(u => 
                    (u.Phone != null && (u.Phone == search || u.Phone == phoneSearch)) ||
                    (u.Email != null && u.Email.ToLower() == search.ToLower()) || 
                    (u.Name != null && u.Name.ToLower() == search.ToLower())
                );
                if (user == null)
                {
                    return BadRequest("কোনো অ্যাকাউন্ট পাওয়া যায়নি! সঠিক মোবাইল নম্বর বা ইমেইল দিন।");
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

                // Return the token, full name, username, phone, email, active deviceId, and role
                return Ok(new { 
                    Token = token, 
                    Username = user.Name ?? "", 
                    Name = user.Name ?? "",
                    FullName = user.Name ?? "",
                    Phone = user.Phone ?? "",
                    Email = user.Email ?? "", 
                    DeviceId = user.DeviceId ?? "", 
                    Role = user.Role ?? "Student" 
                });
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
                new Claim("FullName", user.Name ?? "Student"),
                new Claim(ClaimTypes.Role, user.Role ?? "Student"),
                new Claim("DeviceId", user.DeviceId ?? "")
            };

            if (!string.IsNullOrWhiteSpace(user.Email))
            {
                claims.Add(new Claim(ClaimTypes.Email, user.Email));
            }
            if (!string.IsNullOrWhiteSpace(user.Phone))
            {
                claims.Add(new Claim("Phone", user.Phone));
            }

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
            User? user = null;

            // 1. Search directly by User ID (NameIdentifier) - 100% reliable even when Email is null
            string? userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (int.TryParse(userIdStr, out int userId))
            {
                user = await _context.Users.FindAsync(userId);
            }

            // 2. Fallback to Phone, Email, or Name
            if (user == null)
            {
                string? identifier = User.FindFirstValue("Phone")
                                ?? User.FindFirstValue(ClaimTypes.Email)
                                ?? User.FindFirstValue("email")
                                ?? User.FindFirstValue(ClaimTypes.Name)
                                ?? User.FindFirstValue("name");

                if (!string.IsNullOrEmpty(identifier))
                {
                    user = await _context.Users.FirstOrDefaultAsync(u => 
                        (u.Phone != null && u.Phone == identifier) ||
                        (u.Email != null && u.Email.ToLower() == identifier.ToLower()) || 
                        (u.Name != null && u.Name.ToLower() == identifier.ToLower())
                    );
                }
            }

            string? tokenDeviceId = User.FindFirstValue("DeviceId")
                                ?? User.Claims.FirstOrDefault(c => c.Type == "DeviceId" || c.Type == "deviceId")?.Value;

            // 3. Fallback to inspecting raw Authorization Bearer header
            if (user == null)
            {
                var authHeader = Request.Headers["Authorization"].FirstOrDefault();
                if (!string.IsNullOrEmpty(authHeader) && authHeader.StartsWith("Bearer ", StringComparison.OrdinalIgnoreCase))
                {
                    try
                    {
                        var handler = new JwtSecurityTokenHandler();
                        var jwt = handler.ReadJwtToken(authHeader.Substring("Bearer ".Length).Trim());
                        var idClaim = jwt.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier || c.Type == "nameid")?.Value;
                        if (int.TryParse(idClaim, out int rawId))
                        {
                            user = await _context.Users.FindAsync(rawId);
                        }
                        if (user == null)
                        {
                            var rawPhone = jwt.Claims.FirstOrDefault(c => c.Type == "Phone" || c.Type == "phone")?.Value;
                            var rawEmail = jwt.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Email || c.Type == "email" || c.Type.EndsWith("/emailaddress"))?.Value;
                            var rawName = jwt.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Name || c.Type == "name" || c.Type.EndsWith("/name"))?.Value;

                            user = await _context.Users.FirstOrDefaultAsync(u => 
                                (!string.IsNullOrEmpty(rawPhone) && u.Phone == rawPhone) ||
                                (!string.IsNullOrEmpty(rawEmail) && u.Email != null && u.Email.ToLower() == rawEmail.ToLower()) ||
                                (!string.IsNullOrEmpty(rawName) && u.Name != null && u.Name.ToLower() == rawName.ToLower())
                            );
                        }
                        tokenDeviceId = jwt.Claims.FirstOrDefault(c => c.Type == "DeviceId" || c.Type == "deviceId")?.Value;
                    }
                    catch { }
                }
            }

            if (user == null)
            {
                return Unauthorized(new { isValid = false, message = "User not found." });
            }

            if (user.Role == "Admin")
            {
                return Ok(new { isValid = true, username = user.Name, name = user.Name, fullName = user.Name, role = user.Role });
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

            return Ok(new { isValid = true, username = user.Name, name = user.Name, fullName = user.Name, role = user.Role, phone = user.Phone ?? "", email = user.Email ?? "", deviceId = user.DeviceId });
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

        [HttpGet("test-email")]
        public async Task<IActionResult> TestEmail([FromQuery] string email)
        {
            if (string.IsNullOrWhiteSpace(email)) return BadRequest("Email is required");
            var res = await _emailService.SendOtpEmailAsync(email, "Student", "123456", "Register");
            return Ok(new { success = res.success, message = res.message });
        }

        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordDto dto)
        {
            var search = (dto.Email ?? "").Trim().ToLower();
            if (string.IsNullOrEmpty(search))
            {
                return BadRequest(new { message = "অনুগ্রহ করে আপনার নিবন্ধিত ইমেইল বা মোবাইল নম্বর দিন।" });
            }

            string phoneSearch = search;
            if (phoneSearch.StartsWith("+88")) phoneSearch = phoneSearch.Substring(3);
            else if (phoneSearch.StartsWith("88")) phoneSearch = phoneSearch.Substring(2);

            var user = await _context.Users.FirstOrDefaultAsync(u => 
                (u.Phone != null && (u.Phone == search || u.Phone == phoneSearch)) ||
                (u.Email != null && u.Email.ToLower() == search) || 
                (u.Name != null && u.Name.ToLower() == search)
            );

            if (user == null)
            {
                return NotFound(new { message = "কোনো অ্যাকাউন্ট পাওয়া যায়নি! সঠিক তথ্য দিন।" });
            }

            if (string.IsNullOrWhiteSpace(user.Email))
            {
                // Check if SMS Gateway is enabled
                bool isSmsEnabled = bool.TryParse(_configuration["SmsSettings:Enabled"], out bool sEn) && sEn;
                if (isSmsEnabled && !string.IsNullOrWhiteSpace(user.Phone))
                {
                    string smsOtp = RandomNumberGenerator.GetInt32(100000, 1000000).ToString();
                    string phoneKey = user.Phone.Trim();
                    _cache.Set($"OTP:RESETPASSWORD:{phoneKey}", smsOtp, TimeSpan.FromMinutes(10));
                    var smsRes = await _smsService.SendOtpSmsAsync(phoneKey, smsOtp);
                    if (smsRes.success)
                    {
                        string maskedPhone = phoneKey.Length >= 7 
                            ? phoneKey.Substring(0, 3) + "*****" + phoneKey.Substring(phoneKey.Length - 2) 
                            : phoneKey;
                        return Ok(new { 
                            success = true, 
                            message = "আপনার মোবাইল নম্বরে একটি ৬-সংখ্যার ওটিপি কোড পাঠানো হয়েছে।",
                            email = phoneKey,
                            maskedEmail = maskedPhone
                        });
                    }
                }

                return BadRequest(new { 
                    message = "এই অ্যাকাউন্টে কোনো ইমেইল যুক্ত করা নেই। পাসওয়ার্ড রিসেট করতে অনুগ্রহ করে সরাসরি এডমিনের সাথে যোগাযোগ করুন।" 
                });
            }

            string targetEmail = user.Email.Trim().ToLower();
            string otpCode = RandomNumberGenerator.GetInt32(100000, 1000000).ToString();

            // Cache OTP for 10 minutes
            string cacheKey = $"OTP:RESETPASSWORD:{targetEmail}";
            _cache.Set(cacheKey, otpCode, TimeSpan.FromMinutes(10));

            var sendResult = await _emailService.SendOtpEmailAsync(targetEmail, user.Name ?? "Student", otpCode, "ResetPassword");
            if (!sendResult.success)
            {
                return StatusCode(500, new { message = "ইমেইল পাঠানো যায়নি: " + sendResult.message });
            }

            return Ok(new { 
                success = true, 
                message = "আপনার নিবন্ধিত ইমেইলে একটি ৬-সংখ্যার ওটিপি কোড পাঠানো হয়েছে।",
                email = targetEmail,
                maskedEmail = MaskEmail(targetEmail)
            });
        }

        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordDto dto)
        {
            var search = (dto.Email ?? "").Trim().ToLower();
            if (string.IsNullOrEmpty(search))
            {
                return BadRequest(new { message = "ইমেইল বা মোবাইল নম্বর দেওয়া হয়নি।" });
            }

            if (string.IsNullOrEmpty(dto.NewPassword) || dto.NewPassword.Length < 4)
            {
                return BadRequest(new { message = "নতুন পাসওয়ার্ড কমপক্ষে ৪ অক্ষরের হতে হবে।" });
            }

            if (!string.IsNullOrEmpty(dto.ConfirmPassword) && dto.NewPassword != dto.ConfirmPassword)
            {
                return BadRequest(new { message = "নতুন পাসওয়ার্ড এবং কনফার্ম পাসওয়ার্ড মিলছে না!" });
            }

            string phoneSearch = search;
            if (phoneSearch.StartsWith("+88")) phoneSearch = phoneSearch.Substring(3);
            else if (phoneSearch.StartsWith("88")) phoneSearch = phoneSearch.Substring(2);

            var user = await _context.Users.FirstOrDefaultAsync(u => 
                (u.Phone != null && (u.Phone == search || u.Phone == phoneSearch)) ||
                (u.Email != null && u.Email.ToLower() == search) || 
                (u.Name != null && u.Name.ToLower() == search)
            );

            if (user == null)
            {
                return NotFound(new { message = "ব্যবহারকারী খুঁজে পাওয়া যায়নি!" });
            }

            string userLookupKey = !string.IsNullOrWhiteSpace(user.Email) ? user.Email.Trim().ToLower() : (user.Phone ?? "").Trim();

            // Verify OTP
            bool isOtpVerified = _cache.TryGetValue($"OTP_VERIFIED:RESETPASSWORD:{userLookupKey}", out bool verified) && verified;
            if (!isOtpVerified && !string.IsNullOrWhiteSpace(dto.OtpCode))
            {
                if (_cache.TryGetValue($"OTP:RESETPASSWORD:{userLookupKey}", out string? storedOtp) && storedOtp == dto.OtpCode.Trim())
                {
                    isOtpVerified = true;
                }
            }

            if (!isOtpVerified)
            {
                return BadRequest(new { message = "অবৈধ বা মেয়াদোত্তীর্ণ ওটিপি কোড! অনুগ্রহ করে সঠিক ওটিপি দিয়ে পুনরায় চেষ্টা করুন।" });
            }

            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.NewPassword);
            await _context.SaveChangesAsync();

            // Clean up cache
            _cache.Remove($"OTP_VERIFIED:RESETPASSWORD:{userLookupKey}");
            _cache.Remove($"OTP:RESETPASSWORD:{userLookupKey}");

            return Ok(new { 
                success = true, 
                message = "আপনার পাসওয়ার্ড সফলভাবে পরিবর্তন করা হয়েছে! এখন নতুন পাসওয়ার্ড দিয়ে লগইন করুন।" 
            });
        }

        [Authorize]
        [HttpPut("update-email")]
        public async Task<IActionResult> UpdateEmail([FromBody] VerifyOtpDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Email) || string.IsNullOrWhiteSpace(dto.OtpCode))
            {
                return BadRequest(new { message = "ইমেইল এবং ওটিপি কোড উভয়ই আবশ্যক।" });
            }

            string targetEmail = dto.Email.Trim().ToLower();
            string cacheKey = $"OTP:UPDATEEMAIL:{targetEmail}";

            bool isVerified = _cache.TryGetValue($"OTP_VERIFIED:UPDATEEMAIL:{targetEmail}", out bool v) && v;
            if (!isVerified && _cache.TryGetValue(cacheKey, out string? storedOtp) && storedOtp == dto.OtpCode.Trim())
            {
                isVerified = true;
            }

            if (!isVerified)
            {
                return BadRequest(new { message = "ভুল ওটিপি কোড অথবা ওটিপির মেয়াদ শেষ হয়ে গেছে। অনুগ্রহ করে আবার চেষ্টা করুন।" });
            }

            var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!int.TryParse(userIdStr, out int userId)) return Unauthorized();

            var user = await _context.Users.FindAsync(userId);
            if (user == null) return Unauthorized();

            var exists = await _context.Users.AnyAsync(u => u.Id != userId && u.Email != null && u.Email.ToLower() == targetEmail);
            if (exists)
            {
                return BadRequest(new { message = "এই ইমেইলটি অন্য একটি অ্যাকাউন্টে ইতিমধ্যে ব্যবহৃত হচ্ছে।" });
            }

            user.Email = targetEmail;
            await _context.SaveChangesAsync();

            _cache.Remove(cacheKey);
            _cache.Remove($"OTP_VERIFIED:UPDATEEMAIL:{targetEmail}");

            return Ok(new { success = true, email = user.Email, message = "আপনার অ্যাকাউন্টে ইমেইল সফলভাবে যুক্ত ও ভেরিফাই করা হয়েছে!" });
        }

        [HttpGet("admin/search-students")]
        public async Task<IActionResult> AdminSearchStudents([FromQuery] string? query = "")
        {
            var q = (query ?? "").Trim().ToLower();
            string phoneSearch = q;
            if (phoneSearch.StartsWith("+88")) phoneSearch = phoneSearch.Substring(3);
            else if (phoneSearch.StartsWith("88")) phoneSearch = phoneSearch.Substring(2);

            var users = await _context.Users
                .Where(u => string.IsNullOrEmpty(q) ||
                            (u.Phone != null && (u.Phone.Contains(q) || u.Phone.Contains(phoneSearch))) ||
                            (u.Email != null && u.Email.ToLower().Contains(q)) ||
                            (u.Name != null && u.Name.ToLower().Contains(q)))
                .OrderByDescending(u => u.Id)
                .Take(50)
                .Select(u => new {
                    id = u.Id,
                    name = u.Name,
                    phone = u.Phone ?? "",
                    email = u.Email ?? "",
                    hasEmail = !string.IsNullOrEmpty(u.Email),
                    role = u.Role ?? "Student",
                    deviceId = u.DeviceId ?? ""
                })
                .ToListAsync();

            return Ok(users);
        }

        [HttpPut("admin/reset-student-password/{id}")]
        public async Task<IActionResult> AdminResetStudentPassword(int id, [FromBody] ResetPasswordDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.NewPassword) || dto.NewPassword.Length < 4)
            {
                return BadRequest(new { message = "পাসওয়ার্ড কমপক্ষে ৪ অক্ষরের হতে হবে।" });
            }

            var user = await _context.Users.FindAsync(id);
            if (user == null) return NotFound(new { message = "স্টুডেন্ট পাওয়া যায়নি।" });

            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.NewPassword);
            user.DeviceId = null; // Clear device lock so student can log in right away
            await _context.SaveChangesAsync();

            return Ok(new { success = true, message = $"স্টুডেন্ট {user.Name}-এর পাসওয়ার্ড সফলভাবে রিসেট করা হয়েছে!" });
        }

        [HttpPut("admin/update-student-email/{id}")]
        public async Task<IActionResult> AdminUpdateStudentEmail(int id, [FromBody] ForgotPasswordDto dto)
        {
            string newEmail = (dto.Email ?? "").Trim().ToLower();
            if (string.IsNullOrWhiteSpace(newEmail) || !newEmail.Contains('@'))
            {
                return BadRequest(new { message = "সঠিক ইমেইল ঠিকানা প্রদান করুন।" });
            }

            var existing = await _context.Users.AnyAsync(u => u.Id != id && u.Email != null && u.Email.ToLower() == newEmail);
            if (existing)
            {
                return BadRequest(new { message = "এই ইমেইলটি অন্য একটি অ্যাকাউন্টে ইতিমধ্যে ব্যবহৃত হচ্ছে।" });
            }

            var user = await _context.Users.FindAsync(id);
            if (user == null) return NotFound(new { message = "স্টুডেন্ট পাওয়া যায়নি।" });

            user.Email = newEmail;
            await _context.SaveChangesAsync();

            return Ok(new { success = true, email = user.Email, message = $"স্টুডেন্ট {user.Name}-এর ইমেইল সফলভাবে আপডেট করা হয়েছে!" });
        }
    }
}
