/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        child_process: false,
        http2: false,
        dns: false,
        os: false,
        path: false,
        stream: false,
        crypto: false,
        "node:events": false,
        "node:process": false,
        "node:util": false,
        "node:buffer": false,
        "node:stream": false,
      };
    }
    return config;
  },
};

export default nextConfig;
