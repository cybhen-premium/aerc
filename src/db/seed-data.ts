import { BlogPost, Publication, Project, FocusArea, MediaItem } from './schema';

export const initialProjects: Project[] = [
  {
    id: 1,
    slug: 'kuvuna-project',
    title: 'Kuvuna One World Garden',
    tag: 'Community-Led Adaptation',
    summary: 'In today’s rapidly evolving agricultural landscape, the shift from traditional subsistence and organic farming to industrial agriculture poses severe challenges; Kuvuna restores agroecological sovereignty and promotes sustainable ecological farming.',
    description: `In today’s rapidly evolving agricultural landscape, the shift from traditional subsistence and organic farming to industrial agriculture has created significant challenges for rural farmers. The excessive reliance on synthetic pesticides, herbicides, and fertilizers is not only detrimental to the environment but also undermines the rich heritage of organic farming knowledge. Many farmers now perceive "modern" agriculture as synonymous with synthetic inputs, leading to the erosion of valuable traditional practices and the underutilisation of natural resources available within their communities.

The Kuvuna One World Garden project addresses these critical issues by promoting ecological farming strategies that are essential for sustainable development. Our project aims to counter the misconceptions about modern agriculture and highlight the importance of organic and home-grown foods. By doing so, we strive to combat food insecurity, hunger, malnutrition, and poverty, all exacerbated by climate change and environmental degradation.

The first pilot project not only strengthened our capacity to implement eco-strategies but also forged valuable partnerships and established a foundation for future initiatives. By bringing together communities and leveraging the power of experiential learning, the Kuvuna One World Garden project seeks to create a sustainable and secure food future for all.`,
    coverImage: '/images/projects/garden.jpg',
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
    coverImage: '/images/projects/solar.jpg',
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
    coverImage: '/images/projects/clean-cook.jpg',
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
    coverImage: '/images/projects/ticking.jpg',
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
    coverImage: '/images/projects/club.jpg',
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
    coverImage: '/images/projects/sdg.jpg',
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
    coverImage: '/images/projects/youth4ndcs.jpg',
    status: 'Active',
  },
];

export const initialPublications: Publication[] = [
  {
    id: 1,
    slug: 'aerc-second-edition-impact-newsletter-2026',
    title: 'AERC Second Edition Impact Newsletter (May–August 2026)',
    category: 'Newsletters',
    author: 'AERC Editorial & Communications Desk',
    summary: 'Second edition of the AERC Impact Newsletter highlighting community milestones, grassroots climate dialogues, and rural empowerment initiatives.',
    description: 'The second edition of the AERC Impact Newsletter covers grassroots milestones achieved between May and August 2026. This edition features in-depth coverage of the Gbetsile Community Dialogue on World Environment Day, grassroots tree planting campaigns, the EPA single-use plastics advocacy, and stories of frontline youth champions driving sustainable change.',
    fileType: 'PDF',
    fileSize: '16.5 MB',
    downloadUrl: '/documents/AERC-SECOND-EDITION-IMPACT-NEWSLETTER-MAY-AUGUST-2026.pdf',
    coverImage: '/images/hero-community.jpg',
    isFeatured: 'yes',
    downloadCount: 428,
    status: 'published',
    publishedAt: new Date('2026-09-07'),
  },
  {
    id: 2,
    slug: 'aerc-press-release-epa-styrofoam-ban',
    title: 'AERC Press Release on EPA Styrofoam Ban',
    category: 'Press Releases',
    author: 'AERC Secretariat',
    summary: 'Official AERC statement commending the Environmental Protection Agency’s ban on single-use styrofoam products and outlining community implementation recommendations.',
    description: 'Alliance for Empowering Rural Communities (AERC) welcomes and commends the Environmental Protection Agency (EPA) of Ghana for the historic ban on single-use polystyrene and styrofoam products. This document outlines AERC’s policy advisory on municipal enforcement, circular alternatives, and livelihood support for smallholder market vendors.',
    fileType: 'PDF',
    fileSize: '0.9 MB',
    downloadUrl: '/documents/AERC-PRESS-RELEASE-ON-EPA-STYROFOAM-BAN.pdf',
    coverImage: '/images/clean-cook.jpg',
    isFeatured: 'no',
    downloadCount: 194,
    status: 'published',
    publishedAt: new Date('2026-05-28'),
  },
  {
    id: 3,
    slug: 'q1-jan-april-newsletter',
    title: 'Q1 (Jan–April) Newsletter',
    category: 'Newsletters',
    author: 'AERC Editorial Desk',
    summary: 'Quarterly newsletter detailing project activations, youth mobilization workshops, and renewable energy advocacy outcomes from January to April.',
    description: 'A comprehensive account of first-quarter activities across AERC Ghana regional hubs. Features the launch of Green-Life Clubs in 10 additional basic schools, solar cooking demos in the Volta Region, and regional capacity-building sessions on Nationally Determined Contributions (NDCs).',
    fileType: 'PDF',
    fileSize: '7.4 MB',
    downloadUrl: '/documents/Q1-NEWSLETTER-1final.pdf',
    coverImage: '/images/projects/sdg.jpg',
    isFeatured: 'no',
    downloadCount: 312,
    status: 'published',
    publishedAt: new Date('2026-05-13'),
  },
  {
    id: 4,
    slug: 'powering-change-insights-on-energy-access-and-clean-energy-adoption-in-ghana',
    title: 'Powering Change: Insights on Energy Access and Clean Energy Adoption in Ghana',
    category: 'Policy Briefs',
    author: 'Desmond Sena Kofi Foe & AERC Energy Unit',
    summary: 'Policy brief analyzing barriers, opportunities, and grassroots models for decentralized renewable energy adoption in off-grid and peri-urban Ghanaian communities.',
    description: 'This policy brief presents critical empirical findings from AERC field surveys across 24 rural districts in Ghana. It synthesizes systemic hurdles in energy access, highlights proven community solar mini-grid deployment models, and outlines five high-impact policy recommendations for the Ministry of Energy and international climate financiers.',
    fileType: 'PDF',
    fileSize: '2.8 MB',
    downloadUrl: '/documents/Policy-Brief-Powering-Change.pdf',
    coverImage: '/images/projects/clean-cook.jpg',
    isFeatured: 'yes',
    downloadCount: 865,
    status: 'published',
    publishedAt: new Date('2026-04-23'),
  },
  {
    id: 5,
    slug: 'aerc-2025-annual-report',
    title: 'AERC 2025 Annual Report',
    category: 'Annual Reports',
    author: 'AERC Executive Directorate',
    summary: 'Comprehensive overview of AERC’s annual milestones, programmatic impacts, financial transparency, and partner collaborations across Ghana.',
    description: 'The AERC 2025 Annual Report provides an exhaustive review of our institutional governance, community achievements, advocacy campaigns, and financial stewardship over the past fiscal year. Covering our work in climate adaptation, just energy transition, youth empowerment, and rural community development.',
    fileType: 'PDF',
    fileSize: '13.9 MB',
    downloadUrl: '/documents/AERC-2025-ANNUAL-REPORT-.pdf',
    coverImage: '/images/bettering-tomorrow.jpg',
    isFeatured: 'yes',
    downloadCount: 1240,
    status: 'published',
    publishedAt: new Date('2026-02-09'),
  },
  {
    id: 6,
    slug: 'aerc-press-release-action-on-forest-reserves-illegal-mining',
    title: 'AERC Press Release: Action on Forest Reserves & Illegal Mining',
    category: 'Press Releases',
    author: 'AERC Legal & Governance Desk',
    summary: 'AERC calls for immediate government action to repeal Executive Instruments endangering Ghana’s forest reserves and combat illegal mining (galamsey).',
    description: 'Official call to action by AERC Ghana demanding the repeal of E.I. 144 and L.I. 246(2). Details the catastrophic environmental and hydrological degradation caused by unregulated mining in river basins and nature reserves, presenting actionable recommendations for national restorative justice.',
    fileType: 'PDF',
    fileSize: '0.1 MB',
    downloadUrl: '/documents/AERC-PRESS-RELEASE-FORESTS-MINING.pdf',
    coverImage: '/images/hero-bg.jpg',
    isFeatured: 'no',
    downloadCount: 512,
    status: 'published',
    publishedAt: new Date('2025-03-11'),
  },
  {
    id: 7,
    slug: 'locked-out-of-a-just-transition-fossil-fuel-financing-in-africa',
    title: 'Locked Out of a Just Transition: Fossil Fuel Financing in Africa',
    category: 'Energy Transition Reports',
    author: 'AERC & Fossil Free ECAs Campaign',
    summary: 'Critical investigative report exploring public finance, international export credit agency investments, and stranded asset risks of fossil infrastructure in Africa.',
    description: 'Investigative report exposing the billions in public subsidies and export credit guarantees channeled into oil and gas expansion across sub-Saharan Africa. The paper details how external debt and fossil lock-in impede renewable energy leapfrogging, offering strategic legal and advocacy strategies for civil society resistance.',
    fileType: 'PDF',
    fileSize: '6.7 MB',
    downloadUrl: '/documents/Locked-Out-of-A-Just-Transition-Fossil-Fuel-Financing.pdf',
    coverImage: '/images/projects/ticking.jpg',
    isFeatured: 'yes',
    downloadCount: 940,
    status: 'published',
    publishedAt: new Date('2024-07-10'),
  },
  {
    id: 8,
    slug: 'a-just-energy-transition-for-africa',
    title: 'A Just Energy Transition for Africa',
    category: 'Research Reports',
    author: 'AERC Strategic Policy Unit',
    summary: 'Framework outlining the principles, pathways, and civil society demands for an equitable and decentralized clean energy transition across the African continent.',
    description: 'This flagship policy report articulates a decolonial, rights-based roadmap for Africa’s energy sovereignty. Analyzing transition mineral extraction, community benefit agreements, and distributed solar potential, the paper sets benchmark standards for international climate finance accountability.',
    fileType: 'PDF',
    fileSize: '1.1 MB',
    downloadUrl: '/documents/A-Just-Energy-Transition-for-Africa.pdf',
    coverImage: '/images/projects/solar.jpg',
    isFeatured: 'no',
    downloadCount: 680,
    status: 'published',
    publishedAt: new Date('2024-07-10'),
  },
  {
    id: 9,
    slug: 'from-access-to-utilization-renewable-energy-financing',
    title: 'From Access to Utilization: Rethinking Renewable Energy Financing in Rural Ghana',
    category: 'Research Papers',
    author: 'AERC Research Desk & University Partners',
    summary: 'Scholarly research paper investigating grassroots affordability, microfinance models, and productive use of renewable energy for smallholder farmers.',
    description: 'A study analyzing how rural communities in Ghana can move beyond basic lighting access to the productive utilization of clean energy in agro-processing, cold storage, and irrigation, backed by concessional local-currency community funds.',
    fileType: 'PDF',
    fileSize: '3.4 MB',
    downloadUrl: '/documents/FROM-ACCESS-TO-UTILIZATION.pdf',
    coverImage: '/images/projects/clean-cook.jpg',
    isFeatured: 'no',
    downloadCount: 395,
    status: 'published',
    publishedAt: new Date('2026-04-10'),
  },
  {
    id: 10,
    slug: 'ghanas-energy-transition-agenda-opportunities-for-youth',
    title: 'Ghana’s Energy Transition Agenda: Opportunities for Youth',
    category: 'Energy Transition Reports',
    author: 'Youth4NDCs Secretariat',
    summary: 'Strategic analysis identifying green job creation, technical vocational pathways, and youth entrepreneurship within Ghana’s National Energy Transition Framework.',
    description: 'Published under the Youth4NDCs project, this report maps out youth employment prospects across the renewable energy value chain in Ghana, from solar installation and maintenance to circular battery stewardship and clean cooking distribution.',
    fileType: 'PDF',
    fileSize: '2.1 MB',
    downloadUrl: '/documents/Ghanas-Energy-Transition-Agenda-Opportunities-for-Youth.pdf',
    coverImage: '/images/projects/youth4ndcs.jpg',
    isFeatured: 'no',
    downloadCount: 472,
    status: 'published',
    publishedAt: new Date('2024-07-10'),
  },
  {
    id: 11,
    slug: 'the-answers-are-already-growing-nature-based-solutions',
    title: 'The Answers Are Already Growing: How Nature-Based Solutions Can Drive Sustainable Progress in Ghana',
    category: 'Climate and Environmental Resources',
    author: 'AERC Biodiversity & Agroecology Unit',
    summary: 'Resource handbook documenting traditional ecological knowledge, wetland restoration methods, and community-managed reforestation techniques across Ghana.',
    description: 'A practical knowledge manual designed for district assemblies, farmer cooperatives, and community conservation committees. Outlines nature-based flood management in coastal and urban wetlands, native tree seed banking, and farmer-managed natural regeneration (FMNR).',
    fileType: 'PDF',
    fileSize: '4.8 MB',
    downloadUrl: 'https://www.fao.org/3/cb9360en/cb9360en.pdf',
    coverImage: '/images/projects/garden.jpg',
    isFeatured: 'yes',
    downloadCount: 780,
    status: 'published',
    publishedAt: new Date('2026-01-15'),
  },
];

