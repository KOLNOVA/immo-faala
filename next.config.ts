import type { NextConfig } from "next";

const securityHeaders = [
  {
    key: "x-frame-options",
    value: "DENY",
  },
  {
    key: "content-security-policy",
    value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: https://res.cloudinary.com https://images.unsplash.com; font-src 'self'; connect-src 'self' https://yjwgntgfmsezietqkozf.supabase.co https://api.fedapay.com https://api.resend.com; frame-ancestors 'none'; base-uri 'self'; form-action 'self';",
  },
  {
    key: "referrer-policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    key: "permissions-policy",
    value: "camera=(), microphone=(), geolocation=(self), payment=(self)",
  },
  {
    key: "strict-transport-security",
    value: "max-age=31536000; includeSubDomains; preload",
  },
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
