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
          Jupeang is a place for the things we grow, the things we share, and
          the moments we want to keep.
        </p>
      </div>
      <section className="story-spread">
        <div className="story-portrait">
          <Image
            src="/images/IMG-20250617-WA0015.jpg"
            alt="Holding hydrangeas on the terrace"
            fill
            priority
            sizes="(max-width:700px) 90vw, 45vw"
          />
        </div>
        <div>
          <span className="eyebrow">IT STARTS WITH A FLOWER</span>
          <h2>
            Rooted in
            <br />
            <em>something personal.</em>
          </h2>
          <p>
            Jupeang means flower in Konyak. A small word that holds room for a
            much bigger story.
          </p>
          <p>
            There is a garden here. There are the people who care for it, and
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
        <span className="eyebrow">THE SPIRIT OF JUPEANG</span>
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
