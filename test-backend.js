// Test script to check backend response
const https = require('https');

function testBackend(endpoint) {
    return new Promise((resolve, reject) => {
        const url = `https://news-aggregator-pppy.onrender.com${endpoint}`;
        console.log(`Testing ${url}...`);
        
        https.get(url, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    const parsed = JSON.parse(data);
                    console.log(`\n=== ${endpoint} ===`);
                    console.log(`Status: ${parsed.status}`);
                    console.log(`Total Results: ${parsed.totalResults}`);
                    console.log(`Articles Count: ${parsed.articles?.length}`);
                    
                    if (parsed.articles && parsed.articles.length > 0) {
                        const firstArticle = parsed.articles[0];
                        console.log('\nFirst Article:');
                        console.log(`Title: ${firstArticle.title}`);
                        console.log(`Source: ${firstArticle.source?.name}`);
                        console.log(`Image URL: ${firstArticle.urlToImage}`);
                        console.log(`Description: ${firstArticle.description?.substring(0, 100)}...`);
                    }
                    resolve(parsed);
                } catch (e) {
                    reject(e);
                }
            });
        }).on('error', reject);
    });
}

async function main() {
    try {
        await testBackend('/headlines');
        console.log('\n' + '='.repeat(50));
        await testBackend('/news');
    } catch (error) {
        console.error('Error:', error);
    }
}

main();