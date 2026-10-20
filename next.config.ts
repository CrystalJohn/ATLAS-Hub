import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  distDir: process.env.ATLAS_PROFILE_PREVIEW === '1' ? '.sites-runtime/profile-next' : '.next',
  /* config options here */
};

export default nextConfig;
