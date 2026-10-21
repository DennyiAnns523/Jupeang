import Link from "next/link";
import { Caveat } from "next/font/google";
import styles from "./HomeExperience.module.css";
import { BedScene, PotRow, TerraceScene } from "./GardenArt";

const hand = Caveat({ subsets: ["latin"], weight: ["500", "700"] });

// What the terrace is doing this time of year, by month (0 = January).
const seasons = [
  { months: [0, 1], headline: "the seedlings are waking.", note: "Quiet months. Cuttings rooting under the eaves." },
  { months: [2, 3, 4], headline: "spring is on the terrace.", note: "Roses budding, petunias spilling over the pots." },
  { months: [5, 6, 7, 8], headline: "the rain is doing the watering.", note: "Monsoon. Hydrangeas heavy, everything green." },
  { months: [9, 10, 11], headline: "the chrysanthemums are out.", note: "Full bloom. Every pot on the roof is flowering." },
];

const beds = [
  {
    n: "01",
    place: "The potting bench",
    tag: "Chrysanthemum, yellow button",
    title: "Things to take home.",
    text: "Pots, posies and small growing things, picked from the bench and wrapped for whoever needs a little brightness.",
    href: "/collections",
    action: "Visit the shop",
    scene: "bench" as const,
  },
  {
    n: "02",
    place: "The steps",
    tag: "Mixed pots, three tiers",
    title: "What's growing right now.",
    text: "Every season we try something new. Some of it works. The journal keeps track of what we sow, lose and learn.",
    href: "/garden",
    action: "Read the journal",
    scene: "steps" as const,
  },
  {
    n: "03",
    place: "The pink wall",
    tag: "Pompons, magenta & blush",
    title: "Moments we kept.",
    text: "A shelf of pinks at golden hour. Ordinary afternoons. A photograph album from up here, as it happens.",
    href: "/album",
    action: "Open the album",
    scene: "wall" as const,
  },
  {
    n: "04",
    place: "The chair",
    tag: "Evening, tea, no hurry",
    title: "Pull up a chair.",
    text: "This is where the day ends: in the plastic chair among the pots, looking out at the hills. Here's who we are.",
    href: "/about",
    action: "Read our story",
    scene: "chair" as const,
  },
];

function PlantTag({ children, small }: { children: React.ReactNode; small?: string }) {
  return (
    <span className={`${styles.tag} ${hand.className}`}>
      {small && <small>{small}</small>}
      {children}
    </span>
  );
}

export default function HomeExperience() {
  const month = new Date().getMonth();
  const season = seasons.find((s) => s.months.includes(month)) ?? seasons[3];
  const today = new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long" });

  return (
    <main id="top" className={styles.garden}>
      {/* The gate: arrive on the roof */}
      <section className={styles.gate} aria-labelledby="gate-title">
        <TerraceScene className={styles.gateScene} />
        <div className={styles.gateWeather}>
          <span>Today on the terrace · {today}</span>
          <p>{season.note}</p>
        </div>
        <div className={styles.gateText}>
          <PlantTag small="You are here">The gate</PlantTag>
          <h1 id="gate-title">
            Come in —<br />
            <em>{season.headline}</em>
          </h1>
          <p>
            A rooftop garden above the hills, and the small shop that grew out of it.
            Wander as long as you like.
          </p>
        </div>
        <a href="#plan" className={styles.stepIn}>
          Step inside <b aria-hidden="true">↓</b>
        </a>
      </section>

      {/* The plan: the terrace from above */}
      <section id="plan" className={styles.plan} aria-labelledby="plan-title">
        <div className={styles.planIntro}>
          <span className="eyebrow">A PLAN OF THE TERRACE</span>
          <h2 id="plan-title">
            Four corners,
            <br />
            <em>one roof.</em>
          </h2>
          <p>
            There&rsquo;s no right way round. Follow the stepping stones, or go
            straight to the bed that catches your eye.
          </p>
          <ol className={styles.legend}>
            {beds.map((bed) => (
              <li key={bed.n}>
                <Link href={`#bed-${bed.n}`}>
                  <span>{bed.n}</span>
                  {bed.place}
                  <em>{bed.title}</em>
                </Link>
              </li>
            ))}
          </ol>
        </div>
        <TerracePlan />
      </section>

      {/* The path: walk past each bed */}
      <section className={styles.path} aria-label="A walk through the garden">
        {beds.map((bed, i) => (
          <article
            key={bed.n}
            id={`bed-${bed.n}`}
            className={`${styles.bed} ${i % 2 ? styles.bedRight : ""}`}
          >
            <div className={styles.bedPhoto}>
              <BedScene bed={bed.scene} />
            </div>
            <div className={styles.bedText}>
              <PlantTag small={`Bed ${bed.n} · ${bed.place}`}>{bed.tag}</PlantTag>
              <h2>{bed.title}</h2>
              <p>{bed.text}</p>
              <Link className="round-link" href={bed.href}>
                <span>{bed.action}</span>
                <b aria-hidden="true">↗</b>
              </Link>
            </div>
          </article>
        ))}
      </section>

      {/* The way out: the real photographs live elsewhere */}
      <section className={styles.gardener} aria-labelledby="gardener-title">
        <PlantTag small="On the way out">The gardener</PlantTag>
        <blockquote id="gardener-title">
          &ldquo;Not everything needs to be big to become{" "}
          <em>something beautiful.</em>&rdquo;
        </blockquote>
        <p>
          Everything here is grown, potted and carried up the stairs by hand.
          The real terrace, and the people who look after it, are in the album.
        </p>
        <div className={styles.gardenerLinks}>
          <Link className="round-link" href="/album">
            <span>See the real garden</span>
            <b aria-hidden="true">↗</b>
          </Link>
          <Link className="round-link" href="/about">
            <span>Meet the gardener</span>
            <b aria-hidden="true">↗</b>
          </Link>
        </div>
        <PotRow className={styles.potRow} />
      </section>
    </main>
  );
}

