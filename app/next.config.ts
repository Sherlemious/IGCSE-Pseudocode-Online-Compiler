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
};

export default nextConfig;
