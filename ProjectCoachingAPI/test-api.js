const http = require('http');

async function testApi() {
    try {
        const res = await fetch('http://localhost:5169/api/Teachers', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name: "Test Teacher" })
        });
        
        console.log("Status:", res.status);
        const text = await res.text();
        console.log("Response:", text);
    } catch(e) {
        console.log("Fetch error:", e.message);
    }
}
testApi();
