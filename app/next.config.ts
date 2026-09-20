import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Keep the OpenTelemetry logs SDK out of the server bundle — it relies on
  // Node built-ins and misbehaves when webpack-bundled. Loaded via the
  // instrumentation hook (see src/instrumentation.node.ts).
  serverExternalPackages: [
    '@opentelemetry/sdk-logs',
    '@opentelemetry/exporter-logs-otlp-http',
    '@opentelemetry/api-logs',
    '@opentelemetry/resources',
  ],
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'www.pseudocode-compiler.sherlemious.com' }],
        destination: 'https://pseudocode-compiler.sherlemious.com/:path*',
        permanent: true,
      },
      {
        source: '/cambridge-o-level-pseudocode',
        destination: '/tutorial',
        permanent: true,
      },
      {
        source: '/o-level-pseudocode-tutorial',
        destination: '/tutorial',
        permanent: true,
      },
      {
        source: '/igcse-pseudocode-tutorial',
        destination: '/tutorial',
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/fonts/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
  // Client router cache: reuse static RSC payloads (practice/learn/docs) for a
  // few minutes, and keep dynamic pages warm for 30s of back/forward navigation
  // so filter-adjacent clicks don't each become a Vercel invocation.
  experimental: {
    staleTimes: {
      dynamic: 30,
      static: 180,
    },
  },
};

export default nextConfig;
