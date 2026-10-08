const fs = require('fs');
let html = fs.readFileSync('wwwroot/index.html', 'utf8');

// Update CSS
const oldCss = `.marquee-container {
            overflow: hidden;
            white-space: nowrap;
            width: 100%;
        }`;
const newCss = `.marquee-container {
            overflow: hidden;
            white-space: nowrap;
            width: 100%;
            -webkit-mask-image: linear-gradient(to right, transparent, black 5%, black 95%, transparent);
            mask-image: linear-gradient(to right, transparent, black 5%, black 95%, transparent);
        }`;
html = html.replace(oldCss, newCss);

// Update HTML
const oldHtml = `<div class="marquee-container relative px-4">`;
const newHtml = `<div class="max-w-7xl mx-auto px-4"><div class="marquee-container relative px-4 py-4">`;
html = html.replace(oldHtml, newHtml);

// Fix closing div
const endTag = `</div>\n        </section>`;
const newEndTag = `</div>\n          </div>\n        </section>`;
html = html.replace(endTag, newEndTag);

fs.writeFileSync('wwwroot/index.html', html, 'utf8');
console.log("Applied fade and width to marquee.");
