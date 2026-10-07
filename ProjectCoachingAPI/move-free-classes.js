const fs = require('fs');
let html = fs.readFileSync('wwwroot/index.html', 'utf8');

// Extract free-classes section
const freeStart = html.indexOf('<!-- Free Classes Section -->');
const freeEnd = html.indexOf('<!-- CTA Section -->');
if (freeStart > -1 && freeEnd > -1) {
    const freeSection = html.substring(freeStart, freeEnd);
    
    // Remove it from current location
    html = html.replace(freeSection, '');
    
    // Find where Teachers section starts
    const teachersStart = html.indexOf('<!-- Meet Our Teachers -->');
    if (teachersStart > -1) {
        // Insert free-classes before Teachers
        html = html.substring(0, teachersStart) + freeSection + html.substring(teachersStart);
        fs.writeFileSync('wwwroot/index.html', html, 'utf8');
        console.log("Section moved successfully!");
    } else {
        console.log("Could not find Teachers section.");
    }
} else {
    console.log("Could not find Free Classes section.");
}
