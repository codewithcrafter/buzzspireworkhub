const { execSync } = require('child_process');
const fs = require('fs');

try {
  const diffOutput = execSync('npx prisma migrate diff --from-schema prisma/schema.prisma.bak --to-schema prisma/schema.prisma --script', { encoding: 'utf8' });
  
  // Write the output properly in utf8
  fs.writeFileSync('prisma/migrations/20260917_add_payroll_department_snapshot/migration.sql', diffOutput, 'utf8');
  console.log('Migration generated successfully.');
} catch (e) {
  console.error('Failed to generate diff:', e.message);
}