// A hand-drawn top-down plan of the roof. Each bed links to its stop on the path.
function TerracePlan() {
  const pots = (cx: number, cy: number, cols: number, rows: number, gap = 22) =>
    Array.from({ length: cols * rows }, (_, i) => (
      <circle
        key={i}
        cx={cx + (i % cols) * gap}
        cy={cy + Math.floor(i / cols) * gap}
        r={7 + ((i * 7) % 4)}
      />
    ));
  const stones = [
    [300, 470], [276, 430], [300, 392], [330, 356], [312, 316],
    [280, 282], [300, 244], [334, 212], [320, 172], [292, 138],
  ];
  return (
    <figure className={styles.planFigure}>
      <svg viewBox="0 0 600 540" role="img" aria-labelledby="plan-svg-title">
        <title id="plan-svg-title">Plan of the rooftop terrace showing four beds around a central path</title>
        {/* Parapet wall and the hills beyond */}
        <path className={styles.hills} d="M0 40 Q80 4 160 26 T320 18 T470 28 T600 12" />
        <rect className={styles.parapet} x="40" y="60" width="520" height="440" rx="6" />
        <text className={`${styles.planNote} ${hand.className}`} x="300" y="44" textAnchor="middle">
          the hills ↑
        </text>

        {/* Stepping-stone path from the stairs to the chair */}
        <g className={styles.stones}>
          {stones.map(([x, y], i) => (
            <ellipse key={i} cx={x} cy={y} rx="15" ry="10" transform={`rotate(${(i * 23) % 40 - 20} ${x} ${y})`} />
          ))}
        </g>
        <path className={styles.hose} d="M44 490 C150 496 250 490 256 400 S246 290 236 250" />

        <a href="#bed-01" aria-label="Bed 01, the potting bench: the shop">
          <g className={styles.bed01}>
            <rect x="70" y="330" width="170" height="130" rx="4" />
            <g className={styles.pots}>{pots(100, 362, 6, 3, 24)}</g>
            <circle className={styles.marker} cx="70" cy="330" r="13" />
            <text className={styles.markerText} x="70" y="334" textAnchor="middle">01</text>
          </g>
        </a>
        <a href="#bed-02" aria-label="Bed 02, the steps: the journal">
          <g className={styles.bed02}>
            <rect x="400" y="300" width="130" height="170" rx="4" />
            <path className={styles.stair} d="M400 340 H530 M400 380 H530 M400 420 H530" />
            <g className={styles.pots}>{pots(425, 322, 4, 1, 27)}{pots(425, 362, 4, 1, 27)}{pots(425, 402, 4, 1, 27)}{pots(425, 442, 4, 1, 27)}</g>
            <circle className={styles.marker} cx="400" cy="300" r="13" />
            <text className={styles.markerText} x="400" y="304" textAnchor="middle">02</text>
          </g>
        </a>
        <a href="#bed-03" aria-label="Bed 03, the pink wall: the album">
          <g className={styles.bed03}>
            <rect x="400" y="80" width="140" height="180" rx="4" />
            <g className={styles.pots}>{pots(422, 104, 2, 7, 23)}{pots(492, 104, 2, 7, 23)}</g>
            <circle className={styles.marker} cx="400" cy="80" r="13" />
            <text className={styles.markerText} x="400" y="84" textAnchor="middle">03</text>
          </g>
        </a>
        <a href="#bed-04" aria-label="Bed 04, the chair: our story">
          <g className={styles.bed04}>
            <rect x="70" y="80" width="200" height="150" rx="4" />
            <g className={styles.pots}>{pots(96, 104, 3, 2, 24)}{pots(196, 104, 3, 2, 24)}{pots(96, 200, 8, 1, 22)}</g>
            <rect className={styles.chair} x="158" y="146" width="26" height="26" rx="5" />
            <circle className={styles.marker} cx="70" cy="80" r="13" />
            <text className={styles.markerText} x="70" y="84" textAnchor="middle">04</text>
          </g>
        </a>

        <text className={`${styles.planNote} ${hand.className}`} x="300" y="528" textAnchor="middle">
          ↑ up the stairs, in through the gate
        </text>
        <text className={`${styles.planNote} ${hand.className}`} x="196" y="300" textAnchor="middle">
          the hose
        </text>
      </svg>
    </figure>
  );
}
