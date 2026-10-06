const fs = require('fs');

let html = fs.readFileSync('wwwroot/index.html', 'utf8');

// 1. Change navTeachers link
html = html.replace('<a href="#" id="navTeachers"', '<a href="#teachers" id="navTeachers"');

// 2. Extract the entire teachers section
const teachersRegex = /<!-- Meet Our Teachers -->\s*<section id="teachers"[\s\S]*?<\/section>/;
const teachersMatch = html.match(teachersRegex);

if (teachersMatch) {
    const teachersSection = teachersMatch[0];
    
    // Remove it from its current position
    html = html.replace(teachersSection, '');
    
    // Find the end of the courses section
    const coursesRegex = /<section id="courses"[\s\S]*?<\/section>/;
    const coursesMatch = html.match(coursesRegex);
    
    if (coursesMatch) {
        const coursesSection = coursesMatch[0];
        // Inject teachers right after courses
        html = html.replace(coursesSection, coursesSection + '\n\n' + teachersSection);
        
        fs.writeFileSync('wwwroot/index.html', html, 'utf8');
        console.log("Successfully moved teachers section and updated nav link!");
    } else {
        console.log("Error: Could not find courses section.");
    }
} else {
    console.log("Error: Could not find teachers section.");
}

