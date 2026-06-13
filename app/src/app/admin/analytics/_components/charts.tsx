import { TrendingUp, TrendingDown } from 'lucide-react';

// Deterministic id from a string — stable across renders, and identical
// inputs harmlessly share an identical gradient definition.
function hashId(s: string): string {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return 'g' + (h >>> 0).toString(36);
}

// ── Section heading ──────────────────────────────────────────

export function SectionHeading({
  eyebrow,
  title,
  meta,
}: {
  eyebrow: string;
  title: string;
  meta?: React.ReactNode;
}) {
  return (
    <div className="flex items-end justify-between gap-4 mb-3">
      <div>
        <p className="mono-label text-primary/70">{eyebrow}</p>
        <h2 className="text-sm font-semibold text-light-text mt-0.5">{title}</h2>
      </div>
      {meta && <div className="text-[11px] text-dark-text shrink-0">{meta}</div>}
    </div>
  );
}

// ── Panel ────────────────────────────────────────────────────

export function Panel({
  children,
  className = '',
  pad = true,
}: {
  children: React.ReactNode;
  className?: string;
  pad?: boolean;
}) {
  return (
    <div className={`card-glow rounded-2xl bg-surface ${pad ? 'p-5' : ''} ${className}`}>
      {children}
    </div>
  );
}

// ── Delta chip ───────────────────────────────────────────────

export function DeltaChip({ pct }: { pct: number }) {
  const up = pct >= 0;
  return (
    <span
      className={`inline-flex items-center gap-0.5 text-[10px] font-semibold px-1.5 py-0.5 rounded-md ${
        up ? 'text-success bg-success/10' : 'text-error bg-error/10'
      }`}
    >
      {up ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
      {up ? '+' : ''}{pct}%
    </span>
  );
}

// ── Sparkline ────────────────────────────────────────────────

export function Sparkline({
  data,
  color = 'var(--color-primary)',
  width = 96,
  height = 28,
  fill = true,
}: {
  data: number[];
  color?: string;
  width?: number;
  height?: number;
  fill?: boolean;
}) {
  if (data.length < 2) return <div style={{ width, height }} />;
  const max = Math.max(...data, 1);
  const min = Math.min(...data, 0);
  const range = max - min || 1;
  const stepX = width / (data.length - 1);
  const pts = data.map((v, i) => {
    const x = i * stepX;
    const y = height - ((v - min) / range) * (height - 2) - 1;
    return [x, y] as const;
  });
  const line = pts.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`).join(' ');
  const area = `${line} L${width},${height} L0,${height} Z`;
  const gid = hashId(`${color}-${width}-${height}-${data.join(',')}`);

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="overflow-visible" preserveAspectRatio="none">
      {fill && (
        <>
          <defs>
            <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity="0.25" />
              <stop offset="100%" stopColor={color} stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d={area} fill={`url(#${gid})`} />
        </>
      )}
      <path d={line} fill="none" stroke={color} strokeWidth={1.5} strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

// ── Stat tile ────────────────────────────────────────────────

export function StatTile({
  label,
  value,
  sub,
  delta,
  spark,
  sparkColor,
}: {
  label: string;
  value: number | string;
  sub?: string;
  delta?: number;
  spark?: number[];
  sparkColor?: string;
}) {
  return (
    <div className="card-glow rounded-2xl bg-surface p-4 flex flex-col justify-between min-h-[124px]">
      <div className="flex items-start justify-between gap-2">
        <p className="mono-label text-dark-text">{label}</p>
        {typeof delta === 'number' && <DeltaChip pct={delta} />}
      </div>
      <div className="mt-2">
        <p className="font-mono tabular-nums tracking-tight text-3xl font-semibold text-light-text leading-none">
          {typeof value === 'number' ? value.toLocaleString() : value}
        </p>
        <div className="flex items-end justify-between gap-2 mt-1.5 h-8">
          <span className="text-[11px] text-dark-text leading-tight">{sub ?? ' '}</span>
          {spark && spark.length > 1 && (
            <Sparkline data={spark} color={sparkColor ?? 'var(--color-primary)'} width={84} height={28} />
          )}
        </div>
      </div>
    </div>
  );
}

// ── Area chart (dual series) ─────────────────────────────────

export function AreaChart({
  primary,
  secondary,
  labels,
}: {
  primary: number[];
  secondary?: number[];
  labels: string[];
}) {
  const W = 720;
  const H = 200;
  const padX = 8;
  const padY = 16;
  const innerW = W - padX * 2;
  const innerH = H - padY * 2;

  const all = secondary ? [...primary, ...secondary] : primary;
  const max = Math.max(...all, 1);

  const toPts = (data: number[]) =>
    data.map((v, i) => {
      const x = padX + (data.length === 1 ? innerW / 2 : (i / (data.length - 1)) * innerW);
      const y = padY + innerH - (v / max) * innerH;
      return [x, y] as const;
    });

  const pPts = toPts(primary);
  const pLine = pPts.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`).join(' ');
  const pArea = `${pLine} L${padX + innerW},${padY + innerH} L${padX},${padY + innerH} Z`;

  const sLine = secondary
    ? toPts(secondary).map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`).join(' ')
    : '';

  const gridLines = [0, 0.25, 0.5, 0.75, 1];

  return (
    <div>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" preserveAspectRatio="none">
        <defs>
          <linearGradient id="area-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.28" />
            <stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0" />
          </linearGradient>
        </defs>
        {gridLines.map((g) => {
          const y = padY + innerH * g;
          return (
            <line
              key={g}
              x1={padX}
              y1={y}
              x2={padX + innerW}
              y2={y}
              stroke="var(--color-border)"
              strokeWidth={1}
              strokeDasharray={g === 1 ? undefined : '2 4'}
              opacity={0.6}
            />
          );
        })}
        <path d={pArea} fill="url(#area-fill)" />
        {secondary && (
          <path d={sLine} fill="none" stroke="var(--color-success)" strokeWidth={1.5} strokeOpacity={0.7} strokeDasharray="3 3" strokeLinejoin="round" />
        )}
        <path d={pLine} fill="none" stroke="var(--color-primary)" strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
        {pPts.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={6} fill="transparent">
            <title>{`${labels[i]}: ${primary[i]}${secondary ? ` signups · ${secondary[i]} active` : ' signups'}`}</title>
          </circle>
        ))}
      </svg>
      <div className="flex justify-between mt-2 text-[9px] text-dark-text/60 font-mono px-1">
        <span>{labels[0]}</span>
        <span>{labels[Math.floor(labels.length / 2)]}</span>
        <span>{labels[labels.length - 1]}</span>
      </div>
    </div>
  );
}

