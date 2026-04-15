import AdminDashboardClient from "./AdminDashboardClient";

export const metadata = {
  title: "Admin Dashboard | Calculator Insight Hub",
};

export default function AdminHomePage() {
  return (
    <main>
      <h1 className="mb-4 text-3xl font-bold text-zinc-100">Dashboard</h1>
      <p className="mb-6 text-zinc-500">Realtime analytics powered by Redis + MongoDB.</p>
      <AdminDashboardClient />
    </main>
  );
}
