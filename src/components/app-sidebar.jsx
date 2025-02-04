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
import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { authService } from "../services/auth.service";

// SuperAdmin sayfasının sidebar'i
const superadminSidebar = {
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
          title: "Yeni Kayıt",
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
        {
          title: "Banner Listesi",
          url: "/banner-list",
        }
      ],
    },
  ],
};

// Admin sayfasının sidebar'i yeni gbölge yok yeni popup yok
const adminSidebar = {
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
          title: "Yeni Kayıt",
          url: "/new-patient",
        },
        {
          title: "Yeni Duyuru",
          url: "/new-notification",
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

// User sayfasının sidebar'i yeni gbölge yok yeni popup yok
const userSidebar = {
  navMain: [
    {
      title: "OLUŞTUR",
      url: "#",
      items: [
        {
          title: "Yeni Kayıt",
          url: "/new-patient",
        },
      ],
    },
    {
      title: "LİSTELE",
      url: "#",
      items: [
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

// This is sample data.
// const data = {
//   navMain: [
//     {
//       title: "OLUŞTUR",
//       url: "#",
//       items: [
//         {
//           title: "Yeni Kullanıcı",
//           url: "/new-user",
//         },
//         {
//           title: "Yeni Kayıt",
//           url: "/new-patient",
//         },
//         {
//           title: "Yeni Bölge",
//           url: "/new-area",
//         },
//         {
//           title: "Yeni Duyuru",
//           url: "/new-notification",
//         },
//         {
//           title: "Yeni Banner",
//           url: "/new-banner",
//         },
//       ],
//     },
//     {
//       title: "LİSTELE",
//       url: "#",
//       items: [
//         {
//           title: "Kullanıcı Listesi",
//           url: "/user-list",
//         },
//         {
//           title: "Hasta Kayıt Listesi",
//           url: "/patient-list",
//         },
//         {
//           title: "Bölge Listesi",
//           url: "/area-list",
//         },
//         {
//           title: "Banner Listesi",
//           url: "/banner-list",
//         }
//       ],
//     },
//   ],
// };

export function AppSidebar({ ...props }) {
  const [userEmail, setUserEmail] = useState("");
  const [formData, setFormData] = useState({
    refresh: localStorage.getItem('refreshToken'),
  });
  const userRole = localStorage.getItem('role');
  const [data, setData] = useState({});

  const navigate = useNavigate();

  useEffect(() => {
    if (userRole === "superadmin") {
      setData(superadminSidebar);
    } 
    else if (userRole === "admin") {
      setData(adminSidebar);
    }
    else {
      setData(userSidebar);
    }
  }, [userRole]);

  useEffect(() => {
    // Kullanıcı giriş yapmamışsa login sayfasına yönlendir
    if (!authService.isAuthenticated()) {
      navigate("/login");
    }
  }, [navigate]);

  // Kullanıcı giriş yapmamışsa null döndür (sayfa içeriğini gösterme)
  if (!authService.isAuthenticated()) {
    return null;
  }
  useEffect(() => {
    const email = localStorage.getItem('userEmail');
    if (email) {
      setUserEmail(email);
    }
  }, []);

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };
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
      <SidebarContent className="justify-between">
        <div>
        {/* We create a SidebarGroup for each parent. */}
        {data.navMain?.map((item) => (
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
        </div>
        <Card className="mx-4 mb-4">
        <CardContent className="p-4 flex flex-col gap-2">
          <div className="text-sm text-muted-foreground truncate">
            {userEmail}
          </div>
          <Button 
            variant="destructive" 
            size="sm" 
            onClick={handleLogout}
            className="w-full"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Çıkış Yap
          </Button>
        </CardContent>
      </Card>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
