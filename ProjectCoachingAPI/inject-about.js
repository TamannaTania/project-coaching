const fs = require('fs');
let html = fs.readFileSync('wwwroot/index.html', 'utf8');

const aboutSection = `
    <!-- About Section -->
    <section id="about" class="py-20 bg-white">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex flex-col md:flex-row items-center gap-12">
                <div class="md:w-1/2">
                    <div class="relative">
                        <img id="aboutImg" src="https://images.unsplash.com/photo-1524169358666-79f22534bc6e?auto=format&fit=crop&q=80&w=800" class="rounded-3xl shadow-2xl object-cover w-full h-[400px]">
                        <div class="absolute -bottom-6 -right-6 bg-emerald-600 text-white p-6 rounded-2xl shadow-xl">
                            <i class="fa-solid fa-award text-4xl mb-2"></i>
                            <h4 class="font-bold text-xl">Best Education</h4>
                        </div>
                    </div>
                </div>
                <div class="md:w-1/2">
                    <div class="heading-container mb-6 text-left">
                        <h2 class="text-3xl md:text-5xl font-extrabold text-slate-800 sparkle-text">
                            <span id="aboutTitle">About PhysicsAcademy</span>
                        </h2>
                    </div>
                    <p id="aboutDesc" class="text-lg text-slate-600 mb-8 leading-relaxed">
                        We are dedicated to providing the best physics education for HSC and Admission candidates. Our goal is to make physics intuitive, engaging, and easy to understand.
                    </p>
                    <a href="#courses" class="inline-block bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-full font-bold shadow-lg shadow-emerald-200 transition transform hover:-translate-y-1">
                        Learn More
                    </a>
                </div>
            </div>
        </div>
    </section>
`;

if (!html.includes('id="about" class="py-20 bg-white"')) {
    html = html.replace('<!-- Why Choose Us (Highlights) -->', aboutSection + '\n    <!-- Why Choose Us (Highlights) -->');
    fs.writeFileSync('wwwroot/index.html', html, 'utf8');
    console.log("Added about section before why choose us.");
} else {
    console.log("Already exists.");
}
