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
  // Vercel stores every retained deployment's function bundle and bills the
  // total ("deployment function storage"), so keep files the server never
  // loads out of the trace. Prisma uses the native library engine
  // (runtime/library.js + the .so.node engine); the ~55 MB of per-database
  // wasm runtimes are for edge/driver-adapter clients. Vercel serves
  // /_next/image itself, so sharp is dead weight in the functions too.
  outputFileTracingExcludes: {
    '*': [
      'node_modules/@prisma/client/runtime/*.wasm-base64.*',
      'node_modules/@prisma/client/runtime/query_compiler_bg.*',
      'node_modules/@prisma/client/runtime/query_engine_bg.*',
      'node_modules/@prisma/client/runtime/wasm-*',
      'node_modules/@prisma/client/runtime/edge*',
      'node_modules/@prisma/client/runtime/react-native*',
      'node_modules/@prisma/client/runtime/binary.*',
      'node_modules/@prisma/client/runtime/index-browser*',
      'node_modules/.prisma/client/*.wasm',
      'node_modules/.prisma/client/wasm*',
      'node_modules/.prisma/client/edge*',
      'node_modules/.prisma/client/index-browser*',
      'node_modules/.prisma/client/*.tmp*',
      'node_modules/@prisma/engines/**',
      'node_modules/prisma/**',
      'node_modules/sharp/**',
      'node_modules/@img/**',
    ],
  },
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
