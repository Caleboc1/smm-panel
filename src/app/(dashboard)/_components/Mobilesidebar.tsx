// components/MobileSidebar.tsx
'use client';

import { LayoutDashboard, ShoppingCart, ClipboardList, Wallet, Package, Users, Globe } from 'lucide-react';
import Link from "next/link";
import { usePathname } from "next/navigation";

const getUserRoutes = () => [
  {
    icon: LayoutDashboard,
    label: "Overview",
    href: "/dashboard",
  },
  {
    icon: ShoppingCart,
    label: "New Order",
    href: "/dashboard/new-order",
  },
  {
    icon: ClipboardList,
    label: "Orders",
    href: "/dashboard/orders",
  },
  {
    icon: Wallet,
    label: "Wallet",
    href: "/dashboard/wallet",
  },
];

const getAdminRoutes = () => [
  {
    icon: LayoutDashboard,
    label: "Overview",
    href: "/admin",
  },
  {
    icon: Package,
    label: "Services",
    href: "/admin/services",
  },
  {
    icon: ShoppingCart,
    label: "Orders",
    href: "/admin/orders",
  },
  {
    icon: Users,
    label: "Users",
    href: "/admin/users",
  },
  {
    icon: Globe,
    label: "Peakerr",
    href: "/admin/upstream",
  },
];

export const MobileSidebar = () => {
  const pathname = usePathname();
  const isAdminArea = pathname?.startsWith('/admin');
  
  const routes = isAdminArea ? getAdminRoutes() : getUserRoutes();

  // Hide on desktop, show on mobile
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-gray-200 bg-white dark:bg-gray-900 dark:border-gray-700 shadow-lg">
      <div className="flex justify-around items-center py-2 px-2">
        {routes.map((route) => {
          const Icon = route.icon;
          const isActive = pathname === route.href;
          
          return (
            <Link
              key={route.href}
              href={route.href}
              className={`flex flex-col items-center p-2 rounded-lg transition-all duration-200 min-w-16e ${
                isActive 
                  ? 'text-violet-600 bg-violet-50 dark:bg-violet-950/50' 
                  : 'text-gray-500 hover:text-violet-600 dark:text-gray-400 dark:hover:text-violet-400'
              }`}
            >
              <Icon 
                className={`h-5 w-5 ${isActive ? 'stroke-violet-600' : 'stroke-current'}`}
              />
              <span className="text-xs mt-1 font-medium">{route.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};