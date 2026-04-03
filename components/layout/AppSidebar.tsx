'use client';

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import {
  ClipboardList,
  CreditCard,
  FolderKanban,
  LayoutDashboard,
  Settings,
  ShieldCheck,
  Users,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useProfileQuery } from '@/services';

const items = [
  {
    title: 'Dashboard',
    url: '/',
    icon: LayoutDashboard,
  },
  {
    title: 'Projects',
    url: '/projects',
    icon: FolderKanban,
  },
  {
    title: 'Clients',
    url: '/clients',
    icon: Users,
  },
  {
    title: 'Settings',
    url: '/settings',
    icon: Settings,
  },
  {
    title: 'Users',
    url: '/settings/users',
    icon: ShieldCheck,
    adminOnly: true,
  },
  {
    title: 'Payments',
    url: '/payments',
    icon: CreditCard,
    adminOnly: true,
  },
  {
    title: 'Activity',
    url: '/settings/activity',
    icon: ClipboardList,
    adminOnly: true,
  },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { data: currentUser } = useProfileQuery();

  const visibleItems = items.filter((item) => {
    if (!item.adminOnly) {
      return true;
    }
    return currentUser?.role === 'ADMIN';
  });

  return (
    <Sidebar className="border-r border-border bg-sidebar">
      <SidebarContent>
        <div className="p-6">
          <h1 className="text-xl font-bold tracking-tight">ARCHI.FLOW</h1>
        </div>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {visibleItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={pathname === item.url}>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
