import type { CSSProperties } from "react";
import { FONT_HAND } from "../config/sceneTheme";

// Kue ulang tahun persegi panjang: separuh buah, separuh coklat, dengan papan "Happy Birthday ayg".
// Digambar sebagai SVG (tampak miring dari atas). Tiga lilin di sisi buah, apinya bergoyang.
// out=true -> api ditiup padam satu per satu, muncul asap tipis, lalu seluruh kue memudar.
// Hanya memakai transform/opacity (tanpa filter) supaya ringan di HP.

export const CAKE_FADE_DELAY_MS = 600; // mulai memudar setelah api padam
export const CAKE_FADE_MS = 800;
/** total waktu dari tap sampai kue hilang -> setelah ini kembang api pertama boleh masuk */
export const CAKE_OUT_TOTAL_MS = CAKE_FADE_DELAY_MS + CAKE_FADE_MS + 50;

// x,y = titik dasar lilin di permukaan kue
const CANDLES = [
  { x: 188, y: 114, color: "#6FD6FF", delay: 0 },
  { x: 217, y: 108, color: "#FFD84A", delay: 0.28 },
  { x: 244, y: 115, color: "#FF9ACB", delay: 0.55 },
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

function Kiwi({ x, y, r, rot = 0 }: { x: number; y: number; r: number; rot?: number }) {
  const seeds = Array.from({ length: 10 }, (_, i) => {
    const a = (i / 10) * Math.PI * 2;
    return [Math.cos(a) * r * 0.52, Math.sin(a) * r * 0.52, (a * 180) / Math.PI] as const;
  });
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(1 .74)`}>
      <circle r={r} fill="#79c141" stroke="#4d962b" strokeWidth="1.2" />
      <circle r={r * 0.8} fill="#bfe383" />
      <ellipse rx={r * 0.3} ry={r * 0.4} fill="#f2f9cd" />
      {seeds.map(([sx, sy, a], i) => (
        <ellipse key={i} cx={sx} cy={sy} rx="1.5" ry="0.8" fill="#26261a" transform={`rotate(${a} ${sx} ${sy})`} />
      ))}
    </g>
  );
}

function Orange({ x, y, s = 1, rot = 0 }: { x: number; y: number; s?: number; rot?: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s} ${s * 0.78})`}>
      <path d="M-11 0 A11 11 0 0 0 11 0 Z" fill="#ffa12b" stroke="#ffd584" strokeWidth="1.4" strokeLinejoin="round" />
      <path d="M-6 1 L-3 8 M0 1 V9 M6 1 L3 8" stroke="#ffd584" strokeWidth="0.9" fill="none" />
    </g>
  );
}

function Strawberry({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M0 -8 C9 -8 11 1 0 12 C-11 1 -9 -8 0 -8 Z" fill="#e5233f" stroke="#b81830" strokeWidth="0.8" />
      {[[-4, -2], [3, -3], [0, 2], [-3, 5], [4, 3]].map(([sx, sy], i) => (
        <ellipse key={i} cx={sx} cy={sy} rx="0.9" ry="1.3" fill="#ffe08a" />
      ))}
      <path d="M-6 -8 L0 -4 L6 -8 L3 -10.5 L0 -8.5 L-3 -10.5 Z" fill="#4aa83a" />
    </g>
  );
}

function Grape({ x, y, r = 7 }: { x: number; y: number; r?: number }) {
  return (
    <g>
      <circle cx={x} cy={y} r={r} fill="#5a2250" stroke="#3a1236" strokeWidth="0.8" />
      <ellipse cx={x - r * 0.35} cy={y - r * 0.4} rx={r * 0.28} ry={r * 0.18} fill="#fff" opacity="0.45" />
    </g>
  );
}

function Heart({ x, y, s = 1, fill = "#fff" }: { x: number; y: number; s?: number; fill?: string }) {
  return <path d="M0 3.4 C-7 -2 -3.5 -7.5 0 -3.5 C3.5 -7.5 7 -2 0 3.4 Z" fill={fill} transform={`translate(${x} ${y}) scale(${s})`} />;
}

