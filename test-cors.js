// Simple test to check CORS headers from the deployed backend
const https = require('https');

function testCORS(url) {
    return new Promise((resolve, reject) => {
        const req = https.get(url, (res) => {
            console.log(`Status: ${res.statusCode}`);
            console.log('Headers:');
            Object.keys(res.headers).forEach(key => {
                if (key.toLowerCase().includes('access-control') || key.toLowerCase().includes('cors')) {
                    console.log(`  ${key}: ${res.headers[key]}`);
                }
            });
            
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, data }));
        });
        
        req.on('error', reject);
        req.setTimeout(10000, () => reject(new Error('Request timeout')));
    });
}

async function main() {
    try {
        console.log('Testing backend health endpoint...');
        const result = await testCORS('https://news-aggregator-pppy.onrender.com/health');
        console.log('\nResponse data:', result.data);
        
        console.log('\n===================\n');
        
        console.log('Testing backend headlines endpoint...');
        const headlinesResult = await testCORS('https://news-aggregator-pppy.onrender.com/headlines');
        console.log('\nFirst 200 chars of response:', headlinesResult.data.substring(0, 200));
        
    } catch (error) {
        console.error('Error:', error.message);
    }
}

main();