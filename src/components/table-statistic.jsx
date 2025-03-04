import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function TableStatistic({ data }) {
  // Toplam hasta sayısı
  const totalPatients = data?.length || 0;

  // Bölgelere göre hasta dağılımı
  const patientsByRegion = data?.reduce((acc, patient) => {
    const region = patient.region_name || "Belirsiz";
    acc[region] = (acc[region] || 0) + 1;
    return acc;
  }, {}) || {};

  // En çok hasta olan bölge
  const topRegion = Object.entries(patientsByRegion).sort((a, b) => b[1] - a[1])[0] || ["Belirsiz", 0];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card className="bg-[#EFFFFF]">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Toplam Hasta</CardTitle>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-muted-foreground"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalPatients}</div>
          <p className="text-xs text-muted-foreground">
            Sistemdeki toplam hasta sayısı
          </p>
        </CardContent>
      </Card>

      <Card className="bg-[#FEF3F3]">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Bölge Sayısı</CardTitle>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-muted-foreground"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{Object.keys(patientsByRegion).length}</div>
          <p className="text-xs text-muted-foreground">
            Hasta kaydı olan bölge sayısı
          </p>
        </CardContent>
      </Card>

      <Card className="bg-[#F3ECFE]">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">En Yoğun Bölge</CardTitle>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-muted-foreground"><path d="M3 3v18h18"></path><path d="m19 9-5 5-4-4-3 3"></path></svg>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{topRegion[1]}</div>
          <p className="text-xs text-muted-foreground">
            {topRegion[0]} bölgesindeki hasta sayısı
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
