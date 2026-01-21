import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  distDir: 'out',
  
  // Image optimization for static export
  images: {
    unoptimized: true,
    formats: ['image/webp', 'image/avif'],
  },
  
  // Enable React Compiler for better performance
  reactCompiler: true,
  
  // Compression and optimization
  compress: true,
  
  // Performance optimizations
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['lucide-react', 'recharts'],
  },
  
  // Turbopack configuration (empty to silence warning)
  turbopack: {},
  
  // Build optimization - removed webpack config for Turbopack compatibility
  // Bundle analyzer can be added via environment variable
};

export default nextConfig;
