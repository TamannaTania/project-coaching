const fs = require('fs');

const file = 'wwwroot/admin.html';
if(fs.existsSync(file)) {
    let html = fs.readFileSync(file, 'utf8');
    
    // Add redirect logic
    const redirectScript = `const token = localStorage.getItem('token');
        if (!token) {
            window.location.href = 'login.html';
        }`;
    
    // Replace existing token declaration
    if(html.includes("const token = localStorage.getItem('token');")) {
        html = html.replace("const token = localStorage.getItem('token');", redirectScript);
        fs.writeFileSync(file, html, 'utf8');
        console.log("Added redirect to admin.html");
    } else {
        console.log("Could not find token declaration in admin.html");
    }
}
