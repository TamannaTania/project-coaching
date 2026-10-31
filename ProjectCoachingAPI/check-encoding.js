const fs = require('fs');
const files = [
  'wwwroot/index.html',
  'wwwroot/Views/Home/index.html',
  'wwwroot/Scripts/Home/index.js',
  'wwwroot/admin.html',
  'wwwroot/Views/Admin/admin.html',
  'wwwroot/profile.html',
  'wwwroot/Views/Profile/profile.html',
  'wwwroot/course.html',
  'wwwroot/Views/Course/course.html'
];
files.forEach(f => {
  if (fs.existsSync(f)) {
    const s = fs.readFileSync(f, 'utf8');
    const qMatches = (s.match(/\?{3,}/g) || []).length;
    const moji = (s.match(/à¦|à§/g) || []).length;
    console.log(f + ': ??? sequences=' + qMatches + ', mojibake=' + moji);
  }
});
