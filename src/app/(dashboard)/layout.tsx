import { ReactNode } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/toaster";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Toaster />
      <SidebarProvider>
        <AppSidebar />
        <main className="w-full h-full relative">
          <div className="absolute top-2 left-2 z-[100]">
            <SidebarTrigger />
          </div>
          {children}
        </main>
      </SidebarProvider>
    </>
  );
}
