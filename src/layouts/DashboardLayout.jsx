import * as React from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { AppSidebar } from "@/components/app-sidebar";
import DarkmodeSwitchBtn from "@/components/darkmode-switch-btn";
import NotificationNavigation from "@/components/notification-navigation";
import { generateBreadcrumbs } from "@/utils/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { ImageDialog } from "@/components/image-dialog";
import { useState } from "react";

export default function DashboardLayout() {
  const location = useLocation();
  const breadcrumbs = generateBreadcrumbs(location.pathname);
  const [dialogOpen, setDialogOpen] = useState(true);

  return (
    <SidebarProvider>
      <AppSidebar />
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />  
        <Separator orientation="vertical" className="mr-2 h-4" />
        <div className="flex h-16 items-center justify-between flex-1">
          <nav className="flex items-center space-x-2">
            {breadcrumbs.map((crumb, index) => (
              <React.Fragment key={crumb.path}>
                {index > 0 && (
                  <svg
                    className="h-4 w-4 text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                )}
                <Link
                  to={crumb.path}
                  className={
                    index === breadcrumbs.length - 1
                      ? "text-foreground font-medium"
                      : "text-muted-foreground hover:text-foreground"
                  }
                >
                  {crumb.title}
                </Link>
              </React.Fragment>
            ))}
          </nav>
          <div className="flex items-center space-x-4">
            <NotificationNavigation />
            <DarkmodeSwitchBtn />
          </div>
        </div>
      </header>
      <main className="flex-1">
        <div className="flex flex-1 flex-col gap-4 p-4">
          <Outlet />
        </div>
      </main>
      <ImageDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </SidebarInset>
    </SidebarProvider>
  );
}
