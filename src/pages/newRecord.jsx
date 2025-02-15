import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { areaService } from "@/services/area.service";
import { recordsService } from "@/services/records.service";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

export default function NewRecord() {
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [areas, setAreas] = useState([]);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [isDetailsLoading, setIsDetailsLoading] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [detailFields, setDetailFields] = useState([]);
  const [newDetailName, setNewDetailName] = useState("");
  const [newDetailType, setNewDetailType] = useState("");
  const [newDetailValue, setNewDetailValue] = useState("");

  const [selectedField, setSelectedField] = useState(null);
  const [fieldValue, setFieldValue] = useState("");
  const [editingValue, setEditingValue] = useState(null);

  const [isDeleteValueInRecordLoading, setIsDeleteValueInRecordLoading] = useState(false);
  const [isUpdateValueInRecordLoading, setIsUpdateValueInRecordLoading] = useState(false);
  const [isAddingDetailLoading, setIsAddingDetailLoading] = useState(false);

  const [availableFields, setAvailableFields] = useState([]);

  const getAreas = async () => {
    try {
      const areas = await areaService.getAreas();
      setAreas(areas);
    } catch (error) {
      console.error('Hata:', error);
    }
  }

  async function getAvailableFields() {
    try {
      const fields = await recordsService.getFields();
      setAvailableFields(fields);
      console.log('Kayıt Detay Listesi:', fields);
      
    } catch (error) {
      console.error('Alan listesi alınamadı:', error);
    }
  }

  // Bölge listesi alınıyor
  useEffect(() => {
    getAreas();
    getAvailableFields();
  }, []);

  const handleFieldSelect = (field) => {
    setSelectedField(field);
    setFieldValue("");
  };

  // Form doğrulama şeması
  const formSchema = z.object({
    name: z.string().min(2, {
      message: "Kayıt adı en az 2 karakter olmalıdır.",
    }),
    region: z.string({
      required_error: "Lütfen bir bölge seçiniz",
    }).refine((value) => areas.some(area => area.id === value), {
      message: "Lütfen geçerli bir bölge seçiniz",
    })
  });

  // Form tanımlaması
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",  
      region: "",
    },
  });

  // Kayıt Ekleme işlemi
  async function onSubmit(values) {
    setIsLoading(true);
    try {
      console.log('Form değerleri:', values);
      const response = await recordsService.createNewRecord(
        values.name,
        values.region
      );
      console.log('Kayıt oluşturuldu:', response);
      setSelectedPatient(response); // Oluşturulan kaydı selectedPatient'a ata
      setShowDetailsDialog(true); // Detay diyaloğunu göster
    } catch (error) {
      console.error("Kayıt oluşturma hatası:", error);
      alert(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  // Kayıt Detayı İşlemleri
  const handleAddValue = async () => {
    setIsAddingDetailLoading(true);
    if (!selectedField || !fieldValue) {
      setIsAddingDetailLoading(false);
      return;
    }

    try {
      const field = {
        field_id: selectedField.id,
        fieldValue: selectedField.field_type === 'boolean' ? fieldValue === 'true' : fieldValue
      };

      await recordsService.addValueToRecord(selectedPatient.id, field);

      // Değerleri sıfırla
      setSelectedField(null);
      setFieldValue("");
      setIsAddingDetailLoading(false);
      
      // Kayıt detaylarını yenile
      const updatedRecord = await recordsService.getRecord(selectedPatient.id);
      setDetailFields(updatedRecord.values || []);
    } catch (error) {
      setIsAddingDetailLoading(false);
    }
  };

  const handleUpdateValue = async (valueId) => {
    if (!editingValue?.value) return;
    setIsUpdateValueInRecordLoading(true);
    try {
      await recordsService.updateValueInRecord(selectedPatient.id, valueId, editingValue.value);
      // Kayıt detaylarını yenile
      const updatedRecord = await recordsService.getRecord(selectedPatient.id);
      setDetailFields(updatedRecord.values || []);
      setEditingValue(null);
      setIsUpdateValueInRecordLoading(false);
      //getRecords();
    } catch (error) {
      console.error('Değer güncellenemedi:', error);
      setIsUpdateValueInRecordLoading(false);
    }
  };

  const handleDeleteValue = async (valueId) => {
    setIsDeleteValueInRecordLoading(true);
    try {
      await recordsService.deleteValueInRecord(selectedPatient.id, valueId);
      // Kayıt detaylarını yenile
      const updatedRecord = await recordsService.getRecord(selectedPatient.id);
      setDetailFields(updatedRecord.values || []);
      setIsDeleteValueInRecordLoading(false);
    } catch (error) {
      console.error('Değer silinemedi:', error);
      setIsDeleteValueInRecordLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium">Yeni Kayıt Ekle</h3>
          <p className="text-sm text-muted-foreground">
            Sisteme yeni bir kayıt eklemek için formu doldurun.
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kayıt Adı</FormLabel>
                  <FormControl>
                    <Input placeholder="Kayıt adı" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="region"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bölge</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Bölge seçiniz" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                    {areas.map((area) => (
                        <SelectItem key={area.id} value={area.id}>
                          {area.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Kaydediliyor..." : "Kaydet"}
            </Button>
          </form>
        </Form>
      </div>

      {/* Record Details Dialog */}

      {/* Record Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="sm:max-w-3xl w-[95vw]">
          <DialogHeader>
            <DialogTitle>Kayıt Detayları</DialogTitle>
            <DialogDescription>
              {selectedPatient?.name} isimli kaydın detayları
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {/* Mevcut Detaylar */}
            <div className="space-y-4">
              <h4 className="font-medium">Mevcut Detaylar</h4>
              <div className="space-y-4 max-h-[40vh] overflow-y-auto pr-2">
                {detailFields.map((detail, index) => (
                  <div key={index} className="mb-4 p-4 border rounded-lg">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2">
                      <h3 className="font-semibold text-base">{detail.field_name}</h3>
                      <div className="flex gap-2 mt-2 sm:mt-0">
                        {editingValue?.id === detail.id ? (
                          <>
                            <Button
                              variant="secondary"
                              size="sm"
                              onClick={() => handleUpdateValue(detail.id)}
                              disabled={isUpdateValueInRecordLoading}
                            >
                              {isUpdateValueInRecordLoading ? 'Kaydediliyor...' : 'Kaydet'}
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setEditingValue(null)}
                            >
                              İptal
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button
                              variant="secondary"
                              size="sm"
                              onClick={() => setEditingValue(detail)}
                            >
                              Güncelle
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDeleteValue(detail.id)}
                              disabled={isDeleteValueInRecordLoading}
                            >
                              {isDeleteValueInRecordLoading ? 'Siliniyor...' : 'Sil'}
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="bg-gray-50 p-2 rounded mb-2">
                      {editingValue?.id === detail.id ? (
                        detail.field_type === 'boolean' ? (
                          <Select
                            //defaultValue={editingValue.value.toString()}
                            value={editingValue.value === "true" ? 'true' : 'false'}
                            onValueChange={(value) => {
                              console.log('Selected value:', value);
                              setEditingValue({
                                ...editingValue,
                                value: value.toString() 
                              });
                            }}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue>
                                {editingValue.value ==="true" ? 'Evet' : 'Hayır'}
                              </SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="true">Evet</SelectItem>
                              <SelectItem value="false">Hayır</SelectItem>
                            </SelectContent>
                          </Select>
                        ) : detail.field_type === 'integer' ? (
                          <Input
                            type="number"
                            value={editingValue.value}
                            onChange={(e) => setEditingValue({...editingValue, value: parseInt(e.target.value)})}
                          />
                        ) : (
                          <Input
                            type="text"
                            value={editingValue.value}
                            onChange={(e) => setEditingValue({...editingValue, value: e.target.value})}
                          />
                        )
                      ) : (
                        <p className="text-sm">
                          {detail.field_type === 'boolean' 
                            ? (detail.value === "true" ? 'Evet' : 'Hayır')
                            : detail.value
                          }
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2 text-sm text-gray-500 mb-2">
                      <span>Oluşturulma: {new Date(detail.created_at).toLocaleString()}</span>
                      <span className="hidden sm:inline">•</span>
                      <span>Oluşturan: {detail.created_by}</span>
                    </div>
                    
                  </div>
                ))}
              </div>
            </div>

            {/* Yeni Detay Ekleme */}
            <div className="space-y-4">
              <h4 className="font-medium">Yeni Detay Ekle</h4>
              <div className="space-y-2">
                <Select onValueChange={(value) => handleFieldSelect(availableFields.find(f => f.id === value))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Alan seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableFields.map((field) => (
                      <SelectItem key={field.id} value={field.id}>
                        {field.field_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {selectedField && (
                  <div className="space-y-2">
                    <Label>Değer</Label>
                    {selectedField.field_type === 'boolean' ? (
                      <Select
                        value={fieldValue}
                        onValueChange={setFieldValue}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Seçiniz" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="true">Evet</SelectItem>
                          <SelectItem value="false">Hayır</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <Input
                        type={selectedField.field_type === 'integer' ? 'number' : 'text'}
                        value={fieldValue}
                        onChange={(e) => setFieldValue(e.target.value)}
                      />
                    )}
                    <Button onClick={handleAddValue} disabled={isAddingDetailLoading}>
                      {isAddingDetailLoading ? 'Ekleniyor...' : 'Ekle'}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
