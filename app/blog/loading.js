import BlogSkeletonGrid from "./BlogSkeletonGrid";

export default function BlogLoadingPage() {
  return (
    <main className="mx-auto min-h-screen w-full max-w-5xl p-6 sm:p-10">
      <div className="mb-4 h-5 w-40 animate-pulse rounded bg-zinc-800" />
      <div className="mb-6 h-10 w-56 animate-pulse rounded bg-zinc-800" />
      <BlogSkeletonGrid />
    </main>
  );
}
