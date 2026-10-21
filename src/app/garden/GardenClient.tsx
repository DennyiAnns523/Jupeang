"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { urlFor, type SanityGardenPost } from "@/lib/sanity";
export default function GardenClient({ posts }: { posts: SanityGardenPost[] }) {
  const [tag, setTag] = useState("All entries");
  const tags = [
    "All entries",
    ...Array.from(new Set(posts.flatMap((p) => p.tags ?? []))),
  ];
  const filtered = posts.filter(
    (p) => tag === "All entries" || p.tags?.includes(tag),
  );
  return (
    <main id="top" className="editorial-page">
      <div className="page-heading album-heading">
        <div>
          <span className="eyebrow">03 / THE JOURNEY</span>
          <h1>
            Still <em>growing.</em>
          </h1>
        </div>
        <p>
          Notes from along the way.
          <br />
          The small discoveries and everything in between.
        </p>
      </div>
      <div className="filter-bar">
        {tags.map((t) => (
          <button key={t} onClick={() => setTag(t)} aria-pressed={tag === t}>
            {t}
          </button>
        ))}
      </div>
      {filtered.length ? (
        <div className="journal-list">
          {filtered.map((post) => (
            <Link
              href={`/garden/${post.slug}`}
              className="journal-entry"
              key={post._id}
            >
              <time dateTime={post.date}>
                {new Date(post.date).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                  timeZone: "UTC",
                })}
              </time>
              <div>
                <span className="eyebrow">{post.tags?.join(" / ")}</span>
                <h2>{post.title}</h2>
                <p>{post.excerpt}</p>
                <span className="text-link">Read the entry ↗</span>
              </div>
              {post.heroImage && (
                <div className="journal-image">
                  <Image
                    src={urlFor(post.heroImage).width(600).url()}
                    alt={post.title}
                    fill
                    sizes="(max-width:700px) 88vw, 210px"
                  />
                </div>
              )}
            </Link>
          ))}
        </div>
      ) : (
        <section className="journal-empty">
          <span className="eyebrow">A STORY THAT IS STILL UNFOLDING</span>
          <h2>
            {posts.length
              ? "More to discover."
              : "Every journey has a beginning."}
          </h2>
          <p>
            {posts.length
              ? "There are no entries for this subject yet."
              : "The written chapters are on their way. For now, our photographs tell a little of the story: the garden, the people, and the everyday moments."}
          </p>
          <Link href="/album" className="text-link">
            Explore the album ↗
          </Link>
        </section>
      )}
    </main>
  );
}
