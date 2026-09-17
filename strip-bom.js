const fs = require('fs');
const content = fs.readFileSync('prisma/migrations/0_baseline/migration.sql');
// If BOM exists, strip it
if (content[0] === 0xEF && content[1] === 0xBB && content[2] === 0xBF) {
  fs.writeFileSync('prisma/migrations/0_baseline/migration.sql', content.slice(3));
}
