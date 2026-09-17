const { Client } = require('pg');
require('dotenv').config();

async function runAudit() {
  const connectionString = process.env.DATABASE_URL;
  // Initialize standard pg client
  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();

    // 1. Tables and Columns
    const colsResult = await client.query(`
      SELECT 
        table_name, 
        column_name, 
        data_type, 
        is_nullable, 
        column_default 
      FROM information_schema.columns 
      WHERE table_schema = 'public' 
      ORDER BY table_name, ordinal_position;
    `);

    const tables = {};
    for (const row of colsResult.rows) {
      if (!tables[row.table_name]) {
        tables[row.table_name] = [];
      }
      tables[row.table_name].push(row);
    }

    // 2. Constraints (Primary Keys, Foreign Keys, Unique)
    const constraintsResult = await client.query(`
      SELECT 
        tc.table_name, 
        tc.constraint_name, 
        tc.constraint_type, 
        kcu.column_name, 
        ccu.table_name AS foreign_table_name, 
        ccu.column_name AS foreign_column_name 
      FROM information_schema.table_constraints AS tc 
      JOIN information_schema.key_column_usage AS kcu 
        ON tc.constraint_name = kcu.constraint_name 
        AND tc.table_schema = kcu.table_schema 
      LEFT JOIN information_schema.constraint_column_usage AS ccu 
        ON ccu.constraint_name = tc.constraint_name 
        AND ccu.table_schema = tc.table_schema 
      WHERE tc.table_schema = 'public'
    `);

    // 3. Record Counts
    const counts = {};
    for (const table of Object.keys(tables)) {
      try {
        const cResult = await client.query(`SELECT COUNT(*) FROM "${table}"`);
        counts[table] = parseInt(cResult.rows[0].count, 10);
      } catch (e) {
        counts[table] = 'ERROR';
      }
    }

    // 4. Migration History
    let migrations = [];
    if (tables['_prisma_migrations']) {
      const migResult = await client.query(`SELECT * FROM _prisma_migrations ORDER BY started_at`);
      migrations = migResult.rows;
    }

    // Output all data as JSON
    const report = {
      tables,
      constraints: constraintsResult.rows,
      counts,
      migrations
    };

    const fs = require('fs');
    fs.writeFileSync('audit_output.json', JSON.stringify(report, null, 2), 'utf8');
    console.log('Audit completed and written to audit_output.json');

  } catch (err) {
    console.error('Audit failed:', err);
  } finally {
    await client.end();
  }
}

runAudit();
