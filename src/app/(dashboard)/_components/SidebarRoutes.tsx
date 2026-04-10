'use client';

import { LayoutDashboard, ShoppingCart, ClipboardList, Wallet, Code, Settings, LogOut } from 'lucide-react';
import { SidebarItem } from './SidebarItem';
import { signOut, useSession } from 'next-auth/react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { formatNGN } from '@/lib/utils';
import { useEffect, useState } from 'react';

const mainRoutes = [
  { icon: LayoutDashboard, label: 'Overview',   href: '/dashboard' },
  { icon: ShoppingCart,    label: 'New Order',  href: '/dashboard/new-order' },
  { icon: ClipboardList,   label: 'My Orders',  href: '/dashboard/orders' },
  { icon: Wallet,          label: 'Wallet',     href: '/dashboard/wallet' },
  { icon: Code,            label: 'API Access', href: '/dashboard/api' },
];

const actionRoutes = [
  { icon: Settings, label: 'Settings', href: '/dashboard/settings' },
  { icon: LogOut,   label: 'Sign Out', href: undefined as string | undefined },
];

function getInitials(name: string) {
  const words = name.split(' ').filter(Boolean);
  if (words.length === 0) return 'U';
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
}

export function SidebarRoutes() {
  const { data: session } = useSession();
  const [balance, setBalance] = useState<number | null>(null);

  useEffect(() => {
    fetch('/api/user').then(r => r.json()).then(d => setBalance(d?.balance ?? 0));
  }, []);

  const name = session?.user?.name || session?.user?.email || 'User';

  const updatedActionRoutes = actionRoutes.map(route =>
    route.label === 'Sign Out'
      ? { ...route, onClick: () => signOut({ callbackUrl: '/' }), href: undefined }
      : route
  );

  return (
    <div className="flex flex-col w-full h-full">
      {/* Main nav */}
      <div className="flex flex-col w-full">
        {mainRoutes.map(route => (
          <SidebarItem
            key={route.href}
            icon={route.icon}
            label={route.label}
            href={route.href}
          />
        ))}
      </div>

      {/* Push action routes to bottom */}
      <div className="mt-auto w-full">
        <div className="w-full border-t border-gray-100 pt-2">
          {updatedActionRoutes.map(route => (
            <SidebarItem
              key={route.label}
              icon={route.icon}
              label={route.label}
              href={route.href}
              onClick={(route as any).onClick}
            />
          ))}
        </div>

        {/* User card at bottom */}
        <div className="flex items-center gap-3 px-6 py-4 border-t border-gray-100 mt-2">
          <Avatar className="w-9 h-9">
            <AvatarFallback className="bg-violet-100 text-violet-700 text-sm font-bold">
              {getInitials(name)}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">{name}</p>
            {balance !== null && (
              <p className="text-xs text-emerald-600 font-mono">{formatNGN(balance)}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}