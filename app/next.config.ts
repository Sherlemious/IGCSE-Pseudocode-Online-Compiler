import type { NextConfig } from "next";

// Set by open-next.config.ts when `opennextjs-cloudflare build` runs `next build`.
const cloudflare = process.env.CLOUDFLARE_BUILD === '1';

const nextConfig: NextConfig = {
  // Cloudflare has no /_next/image optimizer without a paid Images binding.
  images: cloudflare ? { unoptimized: true } : undefined,
  // Inlined at build so Cloudflare-only branches are decided per deployment.
  env: cloudflare ? { CLOUDFLARE_BUILD: '1', CLOUDFLARE_BUILD_STAMP: String(Date.now()) } : {},
  // Keep the OpenTelemetry SDK out of the server bundle — it relies on Node
  // built-ins and misbehaves when webpack-bundled. `@opentelemetry/api` has to
  // stay a single copy so Next.js request spans and Prisma spans share the
  // provider registered in src/instrumentation.node.ts.
  serverExternalPackages: [
    '@opentelemetry/api',
    '@opentelemetry/api-logs',
    '@opentelemetry/sdk-logs',
    '@opentelemetry/exporter-logs-otlp-http',
    '@opentelemetry/sdk-trace-node',
    '@opentelemetry/sdk-trace-base',
    '@opentelemetry/sdk-trace',
    '@opentelemetry/exporter-trace-otlp-proto',
    '@opentelemetry/resources',
    '@opentelemetry/semantic-conventions',
    '@opentelemetry/core',
    '@opentelemetry/otlp-exporter-base',
    '@opentelemetry/otlp-transformer',
    // OpenNext patches the generated client for workerd only when it stays external.
    '@prisma/client',
    '.prisma/client',
  ],
  // Vercel stores every retained deployment's function bundle and bills the
  // total ("deployment function storage"), so keep files the server never
  // loads out of the trace. Prisma uses the native library engine
  // (runtime/library.js + the .so.node engine); the ~55 MB of per-database
  // wasm runtimes are for edge/driver-adapter clients. Vercel serves
  // /_next/image itself, so sharp is dead weight in the functions too.
  // Cloudflare builds keep the wasm runtimes: workerd loads Prisma's wasm engine.
  // Tracing follows pg-cloudflare's node export (an empty file); workerd needs the real socket.
  outputFileTracingIncludes: cloudflare ? { '*': ['node_modules/pg-cloudflare/**'] } : undefined,
  outputFileTracingExcludes: {
    '*': [
      ...(cloudflare ? [] : [
        'node_modules/@prisma/client/runtime/*.wasm-base64.*',
        'node_modules/@prisma/client/runtime/query_compiler_bg.*',
        'node_modules/@prisma/client/runtime/query_engine_bg.*',
        'node_modules/@prisma/client/runtime/wasm-*',
        'node_modules/@prisma/client/runtime/edge*',
        'node_modules/.prisma/client/*.wasm',
        'node_modules/.prisma/client/wasm*',
        'node_modules/.prisma/client/edge*',
      ]),
      'node_modules/@prisma/client/runtime/react-native*',
      'node_modules/@prisma/client/runtime/binary.*',
      'node_modules/@prisma/client/runtime/index-browser*',
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
  // Content negotiation: `Accept: text/markdown` gets a markdown rendering of the
  // page (src/app/api/markdown/[[...path]]/route.ts); browsers keep getting HTML.
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: '/:path*',
          has: [{ type: 'header', key: 'accept', value: '(.*)text/markdown(.*)' }],
          destination: '/api/markdown/:path*',
        },
      ],
    };
  },
  async headers() {
    return [
      {
        // Agent discovery (RFC 8288) on the homepage.
        source: "/",
        headers: [
          {
            key: "Link",
            value: '</llms.txt>; rel="describedby"; type="text/plain", </llms-full.txt>; rel="describedby"; type="text/plain", </docs>; rel="service-doc", </sitemap.xml>; rel="sitemap"',
          },
        ],
      },
      {
        // Baseline hardening. No X-Frame-Options / frame-ancestors on purpose:
        // teachers may embed pages in an LMS iframe.
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          // Browsers remember to use https after the first visit (the worker redirects http).
          { key: "Strict-Transport-Security", value: "max-age=31536000" },
          { key: "Vary", value: "Accept" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
          },
        ],
      },
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
