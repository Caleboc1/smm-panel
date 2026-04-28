import { Zap } from 'lucide-react';
import Link from 'next/link';
import { SidebarRoutes } from './SidebarRoutes';
import Image from 'next/image';

const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || 'SMMPanel';

export function DashboardSidebar() {
  return (
    <div className="w-64 h-full min-h-screen border-r border-gray-200 flex flex-col bg-white">
      {/* Logo */}
      <div className="h-16 px-6 border-b border-gray-100 flex items-center shrink-0">
        <Link href="/" className="flex items-center font-bold text-lg">
         <Image src={"/CalebSmmLogo.png"} alt="Logo" width={50} height={50} className="rounded-full" />
          
          <span className="text-gray-900">{APP_NAME}</span>
        </Link>
      </div>

      {/* Nav routes */}
      <div className="flex flex-col flex-1 overflow-y-auto">
        <SidebarRoutes />
      </div>
    </div>
  );
}