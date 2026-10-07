const fs = require('fs');
let html = fs.readFileSync('wwwroot/index.html', 'utf8');

const aboutStart = html.indexOf('<!-- About Section -->');
const aboutEnd = html.indexOf('<!-- Why Choose Us (Highlights) -->');

if (aboutStart > -1 && aboutEnd > -1) {
    const aboutSection = html.substring(aboutStart, aboutEnd);
    
    // Remove it from its current place
    html = html.replace(aboutSection, '');
    
    // Find where App Download Section starts
    const appPromoStart = html.indexOf('<!-- App Download Section -->');
    if (appPromoStart > -1) {
        html = html.substring(0, appPromoStart) + aboutSection + '\n    ' + html.substring(appPromoStart);
        fs.writeFileSync('wwwroot/index.html', html, 'utf8');
        console.log("Moved About section below Teachers section.");
    } else {
        console.log("Could not find App Promo section.");
    }
} else {
    console.log("Could not find About section.");
}
