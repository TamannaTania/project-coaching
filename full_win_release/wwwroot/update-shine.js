const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const shineStyle = `
        .course-card-shine {
            position: relative;
        }
        .course-card-shine::after {
            content: '';
            position: absolute;
            top: 0;
            left: -150%;
            width: 50%;
            height: 100%;
            background: linear-gradient(to right, rgba(255,255,255,0) 0%, rgba(255,255,255,0.6) 50%, rgba(255,255,255,0) 100%);
            transform: skewX(-25deg);
            z-index: 20;
            pointer-events: none;
        }
        .course-card-shine:hover::after {
            animation: shine-sweep 0.75s ease-in-out;
        }
        @keyframes shine-sweep {
            0% { left: -150%; }
            100% { left: 200%; }
        }
    </style>
`;

html = html.replace('</style>', shineStyle);

// Add course-card-shine to the course card JS template
const oldCardWrapper = `<div class="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border border-slate-100 flex flex-col h-full cursor-pointer" onclick="window.location.href='course.html?id=\${course.id}'">`;
const newCardWrapper = `<div class="group course-card-shine bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border border-slate-100 flex flex-col h-full cursor-pointer" onclick="window.location.href='course.html?id=\${course.id}'">`;

html = html.replace(oldCardWrapper, newCardWrapper);

fs.writeFileSync('index.html', html, 'utf8');
