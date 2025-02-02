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
import { Loader2 } from 'lucide-react';

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
  const [isLoading, setIsLoading] = useState(false); 
  const [error, setError] = useState(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedArea, setSelectedArea] = useState(null);
    const [editForm, setEditForm] = useState({
      name: "",
      description: "",
      // hospitals: 0,
      // activeStatus: true,
  });
  const [editFormId, setEditFormId] = useState("")
  const [isEditFormLoading, setIsEditFormLoading] = useState(false);
  const [isDeleteFormLoading, setIsDeleteFormLoading] = useState(false)

  async function getAreas() {
    setIsLoading(true);
    try {
      const areas = await areaService.getAreas();
      console.log('Bölge Listesi:', areas);
      setData(areas);
    } catch (error) {
      setError(err.message);
      console.error('Hata:', error);
    } finally {
      setIsLoading(false);
    }
  } 
  useEffect(() => {
    getAreas();
  }, []);

  const handleEdit = (area) => {
    setSelectedArea(area);
    setEditForm({
      name: area.name,
      description: area.description,
      // hospitals: area.hospitals,
      // activeStatus: area.activeStatus,
    });
    setEditFormId(area.id);
    setIsEditDialogOpen(true);
  };

  const handleDelete = (area) => {
    setSelectedArea(area);
    setEditFormId(area.id);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async() => {
    setIsDeleteFormLoading(true)
    try {
      await areaService.deleteArea(editFormId);
      setIsDeleteDialogOpen(false);
      setIsDeleteFormLoading(false);
      // Güncellemeden sonra listeyi yenile
      getAreas();
    } catch (error) {
      console.error('Bölge silme hatası:', error);
    }
    console.log("Silinen bölge ID:", editFormId);
    setIsDeleteDialogOpen(false);
  };

  const handleSaveEdit = async () => {
    setIsEditFormLoading(true)
    try {
      const formData = new FormData();
      formData.append('name', editForm.name);
      formData.append('description', editForm.description);
      
      await areaService.updateArea(formData, editFormId);
      setIsEditDialogOpen(false);
      setIsEditFormLoading(false);
      // Güncellemeden sonra listeyi yenile
      getAreas();
    } catch (error) {
      console.error('Bölge güncelleme hatası:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Bölge Listesi</h1>
        </div>
        <div className="flex justify-center items-center h-full">
          <Loader2 className="h-6 w-6 animate-spin text-gray-500 mx-auto" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500">
        Hata: {error}
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Bölge Listesi</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {
          // isLoading ? (
          //   <div className="flex justify-center items-center w-lg absolute">
          //     <Loader2 className="h-6 w-6 animate-spin text-gray-500 mx-auto" />
          //   </div>
          // ) : 
          (
            data.map((area) => (
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
            ))
          )
        }
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
              <Label htmlFor="description" className="text-right">
                Bölge Açıklaması
              </Label>
              <Input
                id="description"
                value={editForm.description}
                onChange={(e) =>
                  setEditForm({ ...editForm, description: e.target.value })
                }
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              İptal
            </Button>
            <Button onClick={handleSaveEdit} disabled={isEditFormLoading}>
              {isEditFormLoading ? "Kaydediliyor..." : "Kaydet"}
            </Button>
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
            <Button variant="destructive" onClick={handleConfirmDelete} disabled={isDeleteFormLoading}>
              {isDeleteFormLoading ? "Siliniyor..." : "Sil"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AreaList;