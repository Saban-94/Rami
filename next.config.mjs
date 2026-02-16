/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // חומת מגן עבור מודולים של Node.js בדפדפן
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

      // טיפול ספציפי בשגיאת UnhandledSchemeError עבור סכימת node:
      config.module.rules.push({
        test: /node:/,
        use: 'null-loader',
      });
    }

    return config;
  },
};

export default nextConfig;
