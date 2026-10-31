const fs = require('fs');

['wwwroot/course.html', 'wwwroot/Views/Course/course.html'].forEach(f => {
    let c = fs.readFileSync(f, 'utf8');
    if (c.includes('id="courseImage"')) {
        c = c.replace(
            /<img id="courseImage"[^>]*>/,
            '<img id="courseImage" src="https://via.placeholder.com/800x400" alt="Course Thumbnail" class="absolute inset-0 w-full h-full object-cover opacity-30" onerror="this.src=\'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?auto=format&fit=crop&q=80&w=800\'">'
        );
        fs.writeFileSync(f, c, 'utf8');
        console.log('Updated:', f);
    }
});
