import * as React from "react";
import { Link } from "react-router-dom";
import { SearchForm } from "@/components/search-form";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";

// This is sample data.
const data = {
  navMain: [
    {
      title: "OLUŞTUR",
      url: "#",
      items: [
        {
          title: "Yeni Kullanıcı",
          url: "/new-user",
        },
        {
          title: "Yeni Hasta",
          url: "/new-patient",
        },
        {
          title: "Yeni Bölge",
          url: "/new-area",
        },
        {
          title: "Yeni Duyuru",
          url: "/new-notification",
        },
        {
          title: "Yeni Banner",
          url: "/new-banner",
        },
      ],
    },
    {
      title: "LİSTELE",
      url: "#",
      items: [
        {
          title: "Kullanıcı Listesi",
          url: "/user-list",
        },
        {
          title: "Hasta Kayıt Listesi",
          url: "/patient-list",
        },
        {
          title: "Bölge Listesi",
          url: "/area-list",
        },
      ],
    },
  ],
};

export function AppSidebar({ ...props }) {
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <Link 
          to="/" 
          className="flex items-center gap-2 px-4 py-3 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <svg
            className="h-8 w-8 text-blue-600 dark:text-blue-400"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20.42 4.58a5.4 5.4 0 0 0-7.65 0l-.77.78-.77-.78a5.4 5.4 0 0 0-7.65 0C1.46 6.7 1.33 10.28 4 13l8 8 8-8c2.67-2.72 2.54-6.3.42-8.42z" />
          </svg>
          <div className="flex flex-col">
            <span className="text-lg font-semibold">MediCare</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">Doktor Yönetim Sistemi</span>
          </div>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        {/* We create a SidebarGroup for each parent. */}
        {data.navMain.map((item) => (
          <SidebarGroup key={item.title}>
            <SidebarGroupLabel>{item.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {item.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={item.isActive}>
                      <Link to={item.url}>{item.title}</Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
