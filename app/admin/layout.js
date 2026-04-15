import Link from "next/link";
import { BarChart3, Files, FolderTree, PlusCircle, Settings } from "lucide-react";

const adminLinks = [
  { href: "/admin", label: "Dashboard", icon: BarChart3 },
  { href: "/admin/articles", label: "Articles", icon: Files },
  { href: "/admin/articles/new", label: "Create Article", icon: PlusCircle },
  { href: "/admin/categories", label: "Categories", icon: FolderTree },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export default function AdminLayout({ children }) {
  return (
    <div className="min-h-screen bg-black text-zinc-300 md:grid md:grid-cols-[250px_1fr]">
      <aside className="border-r border-zinc-800 bg-zinc-950">
        <div className="px-5 py-5" />
        <nav className="space-y-1 px-3">
          {adminLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200"
              >
                <Icon className="h-4 w-4" />
                {link.label}
              </Link>
            );
          })}
        </nav>
      </aside>
      <div className="min-w-0">
        <header className="border-b border-zinc-800 px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-lg font-semibold text-zinc-100">Admin Panel</h1>
            <Link href="/" className="text-sm text-zinc-400 hover:text-zinc-100">
              Back to Site
            </Link>
          </div>
        </header>
        <section className="px-6 py-6">{children}</section>
      </div>
    </div>
  );
}
