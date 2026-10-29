import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    output: 'export',
    trailingSlash: true,
    pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'mdx'],
    images: { unoptimized: true }
};

export default nextConfig;
