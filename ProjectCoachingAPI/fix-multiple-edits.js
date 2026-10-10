const fs = require('fs');

function fixMultipleEdits(filePath) {
    let html = fs.readFileSync(filePath, 'utf8');
    
    // We need to find the `container.innerHTML += ...` block and just rewrite it cleanly.
    // It's probably a mess of `<div class="flex gap-2"> <button>Edit</button> <div class="flex gap-2"> <button>Edit</button> ...`
    
    // Let's use a regex to match the entire button div and replace it with a single clean one.
    // The messy part looks like:
    // <div class="flex gap-2"> ... Edit ... <div class="flex gap-2"> ... Edit ... <button ...>Delete</button> </div> </div>
    
    // An easier way is to just grab the raw file before my script messed it up? No, I committed it.
    // Let's just fix it with regex.
    // We want to replace everything from `<button onclick="edit` to `>Delete</button>` with a single pair of buttons.
    
    // Since the button syntax is slightly different for success and freeclasses, I'll do them separately.
    
    if (filePath.includes('admin-success')) {
        const messyRegex = /<div class="flex gap-2">[\s\S]*?<button onclick="deleteStudent\(\$\{s\.id\}\)" class="bg-red-50[^>]+>Delete<\/button>[\s\S]*?<\/div>\s*<\/div>\s*<\/div>`/g;
        
        const cleanButtons = `<div class="flex gap-2">
                            <button onclick="editStudent(\${s.id}, '\${s.name.replace(/'/g, "\\'")}', '\${s.institution.replace(/'/g, "\\'")}', '\${s.batch.replace(/'/g, "\\'")}', '\${s.imageUrl.replace(/'/g, "\\'")}')" class="bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white px-4 py-2 rounded-xl font-bold transition">Edit</button>
                            <button onclick="deleteStudent(\${s.id})" class="bg-red-50 text-red-500 hover:bg-red-500 hover:text-white px-4 py-2 rounded-xl font-bold transition">Delete</button>
                        </div>
                    </div>\`;`;
                    
        html = html.replace(messyRegex, cleanButtons);
    } else if (filePath.includes('admin-freeclasses')) {
        const messyRegex = /<div class="flex gap-2">[\s\S]*?<button onclick="deleteClass\(\$\{fc\.id\}\)" class="bg-red-50[^>]+>Delete<\/button>[\s\S]*?<\/div>\s*<\/div>\s*<\/div>`/g;
        
        const cleanButtons = `<div class="flex gap-2">
                            <button onclick="editClass(\${fc.id}, '\${fc.title.replace(/'/g, "\\'")}', '\${fc.videoUrl.replace(/'/g, "\\'")}', '\${fc.thumbnailUrl.replace(/'/g, "\\'")}')" class="bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white px-4 py-2 rounded-xl font-bold transition">Edit</button>
                            <button onclick="deleteClass(\${fc.id})" class="bg-red-50 text-red-500 hover:bg-red-500 hover:text-white px-4 py-2 rounded-xl font-bold transition">Delete</button>
                        </div>
                    </div>\`;`;
                    
        html = html.replace(messyRegex, cleanButtons);
    }

    fs.writeFileSync(filePath, html, 'utf8');
}

fixMultipleEdits('wwwroot/admin-success.html');
fixMultipleEdits('wwwroot/admin-freeclasses.html');
console.log("Fixed multiple edit buttons.");
