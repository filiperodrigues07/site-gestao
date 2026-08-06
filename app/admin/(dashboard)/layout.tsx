import { getCurrentUser } from "@/lib/auth/dal";
import { SidebarNav } from "@/components/admin/sidebar-nav";

// Nunca cachear/pré-renderizar o painel admin: cada request precisa
// reavaliar a sessão em tempo real, senão o Next pode servir de cache
// um redirect de "sem sessão" gerado durante o build.
export const dynamic = "force-dynamic";

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  return (
    <div className="flex min-h-screen">
      <SidebarNav currentUserName={user.name} />
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
