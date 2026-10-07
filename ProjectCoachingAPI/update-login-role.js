const fs = require('fs');

// 1. Update AuthController.cs to return role
let authCode = fs.readFileSync('Controllers/AuthController.cs', 'utf8');
authCode = authCode.replace('return Ok(new { token = token, username = user.Name });', 
                            'return Ok(new { token = token, username = user.Name, role = user.Role });');
fs.writeFileSync('Controllers/AuthController.cs', authCode, 'utf8');

// 2. Update login.html to redirect based on role
let loginCode = fs.readFileSync('wwwroot/login.html', 'utf8');
const oldLoginLogic = `localStorage.setItem('token', data.token);
                    localStorage.setItem('username', data.username);
                    
                    const urlParams = new URLSearchParams(window.location.search);`;

const newLoginLogic = `localStorage.setItem('token', data.token);
                    localStorage.setItem('username', data.username);
                    localStorage.setItem('role', data.role);
                    
                    const urlParams = new URLSearchParams(window.location.search);`;

loginCode = loginCode.replace(oldLoginLogic, newLoginLogic);

const oldRedirect = `if(returnUrl) {
                        window.location.href = returnUrl;
                    } else {
                        window.location.href = 'profile.html';
                    }`;

const newRedirect = `if(returnUrl) {
                        window.location.href = returnUrl;
                    } else {
                        if (data.role === 'Admin') {
                            window.location.href = 'admin.html';
                        } else {
                            window.location.href = 'profile.html';
                        }
                    }`;

loginCode = loginCode.replace(oldRedirect, newRedirect);
fs.writeFileSync('wwwroot/login.html', loginCode, 'utf8');

console.log("Updated Login Logic for Role Redirection!");
