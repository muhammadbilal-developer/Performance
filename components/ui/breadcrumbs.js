import Link from "next/link";

export default function Breadcrumbs({ items }) {
  return (
    <nav className="mb-4 text-sm text-zinc-500">
      <ol className="flex flex-wrap items-center gap-2">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={`${item.label}-${index}`} className="flex items-center gap-2">
              {index > 0 ? <span className="text-zinc-700">/</span> : null}
              {isLast || !item.href ? (
                <span className="text-zinc-300">{item.label}</span>
              ) : (
                <Link href={item.href} className="hover:text-zinc-200">
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
