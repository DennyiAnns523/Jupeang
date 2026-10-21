// Drawn (not photographed) pieces of the terrace for the landing page.
// Everything is seeded, so the server renders the same garden every time.

type Bloom = { petal: string; centre: string };

export const blooms = {
  yellow: { petal: "#e8b525", centre: "#8a6a12" },
  pink: { petal: "#e9a3bb", centre: "#b0476a" },
  magenta: { petal: "#b23a63", centre: "#6e1f3c" },
  white: { petal: "#f7f3ea", centre: "#d9a92c" },
  blush: { petal: "#f2c9d3", centre: "#c9798f" },
  rust: { petal: "#c8553d", centre: "#7a2a1d" },
} satisfies Record<string, Bloom>;

const pots = { white: "#f4f2ea", clay: "#b5653f", black: "#3a3a36" };

function rng(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** A potted chrysanthemum. `x` is the pot's centre, `base` the bottom of the pot. */
export function Plant({
  x,
  base,
  s = 1,
  bloom,
  pot = "white",
  seed = 1,
}: {
  x: number;
  base: number;
  s?: number;
  bloom: Bloom;
  pot?: keyof typeof pots;
  seed?: number;
}) {
  const r = rng(seed);
  const top = base - 40 * s;
  // Florets fill the dome by area, so big plants get many small heads, not a few huge ones.
  const k = Math.sqrt(s);
  const florets = Array.from({ length: Math.max(12, Math.round(36 * s * s)) }, () => {
    const a = Math.PI + r() * Math.PI;
    const d = Math.sqrt(r()) * 42 * s;
    return {
      cx: x + Math.cos(a) * d * 1.1,
      cy: top - 6 * s + Math.sin(a) * d * 0.78,
      r: (3.8 + r() * 2) * k,
    };
  });
  return (
    <g>
      <ellipse cx={x} cy={top + 2 * s} rx={46 * s} ry={30 * s} fill="#4f6a3f" />
      <ellipse cx={x - 14 * s} cy={top - 8 * s} rx={26 * s} ry={20 * s} fill="#5f7d4b" />
      {florets.map((f, i) => (
        <g key={i}>
          <circle cx={f.cx} cy={f.cy} r={f.r} fill={bloom.petal} stroke="#00000020" strokeWidth={0.6} />
          {f.r > 4.2 && <circle cx={f.cx} cy={f.cy} r={f.r * 0.3} fill={bloom.centre} />}
        </g>
      ))}
      <path
        d={`M${x - 27 * s} ${top} L${x + 27 * s} ${top} L${x + 20 * s} ${base} L${x - 20 * s} ${base} Z`}
        fill={pots[pot]}
        stroke="#00000022"
      />
      <rect x={x - 29 * s} y={top - 2 * s} width={58 * s} height={6 * s} rx={2 * s} fill={pots[pot]} stroke="#00000022" />
    </g>
  );
}

const mix: Bloom[] = [blooms.pink, blooms.yellow, blooms.magenta, blooms.white, blooms.blush, blooms.rust];
const potMix: (keyof typeof pots)[] = ["white", "white", "clay", "white", "black"];

function row(xs: number[], base: number, s: number, seed: number, skip: (x: number) => boolean = () => false) {
  return xs
    .filter((x) => !skip(x))
    .map((x, i) => (
      <Plant
        key={`${seed}-${x}`}
        x={x}
        base={base}
        s={s}
        bloom={mix[(i * 5 + seed) % mix.length]}
        pot={potMix[(i * 3 + seed) % potMix.length]}
        seed={seed * 100 + i}
      />
    ));
}

const range = (from: number, to: number, step: number) =>
  Array.from({ length: Math.floor((to - from) / step) + 1 }, (_, i) => from + i * step);

/** The whole terrace in elevation: hills, the town, the parapet, rows of pots, the chair. */
export function TerraceScene({ className }: { className?: string }) {
  const r = rng(7);
  const houses = Array.from({ length: 16 }, (_, i) => {
    const x = 40 + i * 88 + r() * 30;
    const y = 250 + Math.sin(i * 0.9) * 30 + r() * 40;
    return { x, y, w: 34 + r() * 26, h: 26 + r() * 22, tone: r() > 0.5 ? "#efe9dc" : "#e4dccb" };
  });
  const chair = (x: number) => x > 640 && x < 880;
  return (
    <svg className={className} viewBox="0 0 1440 700" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
      <path d="M0 230 Q220 150 430 200 T860 170 T1440 190 V700 H0 Z" fill="#dfe3d2" />
      <path d="M0 300 Q260 240 520 290 T1040 260 T1440 290 V700 H0 Z" fill="#c9d1b8" />
      {houses.map((h, i) => (
        <g key={i}>
          <rect x={h.x} y={h.y} width={h.w} height={h.h} fill={h.tone} />
          <path d={`M${h.x - 3} ${h.y} L${h.x + h.w / 2} ${h.y - 12} L${h.x + h.w + 3} ${h.y} Z`} fill="#8c7b6a" />
          <rect x={h.x + 6} y={h.y + 8} width={6} height={7} fill="#5b5a52" />
          <rect x={h.x + h.w - 13} y={h.y + 8} width={6} height={7} fill="#5b5a52" />
        </g>
      ))}
      <path d="M0 380 Q300 330 640 370 T1440 350 V700 H0 Z" fill="#aab796" />
      {[1010, 1190, 1290].map((x) => (
        <line key={x} x1={x} y1={250} x2={x + 6} y2={540} stroke="#b59a6a" strokeWidth={5} />
      ))}
      <line x1={990} y1={330} x2={1200} y2={310} stroke="#b59a6a" strokeWidth={4} />
      <line x1={1170} y1={300} x2={1310} y2={316} stroke="#b59a6a" strokeWidth={4} />
      <rect x={0} y={520} width={1440} height={44} fill="#e9e4d6" />
      <rect x={0} y={518} width={1440} height={5} fill="#d6d0c0" />
      {row(range(50, 1400, 72), 522, 0.55, 3)}
      <rect x={0} y={564} width={1440} height={136} fill="#ddd6c6" />
      <path d="M-10 690 C200 650 380 700 520 640 S760 620 900 660" fill="none" stroke="#5d8a6a" strokeWidth={4} opacity={0.5} />
      <g fill="#7b2a2a">
        <rect x={728} y={540} width={64} height={52} rx={8} />
        <rect x={722} y={590} width={76} height={14} rx={4} />
        <rect x={728} y={602} width={7} height={40} />
        <rect x={785} y={602} width={7} height={40} />
      </g>
      {row(range(80, 1400, 108), 640, 0.95, 5, chair)}
      {row(range(20, 1440, 170), 730, 1.6, 9)}
    </svg>
  );
}

/** Small drawn vignettes, one per bed. */
export function BedScene({ bed }: { bed: "bench" | "steps" | "wall" | "chair" }) {
  return (
    <svg viewBox="0 0 400 480" role="presentation" aria-hidden="true">
      {bed === "bench" && (
        <>
          <rect width={400} height={480} fill="#e7e4ea" />
          <rect y={360} width={400} height={120} fill="#d9d2c2" />
          <rect x={30} y={330} width={340} height={20} rx={3} fill="#9c8466" />
          <rect x={50} y={350} width={12} height={80} fill="#7f6a50" />
          <rect x={338} y={350} width={12} height={80} fill="#7f6a50" />
          <Plant x={80} base={330} s={1.05} bloom={blooms.white} seed={11} />
          <Plant x={330} base={330} s={1.15} bloom={blooms.blush} seed={12} />
          <Plant x={200} base={330} s={2.2} bloom={blooms.yellow} seed={13} />
        </>
      )}
      {bed === "steps" && (
        <>
          <rect width={400} height={480} fill="#e7eadf" />
          <rect x={0} y={420} width={400} height={60} fill="#cfc8b6" />
          <rect x={130} y={320} width={270} height={100} fill="#d8d1bf" />
          <rect x={250} y={220} width={150} height={100} fill="#e1dbcb" />
          {[
            [290, 220, 0.85, blooms.pink], [360, 220, 0.85, blooms.white],
            [170, 320, 0.95, blooms.yellow], [250, 320, 0.95, blooms.blush], [330, 320, 0.95, blooms.yellow],
            [45, 420, 1.05, blooms.white], [125, 420, 1.05, blooms.pink], [205, 420, 1.05, blooms.yellow],
            [285, 420, 1.05, blooms.magenta], [365, 420, 1.05, blooms.blush],
          ].map(([x, base, s, b], i) => (
            <Plant key={i} x={x as number} base={base as number} s={s as number} bloom={b as Bloom} seed={20 + i} />
          ))}
        </>
      )}
      {bed === "wall" && (
        <>
          <rect width={400} height={480} fill="#f3e6dc" />
          <path d="M120 0 H400 V300 Z" fill="#f9eee2" />
          <rect y={260} width={400} height={14} fill="#d8cdbf" />
          <rect y={440} width={400} height={40} fill="#d8cdbf" />
          {range(30, 390, 56).map((x, i) => (
            <Plant key={x} x={x} base={260} s={0.8} bloom={i % 2 ? blooms.pink : blooms.magenta} pot={i % 3 ? "white" : "clay"} seed={40 + i} />
          ))}
          {range(45, 390, 78).map((x, i) => (
            <Plant key={x} x={x} base={440} s={1.15} bloom={i % 2 ? blooms.magenta : blooms.blush} pot={i % 2 ? "black" : "white"} seed={60 + i} />
          ))}
        </>
      )}
      {bed === "chair" && (
        <>
          <rect width={400} height={480} fill="#ddd3cf" />
          <rect width={400} height={240} fill="#d3c6cc" />
          <circle cx={310} cy={80} r={22} fill="#f4ecd8" />
          <path d="M0 230 Q120 190 220 220 T400 210 V300 H0 Z" fill="#b6bfa6" />
          <rect y={290} width={400} height={190} fill="#cfc6b6" />
          <g fill="#7b2a2a">
            <rect x={160} y={250} width={80} height={70} rx={10} />
            <rect x={152} y={316} width={96} height={18} rx={5} />
            <rect x={160} y={332} width={9} height={60} />
            <rect x={231} y={332} width={9} height={60} />
          </g>
          <Plant x={60} base={330} s={1.1} bloom={blooms.magenta} pot="clay" seed={81} />
          <Plant x={340} base={330} s={1.1} bloom={blooms.yellow} seed={82} />
          <Plant x={50} base={460} s={1.4} bloom={blooms.pink} seed={83} />
          <Plant x={350} base={460} s={1.4} bloom={blooms.white} pot="black" seed={84} />
          <Plant x={200} base={480} s={1.2} bloom={blooms.rust} pot="clay" seed={85} />
        </>
      )}
    </svg>
  );
}

/** A low strip of pots, used as a border at the end of the walk. */
export function PotRow({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 1440 120" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
      {row(range(40, 1440, 90), 120, 0.75, 13)}
    </svg>
  );
}
