const fs = require('fs');
let html = fs.readFileSync('wwwroot/index.html', 'utf8');

// The entire translations block is:
// const translations = { ... };

// Let's just recreate the whole translations object to be safe!
const translationsRegex = /const translations = \{[\s\S]*?\};/;
const properTranslations = `const translations = {
            en: {
                navHome: "Home", navAbout: "About", navCourses: "Courses", navTeachers: "Teachers", navFreeClasses: "Free Classes", navEnroll: "Enroll Now",
                heroTitle: "Master Physics. <br>Build Strong Concepts. <br><span class='text-emerald-300'>Achieve Better Results.</span>",
                heroSub: "Concept-based Physics learning with expert guidance, regular practice, and exam-focused preparation for SSC, HSC & Admission.",
                btnExplore: "Explore Courses", btnContact: "Contact Us",
                whyTitle: "Why Choose Us?",
                f1Title: "Strong Concepts", f1Desc: "Deep understanding of core physics principles from the basics.",
                f2Title: "Easy Explanation", f2Desc: "Complex topics broken down into simple, digestible lessons.",
                f3Title: "Numerical Solving", f3Desc: "Extensive practice on mathematical problems and theories.",
                f4Title: "Regular Exams", f4Desc: "Weekly tests and evaluations to track student progress.",
                coursesTitle: "Featured Courses",
                teachersTitle: "Meet Our Teachers", teachersDesc: "Learn from the best educators in the field.",
                appTitle: "Learn Anywhere, Anytime.", appDesc: "Download the <span class='font-bold text-emerald-600 font-sans'>PhysicsAcademy</span> mobile app to watch premium video lectures, give exams, and access study materials on the go.",
                successTitle: "Our Pride: Successful Students", successDesc: "Hundreds of our students are studying in top universities.",
                freeTitle: "Free Masterclasses", freeDesc: "Watch our free physics classes to experience our teaching methodology before enrolling.",
                ctaTitle: "Ready to Make Physics Easier?", ctaDesc: "Join our upcoming batches and start your journey towards excellence.", ctaBtn: "Join Our Course Today"
            },
            bn: {
                navHome: "হোম", navAbout: "আমাদের সম্পর্কে", navCourses: "কোর্সসমূহ", navTeachers: "শিক্ষকবৃন্দ", navFreeClasses: "ফ্রি ক্লাস", navEnroll: "এনরোল করুন",
                heroTitle: "ফিজিক্স শিখুন. <br>কনসেপ্ট ক্লিয়ার করুন. <br><span class='text-emerald-300'>সেরা রেজাল্ট অর্জন করুন.</span>",
                heroSub: "SSC, HSC এবং এডমিশন প্রস্তুতি নেওয়ার সবচেয়ে কার্যকরী, সহজবোধ্য ও রিয়েল-লাইফ কনসেপ্ট ভিত্তিক ফিজিক্স একাডেমি",
                btnExplore: "কোর্সগুলো দেখুন", btnContact: "যোগাযোগ করুন",
                whyTitle: "কেনো আমাদের বেছে নিবেন",
                f1Title: "মজবুত কনসেপ্ট", f1Desc: "মুখস্থ না করে প্রতিটি টপিকের গভীরে গিয়ে শেখার সুযোগ",
                f2Title: "সহজ উপস্থাপনা", f2Desc: "কঠিন বিষয়গুলো একদম সহজ ভাষায় বুঝিয়ে বলা",
                f3Title: "ম্যাথমেটিক্যাল প্রবলেম", f3Desc: "অসংখ্য অংক ও থিওরি নিজে নিজে সল্ভ করার গাইডলাইন দেওয়া হয়",
                f4Title: "নিয়মিত পরীক্ষা", f4Desc: "স্টুডেন্টদের অবস্থা যাচাই করার জন্য নিয়মিত মূল্যায়ন পরীক্ষা নেওয়া হয়",
                coursesTitle: "আমাদের কোর্সসমূহ",
                teachersTitle: "আমাদের শিক্ষকবৃন্দ", teachersDesc: "দেশের সেরা শিক্ষকদের কাছ থেকে শিখুন",
                appTitle: "যেকোনো জায়গায়, যেকোনো সময় শিখুন", appDesc: "<span class='font-bold text-emerald-600 font-sans'>PhysicsAcademy</span> মোবাইল অ্যাপ ডাউনলোড করে যেকোনো সময় প্রিমিয়াম ভিডিও লেকচার, এক্সাম ও স্টাডি ম্যাটেরিয়ালস অ্যাক্সেস করুন।",
                successTitle: "আমাদের গর্ব: সফল ছাত্রছাত্রীরা", successDesc: "আমাদের শত শত ছাত্রছাত্রী দেশের সেরা বিশ্ববিদ্যালয়গুলোতে পড়াশোনা করছে।",
                freeTitle: "ফ্রি মাস্টারক্লাস", freeDesc: "আমাদের কোর্সে যুক্ত হওয়ার আগে আমাদের পড়ানোর স্টাইল বুঝতে ফ্রি ক্লাসগুলো দেখতে পারেন।",
                ctaTitle: "ফিজিক্সকে জয় করতে প্রস্তুত?", ctaDesc: "আমাদের নতুন ব্যাচগুলোতে জয়েন করে নিজের বেসিক শক্ত করুন এখনই।", ctaBtn: "আজই কোর্সে এনরোল হন"
            }
        };`;

html = html.replace(translationsRegex, properTranslations);
fs.writeFileSync('wwwroot/index.html', html, 'utf8');
console.log("Translations successfully replaced!");
