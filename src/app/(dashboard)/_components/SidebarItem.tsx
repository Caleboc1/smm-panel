'use client';

import { cn } from '@/lib/utils';
import { usePathname, useRouter } from 'next/navigation';
import { LucideIcon } from 'lucide-react';

interface SidebarItemProps {
  icon: LucideIcon;
  label: string;
  href?: string;
  onClick?: () => void;
  disabled?: boolean;
}

export const SidebarItem = ({ icon: Icon, label, href, onClick, disabled }: SidebarItemProps) => {
  const pathname = usePathname();
  const router = useRouter();

  const isActive =
    pathname === href ||
    (href !== '/dashboard' && pathname?.startsWith(`${href}/`));

  const isLogout = label === 'Sign Out';

  const handleClick = () => {
    if (disabled) return;
    if (onClick) onClick();
    else if (href) router.push(href);
  };

  return (
    <div className={cn(
      'border-l-[3px] rounded-r-lg transition-colors duration-200',
      isActive ? 'border-l-violet-600' : 'border-l-transparent'
    )}>
      <button
        onClick={handleClick}
        type="button"
        disabled={disabled}
        className={cn(
          'flex items-center gap-x-2 text-sm font-medium pl-6 ml-3 transition-all hover:bg-gray-100 w-[90%] rounded-lg',
          isActive && 'bg-violet-50',
          isLogout ? 'text-red-500' : isActive ? 'text-violet-700' : 'text-gray-500',
          disabled && 'opacity-50 cursor-not-allowed'
        )}
      >
        <div className="flex items-center gap-x-2 py-3">
          <Icon
            className={cn(
              'w-4 h-4 transition-colors duration-200',
              isLogout ? 'text-red-500' : isActive ? 'text-violet-600' : 'text-gray-400'
            )}
          />
          {label}
        </div>
      </button>
    </div>
  );
};