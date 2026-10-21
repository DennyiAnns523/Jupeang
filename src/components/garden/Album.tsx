"use client";
import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
const photos = [
  ["IMG-20251127-WA0049.jpg", "A place to pause", "The terrace"],
  ["IMG-20251209-WA0015.jpg", "Every shade of pink", "The little details"],
  ["IMG-20251109-WA0019.jpg", "The hands behind it", "Our people"],
  ["IMG-20250617-WA0015.jpg", "Something worth holding", "Our people"],
  ["IMG-20251127-WA0053.jpg", "Stay a little longer", "The terrace"],
];
export default function Album() {
  const [active, setActive] = useState(0);
  const [filter, setFilter] = useState("All moments");
  const dialog = useRef<HTMLDialogElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const filtered = photos.filter(
    (p) => filter === "All moments" || p[2] === filter,
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
        {["All moments", "The terrace", "The little details", "Our people"].map(
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
            src={`/images/${photo[0]}`}
            alt={photo[1]}
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
          <h2>{photo[1]}</h2>
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
            key={p[0]}
            onClick={() => setActive(i)}
            aria-label={p[1]}
            aria-pressed={i === active}
          >
            <Image src={`/images/${p[0]}`} alt="" width={150} height={110} />
            <span>0{i + 1}</span>
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
          src="/images/VID-20251217-WA0007.mp4"
        />
      </dialog>
    </main>
  );
}
