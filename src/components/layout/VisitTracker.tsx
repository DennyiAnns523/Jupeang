"use client";
import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

// Counts a page view on every page change, for the visitors page in /admin.
// No cookies; respects the browser's "Do Not Track" setting.
export default function VisitTracker() {
  const path = usePathname();
  const first = useRef(true);

  useEffect(() => {
    if (navigator.doNotTrack === "1") return;
    // The outside referrer only matters for the first page of a visit
    const referrer = first.current ? document.referrer : "";
    first.current = false;
    fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path, referrer }),
      keepalive: true,
    }).catch(() => {});
  }, [path]);

  return null;
}
