import { neon } from '@neondatabase/serverless';
import 'dotenv/config';

const sql = neon(process.env.DATABASE_URL);

async function check() {
  try {
    const rows = await sql`SELECT id, title, file_size, download_url, published_at FROM publications ORDER BY id ASC`;
    console.log("Found", rows.length, "publications in DB:");
    for (const r of rows) {
      console.log(`- ID ${r.id}: "${r.title}" (${r.file_size}) -> ${r.download_url}`);
    }
  } catch (err) {
    console.error("DB error:", err);
  }
}

check();
