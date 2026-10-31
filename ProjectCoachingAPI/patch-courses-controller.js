const fs = require('fs');
let code = fs.readFileSync('Controllers/CoursesController.cs', 'utf8');

// Find line "bool isEnrolled = false;"
code = code.replace(/bool\s+isEnrolled\s*=\s*false;/, 'bool isEnrolled = false;\r\n            bool isAdmin = false;');

// Find "var user = await _context.Users.FirstOrDefaultAsync..."
code = code.replace(/if\s*\(user\s*!=\s*null\)\s*\{/, 'if (user != null)\r\n                {\r\n                    isAdmin = (user.Role == "Admin");');

// Find "if (enrollment != null || user.Role == "Admin")"
code = code.replace(/if\s*\(enrollment\s*!=\s*null\s*\|\|\s*user\.Role\s*==\s*"Admin"\)/, 'if (enrollment != null)');

// Find Url = isEnrolled ? co.Url : ""
code = code.replace(/Url\s*=\s*isEnrolled\s*\?\s*co\.Url\s*:\s*""/, 'Url = (isEnrolled || isAdmin) ? co.Url : ""');

// Ensure Batch in return
if (!code.includes('course.Batch,')) {
    code = code.replace('course.ImageUrl,', 'course.ImageUrl,\r\n                course.Batch,');
}

fs.writeFileSync('Controllers/CoursesController.cs', code, 'utf8');
console.log("Updated CoursesController.cs successfully!");
