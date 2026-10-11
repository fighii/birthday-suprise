import type { CSSProperties } from "react";

// Kue ulang tahun (SVG, gaya kertas tempel) dengan 3 lilin yang apinya bergoyang.
// out=true -> api ditiup padam satu per satu, muncul asap tipis, lalu seluruh kue memudar.
// Hanya memakai transform/opacity (tanpa filter) supaya ringan di HP.

export const CAKE_FADE_DELAY_MS = 600; // mulai memudar setelah api padam
export const CAKE_FADE_MS = 800;
/** total waktu dari tap sampai kue hilang -> setelah ini kembang api pertama boleh masuk */
export const CAKE_OUT_TOTAL_MS = CAKE_FADE_DELAY_MS + CAKE_FADE_MS + 50;

const CANDLES = [
  { x: 92, color: "#6FD6FF", delay: 0 },
  { x: 120, color: "#FFD84A", delay: 0.28 },
  { x: 148, color: "#FF9ACB", delay: 0.55 },
];
const SPRINKLES: [number, number, number, string][] = [
  [54, 186, 20, "#FFD84A"], [78, 200, -30, "#6FD6FF"], [96, 176, 55, "#fff3e0"],
  [146, 178, -40, "#FFD84A"], [166, 198, 25, "#6FD6FF"], [188, 184, -15, "#fff3e0"],
  [70, 172, -10, "#B07CFF"], [172, 172, 35, "#B07CFF"],
];
const OUTLINE = "#fff8ee";

const css = `
@keyframes cakeIn { from { opacity: 0; transform: translateY(14px) scale(.96); } to { opacity: 1; transform: none; } }
@keyframes cakeFade { from { opacity: 1; transform: none; } to { opacity: 0; transform: translateY(10px) scale(.96); } }
@keyframes cakeFlicker {
  0%, 100% { transform: scale(1, 1) rotate(-2deg); }
  25% { transform: scale(.92, 1.09) rotate(2.5deg); }
  50% { transform: scale(1.06, .93) rotate(-1deg); }
  75% { transform: scale(.95, 1.05) rotate(3deg); }
}
@keyframes cakeGlow { 0%, 100% { opacity: .5; } 50% { opacity: .85; } }
@keyframes cakeFlameOut {
  0% { transform: scale(1, 1) skewX(0deg); opacity: 1; }
  40% { transform: scale(.8, .7) skewX(-28deg) translateX(3px); opacity: .9; }
  100% { transform: scale(.2, .1) skewX(-40deg) translateX(7px); opacity: 0; }
}
@keyframes cakeGlowOut { to { opacity: 0; } }
@keyframes cakeSmoke {
  0% { opacity: 0; transform: translate(0, 0) scale(.6); }
  20% { opacity: .7; }
  100% { opacity: 0; transform: translate(7px, -36px) scale(1.9); }
}
`;