export const initialBlogs: BlogPost[] = [
  {
    id: 1,
    slug: 'aerc-marks-world-environment-day-with-community-dialogue-on-environmental-action-in-gbetsile',
    title: 'AERC Marks World Environment Day with Youth-Led Zero Waste and Community Action in Gbetsile.',
    excerpt: 'Goshen/Gbetsile, Kpone Katamanso Municipality — Alliance for Empowering Rural Communities (AERC) commemorated World Environment Day 2026 with a community dialogue aimed at strengthening local action on environmental protection, sanitation and climate resilience in the Gbetsile community.',
    content: `Goshen/Gbetsile, Kpone Katamanso Municipality — Alliance for Empowering Rural Communities (AERC) commemorated World Environment Day 2026 with a community dialogue aimed at strengthening local action on environmental protection, sanitation and climate resilience in the Gbetsile community.

The event, held on Friday, 5 June 2026, brought together participants, including community members, women, youth, local leaders, assembly representatives, volunteers and AERC staff. The dialogue created a platform for residents to identify pressing environmental challenges affecting the community and propose practical solutions to address them.

![Community dialogue and stakeholder session at Gbetsile, Kpone Katamanso](/images/gbetsile-dialogue-1.jpg)

The engagement formed part of AERC’s commitment to promoting community-led environmental action and empowering local residents to take ownership of issues that affect their health, livelihoods and environment.

## Waste Management and Sanitation Emerge as Key Concerns

During the dialogue, participants identified several environmental and community challenges, including poor waste management, indiscriminate dumping, open burning of waste, inadequate drainage systems, flooding, erosion, poor road conditions, water supply challenges, limited sanitation facilities and inadequate street lighting.

Waste disposal and poor sanitation emerged as some of the most pressing concerns. Community members explained that irregular waste collection, inadequate access to waste bins and limited disposal options contribute to indiscriminate dumping and the blockage of drains.

Participants noted that these practices do not only affect the cleanliness of the community but also contribute to flooding and create health and environmental risks for residents.

The discussion also highlighted the importance of stronger cooperation among community members, the Municipal Assembly, waste-management service providers and other relevant stakeholders. Participants acknowledged that although improved infrastructure and waste services are necessary, long-term environmental improvement also requires behaviour change, sustained public education and active community participation.

![Participants and community members at the World Environment Day Gbetsile dialogue](/images/gbetsile-dialogue-2.jpg)

## Connecting Community Action to the Youth Zero Waste Initiative

The dialogue also reinforced AERC’s ongoing Youth Zero Waste initiative in Kpone Katamanso, which promotes practical community composting, improved waste separation and greater participation of young people and informal waste workers in local waste management.

Through the initiative, AERC is demonstrating how organic waste that would otherwise be dumped or burned can be separated and converted into useful compost. The project also seeks to equip young people and informal waste workers with practical skills in composting, safe waste handling and community environmental action.

Participants discussed the potential of community composting as a practical response to the large amount of biodegradable waste generated by households, food vendors and other community sources. This provided an opportunity to connect the community’s concerns about poor waste disposal with a practical solution already being promoted through the Youth Zero Waste project.

The engagement also highlighted the important role that informal waste workers play in the local waste system and the need for their knowledge, safety and participation to be considered in community and municipal waste-management efforts.

## Practical Solutions Identified by the Community

As part of the dialogue, participants examined the causes and effects of the environmental challenges identified and proposed practical actions that could be taken by residents and local stakeholders.

The community agreed on the need for regular clean-up exercises and sustained environmental education and sensitisation. Other proposed interventions included improved waste separation, climate advocacy, community composting and the strengthening of community structures that support sanitation and collective environmental action.

Particular attention was given to community composting, improved waste separation and continuous environmental education as practical approaches to reducing the volume of organic waste entering dumpsites and drains.

These recommendations strongly complement AERC’s Youth Zero Waste work, which seeks to demonstrate that communities can move beyond simply disposing of organic waste and instead treat it as a resource that can be converted into compost for gardening and agricultural use.

## Strengthening Youth and Community Ownership

The dialogue demonstrated the value of creating spaces where residents can participate directly in identifying environmental problems and shaping solutions.

For AERC, youth participation remains particularly important. Young people have the potential to play a stronger role in community sensitisation, composting, waste separation and advocacy for improved environmental management.

By connecting youth leadership with the practical experiences of informal waste workers, residents and local authorities, AERC aims to support a more inclusive approach to zero waste in which communities are not simply beneficiaries of environmental programmes but active participants in designing and implementing solutions.

## From Dialogue to Action

The World Environment Day engagement increased community awareness of local environmental challenges and strengthened interest in collective action.

Key recommendations emerging from the discussions included improving waste collection services, increasing access to waste bins, strengthening drainage infrastructure, sustaining environmental education and improving collaboration among community members, the Municipal Assembly and waste-management actors.

For AERC, one of the important outcomes of the dialogue was the opportunity to connect community concerns around waste with the practical composting activities being implemented through the Youth Zero Waste initiative.

The project is helping demonstrate that locally generated organic waste can be processed into a useful resource. Some of the compost produced through AERC’s work has already been provided to local farmers for gardening, and feedback received from the farmers indicates that the compost has been useful for their activities.

This experience is encouraging AERC to continue developing the initiative and explore opportunities to establish a more permanent community composting site that can support larger-scale organic waste recovery, practical training, environmental education and farmer access to compost.

## Building a Cleaner and More Resilient Kpone Katamanso

AERC believes meaningful environmental action becomes more sustainable when communities are informed, included and empowered to participate in decision-making.

The Gbetsile dialogue demonstrated that residents are willing to contribute to environmental improvement when they are given the opportunity to identify their own challenges and participate in developing solutions.

The World Environment Day Community Dialogue concluded with a shared commitment to move beyond discussion toward practical action. Participants expressed their willingness to support initiatives that contribute to a cleaner, healthier and more resilient community.

For AERC, the engagement represents another step toward strengthening community participation, advancing youth-led zero-waste solutions and building stronger partnerships for sustainable waste management in the Kpone Katamanso Municipality.`,
    coverImage: '/images/blog-gbetsile.jpg',
    category: 'Zero Waste & Communities',
    author: 'AERC Secretariat',
    publishedAt: new Date('2026-06-26'),
  },
  {
    id: 2,
    slug: 'first-quarter-newsletter',
    title: 'FIRST QUARTER NEWSLETTER',
    excerpt: 'The first quarter of 2026 marked another important step in AERC Ghana’s mission to empower rural and vulnerable communities through climate action, environmental sustainability, renewable energy advocacy, and inclusive development.',
    content: `The first quarter of 2026 marked another important step in AERC Ghana’s mission to empower rural and vulnerable communities through climate action, environmental sustainability, renewable energy advocacy, and inclusive development. This newsletter showcases our key activities, partnerships, campaigns, and community engagements that reflect our commitment to practical, people-centered solutions. From promoting nature-based climate solutions to amplifying the voices of waste pickers and advancing clean energy conversations, this edition offers a closer look at the work, impact, and collective ambition driving AERC forward.

@[pdf:Q1 NEWSLETTER (1)final](/documents/Q1-NEWSLETTER-1final.pdf)`,
    coverImage: '/images/blog-1.jpg',
    category: 'Newsletters & Updates',
    author: 'AERC Secretariat',
    publishedAt: new Date('2026-05-13'),
  },
  {
    id: 3,
    slug: 'an-insight-brief-from-the-national-renewable-energy-finance-dialogue',
    title: 'An Insight Brief from the National Renewable Energy Finance Dialogue',
    excerpt: 'Ghana now has over 90% electricity access. That is a remarkable achievement. But in many rural communities, having access to energy and actually using it are two very different things and that gap is costing us more than we realise.',
    content: `Ghana now has over 90% electricity access. That is a remarkable achievement. But in many rural communities, having access to energy and actually using it are two very different things and that gap is costing us more than we realise.

In some areas, energy systems are installed and left largely unused. Households continue burning charcoal and diesel not because clean energy is unavailable, but because the systems introduced do not align with their economic realities. The clean energy transition stalls. The investment goes to waste.

The problem is not technology. Solar systems and mini-grids exist. The real barrier is how these solutions are financed, sustained, and connected to the daily lives of the people they are meant to serve.

Our latest insight brief, From Access to Utilization, digs into why access alone is no longer enough and what the path forward actually looks like for rural Ghana.

@[pdf:FROM ACCESS TO UTILIZATION — National Renewable Energy Finance Dialogue](/documents/FROM-ACCESS-TO-UTILIZATION.pdf)`,
    coverImage: '/images/project-solar-real.jpg',
    category: 'Renewable Energy',
    author: 'AERC Energy Policy Desk',
    publishedAt: new Date('2026-04-10'),
  },
  {
    id: 4,
    slug: 'leaving-no-one-and-no-place-behind-why-waste-pickers-must-be-included-in-ghanas-and-africas-waste-management-future',
    title: 'Leaving No One and No Place Behind: Why Waste Pickers Must Be Included in Ghana’s and Africa’s Waste Management Future',
    excerpt: 'As Ghana and other African countries pursue cleaner cities, circular economies, and more sustainable urban development, one truth must remain central: waste pickers are not peripheral actors in the waste sector; they are essential to it.',
    content: `As Ghana and other African countries pursue cleaner cities, circular economies, and more sustainable urban development, one truth must remain central: waste pickers are not peripheral actors in the waste sector; they are essential to it. Across cities and metropolitan areas, waste pickers recover recyclable materials, reduce the volume of waste sent to dumpsites and landfills, support local economies, and provide an environmental service that is too often overlooked. Long before recycling, climate action, and resource recovery became dominant policy conversations, waste pickers were already doing this work under difficult and often dangerous conditions.

Evidence from global and developing-country contexts makes their importance impossible to ignore. Waste pickers represent about 1 per cent of the urban workforce globally, amounting to between 15 and 20 million people worldwide. In low-income countries, they commonly collect between 50 and 100 per cent of city waste at no direct cost to municipalities. Their contribution goes far beyond collection alone. Waste pickers help reduce pressure on overstretched public waste systems, recover valuable materials for recycling, cut transport and landfill burdens, support livelihoods for poor households, and contribute directly to climate change mitigation by diverting waste from disposal and keeping materials in circulation.

Yet despite these contributions, waste pickers remain among the most vulnerable and excluded workers in the urban economy. Many operate without protective equipment, stable income, legal recognition, or access to social protection. They are often exposed to contaminated waste, hazardous working environments, disease, exploitation by middlemen, and public stigma. Women waste pickers face even deeper inequalities, including lower earnings, greater exposure to insecurity, and the additional burden of unpaid care work. In too many cases, the very systems waste pickers help sustain do not recognize, protect, or include them.

This is why the future of waste management in Ghana and across Africa must be built on inclusion, not exclusion. If we are serious about sustainable cities, decent work, public health, and environmental justice, then waste pickers must be integrated into formal and inclusive waste management systems. That means adopting data-driven strategies to understand who they are and where they work; planning for their spatial and infrastructural needs; ensuring safer working environments; improving transport options; supporting waste picker associations; promoting separation at source; involving waste pickers in policy and decision-making; and creating fair payment and formalization pathways that improve livelihoods without destroying existing survival systems.

The case for inclusion is not only social; it is strategic. Better conditions for waste pickers can improve recycling rates, expand service coverage, reduce unmanaged waste, strengthen urban resilience, and advance key development goals. We must understand that improving waste pickers’ livelihoods contributes to poverty reduction, good health and well-being, gender equality, decent work, sustainable cities, responsible consumption and production, reduced inequalities, and climate action. In other words, supporting waste pickers is not charity. It is smart urban policy, sound environmental governance, and a practical pathway toward a more just circular economy.

Rather than modernizing waste systems in ways that displace informal workers, we should build systems that recognize their expertise, strengthen their dignity, and improve their livelihoods. Waste pickers already form part of the solution to our sanitation, recycling, and environmental challenges. The question is whether our policies, institutions, and public attitudes are ready to catch up with that reality.

At AERC, this commitment to waste picker inclusion is also being translated into practical community action. Through our Youth Zero Waste initiative in Kpone Katamanso, we are working with young people, informal waste workers and community stakeholders to demonstrate how more inclusive and community-driven waste management can work in practice.

The initiative combines practical training in organic waste management and composting with improved occupational safety, community sensitisation and engagement with local authorities. Young people and informal waste workers are being equipped with knowledge, basic protective equipment and practical skills while participating in conversations about source separation, composting and their role within local waste-management systems.

The project also demonstrates that organic waste should not automatically be treated as something to dispose of. Through composting, biodegradable waste can be transformed into a useful resource for gardening and local food production. Compost produced through our activities has already been shared with local farmers for gardening, with encouraging feedback on its usefulness.

By connecting practical waste recovery with worker inclusion, youth leadership and engagement with local authorities, AERC is seeking to demonstrate that the transition toward zero waste can be both environmentally effective and socially just.

If we truly believe in leaving no one and no place behind, then waste pickers must no longer remain invisible. They deserve recognition as workers, inclusion as stakeholders, protection as human beings, and respect as vital contributors to Ghana’s and Africa’s sustainable future.`,
    coverImage: '/images/blog-waste-pickers.png',
    category: 'Environment',
    author: 'Desmond Foe',
    publishedAt: new Date('2026-03-17'),
  },
  {
    id: 5,
    slug: 'aerc-2025-annual-report',
    title: 'AERC 2025 ANNUAL REPORT',
    excerpt: 'Alliance for Empowering Rural Communities presents its 2025 Annual Report, capturing key milestones in community resilience, decentralized renewables, agroecological transitions, and youth empowerment.',
    content: `Alliance for Empowering Rural Communities (AERC) is pleased to publish its 2025 Annual Report, summarizing our field interventions, institutional milestones, policy advocacy campaigns, and financial stewardship over the past calendar year.

@[pdf:AERC 2025 ANNUAL REPORT](/documents/AERC-2025-ANNUAL-REPORT-.pdf)`,
    coverImage: '/images/arcp.jpg.jpeg',
    category: 'Annual Reports',
    author: 'AERC Leadership',
    publishedAt: new Date('2026-02-11'),
  },
  {
    id: 6,
    slug: 'the-energy-we-need-the-future-we-want-advancing-sdg-7-and-sdg-9-in-ghana',
    title: 'The Energy We Need, The Future We Want: Advancing SDG 7 and SDG 9 in Ghana',
    excerpt: 'Every day in Ghana, we see small moments that remind us why the energy transition matters. It could be a child studying with a flickering light during a power cut or a neighbor cooking over charcoal because there is no affordable alternative.',
    content: `Every day in Ghana, we see small moments that remind us why the energy transition matters. It could be a child studying with a flickering light during a power cut or a neighbor cooking over charcoal because there is no affordable alternative. These simple scenes tell a bigger story about energy, innovation, and the kind of future we want to build.

SDG 7 calls for access to affordable and clean energy for all. But the reality is that about 77% of Ghanaian households still rely on firewood and charcoal for cooking (Institute of Statistical, Social and Economic Research [ISSER], 2024). This affects health, finances, and the environment. And even though our national electricity access is 86.63%, many rural and peri-urban communities still face unstable supply (World Bank, 2021). Clean, reliable energy is not just a development indicator. It shapes how people live, learn, and work.

SDG 9 focuses on industry, innovation, and resilient infrastructure, which make clean energy possible. Today, non-hydro renewable energy contributes less than 3% to Ghana’s electricity mix (Energy Commission, 2025). Yet Africa’s clean energy transition has the potential to create over 4 million jobs by 2030, especially for young people (International Renewable Energy Agency [IRENA], 2023). This tells us that innovation is not only about technology. It’s also about opportunity.

In my work in renewable energy and advocacy, I have learned that progress happens when people are involved in shaping the solutions. Women who rely on biomass for cooking understand the risks and costs. Young people see the possibilities of new technology. Communities know what works in their context.

If Ghana is going to achieve SDG 7 and SDG 9, we must build systems that are people-centered, reliable, affordable, and designed with local realities in mind.

A people-centered energy system means developing technologies and services that are accessible, easy to use, and address challenges faced by everyday Ghanaians especially in rural and peri-urban areas. Reliability ensures that the energy supply is consistent, reducing disruptions that affect education, business, and health. Affordability is crucial so that all households can feasibly switch to clean energy alternatives without financial strain. Finally, solutions must be adapted to local realities taking into account existing infrastructure, cultural practices, and economic conditions to ensure they are practical and sustainable.

Clean energy and innovation are more than goals. They are investments in dignity, opportunity, and a more resilient future for everyone.

## References

Institute of Statistical, Social and Economic Research. (2024). *2024 Ghana Social Development Outlook*. [**https://www.ghanaweb.com/GhanaHomePage/business/77-of-households-still-rely-on-charcoal-Report-1991380**](https://www.ghanaweb.com/GhanaHomePage/business/77-of-households-still-rely-on-charcoal-Report-1991380)

World Bank. (2021). Access to electricity (% of population) – Ghana. World Bank Open Data. [**https://data.worldbank.org/indicator/EG.ELC.ACCS.ZS?locations=GH**](https://data.worldbank.org/indicator/EG.ELC.ACCS.ZS?locations=GH)

International Renewable Energy Agency. (2023). *Renewable Energy and Jobs Annual Review*. [**https://www.irena.org/publications/2023/May/Renewable-Energy-and-Jobs-Annual-Review-2023**](https://www.irena.org/publications/2023/May/Renewable-Energy-and-Jobs-Annual-Review-2023)

Energy Commission. (2025). *2025 energy outlook for Ghana*. [**https://www.energycom.gov.gh/index.php/planning/sub-codes?download=723%3Aenergy-outlook-for-ghana-2025**](https://www.energycom.gov.gh/index.php/planning/sub-codes?download=723%3Aenergy-outlook-for-ghana-2025)`,
    coverImage: '/images/blog-sdg7-sdg9.png',
    category: 'Energy Sovereignty & SDGs',
    author: 'Desmond Sena Kofi Foe',
    publishedAt: new Date('2026-01-15'),
  },
  {
    id: 7,
    slug: 'aerc-calls-for-immediate-government-action-to-repeal-executive-instruments-endangering-ghanas-forest-reserves-and-combat-illegal-mining',
    title: 'AERC Calls For Immediate Government Action To Repeal Executive Instruments Endangering Ghana’s Forest Reserves And Combat Illegal Mining',
    excerpt: 'The growing crisis of illegal mining, known as “galamsey,” continues to wreak havoc on Ghana’s environment, public health, and economy. AERC urgently calls on the government of Ghana to repeal E.I. 144 and L.I. 246.',
    content: `The growing crisis of illegal mining, known as "galamsey," continues to wreak havoc on Ghana’s environment, public health, and economy. Galamsey activities, driven by unregulated excavation and disregard for environmental regulations, are severely degrading Ghana’s natural resources. As deforestation escalates and water bodies vital to millions of Ghanaians are destroyed, the government must take pragmatic and decisive steps to combat this menace.

The Alliance for Empowering Rural Communities (AERC) urgently calls on the government of Ghana, led by His Excellency Nana Addo Danquah Akuffo Addo, and Parliament to immediately repeal Executive Instrument 144 and Legislative Instrument 246 (2), which allows for development within forest reserves and take pragmatic steps to address the looming danger posed by the galamsey menace. These legislative instruments pose a grave threat to Ghana’s globally significant biodiversity and undermine the country’s commitments to the Sustainable Development Goals (SDGs), particularly SDG 13 on climate action and other environmental targets.

### A Threat to Conservation Efforts and Climate Action

In recent years, Ghana has made commendable progress in environmental conservation and climate change mitigation. As part of the country’s Nationally Determined Contributions (NDCs) under the Paris Agreement, efforts to protect natural resources have been key in addressing climate change. However, the introduction of Executive Instrument 144 and Legislative Instrument 246 (2) declassifying forest reserves, including the Achimota Forest, represents a substantial setback to these gains.

AERC emphasizes that these legislative actions are in direct conflict with national and global conservation goals, threatening both the ecological integrity of the nation’s forest reserves and the livelihoods of rural communities. As Ghana battles the devastating effects of illegal mining, or galamsey, these forests play an essential role in mitigating environmental damage by safeguarding water sources, preventing deforestation, and maintaining biodiversity.

Illegal mining operations have already wreaked havoc on Ghana’s forests and water bodies. Water bodies, including major rivers such as the River Pra, Ankobra, and Birim, have been polluted by toxic chemicals, primarily mercury and cyanide, used in illegal gold mining processes.

### Call to Action

AERC implores the government to take immediate action to reverse these detrimental legislative changes to combat the galamsey crisis and prevent further environmental and public health devastation:

1. **Repeal Executive Instrument 144 and Legislative Instrument 246 (2)** to restore legal protections for Ghana’s forest reserves.
2. **Institute a moratorium on mining in sensitive ecological zones** to halt further degradation of water bodies and biodiversity hotspots.
3. **Launch a national campaign to rehabilitate degraded forests and restore polluted rivers**, using clean-up technologies and community-managed reforestation.
4. **Prioritize public healthcare and mercury testing** for affected communities along polluted river basins.
5. **Strengthen environmental governance and judicial accountability** against environmental crimes.
6. **Promote sustainable rural livelihoods** through training in agroforestry and green enterprises.`,
    coverImage: 'https://aercghana.org/wp-content/uploads/2024/09/Galamsey-in-cocoa-production-jpg.webp',
    category: 'Environmental Governance',
    author: 'AERC Policy Team',
    publishedAt: new Date('2024-09-10'),
  },
  {
    id: 8,
    slug: 'communities-on-the-frontlines-why-local-voices-must-lead-ghanas-climate-decisions',
    title: 'Communities on the Frontlines: Why Local Voices Must Lead Ghana’s Climate Decisions',
    excerpt: 'Ghana’s climate crisis is no longer a distant threat; it is a daily reality for millions. For Ghana to build a resilient, equitable, and climate-secure future, local voices must not only be consulted, they must lead.',
    content: `Ghana’s climate crisis is no longer a distant threat, it is a daily reality for millions. From unpredictable rainfall in the north to coastal erosion in the south, frontline communities, including farmers, women, youth, and fisherfolk bear the brunt of climate impacts. These communities possess invaluable, generational knowledge about environmental change and resilient practices. Yet, their voices are often absent from the decisions that shape their lives. For Ghana to build a resilient, equitable, and climate-secure future, local voices must not only be consulted, they must lead. Community-led adaptation is both a rights-based imperative and a scientifically proven, cost-effective, and sustainable approach to climate resilience.

Climate impacts in Ghana are highly localized. Smallholder farmers are often the first to notice soil degradation, shifting rainfall patterns, or increasing pest outbreaks. Women identify early signs of water scarcity and food insecurity, while youth understand how environmental degradation affects their economic prospects. Research consistently shows that adaptation interventions designed with community participation are more context-specific and achieve greater long-term success than top-down approaches. Local knowledge, cultivated through lived experience, enhances scientific data and ensures climate strategies respond to real needs, not assumptions.

Smallholder farmers contribute an estimated 60–70% of Ghana’s food, yet they are among the most climate-vulnerable groups due to erratic rainfall, prolonged dry spells, shifting planting seasons, and pest outbreaks. Many farmers already employ highly effective indigenous and climate-smart adaptation strategies, such as intercropping, soil mulching, water harvesting, and organic fertilization. These practices must actively inform national adaptation planning.

Women play critical roles in agriculture, food processing, household water management, and natural resource stewardship. A gender-responsive climate agenda must increase women’s representation in local and national climate committees, allocate gender-responsive budgets, support women-led enterprises, and promote equitable access to land, finance, and training.

### A Call to Action

To center frontline communities in Ghana’s climate decisions:
- Establish formal, mandatory mechanisms for farmers, women, and youth to participate in national climate budgeting.
- Direct accessible climate adaptation funds directly to local district assemblies and community cooperatives.
- Translate meteorological and early warning data into local Ghanaian languages.
- Scale proven community nature-based solutions and agroecological innovations.`,
    coverImage: 'https://aercghana.org/wp-content/uploads/2026/01/Screenshot-2026-01-14-115525.png',
    category: 'Community Adaptation',
    author: 'AERC Climate Desk',
    publishedAt: new Date('2026-01-14'),
  },
  {
    id: 9,
    slug: 'a-sanctuary-under-strain-the-monkey-crisis-at-shai-hills-and-the-case-for-smarter-nature-led-conservation',
    title: 'A Sanctuary Under Strain: The Monkey Crisis at Shai Hills and the Case for Smarter, Nature-Led Conservation',
    excerpt: 'Behind Shai Hills Resource Reserve’s natural beauty, baboons and green monkeys are roaming onto busy highways and approaching moving vehicles for food. Ecological imbalance calls for urgent nature-based solutions.',
    content: `Shai Hills Resource Reserve has always offered a unique window into Ghana’s natural heritage. Located just outside Accra, it is one of the few places where wildlife, culture, and tourism intersect so closely with urban life and a busy highway. But behind its beauty, a growing crisis is unfolding. Increasingly, baboons and green monkeys are leaving the sanctuary, roaming onto the roadside, approaching vehicles for food, and even entering nearby communities. What was once a controlled conservation environment is now becoming a hotspot for human–wildlife conflict, raising questions about ecological imbalance and management gaps.

Motorists driving along the Shai Hills road report unusually large numbers of baboons gathering near the roadside and crossing unpredictably between moving vehicles. Others describe monkeys aggressively snatching food or items from visitors. These behaviours are not typical of healthy primate populations; they indicate behavioural shifts driven by human feeding, habitat pressure, and reduced fear of people.

Tour guides confirm that the green monkeys are becoming fewer and more timid due to the dominance of baboons. When one species overwhelms another, it signals that the reserve’s natural carrying capacity and foraging ecosystems may be compromised.

### Nature-Based Solutions for Shai Hills

1. **Habitat Restoration Within the Reserve:** Expanding native fruit-bearing vegetation and restoring degraded patches to support natural foraging.
2. **Eco-Buffer Zones:** Creating living barriers and woody vegetation between the reserve boundary and surrounding communities.
3. **Strict No-Feeding Enforcement:** Clear signage, ranger monitoring, and educational briefings for motorists and tourists.
4. **Wildlife Crossings:** Designing safe corridors and speed-calming infrastructure on the Shai Hills highway.`,
    coverImage: 'https://aercghana.org/wp-content/uploads/2026/01/Screenshot-2026-01-15-125122.png',
    category: 'Wildlife & Biodiversity',
    author: 'AERC Conservation Unit',
    publishedAt: new Date('2026-01-15'),
  },
  {
    id: 10,
    slug: 'the-answers-are-already-growing-how-nature-based-solutions-can-drive-sustainable-progress-in-ghana',
    title: 'The Answers Are Already Growing: How Nature-Based Solutions Can Drive Sustainable Progress in Ghana',
    excerpt: 'Throughout Ghana, environmental pressures—from urban flooding and soil degradation to coastal erosion—demand urgent action. Nature-Based Solutions (NbS) provide practical, affordable, and culturally grounded pathways.',
    content: `Throughout Ghana, environmental pressures are becoming increasingly difficult to overlook. Flooding disrupts cities after brief rainfall, heatwaves intensify, forests shrink, water bodies decline, and coastal towns lose land to advancing tides. These changes affect food systems, public health, local economies, and long-term development.

Yet as these challenges deepen, nature continues to offer solutions that are practical, affordable, and already proven across many communities. Nature-Based Solutions (NbS) provide a powerful pathway for building resilience while supporting sustainable development.

Urban flooding has become a recurring event, especially in fast-growing cities where wetlands and green spaces have disappeared, leaving drainage systems struggling to cope. Restoring wetlands can reduce urban flooding, improve water quality, and enhance groundwater recharge.

Along the coastline, restoring mangroves and sand dunes strengthens natural defenses, reduces storm surge destruction, and revives fish breeding grounds. In agricultural communities, agroforestry, multi-cropping, and farmer-managed natural regeneration restore soil fertility without heavy chemical inputs.

Nature is not a barrier to development; it is an indispensable partner. Many of the solutions needed to build a stronger, more resilient future already exist in Ghana's forests, rivers, wetlands, and coastlines. The answers we seek are already growing.`,
    coverImage: 'https://aercghana.org/wp-content/uploads/2026/01/Screenshot-2026-01-15-130359.png',
    category: 'Nature-Based Solutions',
    author: 'AERC Policy Desk',
    publishedAt: new Date('2026-01-15'),
  },
];

