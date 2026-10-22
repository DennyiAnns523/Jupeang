import Image from "next/image";
import Link from "next/link";
export default function AboutPage() {
  return (
    <main id="top" className="editorial-page">
      <div className="page-heading">
        <span className="eyebrow">01 / OUR STORY</span>
        <h1>
          A small world.
          <br />
          <em>A lot of heart.</em>
        </h1>
        <p>
          Üli is the garden of Pauwau Konyak: flowers, vegetables and
          homegrown things, and the moments we want to keep.
        </p>
      </div>
      <section className="story-spread">
        <div className="story-portrait">
          <Image
            src="/images/IMG-20250617-WA0015.jpg"
            alt="Pauwau Konyak holding hydrangeas on the terrace"
            fill
            priority
            sizes="(max-width:700px) 90vw, 45vw"
          />
        </div>
        <div>
          <span className="eyebrow">FROM A SEED, LIFE BEGINS</span>
          <h2>
            Rooted in
            <br />
            <em>something personal.</em>
          </h2>
          <p>
            Üli is owned and tended by Pauwau Konyak, the gardener behind every
            pot on the terrace. Everything here starts the same way: with a seed,
            some soil and a lot of patience.
          </p>
          <p>
            There is a garden here: flowers, vegetables and homegrown things.
            There is the gardener who cares for it, and
            photographs of the ordinary days around it. There is also a shop—a
            place for things to find a new home.
          </p>
          <p>
            These are all parts of the same world. Something to grow. Something
            to give. Something to keep.
          </p>
          <Link className="text-link" href="/garden">
            Follow the journey ↗
          </Link>
        </div>
      </section>
      <div className="story-manifesto">
        <span className="eyebrow">THE SPIRIT OF ÜLI</span>
        <h2>
          Make room for care.
          <br />
          Find joy in the ordinary.
          <br />
          <em>Let things grow.</em>
        </h2>
      </div>
    </main>
  );
}
