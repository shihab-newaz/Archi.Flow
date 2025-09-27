'use client'

import React from 'react'
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
import AppSidebar from './Sidebar'
import Header from './Header'

interface DashboardLayoutProps {
  children: React.ReactNode
  breadcrumbs?: Array<{
    title: string
    href?: string
  }>
}

export default function DashboardLayout({ children, breadcrumbs }: DashboardLayoutProps) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <Header breadcrumbs={breadcrumbs} />
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}