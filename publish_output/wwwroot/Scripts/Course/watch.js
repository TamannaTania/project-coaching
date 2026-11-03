// watch.js - Video Player & Lecture Playlist Logic
// @ts-nocheck

// Parse Query Parameters
const urlParams = new URLSearchParams(window.location.search);
let currentLectureId = parseInt(urlParams.get('lectureId')) || null;
const courseId = urlParams.get('courseId');
let currentVideoUrl = urlParams.get('url') || '';
let currentTitle = urlParams.get('title') || '';
const isAppMode = urlParams.get('app') === 'true' || sessionStorage.getItem('isApp') === 'true';

let courseData = null;
let allVideoLectures = [];
let currentIndex = -1;

// User authentication check
const token = localStorage.getItem('token');
const userJson = localStorage.getItem('user');
if (userJson) {
    try {
        const user = JSON.parse(userJson);
        if (user.fullName && document.getElementById('userNameDisplay')) {
            document.getElementById('userNameDisplay').innerText = user.fullName;
        }
    } catch(e) {}
}

// Adjust UI for App mode
if (isAppMode) {
    sessionStorage.setItem('isApp', 'true');
    const mainNav = document.getElementById('mainNav');
    if (mainNav) {
        mainNav.classList.add('bg-slate-950', 'border-blue-900/40');
    }
}

function goBack() {
    if (courseId) {
        window.location.href = `/Views/Course/course.html?id=${courseId}${isAppMode ? '&app=true' : ''}`;
    } else if (isAppMode) {
        window.location.href = '/Views/App/app.html';
    } else {
        window.location.href = '/';
    }
}

// Normalize Video URL
function normalizeUrl(url) {
    if (!url) return '';
    let clean = url;
    if (!clean.startsWith('http://') && !clean.startsWith('https://')) {
        clean = '/' + clean.replace(/^\/+/, '');
    }
    try {
        return encodeURI(decodeURI(clean));
    } catch(e) {
        return clean;
    }
}

// Load Course & Validate Enrollment
async function initPlayer() {
    if (!courseId) {
        alert('কোর্স আইডি পাওয়া যায়নি!');
        window.location.href = '/';
        return;
    }

    if (!token) {
        alert('ভিডিও দেখার জন্য অনুগ্রহ করে লগইন করুন।');
        window.location.href = `/Views/Auth/login.html?redirect=${encodeURIComponent(window.location.href)}`;
        return;
    }

    try {
        // Fetch course details with authentication
        const res = await fetch(`/api/Courses/${courseId}`, {
            headers: { 'Authorization': 'Bearer ' + token }
        });

        if (!res.ok) {
            throw new Error('Course fetch failed');
        }

        courseData = await res.json();
        if (document.getElementById('navCourseTitle')) {
            document.getElementById('navCourseTitle').innerText = courseData.title;
        }

        // Flatten all video lectures
        allVideoLectures = [];
        if (courseData.chapters) {
            courseData.chapters.forEach((ch, chIdx) => {
                if (ch.contents) {
                    ch.contents.forEach(item => {
                        if (item.type === 'Video' && item.url) {
                            allVideoLectures.push({
                                ...item,
                                chapterTitle: ch.title,
                                chapterIndex: chIdx + 1,
                                normalizedUrl: normalizeUrl(item.url)
                            });
                        }
                    });
                }
            });
        }

        if (document.getElementById('lectureCountBadge')) {
            document.getElementById('lectureCountBadge').innerText = allVideoLectures.length + ' ক্লাস';
        }

        // Render Curriculum / Playlist
        renderPlaylist();

        // If lectureId is provided, find that specific lecture
        if (currentLectureId) {
            const found = allVideoLectures.find(v => v.id === currentLectureId);
            if (found) {
                currentVideoUrl = found.normalizedUrl;
                currentTitle = found.title;
            }
        } else if (currentVideoUrl) {
            const found = allVideoLectures.find(v => v.normalizedUrl === normalizeUrl(currentVideoUrl));
            if (found) currentLectureId = found.id;
        } else if (allVideoLectures.length > 0) {
            currentLectureId = allVideoLectures[0].id;
            currentVideoUrl = allVideoLectures[0].normalizedUrl;
            currentTitle = allVideoLectures[0].title;
        }

        if (currentVideoUrl) {
            setVideo(currentVideoUrl, currentTitle);
        }

    } catch (err) {
        console.error(err);
        const pc = document.getElementById('playlistContainer');
        if (pc) {
            pc.innerHTML = `
                <div class="text-center py-8 text-red-400 text-xs">
                    <i class="fa-solid fa-triangle-exclamation text-lg mb-2"></i>
                    <p>কোর্স লোড করা যায়নি। অনুগ্রহ করে পুনরায় লগইন করে চেষ্টা করুন।</p>
                </div>
            `;
        }
    }
}

