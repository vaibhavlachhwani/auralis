import { AppSidebar } from "@/components/AppSidebar";
import { SiteHeader } from "@/components/site-header/SiteHeader";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Outlet } from "react-router-dom";

export default function MainLayout() {
  return (
    <>
      <SidebarProvider defaultOpen>
        <AppSidebar />
        <SidebarInset>
          <Outlet />
        </SidebarInset>
      </SidebarProvider>
    </>
  );
}