export interface TeamMember {
  id?: number;
  slug?: string;
  name: string;
  role: string;
  category: 'leadership' | 'officers' | 'board' | 'volunteers';
  image: string;
  bio: string;
  expertise?: string;
  qualifications?: string;
  email?: string;
  phone?: string;
  linkedin?: string;
  twitter?: string;
  facebook?: string;
  displayOrder?: number;
  isFeatured?: 'yes' | 'no';
  status?: 'active' | 'inactive';
}

export const initialTeamMembers: TeamMember[] = [
  {
    id: 1,
    slug: 'richard-matey',
    name: 'Richard Matey',
    role: 'Founder & Strategic Advisor',
    category: 'leadership',
    image: '/images/hero-forest-1.jpg',
    bio: 'Founder of Alliance for Empowering Rural Communities (AERC), pioneering youth-led and community-driven environmental conservation, climate justice, and decentralized renewable energy advocacy across Ghana.',
    expertise: 'Climate Justice, Grassroots Mobilization, Renewable Energy Policy, International Climate Negotiations',
    qualifications: 'Environmental Fellow & Grassroots Strategist',
    email: 'info@aercghana.org',
    linkedin: 'https://linkedin.com/company/aerc-ghana',
    twitter: 'https://twitter.com/aercghana',
    displayOrder: 1,
    isFeatured: 'yes',
    status: 'active',
  },
  {
    id: 2,
    slug: 'desmond-sena-kofi-foe',
    name: 'Desmond Sena Kofi Foe',
    role: 'Executive Director',
    category: 'leadership',
    image: 'https://aercghana.org/wp-content/uploads/2025/07/DESMOND.jpg',
    bio: 'Leads AERC’s programmatic strategy, institutional partnerships, and grassroots policy interventions across clean energy transition, zero waste, and ecological justice in Ghana.',
    expertise: 'Just Energy Transition, Clean Cooking Alternatives, Fossil Finance Accountability, Rural Empowerment',
    qualifications: 'B.Sc. Natural Resources & Environmental Governance',
    email: 'desmond@aercghana.org',
    linkedin: 'https://linkedin.com/in/desmondfoe',
    twitter: 'https://twitter.com/desmondfoe',
    displayOrder: 2,
    isFeatured: 'yes',
    status: 'active',
  },
  {
    id: 3,
    slug: 'carlisle-naa-dodua-dodoo',
    name: 'Carlisle Naa Dodua Dodoo',
    role: 'Community-Led Adaptation Lead & Communications Officer',
    category: 'officers',
    image: 'https://aercghana.org/wp-content/uploads/2025/07/DODOA-1.jpg',
    bio: 'Steers AERC’s frontline community adaptation initiatives, public messaging, media relations, and digital advocacy campaigns to amplify grassroots climate resilience.',
    expertise: 'Community-Led Adaptation, Media Relations, Strategic Storytelling, Environmental Advocacy',
    qualifications: 'B.A. Communication Studies & Public Relations',
    email: 'communications@aercghana.org',
    linkedin: 'https://linkedin.com/company/aerc-ghana',
    twitter: 'https://twitter.com/aercghana',
    displayOrder: 3,
    isFeatured: 'yes',
    status: 'active',
  },
  {
    id: 4,
    slug: 'nicholas-selady-sekpey',
    name: 'Nicholas Selady Sekpey',
    role: 'Renewable Energy Lead & Energy Officer',
    category: 'officers',
    image: 'https://aercghana.org/wp-content/uploads/2025/07/1.jpg',
    bio: 'Drives decentralized renewable energy programs, rural mini-grid analysis, clean cooking demonstrations, and youth technical training in solar PV installation.',
    expertise: 'Solar PV Systems, Off-Grid Rural Electrification, Energy Efficiency, Productive Use of Clean Energy',
    qualifications: 'B.Sc. Renewable Energy & Electrical Systems',
    email: 'energy@aercghana.org',
    linkedin: 'https://linkedin.com/company/aerc-ghana',
    displayOrder: 4,
    isFeatured: 'yes',
    status: 'active',
  },
  {
    id: 5,
    slug: 'sandra-efua-attah-dickson',
    name: 'Sandra Efua Attah Dickson',
    role: 'Nature-Based Solutions Lead & Climate Officer',
    category: 'officers',
    image: 'https://aercghana.org/wp-content/uploads/2025/07/WhatsApp-Image-2026-05-25-at-2.38.19-PM-e1779720138791.jpeg',
    bio: 'Oversees community-led biodiversity conservation, agroforestry, wetland protection, and climate vulnerability assessments across vulnerable Ghanaian districts.',
    expertise: 'Nature-Based Solutions, Agroecological Farming, Wetland Restoration, Climate Risk Assessment',
    qualifications: 'B.Sc. Environmental Science & Natural Resource Management',
    email: 'climate@aercghana.org',
    linkedin: 'https://linkedin.com/company/aerc-ghana',
    displayOrder: 5,
    isFeatured: 'yes',
    status: 'active',
  },
  {
    id: 6,
    slug: 'yvette-ahenkorah',
    name: 'Yvette Ahenkorah',
    role: 'Urban & Infrastructure Lead / Finance & Admin Manager',
    category: 'leadership',
    image: 'https://aercghana.org/wp-content/uploads/2025/07/YVETTE-1.jpg',
    bio: 'Manages institutional administration, partner grant compliance, and financial transparency while heading research on sustainable urban drainage and infrastructure planning.',
    expertise: 'Urban Climate Infrastructure, Financial Administration, Compliance, Circular Economy Planning',
    qualifications: 'B.Sc. Administration (Accounting & Finance)',
    email: 'finance@aercghana.org',
    linkedin: 'https://linkedin.com/company/aerc-ghana',
    displayOrder: 6,
    isFeatured: 'no',
    status: 'active',
  },
  {
    id: 7,
    slug: 'quaye-alexandria-abigail-naa-odey',
    name: 'Quaye Alexandria Abigail Naa Odey',
    role: 'GreenLife Club Coordinator',
    category: 'officers',
    image: '/images/projects/club.jpg',
    bio: 'Coordinates environmental education curricula, tree nursery maintenance, and student eco-clubs across basic and senior high schools in Greater Accra and the Volta Region.',
    expertise: 'Youth Climate Pedagogy, School Garden Mobilization, Plastic Waste Upcycling Education',
    qualifications: 'B.Ed. Science Education',
    email: 'clubs@aercghana.org',
    displayOrder: 7,
    isFeatured: 'no',
    status: 'active',
  },
  {
    id: 8,
    slug: 'siisi-ansah',
    name: 'Siisi Ansah',
    role: 'Volunteer Community Advocate',
    category: 'volunteers',
    image: 'https://aercghana.org/wp-content/uploads/2025/07/SIISI-1.jpg',
    bio: 'Frontline grassroots volunteer leading coastal clean-ups, municipal waste separation workshops, and youth community zero waste actions in Kpone Katamanso.',
    expertise: 'Grassroots Community Organizing, Youth Field Mobilization, Zero Waste Clean-Up Campaigns',
    qualifications: 'Community Leadership Fellow',
    displayOrder: 8,
    isFeatured: 'no',
    status: 'active',
  },
  {
    id: 9,
    slug: 'vida-agyeabeng-ayim',
    name: 'Vida Agyeabeng Ayim',
    role: 'Community Volunteer Advocate',
    category: 'volunteers',
    image: '/images/hero-community.jpg',
    bio: 'Dedicated grassroots organizer championing rural women’s access to clean cooking stoves, seedling nursery distribution, and household agroforestry plots.',
    expertise: 'Rural Women Empowerment, Clean Cookstove Adoption, Community Seed Banking',
    qualifications: 'Grassroots Agricultural Advocate',
    displayOrder: 9,
    isFeatured: 'no',
    status: 'active',
  },
];

