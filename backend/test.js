import fs from 'fs';

async function testApi() {
    const filePath = './dummy.txt';
    const fileBlob = new Blob([fs.readFileSync(filePath)], { type: 'text/plain' });
    const formData = new FormData();
    formData.append('report', fileBlob, 'dummy.txt');

    try {
        const response = await fetch('http://localhost:5001/api/analyze', {
            method: 'POST',
            body: formData
        });
        const data = await response.json();
        console.log('Status code:', response.status);
        console.log('Response body:', JSON.stringify(data, null, 2));
    } catch (err) {
        console.error('Network Error:', err.message);
    }
}

testApi();
