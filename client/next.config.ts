import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      new URL('https://pact-app-user-avatars.s3.us-east-2.amazonaws.com/**'),
    ],
  },
};

export default nextConfig;
