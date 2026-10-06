const fs = require('fs');
let html = fs.readFileSync('wwwroot/index.html', 'utf8');

const regex = /<h2 class="text-3xl md:text-4xl font-extrabold text-slate-800 mb-2 relative inline-block">[\s\S]*?<span class="sparkle-text">[\s\S]*?<i class="fa-solid fa-chalkboard-user text-purple-500 mr-2"><\/i><span id="teachersTitle">Meet Our Teachers<\/span>[\s\S]*?<\/span>[\s\S]*?<\/h2>/;

const replacementHtml = `<div class="heading-container mb-4">
                      <h2 class="text-3xl md:text-4xl font-extrabold text-slate-800 sparkle-text">
                          <i class="fa-solid fa-chalkboard-user text-purple-500 mr-2"></i><span id="teachersTitle">Meet Our Teachers</span>
                      </h2>
                  </div>`;

if(html.match(regex)) {
    html = html.replace(regex, replacementHtml);
    fs.writeFileSync('wwwroot/index.html', html, 'utf8');
    console.log("Heading container fixed with regex!");
} else {
    console.log("Regex not found!");
}
