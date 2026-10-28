/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  serverExternalPackages: ['@neondatabase/serverless', 'drizzle-orm'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'aercghana.org',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  async redirects() {
    return [
      { source: '/blog-grid-2', destination: '/blog', permanent: true },
      { source: '/blog-2', destination: '/blog', permanent: true },
      { source: '/blog-grid', destination: '/blog', permanent: true },
      { source: '/blog-03', destination: '/blog', permanent: true },
      { source: '/blog-03-2', destination: '/blog', permanent: true },
      { source: '/about-us', destination: '/about', permanent: true },
      { source: '/about-us-1', destination: '/festival', permanent: true },
      { source: '/contact-us-3', destination: '/contact', permanent: true },
      { source: '/contact-us', destination: '/contact', permanent: true },
      { source: '/become-a-volunteer', destination: '/volunteer', permanent: true },
      { source: '/become-a-volunteer-2', destination: '/volunteer', permanent: true },
      { source: '/become-a-partner', destination: '/partner', permanent: true },
      { source: '/green-life-clubs', destination: '/projects/green-life-clubs', permanent: true },
      { source: '/sdg-watch-ghana', destination: '/projects/sdg-watch-ghana', permanent: true },
      { source: '/youth4ndcs', destination: '/projects/youth4ndcs', permanent: true },
      { source: '/fossil-finance-campaign', destination: '/projects/fossil-fuel-finance-accountability', permanent: true },
      { source: '/climate-friendly-cooking', destination: '/projects/clean-cooking-solutions', permanent: true },
      { source: '/kuvuna-one-world-garden', destination: '/projects/kuvuna-project', permanent: true },
      { source: '/just-energy-transition', destination: '/projects/just-energy-transition', permanent: true },
      { source: '/donation', destination: '/donate', permanent: true },
      { source: '/donation-2', destination: '/donate', permanent: true },
      { source: '/donation-02', destination: '/donate', permanent: true },
      { source: '/donation-02-2', destination: '/donate', permanent: true },
      { source: '/donor-dashboard-2', destination: '/donate', permanent: true },
      { source: '/donor-dashboard-2-2', destination: '/donate', permanent: true },
      { source: '/team-4', destination: '/team', permanent: true },
      { source: '/team-3', destination: '/team', permanent: true },
      { source: '/team-2', destination: '/team', permanent: true },
      { source: '/team-02', destination: '/team', permanent: true },
      { source: '/faq-2', destination: '/faq', permanent: true },
    ];
  },
};

export default nextConfig;
