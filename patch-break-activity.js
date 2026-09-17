const fs = require('fs');

const path = 'src/app/(dashboard)/break-activity/page.tsx';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(/(\w+)\.breakTypeName === "System Idle"/g, '$1.breakTypeName === "System Idle" || $1.breakTypeName === "Idle Break"');

fs.writeFileSync(path, content, 'utf8');
console.log("Updated break-activity page successfully.");
