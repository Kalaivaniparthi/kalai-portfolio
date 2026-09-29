/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  transpilePackages: ['three'],
  experimental: {
    // Tree-shake icon + animation libraries so only what we use ships
    optimizePackageImports: ['lucide-react', 'framer-motion', '@react-three/drei'],
  },
};

module.exports = nextConfig;
