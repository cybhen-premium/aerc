import { neon } from '@neondatabase/serverless';
import 'dotenv/config';

const sql = neon(process.env.DATABASE_URL);

async function syncProjects() {
  console.log('Connecting to Neon PostgreSQL to update projects table...');

  // Read seed-data directly or import
  const projectsData = [
    {
      id: 1,
      slug: 'kuvuna-project',
      title: 'Kuvuna One World Garden',
      tag: 'Community-Led Adaptation',
      summary: 'In today’s rapidly evolving agricultural landscape, the shift from traditional subsistence and organic farming to industrial agriculture poses severe challenges; Kuvuna restores agroecological sovereignty and promotes sustainable ecological farming.',
      description: `In today’s rapidly evolving agricultural landscape, the shift from traditional subsistence and organic farming to industrial agriculture has created significant challenges for rural farmers. The excessive reliance on synthetic pesticides, herbicides, and fertilizers is not only detrimental to the environment but also undermines the rich heritage of organic farming knowledge. Many farmers now perceive "modern" agriculture as synonymous with synthetic inputs, leading to the erosion of valuable traditional practices and the underutilisation of natural resources available within their communities.

The Kuvuna One World Garden project addresses these critical issues by promoting ecological farming strategies that are essential for sustainable development. Our project aims to counter the misconceptions about modern agriculture and highlight the importance of organic and home-grown foods. By doing so, we strive to combat food insecurity, hunger, malnutrition, and poverty, all exacerbated by climate change and environmental degradation.

The first pilot project not only strengthened our capacity to implement eco-strategies but also forged valuable partnerships and established a foundation for future initiatives. By bringing together communities and leveraging the power of experiential learning, the Kuvuna One World Garden project seeks to create a sustainable and secure food future for all.`,
      cover_image: '/images/projects/garden.jpg',
      status: 'Active',
    },
    {
      id: 2,
      slug: 'just-energy-transition',
      title: 'Just Energy Transition',
      tag: 'Renewable Energy',
      summary: 'The Just Energy Transition project is a flagship initiative of the organisation, dedicated to addressing energy challenges and promoting sustainable, community-owned renewable power across rural Ghana.',
      description: `The Just Energy Transition project is a flagship initiative of the organisation, dedicated to addressing energy challenges and promoting sustainable solutions. This project focuses on creating a fair and equitable shift from traditional fossil fuels to renewable energy sources, ensuring that no community is left behind in the transition.

The JET project aims to create a sustainable future by bridging the gap between energy access and environmental responsibility. Through this project, we are building resilient communities equipped with clean energy solutions, fostering economic opportunities, and driving significant reductions in greenhouse gas emissions.`,
      cover_image: '/images/projects/solar.jpg',
      status: 'Active',
    },
    {
      id: 3,
      slug: 'clean-cooking-solutions',
      title: 'Climate Friendly Cooking',
      tag: 'Clean Cooking',
      summary: 'The Climate-Friendly Cooking Project is a vital initiative of our youth NGO, centered around climate and energy sustainability to introduce eco-friendly cooking methods to women across Ghana.',
      description: `The Climate-Friendly Cooking Project is a vital initiative of our youth NGO, centered around climate and energy sustainability. This project aims to introduce eco-friendly cooking methods to women in the central, eastern, and northern regions of Ghana, promoting environmental conservation and improving health outcomes.

The project focuses on replacing traditional, inefficient cooking methods with sustainable alternatives such as improved cookstoves and clean cooking fuels. These technologies are designed to reduce carbon emissions, decrease deforestation, and lower indoor air pollution. Through the Climate-Friendly Cooking Project, we are creating a positive impact on the lives of women in the central, eastern, and northern regions of Ghana, promoting a cleaner, healthier, and more sustainable future for all.`,
      cover_image: '/images/projects/clean-cook.jpg',
      status: 'Active',
    },
    {
      id: 4,
      slug: 'fossil-fuel-finance-accountability',
      title: 'Fossil Finance campaign',
      tag: 'Climate Finance',
      summary: 'Join us in our mission to tackle the climate crisis head-on through the Fossil FreeECA campaign, advocating to halt public funding and export credits for fossil fuels and redirect capital to community renewables.',
      description: `Join us in our mission to tackle the climate crisis head-on through the Fossil FreeECA campaign, an initiative led by passionate youth activists determined to create a sustainable future for our planet. At the heart of our campaign lies a crucial realisation: the climate crisis cannot be effectively addressed if export credit agencies (ECAs) continue to support fossil fuel industries. These agencies, often funded by taxpayer money, play a significant role in financing projects that perpetuate our reliance on fossil fuels, exacerbating the environmental challenges we face.

Partnering with like-minded civil society organisations (CSOs) across Africa, we are calling on governments worldwide to take immediate action by ending all export credit and other forms of public support for fossil fuel projects. By redirecting these resources towards renewable energy and sustainable development initiatives, we can pave the way for a cleaner, greener future for generations to come.

Through advocacy, awareness-raising, and grassroots mobilisation, our campaign aims to:
1. Raise Awareness: We believe in the power of education and awareness to drive change. Through online and offline channels, we aim to inform the public about the detrimental impacts of ECA-funded fossil fuel projects on our environment and communities.
2. Advocate for Policy Change: We are actively engaging with policymakers at local, national, and international levels to advocate for policy reforms that prioritise renewable energy investments over fossil fuel subsidies.
3. Empower Youth Voices: As young activists, we recognise the importance of amplifying youth voices in the fight against climate change. Through our campaign, we provide a platform for youth to voice their concerns, ideas, and solutions for a sustainable future.
4. Mobilise Action: We organise rallies, protests, and other forms of direct action to mobilise public support and pressure decision-makers to divest from fossil fuels and invest in clean energy alternatives.

Together, we can make a difference. Join the Fossil FreeECA campaign and be part of the movement towards a more sustainable and equitable world. Together, we can build a future where our planet thrives, and all communities have access to clean air, water, and energy.`,
      cover_image: '/images/projects/ticking.jpg',
      status: 'Active',
    },
    {
      id: 5,
      slug: 'green-life-clubs',
      title: 'Green-Life Clubs',
      tag: 'Youth & Schools',
      summary: 'The Green-Life Club is dedicated to fostering environmental conservation and climate change awareness among young people across primary, junior high, senior high, and tertiary institutions in Ghana.',
      description: `The Green-Life Club is dedicated to fostering environmental conservation and climate change awareness among young people in Ghana. Its mission is to cultivate the next generation of youth leaders who are empowered to transform their local communities. The club operates across various educational levels, including primary, junior high, senior high, and tertiary institutions.

Primary Level:
At the primary level, the Green-Life Club introduces young children to the basics of environmental conservation and climate change. Through engaging activities such as planting trees, recycling projects, and educational games, the club helps instil a sense of responsibility and love for the environment in young minds. These early experiences lay a foundation for lifelong environmental stewardship.

Junior High Level:
In junior high schools, the club builds on this foundation by involving students in more structured and in-depth environmental projects. Members participate in workshops, field trips, and science fairs focused on sustainability. They learn about the impact of climate change and develop practical skills to address environmental issues in their communities. These activities not only increase their knowledge but also enhance their problem-solving and leadership abilities.

Senior High Level:
At the senior high school level, the Green-Life Club focuses on empowering students to take leadership roles in environmental initiatives. Members are encouraged to lead campaigns, organize events, and collaborate with local organisations on environmental projects. They receive training in advocacy, project management, and public speaking, preparing them to be effective leaders in the fight against climate change. This experience equips them with the skills needed to inspire and mobilize their peers and community members.

Tertiary Level:
In tertiary institutions, the club continues to nurture young leaders by providing opportunities for advanced learning and professional development. Members engage in research projects, internships, and policy advocacy. They collaborate with experts and policymakers to develop innovative solutions to environmental challenges. The club also facilitates networking opportunities, helping students to connect with like-minded individuals and organizations both locally and internationally.

Impact:
The Green-Life Club's multi-level approach ensures that young people across all educational stages are educated, engaged, and empowered to make a difference. By creating awareness and providing practical experiences, the club helps students understand the importance of environmental conservation and climate change mitigation. As a result, members of the Green-Life Club become proactive leaders who are well-equipped to drive positive change in their local communities and beyond.`,
      cover_image: '/images/projects/club.jpg',
      status: 'Active',
    },
    {
      id: 6,
      slug: 'sdg-watch-ghana',
      title: 'SDG Watch Ghana',
      tag: 'SDG Watch',
      summary: 'SDG Watch Ghana is an essential initiative dedicated to monitoring and promoting the implementation of the Sustainable Development Goals (SDGs) in Ghana through comprehensive reporting, community engagement, and the SDG Watch newspaper.',
      description: `SDG Watch Ghana is an essential initiative of our organisation, dedicated to monitoring and promoting the implementation of the Sustainable Development Goals (SDGs) in Ghana. Through comprehensive reporting and advocacy, we aim to ensure that Ghana remains on track to achieve these global targets by 2030.

The Sustainable Development Goals (SDGs) are a universal call to action to end poverty, protect the planet, and ensure that all people enjoy peace and prosperity. Achieving these goals requires consistent monitoring, advocacy, and community engagement to drive progress and accountability.

The SDGs are critical for ensuring a sustainable future for all. Monitoring their implementation and keeping the public informed is vital for accountability and progress. SDG Watch Ghana plays a pivotal role in this process by not only tracking the country's advancements but also by mobilising communities to contribute to these global objectives.

Our local newspaper, the SDG Watch, serves as a vital communication tool. It features updates on SDG activities, success stories, expert opinions, and in-depth analyses of various initiatives. The SDG Watch supports advocacy efforts by keeping the public informed and engaged in the pursuit of sustainable development.`,
      cover_image: '/images/projects/sdg.jpg',
      status: 'Active',
    },
    {
      id: 7,
      slug: 'youth4ndcs',
      title: 'Youth4NDCs',
      tag: 'Youth Climate Policy',
      summary: 'The Youth4NDCs project is a flagship initiative dedicated to increasing advocacy and engagement around Ghana’s Nationally Determined Contributions (NDCs), empowering young leaders to shape national climate policy under the Paris Agreement.',
      description: `The Youth4NDCs project is a flagship initiative of our organisation, dedicated to increasing advocacy and engagement around Ghana's Nationally Determined Contributions (NDCs). Our mission is to empower young people to play an active and influential role in the implementation of these crucial climate commitments, ensuring a sustainable and resilient future for Ghana.

Nationally Determined Contributions are vital components of the Paris Agreement, representing each country's pledge to reduce greenhouse gas emissions and adapt to the impacts of climate change. In Ghana, the successful implementation of our NDCs is essential for mitigating climate change, promoting sustainable development, and achieving our national and global climate goals.

By empowering young people through the Youth4NDCs project, we aim to create a generation of informed, skilled, and motivated climate advocates who can drive the implementation of Ghana's NDCs. Their active involvement will not only enhance the effectiveness of our national climate strategies but also ensure that the voices of future leaders are integral to shaping a sustainable and resilient Ghana.`,
      cover_image: '/images/projects/youth4ndcs.jpg',
      status: 'Active',
    },
  ];

  for (const p of projectsData) {
    // Check if project exists by id or slug
    const existing = await sql`SELECT id FROM projects WHERE id = ${p.id} OR slug = ${p.slug}`;
    if (existing.length > 0) {
      console.log(`Updating project ID ${p.id}: ${p.title}`);
      await sql`
        UPDATE projects
        SET title = ${p.title},
            slug = ${p.slug},
            tag = ${p.tag},
            summary = ${p.summary},
            description = ${p.description},
            cover_image = ${p.cover_image},
            status = ${p.status}
        WHERE id = ${existing[0].id}
      `;
    } else {
      console.log(`Inserting project ID ${p.id}: ${p.title}`);
      await sql`
        INSERT INTO projects (id, slug, title, tag, summary, description, cover_image, status)
        VALUES (${p.id}, ${p.slug}, ${p.title}, ${p.tag}, ${p.summary}, ${p.description}, ${p.cover_image}, ${p.status})
      `;
    }
  }

  console.log('✅ Projects synchronized in Neon PostgreSQL database successfully!');
}

syncProjects().catch((err) => {
  console.error('Error syncing projects:', err);
  process.exit(1);
});
