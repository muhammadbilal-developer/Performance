import Link from "next/link";

export const metadata = {
  title: "Sitemap | Calculator Insight Hub",
  description: "Browse all important pages on Calculator Insight Hub.",
};

const links = [
  { href: "/", label: "Home" },
  { href: "/vat-calculator", label: "VAT Calculator" },
  { href: "/blog", label: "Articles" },
  { href: "/about-us", label: "About Us" },
  { href: "/contact-us", label: "Contact Us" },
  { href: "/privacy-policy", label: "Privacy Policy" },
  { href: "/terms-and-conditions", label: "Terms and Conditions" },
];

export default function SitemapPage() {
  return (
    <main className="mx-auto min-h-screen w-full max-w-4xl p-6 sm:p-10">
      <h1 className="mb-6 text-3xl font-bold">Sitemap</h1>
      <ul className="space-y-3 text-lg">
        {links.map((link) => (
          <li key={link.href}>
            <Link className="text-blue-600 underline" href={link.href}>
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
