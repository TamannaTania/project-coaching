const fs = require('fs');
let code = fs.readFileSync('Controllers/AuthController.cs', 'utf8');

const makeAdminCode = `
        [HttpPost("make-admin")]
        public async Task<IActionResult> MakeAdmin([FromBody] string email)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
            if (user == null) return NotFound("User not found");
            
            user.Role = "Admin";
            await _context.SaveChangesAsync();
            return Ok("User " + email + " is now an Admin.");
        }
`;

if (!code.includes("MakeAdmin")) {
    code = code.replace('public class AuthController : ControllerBase\r\n    {', 'public class AuthController : ControllerBase\r\n    {\n' + makeAdminCode);
    fs.writeFileSync('Controllers/AuthController.cs', code, 'utf8');
    console.log("Added make-admin endpoint!");
}
