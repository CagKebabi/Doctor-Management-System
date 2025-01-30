import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { areaService } from '@/services/area.service';

const areaData = [
  {
    id: 1,
    name: "İstanbul Avrupa",
    doctorCount: 150,
    hospitals: 25,
    activeStatus: true,
  },
  {
    id: 2,
    name: "İstanbul Anadolu",
    doctorCount: 120,
    hospitals: 20,
    activeStatus: true,
  },
  {
    id: 3,
    name: "Ankara",
    doctorCount: 80,
    hospitals: 15,
    activeStatus: true,
  },
  {
    id: 4,
    name: "İzmir",
    doctorCount: 60,
    hospitals: 12,
    activeStatus: true,
  },
];

const AreaList = () => {
  const [data, setData] = useState([]);
  async function getUsers() {
    try {
      const areas = await areaService.getAreas();
      console.log('Bölge Listesi:', areas);
      setData(areas);
    } catch (error) {
      console.error('Hata:', error);
    }
  } 
  useEffect(() => {
    getUsers();
    }, []);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedArea, setSelectedArea] = useState(null);
    const [editForm, setEditForm] = useState({
      name: "",
      doctorCount: 0,
      hospitals: 0,
      activeStatus: true,
  });

  const handleEdit = (area) => {
    setSelectedArea(area);
    setEditForm({
      name: area.name,
      doctorCount: area.doctorCount,
      hospitals: area.hospitals,
      activeStatus: area.activeStatus,
    });
    setIsEditDialogOpen(true);
  };

  const handleDelete = (area) => {
    setSelectedArea(area);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    // Burada API çağrısı yapılacak
    console.log("Silinen bölge ID:", selectedArea.id);
    setIsDeleteDialogOpen(false);
  };

  const handleSaveEdit = () => {
    // Burada API çağrısı yapılacak
    console.log("Kaydedilen değerler:", { id: selectedArea.id, ...editForm });
    setIsEditDialogOpen(false);
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Doktor Bölgeleri</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.map((area) => (
          <Card key={area.id} className="w-full">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl">{area.name}</CardTitle>
                  <CardDescription>{area.description}</CardDescription>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleEdit(area)}>
                      Düzenle
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      Detaylar
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => handleDelete(area)}
                      className="text-red-600"
                    >
                      Sil
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
              <p className="text-sm">
                  <span className="font-semibold">Oluşturulma Tarihi:</span>{" "}
                  {new Date(area.created_at).toLocaleString()}
                </p>
                <p className="text-sm">
                  <span className="font-semibold">Oluşturan Kişi:</span>{" "}
                  {area.created_by}
                </p>
                <p className="text-sm">
                  <span className="font-semibold">Admin Sayısı:</span>{" "}
                  {area.admins.length}
                </p>
                <p className="text-sm">
                  <span className="font-semibold">Doktor Sayısı:</span>{" "}
                  {area.doctors.length}
                </p>
                <p className="text-sm">
                  <span className="font-semibold">Son Güncelleme:</span>{" "}
                  {new Date(area.updated_at).toLocaleString()}
                </p>
                {/* <p className="text-sm">
                  <span className="font-semibold">Durum:</span>{" "}
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      area.activeStatus
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {area.activeStatus ? "Aktif" : "Pasif"}
                  </span>
                </p> */}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Bölge Düzenle</DialogTitle>
            <DialogDescription>
              Bölge bilgilerini güncellemek için aşağıdaki formu kullanın.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Bölge Adı
              </Label>
              <Input
                id="name"
                value={editForm.name}
                onChange={(e) =>
                  setEditForm({ ...editForm, name: e.target.value })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="doctorCount" className="text-right">
                Doktor Sayısı
              </Label>
              <Input
                id="doctorCount"
                type="number"
                value={editForm.doctorCount}
                onChange={(e) =>
                  setEditForm({
                    ...editForm,
                    doctorCount: parseInt(e.target.value),
                  })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="hospitals" className="text-right">
                Hastane Sayısı
              </Label>
              <Input
                id="hospitals"
                type="number"
                value={editForm.hospitals}
                onChange={(e) =>
                  setEditForm({
                    ...editForm,
                    hospitals: parseInt(e.target.value),
                  })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">
                Durum
              </Label>
              <div className="flex items-center space-x-2 col-span-3">
                <Switch
                  id="status"
                  checked={editForm.activeStatus}
                  onCheckedChange={(checked) =>
                    setEditForm({ ...editForm, activeStatus: checked })
                  }
                />
                <Label htmlFor="status">
                  {editForm.activeStatus ? "Aktif" : "Pasif"}
                </Label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              İptal
            </Button>
            <Button onClick={handleSaveEdit}>Kaydet</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Bölge Silme Onayı</DialogTitle>
            <DialogDescription>
              <span className="text-red-600 font-semibold">{selectedArea?.name}</span> bölgesini silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              İptal
            </Button>
            <Button variant="destructive" onClick={handleConfirmDelete}>
              Sil
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AreaList;