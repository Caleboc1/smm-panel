import { Zap } from 'lucide-react';
import Link from 'next/link';
import { SidebarRoutes } from './SidebarRoutes';

const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || 'SMMPanel';

export function DashboardSidebar() {
  return (
    <div className="w-64 h-full min-h-screen border-r border-gray-200 flex flex-col bg-white">
      {/* Logo */}
      <div className="h-16 px-6 border-b border-gray-100 flex items-center flex-shrink-0">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg">
          <div className="w-7 h-7 rounded-lg bg-violet-600 flex items-center justify-center">
            <Zap className="w-3.5 h-3.5 text-foreground" />
          </div>
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