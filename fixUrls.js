import fs from 'fs';
import { execSync } from 'child_process';

const filesOutput = execSync('dir /b /s src\\*.jsx src\\*.js').toString();
const files = filesOutput.split('\r\n').filter(Boolean);

for (const file of files) {
    let content = fs.readFileSync(file, 'utf8');
    if (content.includes('\\${import.meta.env.VITE_API_URL')) {
        const before = content;
        content = content.replace(/\\\$\{import.meta.env.VITE_API_URL \|\| 'http:\/\/localhost:5001'\}/g, "${import.meta.env.VITE_API_URL || 'http://localhost:5001'}");
        
        if (content !== before) {
            fs.writeFileSync(file, content);
            console.log('Fixed URLs in: ' + file);
        }
    }
}
