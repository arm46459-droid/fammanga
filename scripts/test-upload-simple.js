
import fs from 'fs';

async function run() {
    const baseUrl = 'http://localhost:3000';
    const username = 'admin_test_' + Date.now(); // Unique user
    const password = 'password123';
    const email = `${username}@example.com`;

    try {
        console.log(`1. Registering new admin: ${username}...`);
        const regRes = await fetch(`${baseUrl}/api/auth/register-admin`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username,
                email,
                password,
                adminKey: 'fammanga'
            })
        });
        const regData = await regRes.json();
        console.log('Register response:', regData);

        // 2. Login
        console.log('2. Logging in...');
        const loginRes = await fetch(`${baseUrl}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        const loginData = await loginRes.json();
        if (!loginData.success) {
            console.error('Login failed:', loginData);
            return;
        }

        const token = loginData.token;
        console.log('Login success. Token:', token.substring(0, 10));

        // 3. Prepare multipart body manually
        const boundary = '---------------------------974767299852498929531610575';
        const content = 'FAKE_IMAGE_CONTENT';
        const body =
            `--${boundary}\r\nContent-Disposition: form-data; name="images"; filename="test.jpg"\r\nContent-Type: image/jpeg\r\n\r\n${content}\r\n--${boundary}--`;

        // 4. Upload
        console.log('3. Uploading...');
        const uploadRes = await fetch(`${baseUrl}/api/admin/upload-images`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': `multipart/form-data; boundary=${boundary}`
            },
            body: body
        });

        console.log('Status:', uploadRes.status);
        const text = await uploadRes.text();
        console.log('Response:', text);

    } catch (e) {
        console.error(e);
    }
}

run();