export default function BirthdayCake({ out, reduce }: { out: boolean; reduce: boolean }) {
  const fbox: CSSProperties = { transformBox: "fill-box", transformOrigin: "50% 100%" };

  return (
    <div
      aria-hidden
      style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        width: "min(86vw, 340px)",
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
        <svg viewBox="0 18 310 210" width="100%" style={{ display: "block", overflow: "visible" }}>
          <defs>
            <radialGradient id="cakeGlowGrad">
              <stop offset="0" stopColor="#FFE9A0" stopOpacity="0.9" />
              <stop offset="0.5" stopColor="#FFB84A" stopOpacity="0.28" />
              <stop offset="1" stopColor="#FF9A2E" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* bayangan + papan alas */}
          <ellipse cx="160" cy="214" rx="140" ry="9" fill="rgba(0,0,0,0.3)" />
          <polygon points="22,200 262,200 300,152 60,152" fill="#2a2a2e" stroke="#d9b45a" strokeWidth="2" strokeLinejoin="round" />
          <polygon points="22,200 262,200 262,206 22,206" fill="#1c1c20" stroke="#d9b45a" strokeWidth="1.5" strokeLinejoin="round" />

          {/* sisi depan: kiri coklat, kanan sponge krim */}
          <rect x="40" y="128" width="105" height="64" fill="#4b2a1b" />
          <rect x="40" y="146" width="105" height="5" fill="#6a3f2a" />
          <rect x="40" y="164" width="105" height="5" fill="#6a3f2a" />
          <rect x="40" y="128" width="105" height="11" fill="#2d160e" />
          <rect x="145" y="128" width="105" height="64" fill="#fbefd3" />
          <rect x="145" y="148" width="105" height="5" fill="#efd7a0" />
          <rect x="145" y="166" width="105" height="5" fill="#efd7a0" />
          <rect x="145" y="128" width="105" height="8" fill="#fffaf0" />

          {/* sisi kanan */}
          <polygon points="250,128 278,92 278,156 250,192" fill="#ecd8aa" />
          <polygon points="250,148 278,112 278,117 250,153" fill="#dcc283" />
          <polygon points="250,166 278,130 278,135 250,171" fill="#dcc283" />
          <polygon points="250,128 278,92 278,100 250,136" fill="#fffaf0" />

          {/* permukaan atas: coklat (kiri) & krim (kanan) */}
          <polygon points="40,128 145,128 173,92 68,92" fill="#44261a" />
          <polygon points="50,126 92,126 118,94 80,94" fill="#fff" opacity="0.1" />
          {[[60, 118], [86, 104], [120, 119], [140, 104], [104, 112], [74, 98]].map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r="1.9" fill="#6a4330" />
          ))}
          <polygon points="145,128 250,128 278,92 173,92" fill="#fffaf0" />
          <polyline points="145,128 173,92" stroke="#e8d9b8" strokeWidth="1.5" fill="none" />
          <polygon points="40,128 250,128 250,131 40,131" fill="rgba(0,0,0,0.12)" />

          {/* tepi putih tipis seperti stiker kertas */}
          <polygon
            points="40,128 68,92 278,92 278,156 250,192 40,192"
            fill="none"
            stroke={OUTLINE}
            strokeWidth="2.5"
            strokeLinejoin="round"
          />

          {/* buah di sisi kanan */}
          <Grape x={164} y={98} r={7} />
          <Kiwi x={172} y={113} r={15} rot={-8} />
          <Orange x={160} y={124} s={1.05} rot={-14} />
          <Strawberry x={199} y={100} s={1.05} />
          <Orange x={196} y={126} s={1.1} rot={-6} />
          <Grape x={226} y={96} r={7.5} />
          <Kiwi x={258} y={103} r={14} rot={12} />
          <Grape x={211} y={122} r={6.5} />
          <Orange x={232} y={126} s={1.05} rot={8} />
          <Strawberry x={265} y={124} s={0.95} />
          <Grape x={247} y={124} r={6} />
          <Grape x={186} y={96} r={6} />

          {/* coklat pipih + macaron di belakang papan */}
          <polygon points="112,80 138,60 156,82 130,100" fill="#2a160e" stroke="#5a3524" strokeWidth="1.2" strokeLinejoin="round" />
          <ellipse cx="136" cy="84" rx="17" ry="6.5" fill="#a9633f" />
          <rect x="119" y="84" width="34" height="3.5" fill="#f1ddc0" />
          <ellipse cx="136" cy="88" rx="17" ry="6.5" fill="#9a5836" />

          {/* papan coklat bertulisan */}
          <g transform="rotate(-3 88 112)">
            <rect x="48" y="90" width="82" height="44" rx="2" fill="#241f1c" stroke="#4a3d33" strokeWidth="1.5" />
            <text x="89" y="112" textAnchor="middle" textLength="66" lengthAdjust="spacingAndGlyphs" fontFamily={FONT_HAND} fontSize="14" fontWeight="700" fill="#fff" stroke="#fff" strokeWidth="0.3">
              Happy Birthday
            </text>
            <text x="89" y="130" textAnchor="middle" textLength="26" lengthAdjust="spacingAndGlyphs" fontFamily={FONT_HAND} fontSize="17" fontWeight="700" fill="#fff" stroke="#fff" strokeWidth="0.3">
              ayg
            </text>
            <Heart x={55} y={97} s={0.8} />
            <Heart x={123} y={96} s={0.8} />
            <Heart x={112} y={124} s={0.65} />
            <Heart x={66} y={124} s={0.65} />
          </g>

          {/* lilin + api */}
          {CANDLES.map((c, i) => (
            <g key={c.x}>
              <rect x={c.x - 4.5} y={c.y - 34} width="9" height="34" rx="2" fill={c.color} stroke={OUTLINE} strokeWidth="2" />
              <rect x={c.x - 4.5} y={c.y - 24} width="9" height="4" fill="#fff" opacity="0.55" />
              <rect x={c.x - 4.5} y={c.y - 12} width="9" height="4" fill="#fff" opacity="0.55" />
              <rect x={c.x - 0.9} y={c.y - 41} width="1.8" height="8" fill="#5a3a2a" />

              <g transform={`translate(${c.x} ${c.y - 40})`}>
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
                  cy={c.y - 48}
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