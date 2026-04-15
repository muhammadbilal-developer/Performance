"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Input } from "@/components/ui/input";

const links = [
  { href: "/", label: "Home" },
  { href: "/blog", label: "Articles" },
  { href: "/about-us", label: "About Us" },
  { href: "/contact-us", label: "Contact Us" },
];

export default function SiteHeader() {
  const [search, setSearch] = useState("");
  const router = useRouter();

  function onSearchSubmit(event) {
    event.preventDefault();
    const query = search.trim();
    router.push(query ? `/blog?q=${encodeURIComponent(query)}` : "/blog");
  }

  return (
    <header className="border-b border-zinc-800 bg-black text-zinc-300">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-lg font-semibold tracking-wide text-zinc-100">
          Calculator Insight Hub
        </Link>
        <nav className="flex flex-wrap items-center gap-4 text-sm">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="text-zinc-400 transition hover:text-zinc-200">
              {link.label}
            </Link>
          ))}
        </nav>
        <form onSubmit={onSearchSubmit} className="ml-4 hidden lg:block">
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search articles..."
            className="h-9 w-56"
          />
        </form>
      </div>
    </header>
  );
}
