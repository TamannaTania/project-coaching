const fs = require('fs');
let code = fs.readFileSync('Controllers/CoursesController.cs', 'utf8');

code = code.replace(
    'ch.Id,\r\n                ch.Title,\r\n                Contents', 
    'ch.Id,\n                ch.Title,\n                ch.OrderIndex,\n                Contents'
);

code = code.replace(
    'co.Id,\r\n                    co.Title,\r\n                    co.Type,\r\n                    // Send URL', 
    'co.Id,\n                    co.Title,\n                    co.Type,\n                    co.OrderIndex,\n                    // Send URL'
);

// Fallback if CRLF isn't matching perfectly
if (!code.includes('ch.OrderIndex')) {
    code = code.replace('ch.Title,', 'ch.Title, ch.OrderIndex,');
    code = code.replace('co.Type,', 'co.Type, co.OrderIndex,');
}

fs.writeFileSync('Controllers/CoursesController.cs', code, 'utf8');
