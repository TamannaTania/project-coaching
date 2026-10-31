const fs = require('fs');

const files = ['wwwroot/index.html', 'wwwroot/Views/Home/index.html'];

files.forEach(filePath => {
    if (fs.existsSync(filePath)) {
        let content = fs.readFileSync(filePath, 'utf8');
        const target = '<!-- App Download Section -->';
        if (content.includes(target)) {
            content = content.replace(
                /<!-- App Download Section -->\s*<section class="py-16 bg-emerald-50 border-t border-emerald-100">/,
                '<!-- App Download Section (Hidden until mobile app is launched) -->\r\n    <section id="appDownloadSection" class="py-16 bg-emerald-50 border-t border-emerald-100" style="display: none;">'
            );
            fs.writeFileSync(filePath, content, 'utf8');
            console.log('Successfully updated:', filePath);
        } else {
            console.log('Target not found in:', filePath);
        }
    }
});
