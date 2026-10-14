// session-guard.js - Root proxy / fallback
// Loads modern Scripts/Common/session-guard.js if not already present
(function() {
    var script = document.createElement('script');
    script.src = '/Scripts/Common/session-guard.js';
    document.head.appendChild(script);
})();
