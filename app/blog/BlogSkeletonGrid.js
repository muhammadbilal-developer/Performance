export default function BlogSkeletonGrid() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <article key={index} className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950 p-4">
          <div className="h-40 w-full animate-pulse rounded bg-zinc-800" />
          <div className="mt-4 h-3 w-24 animate-pulse rounded bg-zinc-800" />
          <div className="mt-3 h-5 w-full animate-pulse rounded bg-zinc-800" />
          <div className="mt-2 h-5 w-5/6 animate-pulse rounded bg-zinc-800" />
          <div className="mt-3 h-4 w-full animate-pulse rounded bg-zinc-800" />
          <div className="mt-2 h-4 w-11/12 animate-pulse rounded bg-zinc-800" />
          <div className="mt-2 h-4 w-4/5 animate-pulse rounded bg-zinc-800" />
          <div className="mt-4 h-4 w-24 animate-pulse rounded bg-zinc-800" />
        </article>
      ))}
    </div>
  );
}