export interface InitialSitePage {
  id: number;
  slug: string;
  title: string;
  description: string;
  status: 'published' | 'draft';
  lastUpdatedBy: string;
}

export const initialSitePages: InitialSitePage[] = [
  {
    id: 1,
    slug: '/',
    title: 'Home Page',
    description: 'Main landing page featuring hero banner, mission, impact stats, active campaigns, and news.',
    status: 'published',
    lastUpdatedBy: 'Admin',
  },
  {
    id: 2,
    slug: '/about',
    title: 'About Us',
    description: 'AERC Ghana organizational story, core mission, vision, values, and leadership introduction.',
    status: 'published',
    lastUpdatedBy: 'Admin',
  },
  {
    id: 3,
    slug: '/projects',
    title: 'Projects & Initiatives',
    description: 'Comprehensive directory of active ecological campaigns, clean cooking, and energy projects.',
    status: 'published',
    lastUpdatedBy: 'Admin',
  },
  {
    id: 4,
    slug: '/blog',
    title: 'News & Insights',
    description: 'Climate justice articles, field dispatches, policy press statements, and quarterly newsletters.',
    status: 'published',
    lastUpdatedBy: 'Admin',
  },
  {
    id: 5,
    slug: '/resources',
    title: 'Publications & Reports',
    description: 'Downloadable research reports, policy briefs, and community action guides in PDF format.',
    status: 'published',
    lastUpdatedBy: 'Admin',
  },
  {
    id: 6,
    slug: '/team',
    title: 'Our Team & Leadership',
    description: 'Dedicated roster of executives, officers, and community volunteers driving AERC forward.',
    status: 'published',
    lastUpdatedBy: 'Admin',
  },
  {
    id: 7,
    slug: '/donate',
    title: 'Support & Donate',
    description: 'Grassroots giving portal with Ghana MoMo, international card, and direct bank wire options.',
    status: 'published',
    lastUpdatedBy: 'Admin',
  },
  {
    id: 8,
    slug: '/faq',
    title: 'Frequently Asked Questions',
    description: 'Categorized knowledge base covering programs, partnerships, donations, and volunteering.',
    status: 'published',
    lastUpdatedBy: 'Admin',
  },
  {
    id: 9,
    slug: '/contact',
    title: 'Contact Us',
    description: 'Citizen contact portal, headquarters address in Gbetsile, phone, and direct contact form.',
    status: 'published',
    lastUpdatedBy: 'Admin',
  },
  {
    id: 10,
    slug: '/volunteer',
    title: 'Volunteer Application',
    description: 'Community volunteer recruitment page with interactive multi-field application form.',
    status: 'published',
    lastUpdatedBy: 'Admin',
  },
  {
    id: 11,
    slug: '/partner',
    title: 'Partner Application',
    description: 'Institutional & NGO partnership proposal submission portal for strategic collaborations.',
    status: 'published',
    lastUpdatedBy: 'Admin',
  },
  {
    id: 12,
    slug: '/events',
    title: 'Events & Convenings',
    description: 'Upcoming workshops, community dialogues, and national climate policy symposiums.',
    status: 'published',
    lastUpdatedBy: 'Admin',
  },
  {
    id: 13,
    slug: '/festival',
    title: 'Ghana Environmental Youth Festival',
    description: 'Annual youth gathering celebrating grassroots innovation, eco-art, and youth activism.',
    status: 'published',
    lastUpdatedBy: 'Admin',
  },
  {
    id: 14,
    slug: '/mission',
    title: 'Our Mission',
    description: 'Core institutional mission: empowering vulnerable rural communities through nature-based climate solutions and clean energy transition.',
    status: 'published',
    lastUpdatedBy: 'Admin',
  },
  {
    id: 15,
    slug: '/vision',
    title: 'Our Vision',
    description: 'A thriving, ecologically resilient Ghana where youth and rural frontline communities spearhead sustainable development.',
    status: 'published',
    lastUpdatedBy: 'Admin',
  },
  {
    id: 16,
    slug: '/objectives',
    title: 'Strategic Objectives',
    description: 'Five-year tactical goals spanning agroecology, clean cooking adoption, fossil fuel finance accountability, and youth policy capacity.',
    status: 'published',
    lastUpdatedBy: 'Admin',
  },
  {
    id: 17,
    slug: '/how-we-work',
    title: 'How We Work',
    description: 'Four-pillar grassroots methodology: community convenings, technical capacity building, policy shadow reporting, and direct ecological action.',
    status: 'published',
    lastUpdatedBy: 'Admin',
  },
];

