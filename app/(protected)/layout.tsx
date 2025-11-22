import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/layout/AppSidebar';

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full bg-background min-h-screen flex flex-col">
        <div className="p-4 border-b border-border flex items-center gap-4">
          <SidebarTrigger />
          <span className="text-sm text-muted-foreground">Workspace</span>
        </div>
        <div className="flex-1 p-6 overflow-auto">{children}</div>
      </main>
    </SidebarProvider>
  );
}
