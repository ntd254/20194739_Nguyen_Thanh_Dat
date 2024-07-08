/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { hostname: 'upload.wikimedia.org' },
      { hostname: 'lh3.googleusercontent.com' },
      { hostname: 'cloudfront.ntdat254.id.vn' },
      { hostname: 'cdn.iconscout.com' },
    ],
  },
  rewrites: async () => [{ source: '/', destination: '/courses' }],
};

module.exports = nextConfig;
