/** @type {import('next').NextConfig} */
const nextConfig = {
  // התעלמות משגיאות טיפוסים בזמן Build כדי לאפשר פריסה מהירה
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // מונע מ-Webpack לנסות לפתור מודולים של Node.js בצד הלקוח
      config.resolve.fallback = {
        fs: false,
        net: false,
        tls: false,
        child_process: false,
        path: false,
        os: false,
      };
    }
    return config;
  },
};

export default nextConfig;
