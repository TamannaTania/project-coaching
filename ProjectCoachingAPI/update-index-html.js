const fs = require('fs');
let html = fs.readFileSync('wwwroot/index.html', 'utf8');

const teachersSection = `
    <!-- Meet Our Teachers -->
    <section id="teachers" class="py-20 bg-white">
        <div class="max-w-7xl mx-auto px-6">
            <div class="text-center mb-16">
                <h2 class="text-3xl md:text-4xl font-extrabold text-slate-800 mb-2 relative inline-block">
                    <span class="sparkle-text">
                        <i class="fa-solid fa-chalkboard-user text-purple-500 mr-2"></i><span id="teachersTitle">Meet Our Teachers</span>
                    </span>
                </h2>
                <p id="teachersDesc" class="text-slate-500 mt-4 text-lg">Learn from the best educators in the field.</p>
            </div>
            
            <div id="teachersGrid" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                <!-- Teachers will be injected here -->
                <div class="col-span-full text-center text-slate-400 py-10">
                    <i class="fa-solid fa-spinner fa-spin text-3xl mb-3"></i>
                    <p>Loading teachers...</p>
                </div>
            </div>
        </div>
    </section>
`;

const regex = /<section id="courses"/;
if(html.match(regex)) {
    html = html.replace(regex, teachersSection + '\n    <section id="courses"');
    fs.writeFileSync('wwwroot/index.html', html, 'utf8');
    console.log("Successfully injected teachers section into HTML before courses!");
} else {
    console.log("Could not find courses section either!");
}
