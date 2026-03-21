This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

Create your local environment file before starting the app:

```bash
cp .env.example .env.local
```

Set at least `AUTH_SECRET` in `.env.local`.
You can generate one with:

```bash
openssl rand -base64 32
```

For OAuth providers (Google/GitHub), also set `AUTH_URL` to your app origin:

```bash
# local
AUTH_URL="http://localhost:3000"

# production example
AUTH_URL="https://pseudocode-compiler.sherlemious.com"
```

### Google OAuth redirect URI setup

If you see `redirect_uri_mismatch`, add the exact callback URL in Google Cloud Console:

- `https://pseudocode-compiler.sherlemious.com/api/auth/callback/google`

You should usually also add local development:

- `http://localhost:3000/api/auth/callback/google`

And ensure Authorized JavaScript origins include:

- `https://pseudocode-compiler.sherlemious.com`
- `http://localhost:3000`

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
