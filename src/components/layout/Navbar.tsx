"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/lib/cartContext";
const links = [
  ["The shop", "/collections"],
  ["Our story", "/about"],
  ["The journey", "/garden"],
  ["The album", "/album"],
];
export default function Navbar() {
  const path = usePathname();
  const { count, setIsOpen } = useCart();
  if (path === "/terrace" || path.startsWith("/studio")) return null;
  return (
    <header className={path === "/" ? "site-nav is-overlay" : "site-nav"}>
      <Link href="/" className="wordmark" aria-label="Jupeang home">
        jupeang<span>Objects. Stories. Growing things.</span>
      </Link>
      <nav aria-label="Main navigation">
        {links.map(([label, href]) => (
          <Link
            key={href}
            href={href}
            aria-current={path === href ? "page" : undefined}
          >
            {label}
          </Link>
        ))}
      </nav>
      <div className="nav-tools">
        <Link href="/account" className="account-link" aria-current={path.startsWith("/account") ? "page" : undefined}>
          Account
        </Link>
        <button
          className="bag-button"
          onClick={() => setIsOpen(true)}
          aria-label={`Open bag, ${count} items`}
        >
          Bag <span>{String(count).padStart(2, "0")}</span>
        </button>
      </div>
    </header>
  );
}
