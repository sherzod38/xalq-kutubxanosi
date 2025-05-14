/** @type {import('next').NextConfig} */
const nextConfig = {
    headers: async () => {
      return [
        {
          source: '/:path*',
          headers: [
            {
              key: 'Content-Security-Policy',
              value: [
                "default-src 'self'",
                "script-src 'self' 'unsafe-inline' 'wasm-unsafe-eval' 'inline-speculation-rules'",
                "style-src 'self' 'unsafe-inline'",
                "img-src 'self' data:",
                "connect-src 'self' https://*.supabase.co",
                "font-src 'self'",
                "object-src 'none'",
                "base-uri 'self'",
                "form-action 'self'",
                "frame-ancestors 'none'",
                "block-all-mixed-content",
                "upgrade-insecure-requests",
              ].join('; '),
            },
          ],
        },
      ];
    },
  };
  
  module.exports = nextConfig;