export interface InitialActivityLog {
  id: number;
  adminEmail: string;
  adminName: string;
  action: 'publish' | 'update' | 'create' | 'login' | 'delete';
  entityType: 'article' | 'project' | 'publication' | 'page' | 'team_member' | 'user' | 'donation';
  entityTitle: string;
  details?: string;
  timeAgo: string;
}

export const initialActivityLogs: InitialActivityLog[] = [
  {
    id: 1,
    adminEmail: 'admin@aercghana.org',
    adminName: 'AERC Administrator',
    action: 'publish',
    entityType: 'article',
    entityTitle: 'AERC Calls for Immediate Government Action to Repeal EIs',
    details: 'Synced article from WordPress XML and verified live route',
    timeAgo: '15 mins ago',
  },
  {
    id: 2,
    adminEmail: 'admin@aercghana.org',
    adminName: 'AERC Administrator',
    action: 'create',
    entityType: 'project',
    entityTitle: 'Green-Life Clubs Initiative',
    details: 'Added school environmental education initiative to projects catalogue',
    timeAgo: '42 mins ago',
  },
  {
    id: 3,
    adminEmail: 'admin@aercghana.org',
    adminName: 'AERC Administrator',
    action: 'update',
    entityType: 'team_member',
    entityTitle: 'Richard Matey & Leadership Roster',
    details: 'Synchronised 9 authentic staff profiles and media portraits',
    timeAgo: '1 hour ago',
  },
  {
    id: 4,
    adminEmail: 'admin@aercghana.org',
    adminName: 'AERC Administrator',
    action: 'create',
    entityType: 'page',
    entityTitle: 'Grassroots Donation Platform (/donate)',
    details: 'Configured MoMo & card payment rails replacing GiveWP',
    timeAgo: '2 hours ago',
  },
  {
    id: 5,
    adminEmail: 'admin@aercghana.org',
    adminName: 'AERC Administrator',
    action: 'login',
    entityType: 'user',
    entityTitle: 'Secure Portal Login',
    details: 'Authenticated via bcrypt + jose JWT session',
    timeAgo: '3 hours ago',
  },
];

