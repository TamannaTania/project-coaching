const fs = require('fs');

const files = ['wwwroot/login.html', 'wwwroot/register.html'];
const redirectScript = `
        const existingToken = localStorage.getItem('token');
        if (existingToken) {
            window.location.href = 'profile.html';
        }
`;

files.forEach(file => {
    if(fs.existsSync(file)) {
        let html = fs.readFileSync(file, 'utf8');
        if(!html.includes('existingToken')) {
            html = html.replace('<script>', '<script>' + redirectScript);
            fs.writeFileSync(file, html, 'utf8');
        }
    }
});
console.log("Added logged-in redirects for login/register pages");
