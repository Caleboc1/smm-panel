import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { DashboardTopbar } from "@/components/dashboard/DashboardTopbar";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");
  return (
    <div className="min-h-screen bg-gray-50 flex">
     
      <div className="flex-1 flex flex-col md:ml-64">
        <DashboardTopbar user={session.user} /> 
        <main className="flex-1 p-4 sm:p-6">{children}</main><DashboardSidebar />
      </div>
    </div>
  );
}
