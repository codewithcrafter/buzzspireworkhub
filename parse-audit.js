const fs = require('fs');

const data = JSON.parse(fs.readFileSync('audit_output.json', 'utf8'));

console.log("=== TABLES & RECORD COUNTS ===");
for (const [table, count] of Object.entries(data.counts)) {
  console.log(`${table}: ${count} rows`);
}

console.log("\n=== CLOUDFILE COLUMNS ===");
if (data.tables['CloudFile']) {
  data.tables['CloudFile'].forEach(c => {
    console.log(`- ${c.column_name} (${c.data_type}) NULLABLE: ${c.is_nullable}`);
  });
} else {
  console.log("CloudFile table NOT FOUND in Neon");
}

console.log("\n=== PAYROLL RECORD ===");
if (data.tables['PayrollRecord']) {
  const deptCol = data.tables['PayrollRecord'].find(c => c.column_name === 'departmentSnapshot');
  if (deptCol) {
    console.log(`departmentSnapshot EXISTS! Type: ${deptCol.data_type}`);
  } else {
    console.log("departmentSnapshot DOES NOT EXIST");
  }
} else {
  console.log("PayrollRecord table NOT FOUND");
}

console.log("\n=== CMS TABLES ===");
const cmsTables = ['Page', 'Section', 'ContentField', 'PageSEO', 'FaqItem'];
cmsTables.forEach(t => {
  if (data.tables[t]) {
    console.log(`${t} EXISTS in Neon`);
  } else {
    console.log(`${t} DOES NOT EXIST in Neon`);
  }
});

console.log("\n=== MIGRATION HISTORY ===");
if (data.migrations && data.migrations.length > 0) {
  data.migrations.forEach(m => {
    console.log(`Migration: ${m.migration_name} | Applied: ${m.finished_at}`);
  });
} else {
  console.log("NO MIGRATIONS IN _prisma_migrations");
}