export const initialFocusAreas: FocusArea[] = [
  {
    id: 1,
    slug: 'community-led-adaptation',
    title: 'Community-Led Adaptation',
    parentPillar: 'Environment & Climate',
    summary: 'Empowering frontline communities to lead their own climate adaptation, strengthen local governance, and ensure grassroots knowledge informs national and international policy.',
    description: 'We believe lasting climate solutions must be owned and led by the communities they serve. We strengthen local leadership, build adaptive capacity, and ensure grassroots knowledge informs policy and practice. From training climate champions to supporting community-driven projects, we help people take charge of their resilience journey.',
    icon: 'fa-users-line',
    image: '/images/hero-community.jpg',
    tags: 'Local Leadership, Adaptive Capacity, Grassroots Policy, Agroecology, Food Security',
    displayOrder: 1,
    isFeatured: 'yes',
    status: 'active',
  },
  {
    id: 2,
    slug: 'nature-based-solutions',
    title: 'Nature-Based Solutions',
    parentPillar: 'Environment & Climate',
    summary: 'Restoring degraded terrestrial and coastal ecosystems, protecting biodiversity, and deploying nature-rooted strategies that safeguard frontline rural livelihoods.',
    description: 'Healthy ecosystems are the foundation of climate resilience. We restore degraded lands, preserve biodiversity, and promote adaptation strategies rooted in nature. By protecting forests, wetlands, and mangroves, we strengthen natural defenses against climate impacts while creating livelihood opportunities for local communities.',
    icon: 'fa-seedling',
    image: '/images/projects/garden.jpg',
    tags: 'Reforestation, Wetland Conservation, Biodiversity, Tree Planting, Mangroves',
    displayOrder: 2,
    isFeatured: 'yes',
    status: 'active',
  },
  {
    id: 3,
    slug: 'urban-infrastructure-development',
    title: 'Urban & Infrastructure Development',
    parentPillar: 'Environment & Climate',
    summary: 'Promoting inclusive, climate-resilient infrastructure, green public spaces, and adaptive municipal designs that safeguard vulnerable informal settlements.',
    description: 'We promote inclusive, climate-resilient infrastructure that safeguards lives and livelihoods while supporting sustainable growth. This includes urban planning with green spaces, sustainable transport, and adaptive designs that protect vulnerable communities from extreme weather and flooding.',
    icon: 'fa-city',
    image: '/images/hero-bg.jpg',
    tags: 'Green Urban Spaces, Resilient Transport, Climate Planning, Municipal Governance',
    displayOrder: 3,
    isFeatured: 'yes',
    status: 'active',
  },
  {
    id: 4,
    slug: 'plastics-waste-management',
    title: 'Plastics & Waste Management',
    parentPillar: 'Environment & Climate',
    summary: 'Combating plastic pollution through grassroots education, community cleanups, waste segregation, circular enterprise models, and extended producer responsibility advocacy.',
    description: 'Plastic pollution and poor waste management threaten both people and ecosystems. We reduce plastic use, promote sustainable consumption, and advocate for producer responsibility. Through education, clean-ups, waste segregation, and circular economy initiatives, we turn waste into resources, protect ecosystems, and reduce greenhouse gas emissions.',
    icon: 'fa-recycle',
    image: '/images/clean-cook.jpg',
    tags: 'Circular Economy, Zero Waste Action, Producer Responsibility, Community Cleanups',
    displayOrder: 4,
    isFeatured: 'yes',
    status: 'active',
  },
  {
    id: 5,
    slug: 'fossil-fuel-finance-accountability',
    title: 'Fossil Fuel Finance Accountability',
    parentPillar: 'Energy Transition',
    summary: 'Tracking public financing and export credit subsidies to fossil fuel expansion, advocating for divestment, and redirecting capital toward community-owned clean power.',
    description: 'We push for public and private investments to move away from fossil fuels toward sustainable and just alternatives. By tracking and challenging harmful energy financing, particularly through Export Credit Agencies (ECAs), we accelerate the shift to a low-carbon future and ensure financial accountability.',
    icon: 'fa-file-invoice-dollar',
    image: '/images/projects/ticking.jpg',
    tags: 'Divestment, Public Finance, ECA Tracking, Climate Finance, Policy Reform',
    displayOrder: 5,
    isFeatured: 'yes',
    status: 'active',
  },
  {
    id: 6,
    slug: 'critical-raw-materials',
    title: 'Critical Raw Materials',
    parentPillar: 'Energy Transition',
    summary: 'Advocating for transparent, human-rights centered, and ecologically responsible extraction of transition minerals across Africa to protect frontline host communities.',
    description: 'The green transition relies on critical minerals, but extraction must not harm communities or the environment. We promote transparent, fair, and sustainable sourcing practices, ensuring benefits for local people and safeguarding ecosystems through responsible governance and community consent.',
    icon: 'fa-gem',
    image: '/images/projects/solar.jpg',
    tags: 'Responsible Mining, Just Transition, Human Rights, Minerals Governance',
    displayOrder: 6,
    isFeatured: 'yes',
    status: 'active',
  },
  {
    id: 7,
    slug: 'renewable-energy',
    title: 'Renewable Energy',
    parentPillar: 'Energy Transition',
    summary: 'Championing decentralized renewable energy systems, community solar mini-grids, and clean cooking solutions that reduce emissions while powering rural economic prosperity.',
    description: 'Clean, affordable, and reliable energy is essential for poverty reduction and equitable development. We champion decentralized renewable energy systems that power homes, schools, and businesses, reducing fossil fuel dependence while creating economic opportunities in rural areas.',
    icon: 'fa-solar-panel',
    image: '/images/projects/clean-cook.jpg',
    tags: 'Decentralized Power, Solar Mini-Grids, Clean Energy Sovereignty, Clean Cooking',
    displayOrder: 7,
    isFeatured: 'yes',
    status: 'active',
  },
];

