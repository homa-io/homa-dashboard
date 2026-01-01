import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    // WARNING: This masks ESLint errors during build.
    // TODO: Fix all ESLint errors (mainly @typescript-eslint/no-explicit-any and
    // react/no-unescaped-entities) then remove this flag.
    // Run `npm run lint` to see the full list of issues.
    ignoreDuringBuilds: true,
  },
  typescript: {
    // WARNING: This masks TypeScript errors during build.
    // TODO: Fix all TypeScript errors then remove this flag.
    // Run `npx tsc --noEmit` to see type issues.
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
