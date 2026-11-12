/**
 * Partner (referral) placements. Outbound links go through
 * `/api/out/<partner>?s=<surface>` so every referral is counted server-side
 * (ad blockers drop the client event) before redirecting. Only partners and
 * surfaces listed here are accepted, so the route is not an open redirect.
 */
export const PARTNERS = {
  learningmate: {
    name: 'The Learning Mate',
    url: 'https://thelearningmate.com/trial?utm_source=pseudocode-compiler&utm_medium=referral&utm_campaign=hack-community',
  },
} as const;

export type PartnerId = keyof typeof PARTNERS;

/** `popup`: the one-time corner card a teacher gets after signing in (OnboardingNudges). */
export const PARTNER_SURFACES = ['classes', 'mark_book', 'popup'] as const;
export type PartnerSurface = (typeof PARTNER_SURFACES)[number];

export function isPartner(id: string): id is PartnerId {
  return Object.prototype.hasOwnProperty.call(PARTNERS, id);
}

export function isPartnerSurface(s: string | null): s is PartnerSurface {
  return s !== null && (PARTNER_SURFACES as readonly string[]).includes(s);
}

/** The partner URL with `utm_content=<surface>`, so their analytics can split placements too. */
export function partnerDestination(id: PartnerId, surface: PartnerSurface | null): string {
  const url = new URL(PARTNERS[id].url);
  if (surface) url.searchParams.set('utm_content', surface);
  return url.toString();
}

/** Our own tracked hop. */
export function partnerOutHref(id: PartnerId, surface: PartnerSurface): string {
  return `/api/out/${id}?s=${surface}`;
}
