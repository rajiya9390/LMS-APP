const https = require('https');
https.get('https://www.youtube.com/results?search_query=telusko+core+java+playlist', (res) => {
    let data = '';
    res.on('data', d => data += d);
    res.on('end', () => {
        const rx = /"videoId":"([a-zA-Z0-9_-]{11})"/g;
        let match;
        let count = 0;
        let seen = new Set();
        while ((match = rx.exec(data)) && count < 10) {
            if (!seen.has(match[1])) {
                console.log(match[1]);
                seen.add(match[1]);
                count++;
            }
        }
    });
}).on('error', console.error);
