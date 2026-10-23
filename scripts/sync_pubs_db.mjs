import { neon } from '@neondatabase/serverless';
import 'dotenv/config';

const sql = neon(process.env.DATABASE_URL);

const publications = [
  {
    id: 1,
    title: 'AERC Second Edition Impact Newsletter (May–August 2026)',
    description: 'Second edition of the AERC Impact Newsletter highlighting community milestones, grassroots climate dialogues, and rural empowerment initiatives from May to August 2026.',
    file_type: 'PDF',
    file_size: '16.5 MB',
    download_url: '/documents/AERC-SECOND-EDITION-IMPACT-NEWSLETTER-MAY-AUGUST-2026.pdf',
    published_at: new Date('2026-09-07'),
  },
  {
    id: 2,
    title: 'AERC Press Release on EPA Styrofoam Ban',
    description: 'Official AERC statement commending the Environmental Protection Agency’s ban on single-use styrofoam products and outlining key community implementation recommendations.',
    file_type: 'PDF',
    file_size: '0.9 MB',
    download_url: '/documents/AERC-PRESS-RELEASE-ON-EPA-STYROFOAM-BAN.pdf',
    published_at: new Date('2026-05-28'),
  },
  {
    id: 3,
    title: 'Q1 (Jan–April) Newsletter',
    description: 'Quarterly newsletter detailing project activations, youth mobilization workshops, and renewable energy advocacy outcomes from January to April.',
    file_type: 'PDF',
    file_size: '7.4 MB',
    download_url: '/documents/Q1-NEWSLETTER-1final.pdf',
    published_at: new Date('2026-05-13'),
  },
  {
    id: 4,
    title: 'Powering Change: Insights on Energy Access and Clean Energy Adoption in Ghana',
    description: 'Policy brief analyzing barriers, opportunities, and grassroots models for decentralized renewable energy adoption in off-grid and peri-urban Ghanaian communities.',
    file_type: 'PDF',
    file_size: '2.8 MB',
    download_url: '/documents/Policy-Brief-Powering-Change.pdf',
    published_at: new Date('2026-04-23'),
  },
  {
    id: 5,
    title: 'AERC 2025 Annual Report',
    description: 'Comprehensive overview of AERC’s annual milestones, programmatic impacts, financial transparency, and partner collaborations across Ghana.',
    file_type: 'PDF',
    file_size: '13.9 MB',
    download_url: '/documents/AERC-2025-ANNUAL-REPORT-.pdf',
    published_at: new Date('2026-02-09'),
  },
  {
    id: 6,
    title: 'AERC Press Release: Action on Forest Reserves & Illegal Mining',
    description: 'AERC calls for immediate government action to repeal Executive Instruments endangering Ghana’s forest reserves and combat illegal mining (galamsey).',
    file_type: 'PDF',
    file_size: '0.1 MB',
    download_url: '/documents/AERC-PRESS-RELEASE-FORESTS-MINING.pdf',
    published_at: new Date('2025-03-11'),
  },
  {
    id: 7,
    title: 'Locked Out of a Just Transition: Fossil Fuel Financing in Africa',
    description: 'Critical investigative report exploring public finance, international export credit agency investments, and stranded asset risks of fossil infrastructure in Africa.',
    file_type: 'PDF',
    file_size: '6.7 MB',
    download_url: '/documents/Locked-Out-of-A-Just-Transition-Fossil-Fuel-Financing.pdf',
    published_at: new Date('2024-07-10'),
  },
  {
    id: 8,
    title: 'A Just Energy Transition for Africa',
    description: 'Framework outlining the principles, pathways, and civil society demands for an equitable and decentralized clean energy transition across the African continent.',
    file_type: 'PDF',
    file_size: '1.1 MB',
    download_url: '/documents/A-Just-Energy-Transition-for-Africa.pdf',
    published_at: new Date('2024-07-10'),
  },
];

async function syncPublications() {
  console.log('Synchronizing publications table in Neon PostgreSQL...');
  
  // Clean old dummy rows
  await sql`DELETE FROM publications`;
  console.log('Cleared outdated dummy publications.');

  for (const pub of publications) {
    console.log(`Inserting: ${pub.title}`);
    await sql`
      INSERT INTO publications (id, title, description, file_type, file_size, download_url, published_at)
      VALUES (${pub.id}, ${pub.title}, ${pub.description}, ${pub.file_type}, ${pub.file_size}, ${pub.download_url}, ${pub.published_at})
    `;
  }

  console.log('✅ All 8 official publications synced successfully!');
}

syncPublications().catch(err => {
  console.error('Error syncing publications:', err);
  process.exit(1);
});
