import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { DashboardTopbar } from "@/components/dashboard/DashboardTopbar";
import { DashboardSidebar } from "./_components/DashboardSidebar";
import { MobileSidebar } from "./_components/Mobilesidebar";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  return (
    <div className="h-full">
      <div className="h-[80px] md:pl-62.5 fixed inset-y-0 w-full z-50">
       <DashboardTopbar user={session.user} />
      </div>
      <div className=" h-full w-56 flex-col fixed inset-y-0 z-45">
       <DashboardSidebar />
      </div>
      <main className="md:pl-67 pt-[80px] h-full pb-[80px] md:pb-0 bg-[#FCFCFC] dark:bg-background" >
        {children}
      </main>
      <MobileSidebar/>
    </div>
  );
}