export default function BirthdayCake({ out, reduce }: { out: boolean; reduce: boolean }) {
  const fbox: CSSProperties = { transformBox: "fill-box", transformOrigin: "50% 100%" };

  return (
    <div
      aria-hidden
      style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        width: "min(66vw, 270px)",
        transform: "translate(-50%, -44%)",
        zIndex: 6,
        pointerEvents: "none",
      }}
    >
      <style>{css}</style>
      <div
        style={{
          animation: out
            ? `cakeFade ${CAKE_FADE_MS}ms ease ${CAKE_FADE_DELAY_MS}ms both`
            : "cakeIn 900ms ease both",
        }}
      >
        <svg viewBox="0 0 240 250" width="100%" style={{ display: "block", overflow: "visible" }}>
          <defs>
            <radialGradient id="cakeGlowGrad">
              <stop offset="0" stopColor="#FFE9A0" stopOpacity="0.9" />
              <stop offset="0.5" stopColor="#FFB84A" stopOpacity="0.28" />
              <stop offset="1" stopColor="#FF9A2E" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* bayangan + piring */}
          <ellipse cx="120" cy="228" rx="100" ry="9" fill="rgba(0,0,0,0.28)" />
          <ellipse cx="120" cy="216" rx="104" ry="12" fill="#efe3ff" stroke={OUTLINE} strokeWidth="3" />

          {/* tingkat bawah */}
          <rect x="36" y="150" width="168" height="62" rx="8" fill="#ff7fae" stroke={OUTLINE} strokeWidth="3" />
          <rect x="36" y="150" width="168" height="16" rx="8" fill="#fff3e0" />
          {[52, 84, 116, 148, 180].map((x, i) => (
            <rect key={x} x={x - 7} y="158" width="14" height={i % 2 ? 22 : 14} rx="7" fill="#fff3e0" />
          ))}

          {/* tingkat atas */}
          <rect x="64" y="104" width="112" height="50" rx="8" fill="#c4a3ff" stroke={OUTLINE} strokeWidth="3" />
          <rect x="64" y="104" width="112" height="14" rx="7" fill="#fff3e0" />
          {[80, 106, 134, 160].map((x, i) => (
            <rect key={x} x={x - 6} y="112" width="12" height={i % 2 ? 20 : 13} rx="6" fill="#fff3e0" />
          ))}

          {/* hiasan */}
          {SPRINKLES.map(([x, y, r, c], i) => (
            <rect key={i} x={x - 5} y={y - 1.6} width="10" height="3.2" rx="1.6" fill={c} transform={`rotate(${r} ${x} ${y})`} />
          ))}
          <path
            d="M120 205 l-12-11 a6.5 6.5 0 0 1 12-8 a6.5 6.5 0 0 1 12 8 z"
            fill="#fff3e0"
            transform="translate(0 -4)"
          />

          {/* lilin + api */}
          {CANDLES.map((c, i) => (
            <g key={c.x}>
              <rect x={c.x - 4.5} y="72" width="9" height="34" rx="2" fill={c.color} stroke={OUTLINE} strokeWidth="2" />
              <rect x={c.x - 4.5} y="82" width="9" height="4" fill="#fff" opacity="0.55" />
              <rect x={c.x - 4.5} y="94" width="9" height="4" fill="#fff" opacity="0.55" />
              <rect x={c.x - 0.9} y="65" width="1.8" height="8" fill="#5a3a2a" />

              <g transform={`translate(${c.x} 66)`}>
                <circle
                  cy="-13"
                  r="17"
                  fill="url(#cakeGlowGrad)"
                  style={{
                    animation: out
                      ? `cakeGlowOut 300ms ease ${i * 0.07}s forwards`
                      : reduce
                        ? undefined
                        : `cakeGlow ${1.1 + i * 0.13}s ease-in-out ${c.delay}s infinite`,
                    opacity: reduce && !out ? 0.7 : undefined,
                  }}
                />
                <g
                  style={{
                    ...fbox,
                    animation: out
                      ? `cakeFlameOut 480ms ease-in ${i * 0.07}s forwards`
                      : reduce
                        ? undefined
                        : `cakeFlicker ${0.8 + i * 0.12}s ease-in-out ${c.delay}s infinite`,
                  }}
                >
                  <path d="M0 -27 C 7 -17 8.5 -8 0 0 C -8.5 -8 -7 -17 0 -27 Z" fill="#FF9A2E" />
                  <path d="M0 -18 C 4 -12 4.8 -6 0 -1 C -4.8 -6 -4 -12 0 -18 Z" fill="#FFE27A" />
                </g>
              </g>

              {/* asap tipis setelah api padam */}
              {out && (
                <circle
                  cx={c.x}
                  cy="58"
                  r="3.2"
                  fill="rgba(225,225,240,0.6)"
                  style={{
                    transformBox: "fill-box",
                    transformOrigin: "center",
                    opacity: 0,
                    animation: `cakeSmoke 1100ms ease-out ${0.18 + i * 0.08}s forwards`,
                  }}
                />
              )}
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
}
