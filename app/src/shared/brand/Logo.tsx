import { BRAND } from './brand';
import { markBody } from './mark';

type LogoMarkProps = {
  className?: string;
  size?: number;
  /** Play the one-time entrance. Hover motion works either way inside a `group/logo`. */
  animate?: boolean;
};

/** `currentColor` paints the braces and eyes; the beak stays examiner red. */
export function LogoMark({ className, size = 22, animate = false }: LogoMarkProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      width={size}
      height={size}
      className={['logo-mark overflow-visible', animate ? 'logo-anim' : '', className].filter(Boolean).join(' ')}
      aria-hidden="true"
      fill="none"
      dangerouslySetInnerHTML={{ __html: markBody('currentColor') }}
    />
  );
}

export function LogoWordmark({ className }: { className?: string }) {
  const [lead, rest] = splitShortName();
  return (
    <span className={['flex items-baseline gap-1.5 min-w-0', className].filter(Boolean).join(' ')}>
      <span className="font-display italic font-semibold tracking-tight text-[0.95em] leading-none truncate">
        {lead}
      </span>
      <span className="font-mono text-[0.58em] font-medium uppercase tracking-[0.16em] text-current/50 leading-none shrink-0">
        {rest}
      </span>
    </span>
  );
}

type LogoBadgeProps = {
  className?: string;
  /** Outer badge size in px. The owl fills most of the ink tile. */
  size?: number;
  animate?: boolean;
};

/** Favicon-style tile: cream owl on ink. Use this when the mark sits alone (auth, welcome). */
export function LogoBadge({ className, size = 64, animate = false }: LogoBadgeProps) {
  const mark = Math.round(size * 0.78);
  return (
    <span
      className={['group/logo inline-flex items-center justify-center rounded-[18px] bg-brand-ink text-brand-paper shrink-0', className].filter(Boolean).join(' ')}
      style={{ width: size, height: size }}
    >
      <LogoMark size={mark} animate={animate} />
    </span>
  );
}

type LogoProps = {
  className?: string;
  markSize?: number;
  animate?: boolean;
};

export function Logo({ className, markSize = 22, animate = false }: LogoProps) {
  return (
    <span className={['inline-flex items-center gap-2 min-w-0', className].filter(Boolean).join(' ')}>
      <LogoMark size={markSize} animate={animate} className="shrink-0" />
      <LogoWordmark />
    </span>
  );
}

function splitShortName(): [string, string] {
  const [lead, ...rest] = BRAND.shortName.split(' ');
  return [lead, rest.join(' ')];
}
