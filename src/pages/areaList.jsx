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
import { userService } from "@/services/user.service";
import { Loader2 } from 'lucide-react';
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

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
  const [isEditFormLoading, setIsEditFormLoading] = useState(false);
  const [isDeleteFormLoading, setIsDeleteFormLoading] = useState(false)
  const [isAssignAdminFormLoading, setIsAssignAdminFormLoading] = useState(false)
  const [isAssignDoctorFormLoading, setIsAssignDoctorFormLoading] = useState(false)

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isAssignAdminDialogOpen, setIsAssignAdminDialogOpen] = useState(false);
  const [isAssignDoctorDialogOpen, setIsAssignDoctorDialogOpen] = useState(false);

  const [selectedArea, setSelectedArea] = useState(null);
  const [editForm, setEditForm] = useState({
      name: "",
      description: "",
  });
  const [selectedAdmin, setSelectedAdmin] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [editFormId, setEditFormId] = useState("")
  const [adminUsers, setAdminUsers] = useState([]); 
  const [doctorUsers, setDoctorUsers] = useState([]); 
  const [openAdminCombobox, setOpenAdminCombobox] = useState(false);
  const [openDoctorCombobox, setOpenDoctorCombobox] = useState(false);

  const [error, setError] = useState(null);

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

  useEffect(() => {
    if (isAssignAdminDialogOpen) {
      loadAdminUsers();
    }
  }, [isAssignAdminDialogOpen]);

  useEffect(() => {
    if (isAssignDoctorDialogOpen) {
      loadDoctorUsers();
    }
  }, [isAssignDoctorDialogOpen]);

  async function loadAdminUsers() {
    try {
      const response = await userService.getUsers();
      const users = response.users || response;
      const adminUsers = Array.isArray(users) ? users.filter(user => user.role === 'admin') : [];
      setAdminUsers(adminUsers);
    } catch (error) {
      console.error('Admin kullanıcıları yükleme hatası:', error);
      setAdminUsers([]); 
    }
  }
  
  async function loadDoctorUsers() {
    try {
      const response = await userService.getUsers();
      const users = response.users || response;
      const doctorUsers = Array.isArray(users) ? users.filter(user => user.role === 'doctor') : [];
      setDoctorUsers(doctorUsers);
      console.log('Doktor kullanıcıları:', doctorUsers);
      
    } catch (error) {
      console.error('Doktor kullanıcıları yükleme hatası:', error);
      setDoctorUsers([]); 
    }
  }

  const handleEdit = (area) => {
    setSelectedArea(area);
    setEditForm({
      name: area.name,
      description: area.description,
    });
    setEditFormId(area.id);
    setIsEditDialogOpen(true);
  };

  const handleDelete = (area) => {
    setSelectedArea(area);
    setEditFormId(area.id);
    setIsDeleteDialogOpen(true);
  };

  const openAssignAdminDialog = (area) => {
    setEditFormId(area.id);
    setSelectedAdmin("");
    setIsAssignAdminDialogOpen(true);
  };

  const openAssignDoctorDialog = (area) => {
    setEditFormId(area.id);
    setSelectedDoctor("");
    setIsAssignDoctorDialogOpen(true);
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

  const handleAssignAdmin = async () => {
    if (!selectedAdmin) return;
    
    setIsAssignAdminFormLoading(true);
    try {
      await areaService.assignAdmin(editFormId, { user_id: selectedAdmin });
      setIsAssignAdminDialogOpen(false);
      setIsAssignAdminFormLoading(false);
      setSelectedAdmin("");
      getAreas();
    } catch (error) {
      console.error('Bölgeye admin ekleme hatası:', error);
      setIsAssignAdminFormLoading(false);
    }
  };

  const handleAssignDoctor = async () => {
    if (!selectedDoctor) return;
    
    setIsAssignDoctorFormLoading(true);
    try {
      await areaService.assignDoctor(editFormId, { user_id: selectedDoctor });
      setIsAssignDoctorDialogOpen(false);
      setIsAssignDoctorFormLoading(false);
      getAreas();
    } catch (error) {
      console.error('Bölgeye doktor ekleme hatası:', error);
      setIsAssignDoctorFormLoading(false);
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
                        <DropdownMenuItem 
                          onClick={() => openAssignAdminDialog(area)}
                        >
                          Bölgeye Admin Ekle
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => openAssignDoctorDialog(area)}
                        >
                          Bölgeye Doktor Ekle
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
                      {area.admins?.length}
                    </p>
                    <p className="text-sm">
                      <span className="font-semibold">Doktor Sayısı:</span>{" "}
                      {area.doctors?.length}
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

      <Dialog open={isAssignAdminDialogOpen} onOpenChange={setIsAssignAdminDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Bölgeye Admin Ekle</DialogTitle>
            <DialogDescription>
              Bölgeye atamak istediğiniz admin kullanıcısını seçin.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Admin Seç</Label>
              <div className="col-span-3">
                <Popover open={openAdminCombobox} onOpenChange={setOpenAdminCombobox}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={openAdminCombobox}
                      className="w-full justify-between"
                    >
                      {selectedAdmin
                        ? adminUsers.find((user) => user.id === selectedAdmin)?.email || "Admin seçin..."
                        : "Admin seçin..."}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Command>
                      <CommandInput placeholder="Admin ara..." />
                      <CommandEmpty>Admin bulunamadı.</CommandEmpty>
                      <CommandList>
                        <CommandGroup>
                          {adminUsers && adminUsers.length > 0 ? (
                            adminUsers.map((user) => (
                              <CommandItem
                                key={user.id}
                                value={user.email}
                                onSelect={() => {
                                  setSelectedAdmin(user.id);
                                  setOpenAdminCombobox(false);
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    selectedAdmin === user.id ? "opacity-100" : "opacity-0"
                                  )}
                                />
                                {user.email}
                              </CommandItem>
                            ))
                          ) : (
                            <CommandItem disabled>Yüklenirken...</CommandItem>
                          )}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={() => {
                setIsAssignAdminDialogOpen(false);
                setSelectedAdmin("");
              }}
              variant="outline"
            >
              İptal
            </Button>
            <Button
              onClick={handleAssignAdmin}
              disabled={isAssignAdminFormLoading || !selectedAdmin}
            >
              {isAssignAdminFormLoading ? "Ekleniyor..." : "Ekle"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isAssignDoctorDialogOpen} onOpenChange={setIsAssignDoctorDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Bölgeye Doktor Ekle</DialogTitle>
            <DialogDescription>
              Bu bölgeye yeni bir doktor ekleyin.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Doktor</Label>
              <div className="col-span-3">
                <Popover open={openDoctorCombobox} onOpenChange={setOpenDoctorCombobox}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-between"
                    >
                      {selectedDoctor ? doctorUsers.find((user) => user.id === selectedDoctor)?.email : "Doktor seçin..."}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Command>
                      <CommandInput placeholder="Doktor ara..." />
                      <CommandEmpty>Doktor bulunamadı.</CommandEmpty>
                      <CommandList>
                        <CommandGroup>
                          {doctorUsers && doctorUsers.length > 0 ? (
                            doctorUsers.map((user) => (
                              <CommandItem
                                key={user.id}
                                value={user.email}
                                onSelect={() => {
                                  setSelectedDoctor(user.id);
                                  setOpenDoctorCombobox(false);
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    selectedDoctor === user.id ? "opacity-100" : "opacity-0"
                                  )}
                                />
                                {user.email}
                              </CommandItem>
                            ))
                          ) : (
                            <CommandItem disabled>Yüklenirken...</CommandItem>
                          )}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={() => {
                setIsAssignDoctorDialogOpen(false);
                setSelectedDoctor("");
              }}
              variant="outline"
            >
              İptal
            </Button>
            <Button
              onClick={handleAssignDoctor}
              disabled={isAssignDoctorFormLoading || !selectedDoctor}
            >
              {isAssignDoctorFormLoading ? "Ekleniyor..." : "Ekle"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AreaList;