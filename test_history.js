
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
                try {
                    const jsonBody = JSON.parse(body);
                    resolve({ status: res.statusCode, body: jsonBody });
                } catch (e) {
                    resolve({ status: res.statusCode, body: body });
                }
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

async function testHistoryOnly() {
    const loginResult = await makeRequest('POST', '/api/auth/login', {
        email: 'testuser@example.com',
        password: '123456'
    });
    console.log('Login result:', loginResult);
    
    const historyResult = await makeRequest('GET', '/api/games/history');
    console.log('History result:', historyResult);
}
testHistoryOnly();

