const fs = require('fs');
let html = fs.readFileSync('wwwroot/index.html', 'utf8');

const badEn = `freeTitle: "Free Masterclasses", freeDesc: "Watch our free physics classes to experience our teaching methodology before enrolling.", freeTitle: "???? ????????????", freeDesc: "?????? ?????? ????? ????? ??? ?????? ?????? ?????? ????? ???? ????????? ????? ??????", ctaTitle: "Ready to Make Physics Easier?"`;
// The actual string has Bengali characters encoded or as ? depending on powershell saving it.
// Let's replace using regex on en block
const enRegex = /freeTitle: "Free Masterclasses", freeDesc: "Watch our free physics classes to experience our teaching methodology before enrolling.", freeTitle: "[^"]*", freeDesc: "[^"]*", ctaTitle: "Ready to Make Physics Easier\?"/;

html = html.replace(enRegex, `freeTitle: "Free Masterclasses", freeDesc: "Watch our free physics classes to experience our teaching methodology before enrolling.", ctaTitle: "Ready to Make Physics Easier?"`);

// For BN block:
// Add teachersTitle, teachersDesc, freeTitle, freeDesc before ctaTitle
const bnInsertRegex = /ctaTitle: "[^"]*", ctaDesc: "[^"]*", ctaBtn: "[^"]*"/;
const bnRepl = `teachersTitle: "আমাদের শিক্ষকবৃন্দ", teachersDesc: "দেশের সেরা শিক্ষকদের কাছ থেকে শিখুন", freeTitle: "ফ্রি মাস্টারক্লাস", freeDesc: "আমাদের কোর্সে যুক্ত হওয়ার আগে আমাদের পড়ানোর স্টাইল বুঝতে ফ্রি ক্লাসগুলো দেখতে পারেন।", $&`;
html = html.replace(bnInsertRegex, bnRepl);

fs.writeFileSync('wwwroot/index.html', html, 'utf8');
console.log("Translations fixed!");
