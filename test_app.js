import https from 'https';
import http from 'http';

// Disable SSL verification for testing
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const baseUrl = 'http://localhost:5000';
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
            
            // Store cookies
            if (res.headers['set-cookie']) {
                cookies = res.headers['set-cookie'].map(cookie => cookie.split(';')[0]).join('; ');
            }
            
            res.on('data', (chunk) => {
                body += chunk;
            });
            
            res.on('end', () => {
                try {
                    const jsonBody = JSON.parse(body);
                    resolve({ status: res.statusCode, body: jsonBody, headers: res.headers });
                } catch (e) {
                    resolve({ status: res.statusCode, body: body, headers: res.headers });
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

async function testApp() {
    console.log('🚀 Testing Arabic Trivia App...\n');
    
    try {
        // Test 1: Register a new user
        console.log('1. Testing user registration...');
        const registerData = {
            email: 'testuser@example.com',
            password: '123456',
            name: 'Test User'
        };
        
        const registerResult = await makeRequest('POST', '/api/auth/register', registerData);
        console.log(`   Status: ${registerResult.status}`);
        console.log(`   Response: ${JSON.stringify(registerResult.body)}`);
        
        if (registerResult.status === 200) {
            console.log('   ✅ Registration successful');
        } else if (registerResult.status === 400 && registerResult.body.message === 'المستخدم موجود بالفعل') {
            console.log('   ⚠️  User already exists, trying login...');
            const loginResult = await makeRequest('POST', '/api/auth/login', {
                email: registerData.email,
                password: registerData.password
            });
            console.log(`   Login Status: ${loginResult.status}`);
            if (loginResult.status === 200) {
                console.log('   ✅ Login successful');
            }
        }
        
        // Test 2: Check auth status
        console.log('\n2. Testing auth status...');
        const authResult = await makeRequest('GET', '/api/auth/me');
        console.log(`   Status: ${authResult.status}`);
        console.log(`   Response: ${JSON.stringify(authResult.body)}`);
        
        // Test 3: Get games history
        console.log('\n3. Testing games history...');
        const historyResult = await makeRequest('GET', '/api/games/history');
        console.log(`   Status: ${historyResult.status}`);
        console.log(`   Response: ${JSON.stringify(historyResult.body)}`);
        
        // Test 4: Try to start a game
        console.log('\n4. Testing game start...');
        const startGameResult = await makeRequest('POST', '/api/games/start');
        console.log(`   Status: ${startGameResult.status}`);
        console.log(`   Response: ${JSON.stringify(startGameResult.body)}`);
        
        // Test 5: Test payment intent (without valid stripe key)
        console.log('\n5. Testing payment intent...');
        const paymentResult = await makeRequest('POST', '/api/create-payment-intent', { gameCount: 5 });
        console.log(`   Status: ${paymentResult.status}`);
        console.log(`   Response: ${JSON.stringify(paymentResult.body)}`);
        
        console.log('\n✅ Test completed!');
        
    } catch (error) {
        console.error('❌ Test failed:', error);
    }
}

testApp();