function renderPlaylist() {
    const container = document.getElementById('playlistContainer');
    if (!container) return;
    if (!courseData || !courseData.chapters || courseData.chapters.length === 0) {
        container.innerHTML = '<div class="text-xs text-slate-500 text-center py-6">কোনো কনটেন্ট পাওয়া যায়নি।</div>';
        return;
    }

    let html = '';
    courseData.chapters.forEach((ch, chIdx) => {
        const videos = ch.contents ? ch.contents.filter(c => c.type === 'Video') : [];
        const pdfs = ch.contents ? ch.contents.filter(c => c.type !== 'Video') : [];

        html += `
            <div class="border border-slate-800 rounded-xl overflow-hidden bg-slate-950/40">
                <div class="p-3 bg-slate-900/90 flex items-center justify-between cursor-pointer border-b border-slate-800/80 select-none" onclick="toggleChapterAccordion('ch-content-${ch.id}', 'ch-icon-${ch.id}')">
                    <div class="flex items-center gap-2.5 overflow-hidden">
                        <span class="w-6 h-6 rounded-lg bg-blue-500/20 text-blue-400 text-xs font-bold flex items-center justify-center flex-shrink-0">
                            ${chIdx + 1}
                        </span>
                        <h4 class="text-xs font-bold text-slate-200 truncate">${ch.title}</h4>
                    </div>
                    <div class="flex items-center gap-2 flex-shrink-0 text-slate-400 text-xs">
                        <span>${videos.length} ক্লাস</span>
                        <i id="ch-icon-${ch.id}" class="fa-solid fa-chevron-down text-[10px] transition-transform duration-200"></i>
                    </div>
                </div>

                <div id="ch-content-${ch.id}" class="p-2 flex flex-col gap-1.5 bg-slate-950/80">
        `;

        if (videos.length === 0 && pdfs.length === 0) {
            html += '<div class="text-[11px] text-slate-500 italic p-2 text-center">কোনো কনটেন্ট নেই</div>';
        }

        // Render Videos
        videos.forEach((v) => {
            const normUrl = normalizeUrl(v.url);
            const isPlaying = currentLectureId ? (v.id === currentLectureId) : (normUrl === normalizeUrl(currentVideoUrl));
            const safeTitle = v.title.replace(/'/g, "\\'");

            html += `
                <div onclick="selectLecture(${v.id}, '${normUrl}', '${safeTitle}')" 
                     class="lecture-item p-2.5 rounded-xl cursor-pointer transition flex items-center justify-between gap-3 border ${isPlaying ? 'bg-blue-600/20 border-blue-500/50 text-blue-300 font-bold shadow-md shadow-blue-500/10' : 'bg-slate-900/60 border-slate-800/70 text-slate-300 hover:bg-slate-800 hover:text-white'}"
                     data-url="${normUrl}">
                    <div class="flex items-center gap-2.5 overflow-hidden">
                        <div class="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${isPlaying ? 'bg-blue-600 text-white animate-pulse' : 'bg-slate-800 text-blue-400'}">
                            <i class="fa-solid ${isPlaying ? 'fa-circle-play' : 'fa-play'} text-xs"></i>
                        </div>
                        <span class="text-xs truncate">${v.title}</span>
                    </div>
                    ${isPlaying ? '<span class="text-[10px] bg-blue-500 text-white px-2 py-0.5 rounded-full font-bold flex-shrink-0">চলছে</span>' : '<i class="fa-solid fa-chevron-right text-[10px] text-slate-600"></i>'}
                </div>
            `;
        });

        // Render PDFs
        pdfs.forEach((p) => {
            const normPdf = normalizeUrl(p.url);
            html += `
                <a href="${normPdf}" target="_blank" download class="p-2 rounded-xl transition flex items-center justify-between gap-3 border bg-slate-900/30 border-slate-800/50 text-slate-400 hover:text-red-400 hover:bg-slate-800/60 hover:border-red-500/30">
                    <div class="flex items-center gap-2.5 overflow-hidden">
                        <div class="w-7 h-7 rounded-lg bg-red-500/20 text-red-400 flex items-center justify-center flex-shrink-0">
                            <i class="fa-solid fa-file-pdf text-xs"></i>
                        </div>
                        <span class="text-xs truncate">${p.title}</span>
                    </div>
                    <span class="text-[10px] bg-red-500/20 text-red-300 border border-red-500/30 px-2 py-0.5 rounded-md flex items-center gap-1 flex-shrink-0">
                        <i class="fa-solid fa-download text-[9px]"></i> নোট
                    </span>
                </a>
            `;
        });

        html += `
                </div>
            </div>
        `;
    });

    container.innerHTML = html;
}

function toggleChapterAccordion(contentId, iconId) {
    const el = document.getElementById(contentId);
    const icon = document.getElementById(iconId);
    if (el) {
        el.classList.toggle('hidden');
        if (icon) {
            icon.classList.toggle('rotate-180');
        }
    }
}

// Switch to a new video lecture
function selectLecture(lectureId, videoUrl, title) {
    currentLectureId = lectureId;
    currentVideoUrl = normalizeUrl(videoUrl);
    currentTitle = title;
    setVideo(currentVideoUrl, currentTitle);

    // Update URL without reloading page
    const newUrl = new URL(window.location.href);
    if (currentLectureId) newUrl.searchParams.set('lectureId', currentLectureId);
    newUrl.searchParams.set('url', currentVideoUrl);
    newUrl.searchParams.set('title', currentTitle);
    window.history.replaceState({}, '', newUrl);

    // Re-render playlist to highlight active lecture
    renderPlaylist();
}

function setVideo(url, title) {
    const player = document.getElementById('videoPlayer');
    const source = document.getElementById('videoSource');
    const loader = document.getElementById('videoLoader');

    if (loader) loader.classList.remove('hidden');

    if (source) source.src = url;
    if (player) {
        player.setAttribute('controlsList', 'nodownload');
        player.setAttribute('disablePictureInPicture', 'true');
        player.controlsList = 'nodownload';
        player.oncontextmenu = () => false;
        player.load();
        player.play().catch(e => {
            console.log('Autoplay deferred until interaction:', e);
        });

        player.oncanplay = () => {
            if (loader) loader.classList.add('hidden');
        };
    }

    if (document.getElementById('lectureTitle')) {
        document.getElementById('lectureTitle').innerText = title || 'ভিডিও লেকচার';
    }

    // Find current lecture index by lectureId or URL
    currentIndex = allVideoLectures.findIndex(v => (currentLectureId && v.id === currentLectureId) || v.normalizedUrl === url);
    if (currentIndex !== -1) {
        const currentObj = allVideoLectures[currentIndex];
        currentLectureId = currentObj.id;
        if (document.getElementById('currentChapterName')) {
            document.getElementById('currentChapterName').innerText = `${currentObj.chapterTitle || 'চ্যাপ্টার'}`;
        }
    }

    // Update Previous and Next buttons
    const btnPrev = document.getElementById('btnPrevLecture');
    const btnNext = document.getElementById('btnNextLecture');
    if (btnPrev) btnPrev.disabled = (currentIndex <= 0);
    if (btnNext) btnNext.disabled = (currentIndex === -1 || currentIndex >= allVideoLectures.length - 1);
}

function playPreviousLecture() {
    if (currentIndex > 0) {
        const prev = allVideoLectures[currentIndex - 1];
        selectLecture(prev.id, prev.normalizedUrl, prev.title);
    }
}

function playNextLecture() {
    if (currentIndex >= 0 && currentIndex < allVideoLectures.length - 1) {
        const next = allVideoLectures[currentIndex + 1];
        selectLecture(next.id, next.normalizedUrl, next.title);
    }
}

const vPlayer = document.getElementById('videoPlayer');
if (vPlayer) {
    vPlayer.addEventListener('ended', () => {
        if (currentIndex >= 0 && currentIndex < allVideoLectures.length - 1) {
            playNextLecture();
        }
    });
}

function setSpeed(rate) {
    const player = document.getElementById('videoPlayer');
    if (player) player.playbackRate = rate;
    document.querySelectorAll('.speed-btn').forEach(btn => {
        btn.classList.remove('bg-blue-600', 'text-white', 'active-speed');
        btn.classList.add('text-slate-400');
    });
    if (event && event.target) {
        event.target.classList.remove('text-slate-400');
        event.target.classList.add('bg-blue-600', 'text-white', 'active-speed');
    }
}

function toggleTheaterMode() {
    const player = document.getElementById('videoPlayer');
    if (!player) return;
    if (!document.fullscreenElement) {
        if (player.requestFullscreen) {
            player.requestFullscreen();
        } else if (player.webkitRequestFullscreen) {
            player.webkitRequestFullscreen();
        }
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    }
}

// --- Video Protection & Dynamic Watermark ---
function initVideoProtection() {
    const watermarkEl = document.getElementById('videoWatermark');
    const container = document.getElementById('videoContainer');
    
    // Set watermark identity to student's phone or email
    let identifier = 'PhysicsClassroom';
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
        try {
            const u = JSON.parse(storedUser);
            identifier = u.phone || u.email || u.userName || u.fullName || 'Student';
        } catch(e) {}
    }

    if (watermarkEl) {
        watermarkEl.innerHTML = `<i class="fa-solid fa-shield-halved mr-1 text-[9px] text-blue-400"></i> ${identifier} • PhysicsClassroom`;
        
        // Randomly reposition watermark every 6 seconds to prevent video scraping/recording
        function moveWatermark() {
            if (!container) return;
            const maxTop = 80;
            const minTop = 10;
            const maxLeft = 75;
            const minLeft = 8;
            
            const randomTop = Math.floor(Math.random() * (maxTop - minTop + 1)) + minTop;
            const randomLeft = Math.floor(Math.random() * (maxLeft - minLeft + 1)) + minLeft;
            
            watermarkEl.style.top = randomTop + '%';
            watermarkEl.style.left = randomLeft + '%';
        }

        moveWatermark();
        setInterval(moveWatermark, 6000);
    }

    // Block keyboard shortcuts: F12, Ctrl+S, Ctrl+U, Ctrl+Shift+I/J/C
    document.addEventListener('keydown', function (e) {
        if (e.key === 'F12' ||
            (e.ctrlKey && (e.key === 's' || e.key === 'S' || e.key === 'u' || e.key === 'U')) ||
            (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i' || e.key === 'J' || e.key === 'j' || e.key === 'C' || e.key === 'c'))) {
            e.preventDefault();
            e.stopPropagation();
            return false;
        }
    });

    // Disable right click and enforce nodownload on video & container
    const player = document.getElementById('videoPlayer');
    if (player) {
        player.setAttribute('controlsList', 'nodownload');
        player.setAttribute('disablePictureInPicture', 'true');
        player.controlsList = 'nodownload';
        player.oncontextmenu = () => false;
        player.addEventListener('contextmenu', e => { e.preventDefault(); return false; });
    }
    if (container) {
        container.oncontextmenu = () => false;
        container.addEventListener('contextmenu', e => { e.preventDefault(); return false; });
    }
}

// Run on load
window.addEventListener('DOMContentLoaded', () => {
    initPlayer();
    initVideoProtection();
});