// ── Ring chart ───────────────────────────────────────────────

export function RingChart({
  pct,
  label,
  centerValue,
  centerSub,
  color = 'var(--color-primary)',
  size = 120,
}: {
  pct: number; // 0..1
  label?: string;
  centerValue: string;
  centerSub?: string;
  color?: string;
  size?: number;
}) {
  const stroke = 9;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const clamped = Math.max(0, Math.min(1, pct));
  const offset = c * (1 - clamped);

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--color-border)" strokeWidth={stroke} opacity={0.5} />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke={color}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={c}
            strokeDashoffset={offset}
            style={{ animation: 'draw-progress 1s ease-out both' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-mono tabular-nums text-xl font-semibold text-light-text leading-none">{centerValue}</span>
          {centerSub && <span className="text-[10px] text-dark-text mt-1">{centerSub}</span>}
        </div>
      </div>
      {label && <p className="text-xs text-dark-text mt-2 text-center">{label}</p>}
    </div>
  );
}

// ── Bar row ──────────────────────────────────────────────────

export function BarRow({
  label,
  count,
  pct,
  color = 'bg-primary',
  labelColor = 'text-light-text',
}: {
  label: string;
  count: number | string;
  pct: number; // 0..100
  color?: string;
  labelColor?: string;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs">
        <span className={`font-medium ${labelColor}`}>{label}</span>
        <span className="text-dark-text font-mono tabular-nums">
          {typeof count === 'number' ? count.toLocaleString() : count}
          <span className="text-dark-text/50"> · {pct}%</span>
        </span>
      </div>
      <div className="h-2 w-full bg-border/40 rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full transition-all`} style={{ width: `${Math.max(pct, pct > 0 ? 2 : 0)}%` }} />
      </div>
    </div>
  );
}

// ── Segment bar ──────────────────────────────────────────────

export function SegmentBar({
  segments,
}: {
  segments: Array<{ label: string; value: number; color: string; text: string }>;
}) {
  const total = segments.reduce((s, x) => s + x.value, 0) || 1;
  return (
    <div className="space-y-3">
      <div className="flex h-3 w-full rounded-full overflow-hidden bg-border/40">
        {segments.map((s) => (
          <div
            key={s.label}
            className={s.color}
            style={{ width: `${(s.value / total) * 100}%` }}
            title={`${s.label}: ${s.value}`}
          />
        ))}
      </div>
      <div className="flex flex-wrap gap-x-4 gap-y-1.5">
        {segments.map((s) => (
          <div key={s.label} className="flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${s.color}`} />
            <span className="text-[11px] text-dark-text">{s.label}</span>
            <span className={`text-[11px] font-mono tabular-nums font-semibold ${s.text}`}>{s.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Ranked list ──────────────────────────────────────────────

export function RankedList({
  items,
  emptyText = 'No data yet',
}: {
  items: Array<{
    id: string;
    title: string;
    barPct: number; // 0..100
    chip: string;
    chipClass: string;
    barClass?: string;
  }>;
  emptyText?: string;
}) {
  if (items.length === 0) {
    return <p className="text-sm text-dark-text py-4">{emptyText}</p>;
  }
  return (
    <ol className="space-y-3">
      {items.map((it, i) => (
        <li key={it.id} className="flex items-center gap-3">
          <span className="font-mono tabular-nums text-xs text-dark-text/50 w-4 text-right shrink-0">{i + 1}</span>
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-2 mb-1">
              <span className="text-xs text-light-text truncate">{it.title}</span>
              <span className={`text-[10px] font-mono tabular-nums font-semibold px-1.5 py-0.5 rounded shrink-0 ${it.chipClass}`}>
                {it.chip}
              </span>
            </div>
            <div className="h-1.5 w-full bg-border/40 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${it.barClass ?? 'bg-primary/60'}`}
                style={{ width: `${Math.max(it.barPct, it.barPct > 0 ? 3 : 0)}%` }}
              />
            </div>
          </div>
        </li>
      ))}
    </ol>
  );
}
