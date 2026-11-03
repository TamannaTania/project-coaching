const fs = require('fs');

const code = 
        function updateAuthNav(lang) {
            const token = localStorage.getItem('token');
            const username = localStorage.getItem('username');
            const container = document.getElementById('authNavContainer');
            if(!container) return;
            
            if(token) {
                const logoutText = lang === 'bn' ? 'লগআউট' : 'Logout';
                const profileText = username ? username : (lang === 'bn' ? 'প্রোফাইল' : 'Profile');
                container.innerHTML = \
                    <a href="#" class="text-slate-600 hover:text-emerald-600 font-medium transition flex items-center gap-2"><i class="fa-solid fa-user-circle text-xl"></i> <span class="hidden md:inline">\ + profileText + \</span></a>
                    <button onclick="logout()" class="text-red-500 hover:text-red-700 font-bold transition flex items-center gap-2"><i class="fa-solid fa-arrow-right-from-bracket"></i> <span class="hidden md:inline">\ + logoutText + \</span></button>
                \;
            } else {
                const loginText = lang === 'bn' ? 'লগইন' : 'Login';
                container.innerHTML = \<a href="login.html" class="bg-emerald-600 text-white px-5 py-2 rounded-full font-bold hover:bg-emerald-700 transition shadow-lg shadow-emerald-200 flex items-center gap-2"><i class="fa-solid fa-user text-sm"></i> \ + loginText + \</a>\;
            }
        }
;

function fixFile(file) {
    let content = fs.readFileSync(file, 'utf8');
    const startIdx = content.indexOf('function updateAuthNav(lang)');
    const endStr = 'function setLanguage(lang)';
    const endIdx = content.indexOf(endStr);
    
    if (startIdx !== -1 && endIdx !== -1) {
        content = content.substring(0, startIdx) + code.trim() + '\n\n        ' + content.substring(endIdx);
        fs.writeFileSync(file, content, 'utf8');
        console.log('Fixed ' + file);
    } else {
        console.log('Could not fix ' + file);
    }
}

fixFile('index.html');
fixFile('course.html');
