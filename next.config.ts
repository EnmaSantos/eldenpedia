import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.dicebear.com',
      },
      {
        protocol: 'https',
        hostname: 'eldenring.fanapis.com',
      },
      {
        protocol: 'https',
        hostname: '**.supabase.co', // Allow all Supabase projects
      },
    ],
  },
};

export default nextConfig;
