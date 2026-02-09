import fs from 'fs';
import { FormData } from 'undici'; // Or try global
// If undici is not available, we might struggle. Let's try native fetch.

async function testUpload() {
    const baseUrl = 'http://localhost:3000';

    // 1. Login
    console.log('Logging in...');
    const loginRes = await fetch(`${baseUrl}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: 'admin', password: 'password' })
    });

    const loginData = await loginRes.json();
    if (!loginData.success) {
        console.error('Login failed:', loginData);
        return;
    }

    const token = loginData.token;
    console.log('Logged in. Token:', token.substring(0, 10) + '...');

    // 2. Create dummy file
    const dummyPath = './dummy-image.jpg';
    fs.writeFileSync(dummyPath, 'fake-image-content'); // This is text, mimetype detection might fail if it checks magic bytes, but let's see. 
    // Wait, my server code checks mimetype from the file part header, not magic bytes usually, unless specific library used.
    // Multer checks extension or mime.
    // My new code: `if (!allowedTypes.includes(file.type || ''))`
    // `readMultipartFormData` usually gets type from Content-Type part header.

    const formData = new FormData();
    // We need a Blob-like object for fetch. In Node 18+, we can use `new Blob([buffer])`.
    const buffer = fs.readFileSync(dummyPath);
    const blob = new Blob([buffer], { type: 'image/jpeg' });
    formData.append('images', blob, 'dummy-image.jpg');

    // 3. Upload
    console.log('Uploading...');
    const uploadRes = await fetch(`${baseUrl}/api/admin/upload-images`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`
            // Don't set Content-Type, let fetch set boundary
        },
        body: formData
    });

    // 4. Result
    const text = await uploadRes.text();
    console.log('Status:', uploadRes.status);
    console.log('Response:', text);

    // Cleanup
    fs.unlinkSync(dummyPath);
}

testUpload().catch(console.error);
