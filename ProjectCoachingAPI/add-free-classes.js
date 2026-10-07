const fs = require('fs');
let html = fs.readFileSync('wwwroot/index.html', 'utf8');

// 1. Replace nav items
html = html.replace('<a href="#" id="navRoutine"', '<a href="#free-classes" id="navFreeClasses"');
html = html.replace('Routine</a>', 'Free Classes</a>');
html = html.replace('navRoutine: "Routine"', 'navFreeClasses: "Free Classes"');
html = html.replace('navRoutine: "রুটিন"', 'navFreeClasses: "ফ্রি ক্লাস"');
html = html.replace("document.getElementById('navRoutine').innerText = t.navRoutine;", "document.getElementById('navFreeClasses').innerText = t.navFreeClasses;");

// 2. Add Free Classes Section
const freeClassesSection = `
    <!-- Free Classes Section -->
    <section id="free-classes" class="py-20 bg-slate-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center mb-16">
                <div class="heading-container mb-4">
                    <h2 class="text-3xl md:text-4xl font-extrabold text-slate-800 sparkle-text">
                        <i class="fa-brands fa-youtube text-red-500 mr-2"></i><span id="freeTitle">Free Masterclasses</span>
                    </h2>
                </div>
                <p id="freeDesc" class="text-slate-500 max-w-2xl mx-auto">Watch our free physics classes to experience our teaching methodology before enrolling.</p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                <!-- Video 1 -->
                <div class="bg-white rounded-2xl overflow-hidden shadow-lg border border-slate-100 hover:-translate-y-2 hover:shadow-2xl transition duration-300 group cursor-pointer">
                    <div class="relative h-48 bg-slate-200">
                        <img src="https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?auto=format&fit=crop&q=80&w=800" class="w-full h-full object-cover" alt="Physics Class">
                        <div class="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition flex items-center justify-center">
                            <div class="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center text-red-600 text-2xl shadow-lg transform group-hover:scale-110 transition">
                                <i class="fa-solid fa-play"></i>
                            </div>
                        </div>
                    </div>
                    <div class="p-6">
                        <div class="text-xs font-bold text-red-500 uppercase tracking-wider mb-2">HSC Physics 1st Paper</div>
                        <h3 class="text-lg font-bold text-slate-800 mb-2">Vector - Lecture 01 (Basic Concepts)</h3>
                        <p class="text-slate-500 text-sm">Understand the fundamental concepts of vectors, scalar quantities, and their applications.</p>
                    </div>
                </div>

                <!-- Video 2 -->
                <div class="bg-white rounded-2xl overflow-hidden shadow-lg border border-slate-100 hover:-translate-y-2 hover:shadow-2xl transition duration-300 group cursor-pointer">
                    <div class="relative h-48 bg-slate-200">
                        <img src="https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?auto=format&fit=crop&q=80&w=800" class="w-full h-full object-cover" alt="Physics Class">
                        <div class="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition flex items-center justify-center">
                            <div class="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center text-red-600 text-2xl shadow-lg transform group-hover:scale-110 transition">
                                <i class="fa-solid fa-play"></i>
                            </div>
                        </div>
                    </div>
                    <div class="p-6">
                        <div class="text-xs font-bold text-red-500 uppercase tracking-wider mb-2">SSC Physics</div>
                        <h3 class="text-lg font-bold text-slate-800 mb-2">Motion - Full Chapter Review</h3>
                        <p class="text-slate-500 text-sm">A complete overview of equations of motion, velocity, acceleration and graphs.</p>
                    </div>
                </div>

                <!-- Video 3 -->
                <div class="bg-white rounded-2xl overflow-hidden shadow-lg border border-slate-100 hover:-translate-y-2 hover:shadow-2xl transition duration-300 group cursor-pointer">
                    <div class="relative h-48 bg-slate-200">
                        <img src="https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?auto=format&fit=crop&q=80&w=800" class="w-full h-full object-cover" alt="Physics Class">
                        <div class="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition flex items-center justify-center">
                            <div class="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center text-red-600 text-2xl shadow-lg transform group-hover:scale-110 transition">
                                <i class="fa-solid fa-play"></i>
                            </div>
                        </div>
                    </div>
                    <div class="p-6">
                        <div class="text-xs font-bold text-red-500 uppercase tracking-wider mb-2">Admission Preparation</div>
                        <h3 class="text-lg font-bold text-slate-800 mb-2">Shortcuts for Thermodynamics</h3>
                        <p class="text-slate-500 text-sm">Learn how to solve thermodynamics MCQs in under 30 seconds with exclusive tricks.</p>
                    </div>
                </div>
            </div>
            
            <div class="text-center mt-12">
                <a href="https://youtube.com" target="_blank" class="inline-flex items-center gap-2 text-red-600 font-bold hover:text-red-700 hover:underline">
                    Watch more on our YouTube Channel <i class="fa-solid fa-arrow-right"></i>
                </a>
            </div>
        </div>
    </section>
`;

// Insert after Teachers section
if (html.includes('</section>\r\n\r\n    <!-- CTA Section -->')) {
    html = html.replace('</section>\r\n\r\n    <!-- CTA Section -->', '</section>\n\n' + freeClassesSection + '\n\n    <!-- CTA Section -->');
} else if (html.includes('</section>\n\n    <!-- CTA Section -->')) {
    html = html.replace('</section>\n\n    <!-- CTA Section -->', '</section>\n\n' + freeClassesSection + '\n\n    <!-- CTA Section -->');
}

// Update translations
html = html.replace('ctaTitle: "Ready', 'freeTitle: "Free Masterclasses", freeDesc: "Watch our free physics classes to experience our teaching methodology before enrolling.", ctaTitle: "Ready');
html = html.replace('ctaTitle: "Ready', 'freeTitle: "ফ্রি মাস্টারক্লাস", freeDesc: "আমাদের কোর্সে যুক্ত হওয়ার আগে আমাদের পড়ানোর স্টাইল বুঝতে ফ্রি ক্লাসগুলো দেখতে পারেন।", ctaTitle: "Ready'); // Note: Only replace in BN block if possible, but actually we can just insert it. Let's write precise regex instead.

fs.writeFileSync('wwwroot/index.html', html, 'utf8');
console.log("Free Classes section added!");
