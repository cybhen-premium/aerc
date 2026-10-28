import { neon } from '@neondatabase/serverless';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error('❌ Error: DATABASE_URL is not set in .env');
  process.exit(1);
}

const email = process.argv[2] || 'admin@aercgh.org';
const password = process.argv[3] || 'AERC2026!Admin';
const name = process.argv[4] || 'AERC Administrator';

async function main() {
  const sql = neon(connectionString);

  console.log(`Hashing password for admin: ${email}...`);
  const passwordHash = await bcrypt.hash(password, 12);

  console.log('Ensuring admins table exists...');
  await sql`
    CREATE TABLE IF NOT EXISTS admins (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role VARCHAR(50) DEFAULT 'admin' NOT NULL,
      created_at TIMESTAMP DEFAULT NOW() NOT NULL,
      last_login_at TIMESTAMP
    );
  `;

  console.log(`Upserting admin account for ${email}...`);
  await sql`
    INSERT INTO admins (name, email, password_hash, role)
    VALUES (${name}, ${email}, ${passwordHash}, 'admin')
    ON CONFLICT (email)
    DO UPDATE SET
      name = EXCLUDED.name,
      password_hash = EXCLUDED.password_hash;
  `;

  console.log('✅ Admin account configured successfully!');
  console.log('-------------------------------------------');
  console.log(`Email:    ${email}`);
  console.log(`Password: ${password}`);
  console.log('-------------------------------------------');
}

main().catch((err) => {
  console.error('❌ Error creating admin:', err);
  process.exit(1);
});
