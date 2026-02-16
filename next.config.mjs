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
      // מונע קריסה על ספריות ליבה של Node.js בדפדפן
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
      };
    }

    // טיפול ספציפי בשגיאת UnhandledSchemeError (node:events וכו')
    config.module.rules.push({
      test: /node:/,
      use: 'null-loader',
    });

    return config;
  },
};

export default nextConfig;
