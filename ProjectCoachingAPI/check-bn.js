const fs = require('fs');
let html = fs.readFileSync('wwwroot/index.html', 'utf8');

// The English block has BOTH freeTitle values because of the regex.
const badEnglish = `freeTitle: "Free Masterclasses", freeDesc: "Watch our free physics classes to experience our teaching methodology before enrolling.", freeTitle: "ফ্রি মাস্টারক্লাস", freeDesc: "আমাদের কোর্সে যুক্ত হওয়ার আগে আমাদের পড়ানোর স্টাইল বুঝতে ফ্রি ক্লাসগুলো দেখতে পারেন।", ctaTitle: "Ready to Make Physics Easier?"`;
const goodEnglish = `freeTitle: "Free Masterclasses", freeDesc: "Watch our free physics classes to experience our teaching methodology before enrolling.", ctaTitle: "Ready to Make Physics Easier?"`;

html = html.replace(badEnglish, goodEnglish);

// Now for the Bengali block, we need to add it there.
const bnTarget = `ctaTitle: "Ready to Make Physics Easier?"`;
// Let's check what bn actually has for ctaTitle.
