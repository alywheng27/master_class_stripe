/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "previews.123rf.com",
      }
    ]
  }
};

export default nextConfig;
