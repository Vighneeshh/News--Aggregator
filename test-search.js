// Test search functionality
const https = require('https');

function testSearch(query) {
    return new Promise((resolve, reject) => {
        const url = `https://news-aggregator-pppy.onrender.com/search?q=${encodeURIComponent(query)}`;
        console.log(`🔍 Testing search for: "${query}"`);
        
        https.get(url, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    if (res.statusCode !== 200) {
                        console.log(`❌ HTTP ${res.statusCode} Error:`, data);
                        reject(new Error(`HTTP ${res.statusCode}`));
                        return;
                    }
                    
                    const parsed = JSON.parse(data);
                    console.log(`✅ Search "${query}" Results:`);
                    console.log(`   Status: ${parsed.status}`);
                    console.log(`   Articles: ${parsed.articles?.length || 0}`);
                    console.log(`   Total Results: ${parsed.totalResults || 0}`);
                    
                    if (parsed.articles && parsed.articles.length > 0) {
                        const first = parsed.articles[0];
                        console.log(`   First Title: ${first.title?.substring(0, 60)}...`);
                        console.log(`   Source: ${first.source?.name}`);
                        console.log(`   Match Type: ${first.title?.toLowerCase().includes(query.toLowerCase()) ? 'Title' : 'Other'}`);
                    }
                    
                    resolve(parsed);
                } catch (e) {
                    console.log(`❌ Parse Error:`, e.message);
                    console.log('Raw response:', data.substring(0, 200));
                    reject(e);
                }
            });
        }).on('error', (err) => {
            console.log(`❌ Request Error:`, err.message);
            reject(err);
        });
    });
}

async function testSearchFunctionality() {
    console.log('🎯 Testing RSS Search Functionality...');
    console.log('='.repeat(50));
    
    try {
        // Test basic search
        await testSearch('technology');
        console.log('\n' + '-'.repeat(30) + '\n');
        
        // Test another search
        await testSearch('business');
        console.log('\n' + '-'.repeat(30) + '\n');
        
        // Test specific search
        await testSearch('BBC');
        
        console.log('\n' + '='.repeat(50));
        console.log('🎉 Search functionality test complete!');
        
    } catch (error) {
        console.error('Search test failed:', error.message);
        
        // Try testing the main endpoints to see if they work
        console.log('\n📋 Testing basic endpoints as fallback...');
        try {
            const url = 'https://news-aggregator-pppy.onrender.com/headlines';
            https.get(url, (res) => {
                console.log(`Headlines endpoint status: ${res.statusCode}`);
            });
        } catch (e) {
            console.log('Basic endpoint test also failed');
        }
    }
}

testSearchFunctionality();