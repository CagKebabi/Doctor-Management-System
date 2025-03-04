import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function UserTableStatistic({ data }) {
  // Toplam kullanıcı sayısı
  const totalUsers = data?.length || 0;

  // Aktif kullanıcı sayısı
  const activeUsers = data?.filter(user => user.is_active)?.length || 0;

  // Rollere göre kullanıcı dağılımı
  const usersByRole = data?.reduce((acc, user) => {
    const role = user.role || "Belirsiz";
    acc[role] = (acc[role] || 0) + 1;
    return acc;
  }, {}) || {};

  // En çok kullanıcısı olan rol
  const topRole = Object.entries(usersByRole).sort((a, b) => b[1] - a[1])[0] || ["Belirsiz", 0];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card className="bg-[#EFFFFF]">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Toplam Kullanıcı</CardTitle>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-muted-foreground"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalUsers}</div>
          <p className="text-xs text-muted-foreground">
            Sistemdeki toplam kullanıcı sayısı
          </p>
        </CardContent>
      </Card>

      <Card className="bg-[#FEF3F3]">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Aktif Kullanıcılar</CardTitle>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-muted-foreground"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{activeUsers}</div>
          <p className="text-xs text-muted-foreground">
            Aktif durumdaki kullanıcı sayısı
          </p>
        </CardContent>
      </Card>

      <Card className="bg-[#F3ECFE]">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">En Yaygın Rol</CardTitle>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-muted-foreground"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M20 8v6M23 11h-6"></path></svg>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{topRole[1]}</div>
          <p className="text-xs text-muted-foreground">
            {topRole[0]} rolündeki kullanıcı sayısı
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
