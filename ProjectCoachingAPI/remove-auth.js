const fs = require('fs');
let code = fs.readFileSync('Controllers/TeachersController.cs', 'utf8');

code = code.replace(/\[Authorize\(Roles = "Admin"\)\]/g, '// [Authorize(Roles = "Admin")]');

fs.writeFileSync('Controllers/TeachersController.cs', code, 'utf8');
