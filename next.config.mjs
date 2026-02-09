/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // !! אזהרה: זה מאפשר ל-Build לעבור גם אם יש שגיאות טייפ
    ignoreBuildErrors: true,
  },
  eslint: {
    // התעלמות משגיאות לינקינג בזמן בנייה
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