export const initialMediaItems: MediaItem[] = [
  // 1. Team Photographs
  {
    id: 1,
    publicId: 'aerc_media/team_desmond',
    title: 'Desmond Sena Kofi Foe - Executive Director',
    filename: 'desmond.jpg',
    url: '/images/team/desmond.jpg',
    thumbnailUrl: '/images/team/desmond.jpg',
    category: 'Team Photographs',
    fileType: 'image/jpeg',
    fileSize: '134 KB',
    bytes: 134584,
    width: 800,
    height: 800,
    altText: 'Desmond Sena Kofi Foe, Executive Director of AERC Ghana',
    caption: 'Desmond Sena Kofi Foe, Executive Director and environmental rights advocate',
    description: 'Official leadership portrait of Desmond Sena Kofi Foe, Executive Director at Africa Environmental Research and Consulting (AERC Ghana).',
    folder: 'team',
    tags: 'team, leadership, executive director, staff, portrait',
    uploadedBy: 'System Migration',
  },
  {
    id: 2,
    publicId: 'aerc_media/team_carlisle',
    title: 'Carlisle Naa Dodua Dodoo - Community-Led Adaptation Lead',
    filename: 'carlisle.jpg',
    url: '/images/team/carlisle.jpg',
    thumbnailUrl: '/images/team/carlisle.jpg',
    category: 'Team Photographs',
    fileType: 'image/jpeg',
    fileSize: '208 KB',
    bytes: 208343,
    width: 800,
    height: 800,
    altText: 'Carlisle Naa Dodua Dodoo, Community-Led Adaptation Lead',
    caption: 'Carlisle Naa Dodua Dodoo leads climate adaptation projects with frontline communities',
    description: 'Portrait of Carlisle Naa Dodua Dodoo, heading community climate adaptation and resilient agriculture at AERC Ghana.',
    folder: 'team',
    tags: 'team, leadership, community adaptation, staff',
    uploadedBy: 'System Migration',
  },
  {
    id: 3,
    publicId: 'aerc_media/team_nicholas',
    title: 'Nicholas Selady Sekpey - Renewable Energy Lead',
    filename: 'nicholas.jpg',
    url: '/images/team/nicholas.jpg',
    thumbnailUrl: '/images/team/nicholas.jpg',
    category: 'Team Photographs',
    fileType: 'image/jpeg',
    fileSize: '212 KB',
    bytes: 212386,
    width: 800,
    height: 800,
    altText: 'Nicholas Selady Sekpey, Renewable Energy Lead',
    caption: 'Nicholas Selady Sekpey, leading decentralized renewable power initiatives',
    description: 'Official portrait of Nicholas Selady Sekpey, spearheading the Just Energy Transition and rural solar minigrid efforts.',
    folder: 'team',
    tags: 'team, leadership, renewable energy, clean power',
    uploadedBy: 'System Migration',
  },
  {
    id: 4,
    publicId: 'aerc_media/team_sandra',
    title: 'Sandra Efua Attah Dickson - Nature-Based Solutions Lead',
    filename: 'sandra.jpeg',
    url: '/images/team/sandra.jpeg',
    thumbnailUrl: '/images/team/sandra.jpeg',
    category: 'Team Photographs',
    fileType: 'image/jpeg',
    fileSize: '48 KB',
    bytes: 48500,
    width: 800,
    height: 800,
    altText: 'Sandra Efua Attah Dickson, Nature-Based Solutions Lead',
    caption: 'Sandra Efua Attah Dickson, championing biodiversity restoration and tree planting',
    description: 'Official portrait of Sandra Efua Attah Dickson, overseeing agroecological restoration and nature-based solutions.',
    folder: 'team',
    tags: 'team, leadership, nature-based solutions, biodiversity',
    uploadedBy: 'System Migration',
  },
  {
    id: 5,
    publicId: 'aerc_media/team_yvette',
    title: 'Yvette Ahenkorah - Urban & Infrastructure Lead',
    filename: 'yvette.jpg',
    url: '/images/team/yvette.jpg',
    thumbnailUrl: '/images/team/yvette.jpg',
    category: 'Team Photographs',
    fileType: 'image/jpeg',
    fileSize: '117 KB',
    bytes: 117800,
    width: 800,
    height: 800,
    altText: 'Yvette Ahenkorah, Urban and Infrastructure Lead',
    caption: 'Yvette Ahenkorah, leading green urban design and climate-resilient planning',
    description: 'Official portrait of Yvette Ahenkorah, directing sustainable urban infrastructure and informal settlement resilience.',
    folder: 'team',
    tags: 'team, leadership, urban infrastructure, sustainable cities',
    uploadedBy: 'System Migration',
  },
  {
    id: 6,
    publicId: 'aerc_media/team_siisi',
    title: 'Siisi Ansah - Youth Volunteer Coordinator',
    filename: 'siisi.jpg',
    url: '/images/team/siisi.jpg',
    thumbnailUrl: '/images/team/siisi.jpg',
    category: 'Team Photographs',
    fileType: 'image/jpeg',
    fileSize: '352 KB',
    bytes: 352023,
    width: 800,
    height: 800,
    altText: 'Siisi Ansah, Volunteer and Youth Climate Organizer',
    caption: 'Siisi Ansah coordinates university volunteers and grassroots school outreach',
    description: 'Portrait of Siisi Ansah, coordinating grassroots volunteer campaigns, community cleanup drives, and school outreach.',
    folder: 'team',
    tags: 'team, volunteer, youth, grassroots',
    uploadedBy: 'System Migration',
  },

  // 2. Project Images
  {
    id: 7,
    publicId: 'aerc_media/project_garden',
    title: 'Kuvuna One World Garden Project',
    filename: 'garden.jpg',
    url: '/images/projects/garden.jpg',
    thumbnailUrl: '/images/projects/garden.jpg',
    category: 'Project Images',
    fileType: 'image/jpeg',
    fileSize: '179 KB',
    bytes: 179423,
    width: 1200,
    height: 800,
    altText: 'Organic vegetable garden beds cultivated through Kuvuna One World Garden',
    caption: 'Community members nurturing agroecological crops in the Kuvuna pilot garden',
    description: 'Field photo showing community farmers cultivating organic crops using sustainable agroecological practices.',
    folder: 'projects',
    tags: 'projects, agriculture, food security, agroecology, kuvuna',
    uploadedBy: 'System Migration',
  },
  {
    id: 8,
    publicId: 'aerc_media/project_solar',
    title: 'Just Energy Transition - Solar Initiative',
    filename: 'solar.jpg',
    url: '/images/projects/solar.jpg',
    thumbnailUrl: '/images/projects/solar.jpg',
    category: 'Project Images',
    fileType: 'image/jpeg',
    fileSize: '130 KB',
    bytes: 130852,
    width: 1200,
    height: 800,
    altText: 'Solar panels installed on rooftop providing clean community energy',
    caption: 'Decentralized solar photovoltaic installation providing clean energy to rural households',
    description: 'Documentation of community-scale solar installation under the Just Energy Transition project.',
    folder: 'projects',
    tags: 'projects, solar, renewable energy, clean power, JET',
    uploadedBy: 'System Migration',
  },
  {
    id: 9,
    publicId: 'aerc_media/project_clean_cook',
    title: 'Climate-Friendly Cooking Demonstration',
    filename: 'clean-cook.jpg',
    url: '/images/projects/clean-cook.jpg',
    thumbnailUrl: '/images/projects/clean-cook.jpg',
    category: 'Project Images',
    fileType: 'image/jpeg',
    fileSize: '404 KB',
    bytes: 404078,
    width: 1200,
    height: 800,
    altText: 'Women community leaders demonstrating improved fuel-efficient cookstoves',
    caption: 'Training rural women on improved clean cookstoves to reduce smoke exposure and firewood use',
    description: 'Field workshop teaching women cooperative members how to manufacture and utilize energy-efficient cookstoves.',
    folder: 'projects',
    tags: 'projects, clean cooking, health, women, climate',
    uploadedBy: 'System Migration',
  },
  {
    id: 10,
    publicId: 'aerc_media/project_fossil_finance',
    title: 'Fossil Finance Campaign Banner',
    filename: 'ticking.jpg',
    url: '/images/projects/ticking.jpg',
    thumbnailUrl: '/images/projects/ticking.jpg',
    category: 'Project Images',
    fileType: 'image/jpeg',
    fileSize: '170 KB',
    bytes: 170550,
    width: 1200,
    height: 800,
    altText: 'Clock ticking on fossil fuel subsidies advocacy graphic',
    caption: 'Mobilizing youth and CSOs across Africa to end export credit subsidies for oil and gas',
    description: 'Advocacy creative highlighting the urgent need to halt public finance flows to fossil fuels in Africa.',
    folder: 'projects',
    tags: 'projects, climate finance, fossil free, advocacy',
    uploadedBy: 'System Migration',
  },
  {
    id: 11,
    publicId: 'aerc_media/project_club',
    title: 'Green-Life School Clubs Workshop',
    filename: 'club.jpg',
    url: '/images/projects/club.jpg',
    thumbnailUrl: '/images/projects/club.jpg',
    category: 'Project Images',
    fileType: 'image/jpeg',
    fileSize: '131 KB',
    bytes: 131577,
    width: 1200,
    height: 800,
    altText: 'Secondary school students participating in Green-Life environmental club activities',
    caption: 'Student climate ambassadors participating in interactive environmental education sessions',
    description: 'Hands-on environmental learning session with high school students under the Green-Life Clubs program.',
    folder: 'projects',
    tags: 'projects, green-life, schools, youth education',
    uploadedBy: 'System Migration',
  },
  {
    id: 12,
    publicId: 'aerc_media/project_sdg',
    title: 'SDG Watch Ghana Multi-Stakeholder Dialogue',
    filename: 'sdg.jpg',
    url: '/images/projects/sdg.jpg',
    thumbnailUrl: '/images/projects/sdg.jpg',
    category: 'Project Images',
    fileType: 'image/jpeg',
    fileSize: '116 KB',
    bytes: 116912,
    width: 1200,
    height: 800,
    altText: 'Stakeholders convening at national SDG Watch Ghana tracking forum',
    caption: 'Tracking civil society progress toward Sustainable Development Goals 7 and 13',
    description: 'Conference convening policymakers, civil society, and grassroots leaders to evaluate Ghana’s climate and energy SDGs.',
    folder: 'projects',
    tags: 'projects, sdg, policy tracking, civil society',
    uploadedBy: 'System Migration',
  },
  {
    id: 13,
    publicId: 'aerc_media/project_youth4ndcs',
    title: 'Youth4NDCs Climate Action Strategy Meeting',
    filename: 'youth4ndcs.jpg',
    url: '/images/projects/youth4ndcs.jpg',
    thumbnailUrl: '/images/projects/youth4ndcs.jpg',
    category: 'Project Images',
    fileType: 'image/jpeg',
    fileSize: '294 KB',
    bytes: 294853,
    width: 1200,
    height: 800,
    altText: 'Youth leaders reviewing Ghana Nationally Determined Contributions (NDCs)',
    caption: 'Empowering young climate champions to engage in national climate policy formulation',
    description: 'Workshop equipping African youth representatives to participate in international climate negotiations and domestic NDCs.',
    folder: 'projects',
    tags: 'projects, youth4ndcs, policy, climate change',
    uploadedBy: 'System Migration',
  },

  // 3. Event Photographs
  {
    id: 14,
    publicId: 'aerc_media/event_gbetsile_1',
    title: 'Gbetsile Community Climate Dialogue - Session 1',
    filename: 'gbetsile-dialogue-1.jpg',
    url: '/images/gbetsile-dialogue-1.jpg',
    thumbnailUrl: '/images/gbetsile-dialogue-1.jpg',
    category: 'Event Photographs',
    fileType: 'image/jpeg',
    fileSize: '126 KB',
    bytes: 126866,
    width: 1200,
    height: 800,
    altText: 'Community members actively dialoguing at Gbetsile climate forum',
    caption: 'Local leaders sharing experiences with environmental degradation and waste management',
    description: 'Photo from the Gbetsile town hall dialogue focused on local flood risk and community-led adaptation solutions.',
    folder: 'events',
    tags: 'events, community dialogue, gbetsile, adaptation',
    uploadedBy: 'System Migration',
  },
  {
    id: 15,
    publicId: 'aerc_media/event_gbetsile_2',
    title: 'Gbetsile Community Climate Dialogue - Session 2',
    filename: 'gbetsile-dialogue-2.jpg',
    url: '/images/gbetsile-dialogue-2.jpg',
    thumbnailUrl: '/images/gbetsile-dialogue-2.jpg',
    category: 'Event Photographs',
    fileType: 'image/jpeg',
    fileSize: '187 KB',
    bytes: 187385,
    width: 1200,
    height: 800,
    altText: 'Youth participants working in breakout groups during Gbetsile climate session',
    caption: 'Action planning breakout group developing waste segregation strategies for Gbetsile',
    description: 'Breakout session with young climate activists co-designing neighborhood waste reduction plans.',
    folder: 'events',
    tags: 'events, youth, gbetsile, workshops',
    uploadedBy: 'System Migration',
  },
  {
    id: 16,
    publicId: 'aerc_media/event_earth_day',
    title: 'Earth Day Climate Action Banner',
    filename: 'earth-day-banner.jpg',
    url: '/images/about/earth-day-banner.jpg',
    thumbnailUrl: '/images/about/earth-day-banner.jpg',
    category: 'Event Photographs',
    fileType: 'image/jpeg',
    fileSize: '474 KB',
    bytes: 474857,
    width: 1400,
    height: 700,
    altText: 'Earth Day climate action banner displayed during youth mobilization',
    caption: 'AERC youth delegates displaying the official Earth Day climate solidarity banner',
    description: 'Commemorative banner and participants during the annual Earth Day climate justice march in Accra.',
    folder: 'events',
    tags: 'events, earth day, climate action, mobilization',
    uploadedBy: 'System Migration',
  },
  {
    id: 17,
    publicId: 'aerc_media/event_festival_banner',
    title: 'AERC Youth Climate Festival Banner',
    filename: 'festival-banner.jpg',
    url: '/images/festival-banner.jpg',
    thumbnailUrl: '/images/festival-banner.jpg',
    category: 'Event Photographs',
    fileType: 'image/jpeg',
    fileSize: '290 KB',
    bytes: 290061,
    width: 1400,
    height: 700,
    altText: 'Official banner for the AERC Youth Climate and Energy Festival',
    caption: 'Promoting youth ecological leadership and renewable energy innovation',
    description: 'Main stage banner from the annual AERC Youth Climate and Clean Energy Festival.',
    folder: 'events',
    tags: 'events, festival, youth, celebration',
    uploadedBy: 'System Migration',
  },

  // 4. Publication Covers & Documents
  {
    id: 18,
    publicId: 'aerc_media/pub_cover_2025',
    title: 'AERC 2025 Annual Report Cover',
    filename: 'blog-annual-report-2025.jpg',
    url: '/images/blog-annual-report-2025.jpg',
    thumbnailUrl: '/images/blog-annual-report-2025.jpg',
    category: 'Publication Covers',
    fileType: 'image/jpeg',
    fileSize: '1.8 MB',
    bytes: 1872527,
    width: 1200,
    height: 1600,
    altText: 'AERC 2025 Annual Report publication front cover',
    caption: 'Official front cover artwork of the 2025 AERC Annual Progress Report',
    description: 'High-resolution cover image for the 2025 Annual Report detailing program accomplishments and financial accountability.',
    folder: 'publications',
    tags: 'publications, annual report, cover, 2025',
    uploadedBy: 'System Migration',
  },
  {
    id: 19,
    publicId: 'aerc_media/pub_report_cover',
    title: 'AERC Research & Policy Report Cover Graphic',
    filename: 'blog-report.jpg',
    url: '/images/blog-report.jpg',
    thumbnailUrl: '/images/blog-report.jpg',
    category: 'Publication Covers',
    fileType: 'image/jpeg',
    fileSize: '1.8 MB',
    bytes: 1872527,
    width: 1200,
    height: 800,
    altText: 'Cover artwork for AERC policy briefs and research series',
    caption: 'Branded publication banner for AERC research publications',
    description: 'Standard publication title graphic used on policy briefs and technical assessments.',
    folder: 'publications',
    tags: 'publications, research, policy briefs, cover',
    uploadedBy: 'System Migration',
  },
  {
    id: 20,
    publicId: 'aerc_media/doc_annual_report_2025',
    title: 'AERC 2025 Annual Report (PDF Document)',
    filename: 'AERC-2025-ANNUAL-REPORT-.pdf',
    url: '/documents/AERC-2025-ANNUAL-REPORT-.pdf',
    thumbnailUrl: '/images/blog-annual-report-2025.jpg',
    category: 'Publication Covers',
    fileType: 'application/pdf',
    fileSize: '14.6 MB',
    bytes: 14618686,
    width: null,
    height: null,
    altText: 'Complete downloadable PDF of the 2025 AERC Ghana Annual Report',
    caption: 'Downloadable PDF document: AERC Ghana Annual Report 2025',
    description: 'Comprehensive report on AERC Ghana activities, grassroots reach, clean energy advocacy, and governance for 2025.',
    folder: 'documents',
    tags: 'document, pdf, annual report, governance, 2025',
    uploadedBy: 'System Migration',
  },
  {
    id: 21,
    publicId: 'aerc_media/doc_just_transition_africa',
    title: 'A Just Energy Transition for Africa (PDF Document)',
    filename: 'A-Just-Energy-Transition-for-Africa.pdf',
    url: '/documents/A-Just-Energy-Transition-for-Africa.pdf',
    thumbnailUrl: '/images/projects/solar.jpg',
    category: 'Publication Covers',
    fileType: 'application/pdf',
    fileSize: '1.1 MB',
    bytes: 1165005,
    width: null,
    height: null,
    altText: 'Policy report PDF: A Just Energy Transition for Africa',
    caption: 'Policy analysis on decentralizing renewable power across the African continent',
    description: 'Key research document outlining structural strategies to ensure renewable energy development benefits grassroots populations.',
    folder: 'documents',
    tags: 'document, pdf, renewable energy, policy report',
    uploadedBy: 'System Migration',
  },
  {
    id: 22,
    publicId: 'aerc_media/doc_fossil_financing',
    title: 'Locked Out of A Just Transition - Fossil Financing Report (PDF)',
    filename: 'Locked-Out-of-A-Just-Transition-Fossil-Fuel-Financing.pdf',
    url: '/documents/Locked-Out-of-A-Just-Transition-Fossil-Fuel-Financing.pdf',
    thumbnailUrl: '/images/projects/ticking.jpg',
    category: 'Publication Covers',
    fileType: 'application/pdf',
    fileSize: '7.0 MB',
    bytes: 7048621,
    width: null,
    height: null,
    altText: 'Fossil Fuel Financing Research Report PDF',
    caption: 'In-depth investigation of public finance flows and export credit agencies in African energy projects',
    description: 'Groundbreaking investigation tracking billions in export credit agency subsidies directed to oil and gas exploration in Africa.',
    folder: 'documents',
    tags: 'document, pdf, climate finance, fossil fuel, ECA',
    uploadedBy: 'System Migration',
  },

  // 5. Homepage Banners
  {
    id: 23,
    publicId: 'aerc_media/banner_hero_bg',
    title: 'Homepage Main Hero Banner',
    filename: 'hero-bg.jpg',
    url: '/images/hero-bg.jpg',
    thumbnailUrl: '/images/hero-bg.jpg',
    category: 'Homepage Banners',
    fileType: 'image/jpeg',
    fileSize: '1.1 MB',
    bytes: 1107509,
    width: 1920,
    height: 1080,
    altText: 'Panoramic aerial landscape of Ghanaian rural forest and community farm',
    caption: 'The vibrant natural heritage AERC Ghana works tirelessly to preserve and protect',
    description: 'Full-width cinematic hero background image utilized on the website homepage and main landing sections.',
    folder: 'banners',
    tags: 'banners, homepage, hero, background',
    uploadedBy: 'System Migration',
  },
  {
    id: 24,
    publicId: 'aerc_media/banner_slider_1',
    title: 'Homepage Slider 1 - Grassroots Restoration',
    filename: 'slider-1.jpg',
    url: '/images/slider-1.jpg',
    thumbnailUrl: '/images/slider-1.jpg',
    category: 'Homepage Banners',
    fileType: 'image/jpeg',
    fileSize: '474 KB',
    bytes: 474857,
    width: 1920,
    height: 800,
    altText: 'Volunteers and community youth planting native seedlings along degraded riverbanks',
    caption: 'Restoring degraded watersheds and planting climate-resilient agroforestry canopies',
    description: 'First feature slide in the homepage carousel showcasing direct community ecological stewardship.',
    folder: 'banners',
    tags: 'banners, slider, reforestation, homepage',
    uploadedBy: 'System Migration',
  },
  {
    id: 25,
    publicId: 'aerc_media/banner_slider_2',
    title: 'Homepage Slider 2 - Clean Energy Transition',
    filename: 'slider-2.jpg',
    url: '/images/slider-2.jpg',
    thumbnailUrl: '/images/slider-2.jpg',
    category: 'Homepage Banners',
    fileType: 'image/jpeg',
    fileSize: '1.0 MB',
    bytes: 1042667,
    width: 1920,
    height: 800,
    altText: 'High-efficiency community solar panels against sunset horizon',
    caption: 'Advancing affordable, decentralized solar power for rural Ghanaian communities',
    description: 'Second carousel banner highlighting AERC Ghana’s commitment to an equitable renewable energy revolution.',
    folder: 'banners',
    tags: 'banners, slider, solar, clean energy',
    uploadedBy: 'System Migration',
  },
  {
    id: 26,
    publicId: 'aerc_media/banner_slider_3',
    title: 'Homepage Slider 3 - Youth Climate Advocacy',
    filename: 'slider-3.jpg',
    url: '/images/slider-3.jpg',
    thumbnailUrl: '/images/slider-3.jpg',
    category: 'Homepage Banners',
    fileType: 'image/jpeg',
    fileSize: '314 KB',
    bytes: 314636,
    width: 1920,
    height: 800,
    altText: 'Enthusiastic young climate leaders holding advocacy banners at national youth summit',
    caption: 'Amplifying African youth voices to shape climate policy and defend environmental human rights',
    description: 'Third carousel slide illustrating youth civic engagement and climate policy advocacy.',
    folder: 'banners',
    tags: 'banners, slider, youth, climate justice',
    uploadedBy: 'System Migration',
  },
  {
    id: 27,
    publicId: 'aerc_media/banner_footer_bg',
    title: 'Website Global Footer Background',
    filename: 'footer-bg.jpg',
    url: '/images/footer-bg.jpg',
    thumbnailUrl: '/images/footer-bg.jpg',
    category: 'Homepage Banners',
    fileType: 'image/jpeg',
    fileSize: '797 KB',
    bytes: 797374,
    width: 1920,
    height: 600,
    altText: 'Dark emerald lush tropical foliage pattern for footer background',
    caption: 'Lush tropical foliage texture giving depth to the global site footer',
    description: 'Atmospheric foliage background banner applied across the global website footer section.',
    folder: 'banners',
    tags: 'banners, footer, texture, styling',
    uploadedBy: 'System Migration',
  },

  // 6. Logos and Branding
  {
    id: 28,
    publicId: 'aerc_media/logo_header',
    title: 'AERC Ghana Header Logo',
    filename: 'logo-header.png',
    url: '/images/logo-header.png',
    thumbnailUrl: '/images/logo-header.png',
    category: 'Logos and Branding',
    fileType: 'image/png',
    fileSize: '2.3 KB',
    bytes: 2296,
    width: 240,
    height: 60,
    altText: 'AERC Ghana Official Logo for Website Header',
    caption: 'AERC Ghana primary brand mark',
    description: 'Transparent PNG header logo optimized for crisp presentation in the global navigation bar.',
    folder: 'branding',
    tags: 'branding, logo, header, transparent, png',
    uploadedBy: 'System Migration',
  },
  {
    id: 29,
    publicId: 'aerc_media/logo_footer',
    title: 'AERC Ghana Footer Logo',
    filename: 'logo-footer.png',
    url: '/images/logo-footer.png',
    thumbnailUrl: '/images/logo-footer.png',
    category: 'Logos and Branding',
    fileType: 'image/png',
    fileSize: '24 KB',
    bytes: 24138,
    width: 240,
    height: 60,
    altText: 'AERC Ghana Whiteout Logo for Dark Footer',
    caption: 'Inverted whiteout logo designed for dark backgrounds',
    description: 'Clean white vector silhouette logo tailored for dark background presentation in the footer.',
    folder: 'branding',
    tags: 'branding, logo, footer, white, png',
    uploadedBy: 'System Migration',
  },
  {
    id: 30,
    publicId: 'aerc_media/logo_sidebar',
    title: 'AERC Portal Emblem Icon',
    filename: 'logo-sidebar.png',
    url: '/images/logo-sidebar.png',
    thumbnailUrl: '/images/logo-sidebar.png',
    category: 'Logos and Branding',
    fileType: 'image/png',
    fileSize: '88 KB',
    bytes: 88110,
    width: 300,
    height: 300,
    altText: 'AERC Ghana circular management console badge',
    caption: 'Square emblem for admin dashboard and social profile icons',
    description: 'Square branding mark with rounded corners for use on portal headers, app favicons, and social avatar marks.',
    folder: 'branding',
    tags: 'branding, logo, avatar, emblem, admin',
    uploadedBy: 'System Migration',
  },
  {
    id: 31,
    publicId: 'aerc_media/logo_crest',
    title: 'AERC Ghana Official Brand Seal & Crest',
    filename: 'logo.jpg',
    url: '/images/logo.jpg',
    thumbnailUrl: '/images/logo.jpg',
    category: 'Logos and Branding',
    fileType: 'image/jpeg',
    fileSize: '740 KB',
    bytes: 740548,
    width: 800,
    height: 800,
    altText: 'AERC Ghana High-Resolution Corporate Seal',
    caption: 'High-resolution official seal and emblem of AERC Ghana',
    description: 'Master high-resolution corporate logo graphic used for letterheads, formal certs, and press kits.',
    folder: 'branding',
    tags: 'branding, logo, seal, master',
    uploadedBy: 'System Migration',
  },

  // 7. General Website Images
  {
    id: 32,
    publicId: 'aerc_media/img_bettering_tomorrow',
    title: 'Bettering Tomorrow - Organic Farm Field',
    filename: 'bettering-tomorrow.jpg',
    url: '/images/bettering-tomorrow.jpg',
    thumbnailUrl: '/images/bettering-tomorrow.jpg',
    category: 'General Website Images',
    fileType: 'image/jpeg',
    fileSize: '78 KB',
    bytes: 78084,
    width: 1000,
    height: 667,
    altText: 'Flourishing sustainable farm beds under the Bettering Tomorrow initiative',
    caption: 'Sustainable farming strategies revitalizing local agricultural soils',
    description: 'Featured photography representing the vision of self-reliant, sustainable ecological agriculture in Ghana.',
    folder: 'general',
    tags: 'agriculture, vision, food security, farming',
    uploadedBy: 'System Migration',
  },
  {
    id: 33,
    publicId: 'aerc_media/img_who_we_are',
    title: 'Who We Are - AERC Founding Team',
    filename: 'who-we-are.jpg',
    url: '/images/about/who-we-are.jpg',
    thumbnailUrl: '/images/about/who-we-are.jpg',
    category: 'General Website Images',
    fileType: 'image/jpeg',
    fileSize: '226 KB',
    bytes: 226578,
    width: 1200,
    height: 800,
    altText: 'AERC Ghana founding members and staff standing together outdoors',
    caption: 'The passionate researchers, activists, and leaders powering AERC Ghana',
    description: 'Group photograph of AERC Ghana core staff and community organizers featured on the About Us page.',
    folder: 'general',
    tags: 'about, team, organization, mission',
    uploadedBy: 'System Migration',
  },
  {
    id: 34,
    publicId: 'aerc_media/img_focus_areas_graphic',
    title: 'Strategic Pillars & Focus Areas Graphic',
    filename: 'focus-areas-real.png',
    url: '/images/focus-areas-real.png',
    thumbnailUrl: '/images/focus-areas-real.png',
    category: 'General Website Images',
    fileType: 'image/png',
    fileSize: '1.2 MB',
    bytes: 1230450,
    width: 1200,
    height: 800,
    altText: 'Infographic depicting Environment & Climate alongside Just Energy Transition pillars',
    caption: 'Strategic framework illustrating AERC Ghana’s two operational pillars',
    description: 'High-impact visual diagram illustrating our dual thematic pillars and interrelated intervention areas.',
    folder: 'general',
    tags: 'pillars, strategy, infographic, focus areas',
    uploadedBy: 'System Migration',
  },
  {
    id: 35,
    publicId: 'aerc_media/img_how_we_work',
    title: 'How We Work In Communities',
    filename: 'how-we-work-real.jpg',
    url: '/images/how-we-work-real.jpg',
    thumbnailUrl: '/images/how-we-work-real.jpg',
    category: 'General Website Images',
    fileType: 'image/jpeg',
    fileSize: '78 KB',
    bytes: 78084,
    width: 1000,
    height: 667,
    altText: 'AERC team member dialoguing with local village elders and farmers',
    caption: 'Participatory community-driven methodologies at the heart of our interventions',
    description: 'Field photo showing community consultation and collaborative planning with local stakeholders.',
    folder: 'general',
    tags: 'methodology, field, community, grassroots',
    uploadedBy: 'System Migration',
  },
  {
    id: 36,
    publicId: 'aerc_media/img_waste_pickers',
    title: 'Informal Waste Pickers & Recyclers',
    filename: 'blog-waste-pickers.png',
    url: '/images/blog-waste-pickers.png',
    thumbnailUrl: '/images/blog-waste-pickers.png',
    category: 'General Website Images',
    fileType: 'image/png',
    fileSize: '773 KB',
    bytes: 773500,
    width: 1200,
    height: 800,
    altText: 'Waste pickers sorting plastics for circular recycling enterprise',
    caption: 'Supporting informal waste pickers with dignity, protective gear, and fair recycling prices',
    description: 'Feature photo illustrating our grassroots circular economy partnerships and plastic waste management initiatives.',
    folder: 'general',
    tags: 'plastics, waste management, circular economy, workers',
    uploadedBy: 'System Migration',
  },
  {
    id: 37,
    publicId: 'aerc_media/img_sdg_synergies',
    title: 'Synergies Between SDG 7 and SDG 9',
    filename: 'blog-sdg7-sdg9.png',
    url: '/images/blog-sdg7-sdg9.png',
    thumbnailUrl: '/images/blog-sdg7-sdg9.png',
    category: 'General Website Images',
    fileType: 'image/png',
    fileSize: '1.1 MB',
    bytes: 1143994,
    width: 1200,
    height: 800,
    altText: 'Diagram of SDG 7 Affordable Clean Energy and SDG 9 Industry & Infrastructure synergy',
    caption: 'Examining the vital link between clean power and sustainable industrial innovation in Africa',
    description: 'Analytical visual illustrating how clean renewable power directly unlocks sustainable manufacturing and infrastructure.',
    folder: 'general',
    tags: 'sdgs, clean energy, infrastructure, policy',
    uploadedBy: 'System Migration',
  },
];


