import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';

dotenv.config();

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error('DATABASE_URL is not set');
  process.exit(1);
}

const sql = neon(connectionString);

async function main() {
  console.log('Ensuring tables and schema columns exist in PostgreSQL...');

  // 1. Donations
  await sql`
    CREATE TABLE IF NOT EXISTS donations (
      id SERIAL PRIMARY KEY,
      donor_name TEXT NOT NULL,
      donor_email VARCHAR(255) NOT NULL,
      amount TEXT NOT NULL,
      currency VARCHAR(10) DEFAULT 'USD' NOT NULL,
      frequency VARCHAR(20) DEFAULT 'one-time' NOT NULL,
      campaign VARCHAR(255) DEFAULT 'General Grassroots Fund' NOT NULL,
      payment_method VARCHAR(50) DEFAULT 'mobile_money' NOT NULL,
      status VARCHAR(50) DEFAULT 'completed' NOT NULL,
      message TEXT,
      is_anonymous VARCHAR(10) DEFAULT 'no',
      created_at TIMESTAMP DEFAULT NOW() NOT NULL
    );
  `;

  // 2. Team Members
  await sql`
    CREATE TABLE IF NOT EXISTS team_members (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      role VARCHAR(255) NOT NULL,
      bio TEXT,
      image TEXT NOT NULL,
      email VARCHAR(255),
      linkedin TEXT,
      twitter TEXT,
      display_order INT DEFAULT 0,
      status VARCHAR(50) DEFAULT 'active' NOT NULL,
      created_at TIMESTAMP DEFAULT NOW() NOT NULL,
      updated_at TIMESTAMP DEFAULT NOW() NOT NULL
    );
  `;

  // 3. Site Pages
  await sql`
    CREATE TABLE IF NOT EXISTS site_pages (
      id SERIAL PRIMARY KEY,
      slug VARCHAR(255) UNIQUE NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      status VARCHAR(50) DEFAULT 'published' NOT NULL,
      last_updated_by VARCHAR(255) DEFAULT 'Admin',
      updated_at TIMESTAMP DEFAULT NOW() NOT NULL,
      created_at TIMESTAMP DEFAULT NOW() NOT NULL
    );
  `;

  // 4. Activity Logs
  await sql`
    CREATE TABLE IF NOT EXISTS activity_logs (
      id SERIAL PRIMARY KEY,
      admin_email VARCHAR(255) NOT NULL,
      admin_name VARCHAR(255) NOT NULL,
      action VARCHAR(100) NOT NULL,
      entity_type VARCHAR(100) NOT NULL,
      entity_title TEXT NOT NULL,
      details TEXT,
      created_at TIMESTAMP DEFAULT NOW() NOT NULL
    );
  `;

  // 4b. Article Revisions History
  await sql`
    CREATE TABLE IF NOT EXISTS article_revisions (
      id SERIAL PRIMARY KEY,
      article_id INT NOT NULL,
      title TEXT NOT NULL,
      excerpt TEXT,
      content TEXT NOT NULL,
      author VARCHAR(100),
      status VARCHAR(50) DEFAULT 'draft',
      revised_by VARCHAR(255) DEFAULT 'Admin',
      change_summary TEXT,
      created_at TIMESTAMP DEFAULT NOW() NOT NULL
    );
  `;

  // 4c. Page Revisions History
  await sql`
    CREATE TABLE IF NOT EXISTS page_revisions (
      id SERIAL PRIMARY KEY,
      page_id INT NOT NULL,
      title TEXT NOT NULL,
      slug VARCHAR(255) NOT NULL,
      hero_headline TEXT,
      hero_subtitle TEXT,
      content TEXT,
      sections_json TEXT,
      status VARCHAR(50) DEFAULT 'draft',
      revised_by VARCHAR(255) DEFAULT 'Admin',
      change_summary TEXT,
      created_at TIMESTAMP DEFAULT NOW() NOT NULL
    );
  `;

  // 4d. Project Revisions History
  await sql`
    CREATE TABLE IF NOT EXISTS project_revisions (
      id SERIAL PRIMARY KEY,
      project_id INT NOT NULL,
      title TEXT NOT NULL,
      slug VARCHAR(255) NOT NULL,
      tag VARCHAR(100),
      summary TEXT,
      description TEXT,
      status VARCHAR(50),
      revised_by VARCHAR(255) DEFAULT 'Admin',
      change_summary TEXT,
      created_at TIMESTAMP DEFAULT NOW() NOT NULL
    );
  `;

  // 4e. Focus Areas & Strategic Pillars
  await sql`
    CREATE TABLE IF NOT EXISTS focus_areas (
      id SERIAL PRIMARY KEY,
      slug VARCHAR(255) UNIQUE NOT NULL,
      title TEXT NOT NULL,
      parent_pillar VARCHAR(100) DEFAULT 'Environment & Climate' NOT NULL,
      summary TEXT NOT NULL,
      description TEXT,
      icon VARCHAR(100) DEFAULT 'fa-leaf',
      image TEXT,
      tags TEXT,
      display_order INT DEFAULT 1,
      is_featured VARCHAR(10) DEFAULT 'yes',
      status VARCHAR(50) DEFAULT 'active' NOT NULL,
      updated_at TIMESTAMP DEFAULT NOW(),
      created_at TIMESTAMP DEFAULT NOW() NOT NULL
    );
  `;

  // 4f. Focus Area Revisions History
  await sql`
    CREATE TABLE IF NOT EXISTS focus_area_revisions (
      id SERIAL PRIMARY KEY,
      focus_area_id INT NOT NULL,
      title TEXT NOT NULL,
      slug VARCHAR(255) NOT NULL,
      parent_pillar VARCHAR(100),
      summary TEXT,
      description TEXT,
      status VARCHAR(50),
      revised_by VARCHAR(255) DEFAULT 'Admin',
      change_summary TEXT,
      created_at TIMESTAMP DEFAULT NOW() NOT NULL
    );
  `;

  // 4g. Publication Revisions History
  await sql`
    CREATE TABLE IF NOT EXISTS publication_revisions (
      id SERIAL PRIMARY KEY,
      publication_id INT NOT NULL,
      title TEXT NOT NULL,
      category VARCHAR(100),
      summary TEXT,
      description TEXT,
      download_url TEXT,
      status VARCHAR(50),
      revised_by VARCHAR(255) DEFAULT 'Admin',
      change_summary TEXT,
      created_at TIMESTAMP DEFAULT NOW() NOT NULL
    );
  `;

  // 4h. Team Member Revisions History
  await sql`
    CREATE TABLE IF NOT EXISTS team_member_revisions (
      id SERIAL PRIMARY KEY,
      team_member_id INT NOT NULL,
      name TEXT NOT NULL,
      role VARCHAR(255) NOT NULL,
      category VARCHAR(100),
      bio TEXT,
      status VARCHAR(50),
      revised_by VARCHAR(255) DEFAULT 'Admin',
      change_summary TEXT,
      created_at TIMESTAMP DEFAULT NOW() NOT NULL
    );
  `;

  // 4i. Media Library Items
  await sql`
    CREATE TABLE IF NOT EXISTS media_items (
      id SERIAL PRIMARY KEY,
      public_id VARCHAR(255),
      title TEXT NOT NULL,
      filename VARCHAR(255) NOT NULL,
      url TEXT UNIQUE NOT NULL,
      thumbnail_url TEXT,
      category VARCHAR(100) DEFAULT 'General Website Images' NOT NULL,
      file_type VARCHAR(50) DEFAULT 'image/jpeg' NOT NULL,
      file_size VARCHAR(50) DEFAULT '0 KB' NOT NULL,
      bytes INT DEFAULT 0,
      width INT,
      height INT,
      alt_text TEXT,
      caption TEXT,
      description TEXT,
      folder VARCHAR(100) DEFAULT 'aerc_media',
      tags TEXT,
      uploaded_by VARCHAR(255) DEFAULT 'Admin',
      updated_at TIMESTAMP DEFAULT NOW() NOT NULL,
      created_at TIMESTAMP DEFAULT NOW() NOT NULL
    );
  `;
  await sql`CREATE UNIQUE INDEX IF NOT EXISTS idx_media_items_url ON media_items (url);`;

  // 4j. Homepage Settings
  await sql`
    CREATE TABLE IF NOT EXISTS homepage_settings (
      id SERIAL PRIMARY KEY,
      hero_headline_prefix TEXT DEFAULT 'Building Resilience Through ' NOT NULL,
      hero_highlight TEXT DEFAULT 'Just Energy Transition' NOT NULL,
      hero_introduction TEXT DEFAULT 'Advancing a just, inclusive energy transition across rural Ghana—championing community ownership, decentralized solar mini-grids, and clean renewable power.' NOT NULL,
      hero_tag VARCHAR(100) DEFAULT 'AERC GHANA' NOT NULL,
      hero_bg_image TEXT DEFAULT '/images/slider-1.jpg' NOT NULL,
      hero_cta_primary_text VARCHAR(100) DEFAULT 'Explore Initiatives' NOT NULL,
      hero_cta_primary_link VARCHAR(255) DEFAULT '/projects' NOT NULL,
      hero_cta_secondary_text VARCHAR(100) DEFAULT 'About Our Mission' NOT NULL,
      hero_cta_secondary_link VARCHAR(255) DEFAULT '/about' NOT NULL,
      intro_badge VARCHAR(100) DEFAULT 'ABOUT AERC GHANA',
      intro_heading TEXT DEFAULT 'Grassroots Leadership Driving Climate Justice & Energy Sovereignty',
      intro_content TEXT DEFAULT 'Alliance for Empowering Rural Communities (AERC Ghana) is a dedicated youth-led and community-centered environmental organisation advancing grassroots solutions to climate change, rural energy poverty, and natural resource governance across Ghana and West Africa.',
      intro_image TEXT DEFAULT '/images/about/who-we-are.jpg',
      about_badge VARCHAR(100) DEFAULT 'HOW WE WORK',
      about_heading TEXT DEFAULT 'We Work Together For Bettering Tomorrow',
      about_lead TEXT DEFAULT 'Through policy advocacy, research, and training, we bridge grassroots realities with national and global decision-making. We amplify community voices, strengthen local leadership, and connect our partners to the knowledge, resources, and networks that drive change. Every project we undertake reflects our belief that rural communities are not just beneficiaries, they are leaders in building a just, resilient, and sustainable future for all.',
      about_image TEXT DEFAULT '/images/bettering-tomorrow.jpg',
      about_objectives_json TEXT,
      focus_badge VARCHAR(100) DEFAULT 'STRATEGIC PILLARS',
      focus_heading TEXT DEFAULT 'Our Focus Areas and Strategic Pillars',
      focus_subtitle TEXT DEFAULT 'AERC focuses on Environment & Climate and Energy Transition, driving climate justice, community empowerment, and sustainable development.',
      focus_image TEXT DEFAULT '/images/rrrr.png',
      featured_focus_area_ids TEXT,
      projects_badge VARCHAR(100) DEFAULT 'ACTIVE INITIATIVES',
      projects_heading TEXT DEFAULT 'Our Featured Projects',
      projects_subtitle TEXT DEFAULT 'Community-led agroecology, clean cooking transitions, and renewable solar installations.',
      featured_project_ids TEXT,
      impact_stats_json TEXT,
      display_impact_stats VARCHAR(10) DEFAULT 'yes',
      news_badge VARCHAR(100) DEFAULT 'LATEST DISPATCHES',
      news_heading TEXT DEFAULT 'Latest News & Advocacy Stories',
      news_subtitle TEXT DEFAULT 'Updates, grassroots insights, and policy announcements from AERC Ghana teams.',
      featured_article_ids TEXT,
      pubs_badge VARCHAR(100) DEFAULT 'RESEARCH & POLICY',
      pubs_heading TEXT DEFAULT 'Publications & Downloadable Resources',
      pubs_subtitle TEXT DEFAULT 'Evidence-based policy briefs, investigative reports, and community toolkits.',
      featured_publication_ids TEXT,
      team_badge VARCHAR(100) DEFAULT 'OUR TEAM MEMBERS',
      team_heading TEXT DEFAULT 'Our Awesome Team',
      team_subtitle TEXT DEFAULT 'Meet the passionate practitioners, organizers, and policy advocates leading frontline change across Ghana.',
      featured_team_ids TEXT,
      partners_badge VARCHAR(100) DEFAULT 'ALLIANCES & SUPPORTERS',
      partners_heading TEXT DEFAULT 'Our Coalitions & Strategic Partners',
      partners_json TEXT,
      cta_heading TEXT DEFAULT 'Join Hands With Us For Climate Justice',
      cta_subtitle TEXT DEFAULT 'Whether as a partner organisation, volunteer, or supporter, your engagement empowers rural communities to lead their own sustainable future.',
      cta_button_text VARCHAR(100) DEFAULT 'Get Involved Today',
      cta_button_link VARCHAR(255) DEFAULT '/partner',
      sections_config TEXT NOT NULL,
      updated_by VARCHAR(255) DEFAULT 'Admin',
      updated_at TIMESTAMP DEFAULT NOW() NOT NULL
    );
  `;

  // 5. Add columns if not exist
  await sql`ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'published';`;
  await sql`ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT NOW();`;
  await sql`ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS image_caption TEXT;`;
  await sql`ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS image_alt TEXT;`;
  await sql`ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS tags TEXT;`;
  await sql`ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS seo_title TEXT;`;
  await sql`ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS seo_description TEXT;`;
  await sql`ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS scheduled_for TIMESTAMP;`;
  
  // Publications columns
  await sql`ALTER TABLE publications ADD COLUMN IF NOT EXISTS slug VARCHAR(255);`;
  await sql`ALTER TABLE publications ADD COLUMN IF NOT EXISTS category VARCHAR(100) DEFAULT 'Research Reports';`;
  await sql`ALTER TABLE publications ADD COLUMN IF NOT EXISTS author VARCHAR(255) DEFAULT 'AERC Research & Policy Team';`;
  await sql`ALTER TABLE publications ADD COLUMN IF NOT EXISTS summary TEXT;`;
  await sql`ALTER TABLE publications ADD COLUMN IF NOT EXISTS cover_image TEXT;`;
  await sql`ALTER TABLE publications ADD COLUMN IF NOT EXISTS external_url TEXT;`;
  await sql`ALTER TABLE publications ADD COLUMN IF NOT EXISTS is_featured VARCHAR(10) DEFAULT 'no';`;
  await sql`ALTER TABLE publications ADD COLUMN IF NOT EXISTS download_count INT DEFAULT 0;`;
  await sql`ALTER TABLE publications ADD COLUMN IF NOT EXISTS seo_title TEXT;`;
  await sql`ALTER TABLE publications ADD COLUMN IF NOT EXISTS seo_description TEXT;`;
  await sql`ALTER TABLE publications ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'published';`;
  await sql`ALTER TABLE publications ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT NOW();`;
  await sql`ALTER TABLE publications ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT NOW();`;
  
  // Projects columns
  await sql`ALTER TABLE projects ADD COLUMN IF NOT EXISTS focus_area VARCHAR(100);`;
  await sql`ALTER TABLE projects ADD COLUMN IF NOT EXISTS objectives TEXT;`;
  await sql`ALTER TABLE projects ADD COLUMN IF NOT EXISTS location VARCHAR(255);`;
  await sql`ALTER TABLE projects ADD COLUMN IF NOT EXISTS start_date VARCHAR(50);`;
  await sql`ALTER TABLE projects ADD COLUMN IF NOT EXISTS end_date VARCHAR(50);`;
  await sql`ALTER TABLE projects ADD COLUMN IF NOT EXISTS partners TEXT;`;
  await sql`ALTER TABLE projects ADD COLUMN IF NOT EXISTS funders TEXT;`;
  await sql`ALTER TABLE projects ADD COLUMN IF NOT EXISTS activities TEXT;`;
  await sql`ALTER TABLE projects ADD COLUMN IF NOT EXISTS outcomes TEXT;`;
  await sql`ALTER TABLE projects ADD COLUMN IF NOT EXISTS impact_stats TEXT;`;
  await sql`ALTER TABLE projects ADD COLUMN IF NOT EXISTS banner_image TEXT;`;
  await sql`ALTER TABLE projects ADD COLUMN IF NOT EXISTS gallery_images TEXT;`;
  await sql`ALTER TABLE projects ADD COLUMN IF NOT EXISTS external_link TEXT;`;
  await sql`ALTER TABLE projects ADD COLUMN IF NOT EXISTS is_featured VARCHAR(10) DEFAULT 'no';`;
  await sql`ALTER TABLE projects ADD COLUMN IF NOT EXISTS is_public VARCHAR(10) DEFAULT 'yes';`;
  await sql`ALTER TABLE projects ADD COLUMN IF NOT EXISTS related_publications TEXT;`;
  await sql`ALTER TABLE projects ADD COLUMN IF NOT EXISTS related_news TEXT;`;
  await sql`ALTER TABLE projects ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT NOW();`;
  await sql`ALTER TABLE projects ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT NOW();`;

  // Contact Inquiries columns
  await sql`ALTER TABLE contact_inquiries ADD COLUMN IF NOT EXISTS phone VARCHAR(50);`;
  await sql`ALTER TABLE contact_inquiries ADD COLUMN IF NOT EXISTS category VARCHAR(100) DEFAULT 'General Inquiry';`;
  await sql`ALTER TABLE contact_inquiries ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'New';`;
  await sql`ALTER TABLE contact_inquiries ADD COLUMN IF NOT EXISTS is_read BOOLEAN DEFAULT false;`;
  await sql`ALTER TABLE contact_inquiries ADD COLUMN IF NOT EXISTS read_at TIMESTAMP;`;
  await sql`ALTER TABLE contact_inquiries ADD COLUMN IF NOT EXISTS assigned_to VARCHAR(255);`;
  await sql`ALTER TABLE contact_inquiries ADD COLUMN IF NOT EXISTS assigned_staff_email VARCHAR(255);`;
  await sql`ALTER TABLE contact_inquiries ADD COLUMN IF NOT EXISTS priority VARCHAR(50) DEFAULT 'normal';`;
  await sql`ALTER TABLE contact_inquiries ADD COLUMN IF NOT EXISTS internal_notes TEXT;`;
  await sql`ALTER TABLE contact_inquiries ADD COLUMN IF NOT EXISTS response_summary TEXT;`;
  await sql`ALTER TABLE contact_inquiries ADD COLUMN IF NOT EXISTS responded_at TIMESTAMP;`;
  await sql`ALTER TABLE contact_inquiries ADD COLUMN IF NOT EXISTS responded_by VARCHAR(255);`;
  await sql`ALTER TABLE contact_inquiries ADD COLUMN IF NOT EXISTS is_archived VARCHAR(10) DEFAULT 'no';`;
  await sql`ALTER TABLE contact_inquiries ADD COLUMN IF NOT EXISTS spam_score INT DEFAULT 0;`;
  await sql`ALTER TABLE contact_inquiries ADD COLUMN IF NOT EXISTS retention_expiry_date TIMESTAMP;`;
  await sql`ALTER TABLE contact_inquiries ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT NOW();`;

  // Enquiry Notification & Privacy Settings table
  await sql`
    CREATE TABLE IF NOT EXISTS enquiry_notification_settings (
      id SERIAL PRIMARY KEY,
      notifications_enabled VARCHAR(10) DEFAULT 'yes',
      notification_recipient_email VARCHAR(255) DEFAULT 'info@aercghana.net',
      cc_emails TEXT DEFAULT 'admin@aercgh.org',
      auto_responder_enabled VARCHAR(10) DEFAULT 'yes',
      auto_responder_subject VARCHAR(255) DEFAULT 'Thank you for contacting AERC Ghana',
      auto_responder_message TEXT DEFAULT 'Dear Sender,\n\nThank you for reaching out to the Alliance for Empowering Rural Communities (AERC Ghana). We have received your inquiry and our team is reviewing your message.\n\nWe will get back to you shortly.\n\nWarm regards,\nAERC Ghana Communications & Secretariat',
      spam_protection_level VARCHAR(50) DEFAULT 'standard',
      retention_days INT DEFAULT 365,
      anonymize_after_retention VARCHAR(10) DEFAULT 'yes',
      updated_at TIMESTAMP DEFAULT NOW(),
      updated_by VARCHAR(255) DEFAULT 'Admin'
    );
  `;
  await sql`
    INSERT INTO enquiry_notification_settings (id, notification_recipient_email, notifications_enabled)
    VALUES (1, 'info@aercghana.net', 'yes')
    ON CONFLICT (id) DO NOTHING;
  `;
  await sql`ALTER TABLE site_pages ADD COLUMN IF NOT EXISTS hero_headline TEXT;`;
  await sql`ALTER TABLE site_pages ADD COLUMN IF NOT EXISTS hero_subtitle TEXT;`;
  await sql`ALTER TABLE site_pages ADD COLUMN IF NOT EXISTS hero_image TEXT;`;
  await sql`ALTER TABLE site_pages ADD COLUMN IF NOT EXISTS hero_cta_text VARCHAR(100);`;
  await sql`ALTER TABLE site_pages ADD COLUMN IF NOT EXISTS hero_cta_link VARCHAR(255);`;
  await sql`ALTER TABLE site_pages ADD COLUMN IF NOT EXISTS sections_json TEXT;`;
  await sql`ALTER TABLE site_pages ADD COLUMN IF NOT EXISTS content TEXT;`;
  await sql`ALTER TABLE site_pages ADD COLUMN IF NOT EXISTS seo_title TEXT;`;
  await sql`ALTER TABLE site_pages ADD COLUMN IF NOT EXISTS seo_description TEXT;`;
  await sql`ALTER TABLE site_pages ADD COLUMN IF NOT EXISTS scheduled_for TIMESTAMP;`;
  await sql`ALTER TABLE site_pages ADD COLUMN IF NOT EXISTS page_type VARCHAR(50) DEFAULT 'standard';`;

  await sql`ALTER TABLE team_members ADD COLUMN IF NOT EXISTS slug VARCHAR(255);`;
  await sql`ALTER TABLE team_members ADD COLUMN IF NOT EXISTS category VARCHAR(100) DEFAULT 'leadership';`;
  await sql`ALTER TABLE team_members ADD COLUMN IF NOT EXISTS expertise TEXT;`;
  await sql`ALTER TABLE team_members ADD COLUMN IF NOT EXISTS qualifications TEXT;`;
  await sql`ALTER TABLE team_members ADD COLUMN IF NOT EXISTS phone VARCHAR(50);`;
  await sql`ALTER TABLE team_members ADD COLUMN IF NOT EXISTS facebook TEXT;`;
  await sql`ALTER TABLE team_members ADD COLUMN IF NOT EXISTS is_featured VARCHAR(10) DEFAULT 'no';`;
  await sql`CREATE UNIQUE INDEX IF NOT EXISTS idx_team_members_slug ON team_members (slug);`;

  await sql`CREATE UNIQUE INDEX IF NOT EXISTS idx_publications_slug ON publications (slug);`;

  // Admin user columns
  await sql`ALTER TABLE admins ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'active';`;
  await sql`ALTER TABLE admins ADD COLUMN IF NOT EXISTS department VARCHAR(100);`;
  await sql`ALTER TABLE admins ADD COLUMN IF NOT EXISTS phone VARCHAR(50);`;
  await sql`ALTER TABLE admins ADD COLUMN IF NOT EXISTS avatar TEXT;`;
  await sql`ALTER TABLE admins ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT NOW();`;

  console.log('✅ Tables and schema columns verified.');

  const { initialProjects, initialBlogs, initialTeamMembers, initialSitePages, initialActivityLogs, initialFocusAreas, initialPublications, initialMediaItems, initialHomepageSettings } = await import('../src/db/seed-data.ts');

  console.log('Syncing all 11 publications...');
  for (const pub of initialPublications) {
    await sql`
      INSERT INTO publications (slug, title, category, author, summary, description, file_type, file_size, download_url, cover_image, external_url, is_featured, download_count, status, published_at)
      VALUES (${pub.slug}, ${pub.title}, ${pub.category}, ${pub.author}, ${pub.summary}, ${pub.description}, ${pub.fileType}, ${pub.fileSize}, ${pub.downloadUrl}, ${pub.coverImage}, ${pub.externalUrl || null}, ${pub.isFeatured || 'no'}, ${pub.downloadCount || 0}, ${pub.status || 'published'}, ${pub.publishedAt})
      ON CONFLICT (slug)
      DO UPDATE SET
        title = EXCLUDED.title,
        category = EXCLUDED.category,
        author = EXCLUDED.author,
        summary = EXCLUDED.summary,
        description = EXCLUDED.description,
        file_type = EXCLUDED.file_type,
        file_size = EXCLUDED.file_size,
        download_url = EXCLUDED.download_url,
        cover_image = EXCLUDED.cover_image,
        external_url = EXCLUDED.external_url,
        is_featured = EXCLUDED.is_featured,
        download_count = EXCLUDED.download_count,
        status = EXCLUDED.status,
        published_at = EXCLUDED.published_at;
    `;
  }
  console.log(`✅ Synced ${initialPublications.length} publications.`);

  console.log('Syncing all 7 projects...');
  for (const proj of initialProjects) {
    await sql`
      INSERT INTO projects (slug, title, tag, summary, description, cover_image, status)
      VALUES (${proj.slug}, ${proj.title}, ${proj.tag}, ${proj.summary}, ${proj.description}, ${proj.coverImage}, ${proj.status})
      ON CONFLICT (slug)
      DO UPDATE SET
        title = EXCLUDED.title,
        tag = EXCLUDED.tag,
        summary = EXCLUDED.summary,
        description = EXCLUDED.description,
        cover_image = EXCLUDED.cover_image,
        status = EXCLUDED.status;
    `;
  }
  console.log(`✅ Synced ${initialProjects.length} projects.`);

  console.log('Syncing all 10 blog posts...');
  for (const blog of initialBlogs) {
    await sql`
      INSERT INTO blog_posts (slug, title, excerpt, content, cover_image, category, author, published_at)
      VALUES (${blog.slug}, ${blog.title}, ${blog.excerpt}, ${blog.content}, ${blog.coverImage}, ${blog.category}, ${blog.author}, ${blog.publishedAt})
      ON CONFLICT (slug)
      DO UPDATE SET
        title = EXCLUDED.title,
        excerpt = EXCLUDED.excerpt,
        content = EXCLUDED.content,
        cover_image = EXCLUDED.cover_image,
        category = EXCLUDED.category,
        author = EXCLUDED.author,
        published_at = EXCLUDED.published_at;
    `;
  }
  console.log(`✅ Synced ${initialBlogs.length} blog posts.`);

  console.log('Syncing team members roster...');
  for (let i = 0; i < initialTeamMembers.length; i++) {
    const tm = initialTeamMembers[i];
    const existing = await sql`SELECT id FROM team_members WHERE name = ${tm.name};`;
    if (existing.length === 0) {
      await sql`
        INSERT INTO team_members (slug, name, role, category, bio, expertise, qualifications, image, email, phone, linkedin, twitter, facebook, display_order, is_featured, status)
        VALUES (${tm.slug || null}, ${tm.name}, ${tm.role}, ${tm.category || 'leadership'}, ${tm.bio}, ${tm.expertise || null}, ${tm.qualifications || null}, ${tm.image}, ${tm.email || null}, ${tm.phone || null}, ${tm.linkedin || null}, ${tm.twitter || null}, ${tm.facebook || null}, ${tm.displayOrder || (i + 1)}, ${tm.isFeatured || 'no'}, ${tm.status || 'active'});
      `;
    } else {
      await sql`
        UPDATE team_members
        SET slug = ${tm.slug || null},
            role = ${tm.role},
            category = ${tm.category || 'leadership'},
            bio = ${tm.bio},
            expertise = ${tm.expertise || null},
            qualifications = ${tm.qualifications || null},
            image = ${tm.image},
            email = ${tm.email || null},
            phone = ${tm.phone || null},
            linkedin = ${tm.linkedin || null},
            twitter = ${tm.twitter || null},
            facebook = ${tm.facebook || null},
            display_order = ${tm.displayOrder || (i + 1)},
            is_featured = ${tm.isFeatured || 'no'},
            status = ${tm.status || 'active'},
            updated_at = NOW()
        WHERE name = ${tm.name};
      `;
    }
  }
  console.log(`✅ Synced ${initialTeamMembers.length} team members.`);

  console.log('Syncing website pages directory...');
  for (const page of initialSitePages) {
    await sql`
      INSERT INTO site_pages (slug, title, description, status, last_updated_by)
      VALUES (${page.slug}, ${page.title}, ${page.description}, ${page.status}, ${page.lastUpdatedBy})
      ON CONFLICT (slug)
      DO UPDATE SET
        title = EXCLUDED.title,
        description = EXCLUDED.description,
        status = EXCLUDED.status,
        last_updated_by = EXCLUDED.last_updated_by;
    `;
  }
  console.log(`✅ Synced ${initialSitePages.length} site pages.`);
 
   console.log('Syncing focus areas & strategic pillars...');
   for (const fa of initialFocusAreas) {
     await sql`
       INSERT INTO focus_areas (slug, title, parent_pillar, summary, description, icon, image, tags, display_order, is_featured, status)
       VALUES (${fa.slug}, ${fa.title}, ${fa.parentPillar}, ${fa.summary}, ${fa.description}, ${fa.icon}, ${fa.image}, ${fa.tags}, ${fa.displayOrder}, ${fa.isFeatured}, ${fa.status})
       ON CONFLICT (slug)
       DO UPDATE SET
         title = EXCLUDED.title,
         parent_pillar = EXCLUDED.parent_pillar,
         summary = EXCLUDED.summary,
         description = EXCLUDED.description,
         icon = EXCLUDED.icon,
         image = EXCLUDED.image,
         tags = EXCLUDED.tags,
         display_order = EXCLUDED.display_order,
         is_featured = EXCLUDED.is_featured,
         status = EXCLUDED.status;
     `;
   }
   console.log(`✅ Synced ${initialFocusAreas.length} focus areas.`);

  console.log('Syncing media library assets...');
  if (initialMediaItems && initialMediaItems.length > 0) {
    for (const item of initialMediaItems) {
      await sql`
        INSERT INTO media_items (public_id, title, filename, url, thumbnail_url, category, file_type, file_size, bytes, width, height, alt_text, caption, description, folder, tags, uploaded_by)
        VALUES (${item.publicId || null}, ${item.title}, ${item.filename}, ${item.url}, ${item.thumbnailUrl || item.url}, ${item.category}, ${item.fileType}, ${item.fileSize}, ${item.bytes || 0}, ${item.width || null}, ${item.height || null}, ${item.altText || null}, ${item.caption || null}, ${item.description || null}, ${item.folder || 'aerc_media'}, ${item.tags || null}, ${item.uploadedBy || 'Admin'})
        ON CONFLICT (url)
        DO UPDATE SET
          title = EXCLUDED.title,
          category = EXCLUDED.category,
          alt_text = EXCLUDED.alt_text,
          caption = EXCLUDED.caption,
          description = EXCLUDED.description,
          tags = EXCLUDED.tags,
          file_type = EXCLUDED.file_type,
          file_size = EXCLUDED.file_size,
          bytes = EXCLUDED.bytes,
          width = EXCLUDED.width,
          height = EXCLUDED.height,
          thumbnail_url = EXCLUDED.thumbnail_url;
      `;
    }
    console.log(`✅ Synced ${initialMediaItems.length} media library items.`);
  }

  console.log('Checking homepage settings...');
  const existingHomepage = await sql`SELECT count(*) FROM homepage_settings;`;
  if (Number(existingHomepage[0].count) === 0) {
    console.log('Seeding initial homepage settings...');
    const hs = initialHomepageSettings;
    await sql`
      INSERT INTO homepage_settings (
        id, hero_headline_prefix, hero_highlight, hero_introduction, hero_tag, hero_bg_image,
        hero_cta_primary_text, hero_cta_primary_link, hero_cta_secondary_text, hero_cta_secondary_link,
        intro_badge, intro_heading, intro_content, intro_image,
        about_badge, about_heading, about_lead, about_image, about_objectives_json,
        focus_badge, focus_heading, focus_subtitle, focus_image, featured_focus_area_ids,
        projects_badge, projects_heading, projects_subtitle, featured_project_ids,
        impact_stats_json, display_impact_stats,
        news_badge, news_heading, news_subtitle, featured_article_ids,
        pubs_badge, pubs_heading, pubs_subtitle, featured_publication_ids,
        team_badge, team_heading, team_subtitle, featured_team_ids,
        partners_badge, partners_heading, partners_json,
        cta_heading, cta_subtitle, cta_button_text, cta_button_link,
        sections_config, updated_by
      )
      VALUES (
        1, ${hs.heroHeadlinePrefix}, ${hs.heroHighlight}, ${hs.heroIntroduction}, ${hs.heroTag}, ${hs.heroBgImage},
        ${hs.heroCtaPrimaryText}, ${hs.heroCtaPrimaryLink}, ${hs.heroCtaSecondaryText}, ${hs.heroCtaSecondaryLink},
        ${hs.introBadge}, ${hs.introHeading}, ${hs.introContent}, ${hs.introImage},
        ${hs.aboutBadge}, ${hs.aboutHeading}, ${hs.aboutLead}, ${hs.aboutImage}, ${hs.aboutObjectivesJson},
        ${hs.focusBadge}, ${hs.focusHeading}, ${hs.focusSubtitle}, ${hs.focusImage}, ${hs.featuredFocusAreaIds},
        ${hs.projectsBadge}, ${hs.projectsHeading}, ${hs.projectsSubtitle}, ${hs.featuredProjectIds},
        ${hs.impactStatsJson}, ${hs.displayImpactStats},
        ${hs.newsBadge}, ${hs.newsHeading}, ${hs.newsSubtitle}, ${hs.featuredArticleIds},
        ${hs.pubsBadge}, ${hs.pubsHeading}, ${hs.pubsSubtitle}, ${hs.featuredPublicationIds},
        ${hs.teamBadge}, ${hs.teamHeading}, ${hs.teamSubtitle}, ${hs.featuredTeamIds},
        ${hs.partnersBadge}, ${hs.partnersHeading}, ${hs.partnersJson},
        ${hs.ctaHeading}, ${hs.ctaSubtitle}, ${hs.ctaButtonText}, ${hs.ctaButtonLink},
        ${hs.sectionsConfig}, 'Admin'
      );
    `;
    console.log('✅ Seeded default homepage settings.');
  }

  console.log('Checking activity logs...');
  const existingLogs = await sql`SELECT count(*) FROM activity_logs;`;
  if (Number(existingLogs[0].count) === 0) {
    for (const log of initialActivityLogs) {
      await sql`
        INSERT INTO activity_logs (admin_email, admin_name, action, entity_type, entity_title, details)
        VALUES (${log.adminEmail}, ${log.adminName}, ${log.action}, ${log.entityType}, ${log.entityTitle}, ${log.details || null});
      `;
    }
    console.log(`✅ Seeded ${initialActivityLogs.length} initial activity logs.`);
  }

  const existingDonations = await sql`SELECT count(*) FROM donations;`;
  if (Number(existingDonations[0].count) === 0) {
    console.log('Adding initial grassroots demonstration donation...');
    await sql`
      INSERT INTO donations (donor_name, donor_email, amount, currency, frequency, campaign, payment_method, status, message)
      VALUES ('Kwame Mensah', 'kwame.mensah@gmail.com', '50', 'USD', 'monthly', 'Green-Life School Clubs', 'mobile_money', 'completed', 'Keep empowering our youth in Accra and rural Ghana!');
    `;
  }

  console.log('Verifying standard demonstration admin accounts and roles...');
  const bcrypt = (await import('bcryptjs')).default;
  const defaultPasswordHash = await bcrypt.hash('Password123!', 12);

  const initialRolesUsers = [
    {
      name: 'Desmond Sena Kofi Foe',
      email: 'admin@aercgh.org',
      role: 'superadmin',
      department: 'Executive Leadership',
      phone: '+233 24 123 4567',
      status: 'active',
    },
    {
      name: 'AERC SuperAdmin',
      email: 'admin@aercghana.org',
      role: 'superadmin',
      department: 'System Governance',
      phone: '+233 24 000 1122',
      status: 'active',
    },
    {
      name: 'Carlisle Naa Dodua Dodoo',
      email: 'carlisle.dodoo@aercghana.org',
      role: 'editor',
      department: 'Community-Led Adaptation',
      phone: '+233 24 234 5678',
      status: 'active',
    },
    {
      name: 'Nicholas Selady Sekpey',
      email: 'energy@aercghana.org',
      role: 'project_manager',
      department: 'Renewable Energy & Infrastructure',
      phone: '+233 24 345 6789',
      status: 'active',
    },
    {
      name: 'Sandra Efua Attah Dickson',
      email: 'comms@aercghana.org',
      role: 'communications',
      department: 'Media & Nature-Based Solutions',
      phone: '+233 24 456 7890',
      status: 'active',
    },
    {
      name: 'Siisi Ansah',
      email: 'author@aercghana.org',
      role: 'author',
      department: 'Grassroots Storytelling & Youth',
      phone: '+233 24 567 8901',
      status: 'active',
    },
    {
      name: 'Yvette Ahenkorah',
      email: 'finance.viewer@aercghana.org',
      role: 'viewer',
      department: 'Finance & Operations Oversight',
      phone: '+233 24 678 9012',
      status: 'active',
    },
  ];

  for (const user of initialRolesUsers) {
    await sql`
      INSERT INTO admins (name, email, password_hash, role, status, department, phone)
      VALUES (${user.name}, ${user.email}, ${defaultPasswordHash}, ${user.role}, ${user.status}, ${user.department}, ${user.phone})
      ON CONFLICT (email)
      DO UPDATE SET
        role = EXCLUDED.role,
        department = EXCLUDED.department,
        phone = EXCLUDED.phone,
        status = EXCLUDED.status;
    `;
  }
  console.log(`✅ Verified ${initialRolesUsers.length} role-based administrator accounts.`);

  console.log('Syncing demonstration contact inquiries...');
  const existingInquiries = await sql`SELECT count(*) FROM contact_inquiries;`;
  if (Number(existingInquiries[0].count) <= 1) {
    const demoInquiries = [
      {
        name: 'Dr. Kwabena Asante',
        email: 'kwabena.asante@ug.edu.gh',
        phone: '+233 24 888 1234',
        subject: 'Academic Collaboration on Climate Resilience Data',
        message: 'Greetings Desmond and AERC team, our faculty at University of Ghana is reviewing community-led adaptation benchmarks in the Greater Accra and Volta basin. We would love to collaborate on your upcoming 2026 Climate Adaptation Field Survey.',
        category: 'Research & Climate Data',
        status: 'New',
        is_read: false,
        priority: 'high',
        assigned_to: 'Carlisle Naa Dodua Dodoo',
        assigned_staff_email: 'carlisle.dodoo@aercghana.org',
        internal_notes: 'Promising academic research partnership. Forwarded to climate research team.',
      },
      {
        name: 'Ama Serwaa Boateng',
        email: 'ama.boateng@ecobankgh.com',
        phone: '+233 20 555 7890',
        subject: 'Corporate Sustainability Partnership & Tree Planting',
        message: 'We are interested in co-funding the planting of 5,000 mangrove and indigenous shade trees along the Gbetsile catchment area as part of our corporate ESG initiative. Could we arrange an exploratory call this week?',
        category: 'Partnership & Grants',
        status: 'In Progress',
        is_read: true,
        priority: 'urgent',
        assigned_to: 'Nicholas Selady Sekpey',
        assigned_staff_email: 'energy@aercghana.org',
        internal_notes: 'Ecobank ESG proposal. Budget scope: GHS 85,000. Follow-up meeting scheduled.',
      },
      {
        name: 'Kofi Mensah Annan',
        email: 'kofi.annan.media@ghanaweb.com',
        phone: '+233 26 333 4455',
        subject: 'Press Interview Request: Renewable Energy Access in Rural Off-Grid Districts',
        message: 'I am producing a feature on decentralized clean mini-grids and clean cooking adoption in rural Ghana. Would an AERC representative be available for a 15-minute studio discussion or remote commentary?',
        category: 'Media & Press',
        status: 'Responded',
        is_read: true,
        priority: 'normal',
        assigned_to: 'Sandra Efua Attah Dickson',
        assigned_staff_email: 'comms@aercghana.org',
        responded_at: new Date(),
        responded_by: 'Sandra Efua Attah Dickson',
        response_summary: 'Connected journalist with Nicholas Selady Sekpey for clean energy brief.',
      },
      {
        name: 'Abena Osei Tutu',
        email: 'abena.tutu@greenyouth.org',
        phone: '+233 50 111 2233',
        subject: 'Student Field Trip & Green-Life Club Mentorship',
        message: 'Our high school climate club in Tema would be grateful for an educational visit to the AERC Demonstration Nursery and community solar briquetting site during the environmental awareness week.',
        category: 'Community Initiatives',
        status: 'New',
        is_read: false,
        priority: 'normal',
        assigned_to: null,
      },
      {
        name: 'Michael Vance',
        email: 'm.vance@africaclimatefund.org',
        phone: '+44 20 7946 0991',
        subject: 'Grant Proposal Guidelines & Submission Confirmation',
        message: 'Confirming receipt of AERC Ghana expression of interest for the Small Island & Coastal Resilience Fund 2026. Review committee convenes next month.',
        category: 'Partnership & Grants',
        status: 'Closed',
        is_read: true,
        priority: 'high',
        assigned_to: 'Desmond Sena Kofi Foe',
        assigned_staff_email: 'admin@aercgh.org',
        responded_at: new Date(),
        responded_by: 'Desmond Sena Kofi Foe',
        response_summary: 'Full stage-2 proposal dossiers submitted and acknowledgment receipt filed.',
      },
    ];

    for (const inq of demoInquiries) {
      await sql`
        INSERT INTO contact_inquiries (
          name, email, phone, subject, message, category, status, is_read, priority,
          assigned_to, assigned_staff_email, internal_notes, response_summary, responded_at, responded_by
        )
        VALUES (
          ${inq.name}, ${inq.email}, ${inq.phone || null}, ${inq.subject}, ${inq.message},
          ${inq.category}, ${inq.status}, ${inq.is_read}, ${inq.priority},
          ${inq.assigned_to || null}, ${inq.assigned_staff_email || null},
          ${inq.internal_notes || null}, ${inq.response_summary || null},
          ${inq.responded_at || null}, ${inq.responded_by || null}
        );
      `;
    }
    console.log(`✅ Seeded ${demoInquiries.length} demonstration contact inquiries.`);
  }

  console.log('🎉 Complete database synchronization successful!');
}

main().catch((err) => {
  console.error('Sync failed:', err);
  process.exit(1);
});
