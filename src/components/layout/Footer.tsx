"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
export default function Footer() {
  const path = usePathname();
  if (path === "/terrace" || path.startsWith("/studio")) return null;
  return (
    <footer className="site-footer">
      <div className="footer-top">
        <p>
          A little closer to
          <br />
          <em>the things that matter.</em>
        </p>
        <div>
          <Link href="/collections">Find something to love ↗</Link>
          <Link href="/album">Stay for the memories ↗</Link>
        </div>
      </div>
      <Link href="/" className="footer-wordmark">
        jupeang<span>®</span>
      </Link>
      <div className="footer-bottom">
        <span>Konyak for flower. A world of our own.</span>
        <span>© {new Date().getFullYear()} Jupeang</span>
        <a href="#top">Back to the top ↑</a>
      </div>
    </footer>
  );
}
