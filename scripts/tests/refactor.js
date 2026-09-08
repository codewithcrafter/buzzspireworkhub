const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

walkDir('./src/app/api', (filePath) => {
  if (!filePath.endsWith('.ts')) return;

  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  // Replace standard internal server error return with ApiResponse
  const searchRegex = /return NextResponse\.json\(\{\s*success:\s*false,\s*message:\s*["']Internal server error["']\s*\},?\s*\{\s*status:\s*500\s*\}\);/g;
  
  if (content.match(searchRegex)) {
    content = content.replace(searchRegex, 'return ApiResponse.serverError("API Execution Error", error);');
    changed = true;
  }
  
  // Update catch block in auth/login/route.ts
  if (filePath.includes('login') && content.includes('return NextResponse.json(')) {
     const loginRegex = /return NextResponse\.json\(\s*\{\s*error:\s*["']Internal server error["']\s*\},\s*\{\s*status:\s*500\s*\}\s*\);/g;
     if (content.match(loginRegex)) {
         content = content.replace(loginRegex, 'return ApiResponse.serverError("Login Error", error);');
         changed = true;
     }
  }

  if (changed) {
    // Add import if missing
    if (!content.includes('import { ApiResponse }')) {
      content = 'import { ApiResponse } from "@/lib/api-response";\n' + content;
    }
    fs.writeFileSync(filePath, content);
    console.log('Updated: ' + filePath);
  }
});
