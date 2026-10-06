const http = require('http');

async function testApi() {
    try {
        const res = await fetch('http://localhost:5169/api/Teachers');
        const text = await res.text();
        console.log("Response length:", text.length);
        console.log("Data:", text.substring(0, 500));
    } catch(e) {
        console.log("Fetch error:", e.message);
    }
}
testApi();
