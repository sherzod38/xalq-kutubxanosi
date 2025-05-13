
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  headers: async () => [
    {
      source: "/:path*",
      headers: [
        {
          key: "Content-Security-Policy",
          value:
            "script-src 'self' 'wasm-unsafe-eval' 'inline-speculation-rules' 'sha256-kPx0AsF0oz2kKiZ875xSvv693TBHkQ/0SkMJZnnNpnQ=';",
        },
      ],
    },
  ],
};

export default nextConfig;