import Link from "next/link";

const footerLinks = [
  { href: "/about-us", label: "About Us" },
  { href: "/contact-us", label: "Contact Us" },
  { href: "/sitemap", label: "Sitemap" },
  { href: "/privacy-policy", label: "Privacy Policy" },
  { href: "/terms-and-conditions", label: "Terms and Conditions" },
];

export default function SiteFooter() {
  return (
    <footer className="mt-12 border-t border-zinc-800 bg-black">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-6 py-8 text-sm text-zinc-500 sm:flex-row sm:items-center sm:justify-between">
        <p>© {new Date().getFullYear()} Calculator Insight Hub. All rights reserved.</p>
        <nav className="flex flex-wrap gap-4">
          {footerLinks.map((item) => (
            <Link key={item.href} href={item.href} className="text-zinc-400 transition hover:text-zinc-200">
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
