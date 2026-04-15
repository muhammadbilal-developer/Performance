import CategoriesClient from "./CategoriesClient";
import Breadcrumbs from "@/components/ui/breadcrumbs";

export const metadata = {
  title: "Categories | Admin",
};

export default function CategoriesPage() {
  return (
    <main>
      <Breadcrumbs items={[{ label: "Admin", href: "/admin" }, { label: "Categories" }]} />
      <h1 className="mb-4 text-3xl font-bold text-zinc-100">Categories</h1>
      <p className="mb-6 text-zinc-500">Manage article categories for publishing workflows.</p>
      <CategoriesClient />
    </main>
  );
}
