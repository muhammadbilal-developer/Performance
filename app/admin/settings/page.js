import Breadcrumbs from "@/components/ui/breadcrumbs";
import SettingsClient from "./SettingsClient";

export const metadata = {
  title: "Settings | Admin",
};

export default function AdminSettingsPage() {
  return (
    <main>
      <Breadcrumbs items={[{ label: "Admin", href: "/admin" }, { label: "Settings" }]} />
      <h1 className="mb-4 text-3xl font-bold text-zinc-100">Settings</h1>
      <p className="mb-6 text-zinc-500">Manage logo and core branding options for your site.</p>
      <SettingsClient />
    </main>
  );
}
