import fs from 'fs';
import { execSync } from 'child_process';

// Find all js and jsx files in src directory
const filesOutput = execSync('dir /b /s src\\*.jsx src\\*.js').toString();
const files = filesOutput.split('\r\n').filter(Boolean);

for (const file of files) {
    let content = fs.readFileSync(file, 'utf8');
    if (content.includes('http://localhost:5001')) {
        // Replace 'http://localhost:5001/api/...' -> `${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/...`
        const before = content;
        content = content.replace(/'http:\/\/localhost:5001(.*?)'/g, "`\\${import.meta.env.VITE_API_URL || 'http://localhost:5001'}$1`");
        
        if (content !== before) {
            fs.writeFileSync(file, content);
            console.log('Updated: ' + file);
        }
    }
}
