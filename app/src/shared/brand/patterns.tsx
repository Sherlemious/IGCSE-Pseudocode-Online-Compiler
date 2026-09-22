import { useId } from 'react';
import { BRAND } from './brand';

function svgId(reactId: string) {
  return `brand-${reactId.replace(/[^a-zA-Z0-9_-]/g, '')}`;
}

/** Dotted exam-paper answer lines. Marketing surfaces only — never the editor. */
export function AnswerLines({ className }: { className?: string }) {
  const id = svgId(useId());
  return (
    <svg className={className} aria-hidden="true" preserveAspectRatio="none">
      <defs>
        <pattern id={id} width="48" height="28" patternUnits="userSpaceOnUse">
          <path
            d="M0 27.5 H48"
            stroke={BRAND.colors.rule}
            strokeWidth="1"
            strokeDasharray="1.25 5.5"
            strokeOpacity="0.55"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
}

/** Fine paper grain. Marketing surfaces only — never the editor. */
export function PaperGrain({ className }: { className?: string }) {
  const id = svgId(useId());
  return (
    <svg className={className} aria-hidden="true" preserveAspectRatio="none">
      <filter id={id}>
        <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="4" stitchTiles="stitch" />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width="100%" height="100%" filter={`url(#${id})`} opacity="0.22" />
    </svg>
  );
}

/** Cambridge-style vertical margin rule on the left of a paper panel. */
export function MarginRule({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={['block w-px bg-brand-red/80', className].filter(Boolean).join(' ')}
    />
  );
}
