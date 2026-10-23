import { neon } from '@neondatabase/serverless';
import 'dotenv/config';

const sql = neon(process.env.DATABASE_URL);

async function check() {
  try {
    const rows = await sql`SELECT * FROM projects ORDER BY id ASC`;
    console.log("Found", rows.length, "projects in DB:");
    for (const r of rows) {
      console.log(`- ID ${r.id}: [${r.slug}] "${r.title}" (tag: ${r.tag})`);
      console.log(`  Summary: ${r.summary}`);
      console.log(`  Cover: ${r.cover_image || r.coverImage}`);
      console.log(`  Desc: ${r.description?.slice(0, 100)}...`);
    }
  } catch (err) {
    console.error("DB error:", err);
  }
}

check();
