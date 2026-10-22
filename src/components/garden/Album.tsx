"use client";
import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { AlbumContent } from "@/lib/siteContent";
export default function Album({ photos, film }: AlbumContent) {
  const [active, setActive] = useState(0);
  const [filter, setFilter] = useState("All moments");
  const dialog = useRef<HTMLDialogElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const categories = ["All moments", ...new Set(photos.map((p) => p.category))];
  const filtered = photos.filter(
    (p) => filter === "All moments" || p.category === filter,
  );
  const photo = filtered[active] ?? filtered[0];
  function move(delta: number) {
    setActive((active + delta + filtered.length) % filtered.length);
  }
  return (
    <main id="top" className="editorial-page">
      <div className="page-heading album-heading">
        <div>
          <span className="eyebrow">04 / THE ALBUM</span>
          <h1>
            Life, <em>as it is.</em>
          </h1>
        </div>
        <p>
          A collection of ordinary days.
          <br />
          Photographs from our own little world.
        </p>
      </div>
      <div className="filter-bar" aria-label="Filter photographs">
        {categories.map(
          (label) => (
            <button
              key={label}
              aria-pressed={filter === label}
              onClick={() => {
                setFilter(label);
                setActive(0);
              }}
            >
              {label}
            </button>
          ),
        )}
        <button
          className="film-link"
          onClick={() => dialog.current?.showModal()}
        >
          Play a garden moment ▷
        </button>
      </div>
      <section
        className="album-stage"
        aria-label="Photo viewer"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") move(1);
          if (e.key === "ArrowLeft") move(-1);
        }}
      >
        <div className="album-stage-image">
          <Image
            src={photo.src}
            alt={photo.alt}
            fill
            priority
            sizes="(max-width:700px) 90vw, 75vw"
          />
        </div>
        <div className="album-stage-caption" aria-live="polite">
          <span>
            {String(active + 1).padStart(2, "0")} /{" "}
            {String(filtered.length).padStart(2, "0")}
          </span>
          <h2>{photo.caption}</h2>
          <div>
            <button aria-label="Previous photograph" onClick={() => move(-1)}>
              ←
            </button>
            <button aria-label="Next photograph" onClick={() => move(1)}>
              →
            </button>
          </div>
        </div>
      </section>
      <div className="album-contact-sheet">
        {filtered.map((p, i) => (
          <button
            key={p.src}
            onClick={() => setActive(i)}
            aria-label={p.caption}
            aria-pressed={i === active}
          >
            <Image src={p.src} alt="" width={150} height={110} />
            <span>{String(i + 1).padStart(2, "0")}</span>
          </button>
        ))}
      </div>
      <div className="album-end">
        <p>Want to linger a little longer?</p>
        <Link className="text-link" href="/terrace">
          Step onto the terrace ↗
        </Link>
      </div>
      <dialog
        className="film-dialog"
        ref={dialog}
        onClose={() => video.current?.pause()}
        aria-label="A garden moment"
      >
        <button
          autoFocus
          onClick={() => dialog.current?.close()}
          aria-label="Close film"
        >
          Close ×
        </button>
        <video
          ref={video}
          controls
          playsInline
          preload="none"
          src={film}
        />
      </dialog>
    </main>
  );
}
