
import http from 'http';
let cookies = '';
function makeRequest(method, path, data = null) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: 5000,
            path: path,
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Cookie': cookies
            }
        };
        const req = http.request(options, (res) => {
            let body = '';
            if (res.headers['set-cookie']) {
                cookies = res.headers['set-cookie'].map(cookie => cookie.split(';')[0]).join('; ');
            }
            res.on('data', (chunk) => {
                body += chunk;
            });
            res.on('end', () => {
                console.log('Response Status:', res.statusCode);
                console.log('Response Body:', body);
                resolve();
            });
        });
        req.on('error', (err) => {
            reject(err);
        });
        if (data) {
            req.write(JSON.stringify(data));
        }
        req.end();
    });
}

async function testHistoryRoute() {
    console.log('Testing history route...');
    await makeRequest('POST', '/api/auth/login', {
        email: 'testuser@example.com',
        password: '123456'
    });
    
    console.log('\nTesting /api/games/history...');
    await makeRequest('GET', '/api/games/history');
}
testHistoryRoute();

