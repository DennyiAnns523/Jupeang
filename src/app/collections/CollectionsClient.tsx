"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { urlFor, type SanityProduct } from "@/lib/sanity";
export default function CollectionsClient({
  products,
}: {
  products: SanityProduct[];
}) {
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("curated");
  const categories = [
    "All",
    ...Array.from(new Set(products.map((p) => p.occasion).filter(Boolean))),
  ];
  const filtered = products
    .filter(
      (p) =>
        (filter === "All" || p.occasion === filter) &&
        p.name.toLowerCase().includes(search.toLowerCase()),
    )
    .sort((a, b) =>
      sort === "low"
        ? a.price - b.price
        : sort === "high"
          ? b.price - a.price
          : 0,
    );
  return (
    <main id="top" className="editorial-page">
      <div className="page-heading album-heading">
        <div>
          <span className="eyebrow">THE JUPEANG COLLECTION</span>
          <h1>
            For your
            <br />
            <em>little world.</em>
          </h1>
        </div>
        <p>
          Things to give. Things to keep.
          <br />
          Find something that feels like you.
        </p>
      </div>
      <div className="filter-bar">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setFilter(c)}
            aria-pressed={filter === c}
          >
            {c === "All" ? "Everything" : c}
          </button>
        ))}
        <div className="shop-search">
          <input
            aria-label="Search the shop"
            placeholder="Find something…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            aria-label="Sort products"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="curated">Curated order</option>
            <option value="low">Price: low to high</option>
            <option value="high">Price: high to low</option>
          </select>
          <span>{filtered.length} pieces</span>
        </div>
      </div>
      {filtered.length > 0 ? (
        <div className="product-grid">
          {filtered.map((p) => (
            <Link href={`/collections/${p.slug}`} key={p._id}>
              <div className="product-visual">
                {p.image ? (
                  <Image
                    src={urlFor(p.image).width(800).height(1000).url()}
                    alt={p.name}
                    fill
                    sizes="(max-width:700px) 44vw, 30vw"
                  />
                ) : (
                  <span>Photograph to follow</span>
                )}
              </div>
              <div className="product-line">
                <div>
                  <h2>{p.name}</h2>
                  <p>{p.occasion}</p>
                </div>
                <span>from ${p.price}</span>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <section className="empty-shop">
          <div>
            <span className="eyebrow">
              {products.length
                ? "A LITTLE DIFFERENT?"
                : "GOOD THINGS TAKE THEIR TIME"}
            </span>
            <h2>
              {products.length
                ? "Nothing here just yet."
                : "A collection in the making."}
            </h2>
            <p>
              {products.length
                ? "Try another search or explore everything."
                : "Our shop is taking shape. While the shelves are being filled, come meet the world behind them."}
            </p>
            {products.length ? (
              <button
                className="text-link"
                style={{ background: "none", border: 0, marginTop: 20 }}
                onClick={() => {
                  setFilter("All");
                  setSearch("");
                }}
              >
                Clear the filters ↗
              </button>
            ) : (
              <Link className="round-link" href="/about">
                <span>Discover our story</span>
                <b>↗</b>
              </Link>
            )}
          </div>
          <div className="empty-shop-art">
            <span>THE JUPEANG SHOP</span>
            <b>
              Good things.
              <br />
              <em>Soon.</em>
            </b>
            <span>GROWN WITH CARE. CHOSEN WITH FEELING.</span>
          </div>
        </section>
      )}
    </main>
  );
}
