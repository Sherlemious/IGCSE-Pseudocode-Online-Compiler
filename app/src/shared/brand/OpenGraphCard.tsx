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

export function OpenGraphCard() {
  const { ink, paper, red, highlight, rule } = BRAND.colors;
  const mark = markDataUri({ color: ink, size: 256 });
  const tick = `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><path d="M9 26.5L19 36L40 10" stroke="${red}" stroke-width="4.4" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>`,
  )}`;

  return (
    <div
      style={{
        width: 1200,
        height: 630,
        display: 'flex',
        background: ink,
        padding: 40,
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
        <div
          style={{
            display: 'flex',
            width: 8,
            background: red,
            height: '100%',
          }}
        />
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            padding: '44px 48px 40px 40px',
            position: 'relative',
          }}
        >
          {Array.from({ length: 16 }, (_, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                position: 'absolute',
                left: 40,
                right: 0,
                top: 72 + i * 28,
                height: 1,
                background: `rgba(159, 179, 209, ${i % 2 === 0 ? 0.45 : 0.22})`,
              }}
            />
          ))}

          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <img src={mark} width={56} height={56} alt="" />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div
                style={{
                  display: 'flex',
                  fontFamily: 'Fraunces',
                  fontStyle: 'italic',
                  fontSize: 52,
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
                  fontSize: 14,
                  color: `rgba(17, 23, 38, 0.55)`,
                  letterSpacing: 4,
                  marginTop: 6,
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
              fontSize: 22,
              color: `rgba(17, 23, 38, 0.72)`,
              marginTop: 28,
              maxWidth: 640,
              lineHeight: 1.35,
            }}
          >
            {BRAND.tagline}
          </div>

          <div
            style={{
              display: 'flex',
              marginTop: 36,
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
                  height: 28,
                  position: 'relative',
                }}
              >
                {line.highlight ? (
                  <div
                    style={{
                      display: 'flex',
                      position: 'absolute',
                      left: -8,
                      right: 80,
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
                    fontSize: 22,
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
              width={64}
              height={64}
              alt=""
              style={{
                position: 'absolute',
                left: 432,
                top: 26,
                transform: 'rotate(6deg)',
              }}
            />
          </div>

          <div
            style={{
              display: 'flex',
              marginTop: 'auto',
              fontFamily: 'Fira Code',
              fontSize: 14,
              color: `rgba(17, 23, 38, 0.42)`,
              letterSpacing: 0.4,
            }}
          >
            {BRAND.maker.toLowerCase()}.com
          </div>
        </div>

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
                    width: 110,
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
      </div>
    </div>
  );
}
