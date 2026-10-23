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
      {
        source: '/blog-grid-2',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/blog-2',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/blog-grid',
        destination: '/blog',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
