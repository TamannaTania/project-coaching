const fs = require('fs');

function fix(filePath, entity) {
    let html = fs.readFileSync(filePath, 'utf8');

    // For admin-success.html, it looks like:
    // <div class="flex gap-2">\n  <button onclick="editStudent...
    // repeated multiple times, ending with a Delete button and closing div.
    
    // We can just use a regex to grab the entire messy block of buttons starting with `<div class="flex gap-2">` and ending with `</button>\n                          </div>`
    
    if (entity === 'success') {
        const regex = /<div class="flex gap-2">\s*<button onclick="editStudent[\s\S]*?<button onclick="deleteStudent\(\$\{s\.id\}\)"[^>]*>Delete<\/button>\s*<\/div>/g;
        const replacement = `<div class="flex gap-2">
                                <button onclick="editStudent(\${s.id}, '\${s.name.replace(/'/g, "\\'")}', '\${s.institution.replace(/'/g, "\\'")}', '\${s.batch.replace(/'/g, "\\'")}', '\${s.imageUrl.replace(/'/g, "\\'")}')" class="bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white px-4 py-2 rounded-xl font-bold transition">Edit</button>
                                <button onclick="deleteStudent(\${s.id})" class="bg-red-50 text-red-500 hover:bg-red-500 hover:text-white px-4 py-2 rounded-xl font-bold transition">Delete</button>
                            </div>`;
        html = html.replace(regex, replacement);
    } else {
        const regex = /<div class="flex gap-2">\s*<button onclick="editClass[\s\S]*?<button onclick="deleteClass\(\$\{fc\.id\}\)"[^>]*>Delete<\/button>\s*<\/div>/g;
        const replacement = `<div class="flex gap-2">
                                <button onclick="editClass(\${fc.id}, '\${fc.title.replace(/'/g, "\\'")}', '\${fc.videoUrl.replace(/'/g, "\\'")}', '\${fc.thumbnailUrl.replace(/'/g, "\\'")}')" class="bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white px-4 py-2 rounded-xl font-bold transition">Edit</button>
                                <button onclick="deleteClass(\${fc.id})" class="bg-red-50 text-red-500 hover:bg-red-500 hover:text-white px-4 py-2 rounded-xl font-bold transition">Delete</button>
                            </div>`;
        html = html.replace(regex, replacement);
    }

    fs.writeFileSync(filePath, html, 'utf8');
}

fix('wwwroot/admin-success.html', 'success');
fix('wwwroot/admin-freeclasses.html', 'freeclass');
console.log("Fixed multiple edit buttons.");
