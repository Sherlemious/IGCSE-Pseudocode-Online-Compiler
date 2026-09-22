/* eslint-disable @next/next/no-img-element -- ImageResponse / Satori only supports <img> */
import { BRAND } from './brand';
import { markDataUri } from './mark';

const CODE = [
  { text: 'DECLARE Total : INTEGER', highlight: false },
  { text: 'Total <- 0', highlight: false },
  { text: 'Total <- Total + Mark', highlight: true },
  { text: 'OUTPUT Total', highlight: false },
] as const;

const TRACE = [
  ['Total', 'Mark'],
  ['0', ''],
  ['0', '7'],
  ['7', '7'],
] as const;

export const OG_SQUARE = { width: 1200, height: 1200 } as const;
export const OG_WIDE = { width: 1200, height: 630 } as const;

type Variant = 'square' | 'wide';

export function OpenGraphCard({ variant = 'square' }: { variant?: Variant }) {
  const square = variant === 'square';
  const { ink, paper, red, highlight, rule } = BRAND.colors;
  const mark = markDataUri({ color: ink, size: 256 });
  const tick = `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><path d="M9 26.5L19 36L40 10" stroke="${red}" stroke-width="4.4" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>`,
  )}`;
  const size = square ? OG_SQUARE : OG_WIDE;
  const pad = square ? 48 : 40;
  const titleSize = square ? 72 : 52;
  const bodyPad = square ? '56px 56px 48px 48px' : '44px 48px 40px 40px';
  const lineCount = square ? 22 : 16;
  const lineStart = square ? 96 : 72;

  return (
    <div
      style={{
        width: size.width,
        height: size.height,
        display: 'flex',
        background: ink,
        padding: pad,
      }}
    >
      <div
        style={{
          display: 'flex',
          flex: 1,
          background: paper,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div style={{ display: 'flex', width: 8, background: red, height: '100%' }} />
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            padding: bodyPad,
            position: 'relative',
          }}
        >
          {Array.from({ length: lineCount }, (_, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                position: 'absolute',
                left: square ? 48 : 40,
                right: 0,
                top: lineStart + i * 28,
                height: 1,
                background: `rgba(159, 179, 209, ${i % 2 === 0 ? 0.45 : 0.22})`,
              }}
            />
          ))}

          <div style={{ display: 'flex', alignItems: 'center', gap: square ? 20 : 16 }}>
            <img src={mark} width={square ? 80 : 56} height={square ? 80 : 56} alt="" />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div
                style={{
                  display: 'flex',
                  fontFamily: 'Fraunces',
                  fontStyle: 'italic',
                  fontSize: titleSize,
                  color: ink,
                  lineHeight: 1,
                  letterSpacing: -1,
                }}
              >
                Pseudocode
              </div>
              <div
                style={{
                  display: 'flex',
                  fontFamily: 'Fira Code',
                  fontSize: square ? 18 : 14,
                  color: `rgba(17, 23, 38, 0.55)`,
                  letterSpacing: 4,
                  marginTop: 8,
                }}
              >
                COMPILER
              </div>
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              fontFamily: 'Fraunces',
              fontStyle: 'italic',
              fontSize: square ? 28 : 22,
              color: `rgba(17, 23, 38, 0.72)`,
              marginTop: square ? 40 : 28,
              maxWidth: square ? 900 : 640,
              lineHeight: 1.35,
            }}
          >
            {BRAND.tagline}
          </div>

          <div
            style={{
              display: 'flex',
              marginTop: square ? 48 : 36,
              flexDirection: 'column',
              position: 'relative',
            }}
          >
            {CODE.map((line) => (
              <div
                key={line.text}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  height: square ? 40 : 28,
                  position: 'relative',
                }}
              >
                {line.highlight ? (
                  <div
                    style={{
                      display: 'flex',
                      position: 'absolute',
                      left: -8,
                      right: square ? 40 : 80,
                      top: 2,
                      bottom: 2,
                      background: highlight,
                      opacity: 0.85,
                    }}
                  />
                ) : null}
                <div
                  style={{
                    display: 'flex',
                    fontFamily: 'Fira Code',
                    fontSize: square ? 28 : 22,
                    color: ink,
                    position: 'relative',
                  }}
                >
                  {line.text}
                </div>
              </div>
            ))}
            <img
              src={tick}
              width={square ? 72 : 64}
              height={square ? 72 : 64}
              alt=""
              style={{
                position: 'absolute',
                left: square ? 560 : 432,
                top: square ? 44 : 26,
                transform: 'rotate(6deg)',
              }}
            />
          </div>

          {square ? (
            <div
              style={{
                display: 'flex',
                marginTop: 56,
                width: 360,
                background: paper,
                border: `1px solid ${rule}`,
              }}
            >
              <TraceTable rule={rule} ink={ink} />
            </div>
          ) : null}

          <div
            style={{
              display: 'flex',
              marginTop: 'auto',
              fontFamily: 'Fira Code',
              fontSize: square ? 16 : 14,
              color: `rgba(17, 23, 38, 0.42)`,
              letterSpacing: 0.4,
            }}
          >
            {BRAND.maker.toLowerCase()}.com
          </div>
        </div>

        {square ? null : (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              width: 220,
              marginRight: -24,
              marginTop: 168,
              background: paper,
              border: `1px solid ${rule}`,
              transform: 'rotate(4deg)',
            }}
          >
            <TraceTable rule={rule} ink={ink} />
          </div>
        )}
      </div>
    </div>
  );
}

function TraceTable({ rule, ink }: { rule: string; ink: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
      {TRACE.map((row, rowIndex) => (
        <div
          key={row.join('-')}
          style={{
            display: 'flex',
            borderBottom: rowIndex === TRACE.length - 1 ? 'none' : `1px solid ${rule}`,
          }}
        >
          {row.map((cell, cellIndex) => (
            <div
              key={`${rowIndex}-${cellIndex}`}
              style={{
                display: 'flex',
                width: '50%',
                padding: '10px 12px',
                fontFamily: 'Fira Code',
                fontSize: rowIndex === 0 ? 12 : 18,
                color: ink,
                letterSpacing: rowIndex === 0 ? 1 : 0,
                borderRight: cellIndex === 0 ? `1px solid ${rule}` : 'none',
                background: rowIndex === TRACE.length - 1 ? 'rgba(242, 201, 76, 0.35)' : 'transparent',
              }}
            >
              {cell || ' '}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
