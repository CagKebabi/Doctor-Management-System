import { useState, useEffect, useRef } from "react";
import { Grid, AutoSizer, CellMeasurer, CellMeasurerCache } from "react-virtualized";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Loader2 } from "lucide-react";
import { popupService } from "@/services/popup.service";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function BannersPage() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedBanner, setSelectedBanner] = useState(null);
  const [editedData, setEditedData] = useState({
    title: "",
    is_active: false
  });
  const [isEditLoading, setIsEditLoading] = useState(false);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);

  // CellMeasurer için cache oluştur
  const cache = useRef(
    new CellMeasurerCache({
      defaultHeight: 300,
      fixedWidth: true,
      keyMapper: (rowIndex, columnIndex) => `${rowIndex}-${columnIndex}`
    })
  );

  // Grid için hesaplamalar
  const getGridDimensions = (width) => {
    const minCardWidth = 300;
    const gap = 5;
    const maxColumns = 3;
    
    let columns = Math.floor((width + gap) / (minCardWidth + gap));
    columns = Math.max(1, Math.min(columns, maxColumns));
    
    const columnWidth = Math.floor((width - (columns - 1) * gap) / columns);

    return {
      columnCount: columns,
      columnWidth: columnWidth,
      rowCount: Math.ceil(banners.length / columns),
      gap: gap
    };
  };

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        setLoading(true);
        const response = await popupService.getPopups();
        setBanners(response);
      } catch (err) {
        setError(err.message);
        console.error("Banner listesi yüklenirken hata:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBanners();
  }, []);

  // Grid yeniden hesaplanması gerektiğinde cache'i temizle
  useEffect(() => {
    cache.current.clearAll();
  }, [banners]);

  // Düzenleme dialog'unu aç
  const handleEditClick = (banner) => {
    setSelectedBanner(banner);
    setEditedData({
      title: banner.title,
      is_active: banner.is_active
    });
    setEditDialogOpen(true);
  };

  // Silme dialog'unu aç
  const handleDeleteClick = (banner) => {
    setSelectedBanner(banner);
    setDeleteDialogOpen(true);    
  };

  // Değişiklikleri kaydet
  const handleSaveClick = async () => {
    setIsEditLoading(true);
    try {
      const formData = new FormData();
      formData.append('title', editedData.title);
      formData.append('is_active', editedData.is_active);

      await popupService.updatePopup(selectedBanner.id, formData);
      
      // Listeyi güncelle
      const response = await popupService.getPopups();
      setBanners(response);
      
      setEditDialogOpen(false);
      setSelectedBanner(null);
      setEditedData({
        title: "",
        is_active: false
      });
    } catch (error) {
      console.error('Banner güncelleme hatası:', error);
    } finally {
      setIsEditLoading(false);
    }
  };

  // Banner'ı sil
  const handleDeleteConfirm = async () => {
    setIsDeleteLoading(true);
    try {
      await popupService.deletePopup(selectedBanner.id);
      
      // Listeyi güncelle
      const response = await popupService.getPopups();
      setBanners(response);
      
      setDeleteDialogOpen(false);
      setSelectedBanner(null);
    } catch (error) {
      console.error('Banner silme hatası:', error);
    } finally {
      setIsDeleteLoading(false);
    }
  };

  // CellRenderer fonksiyonu
  const cellRenderer = ({ columnIndex, key, rowIndex, style, parent, width }) => {
    const dimensions = getGridDimensions(width);
    const index = rowIndex * dimensions.columnCount + columnIndex;
    const banner = banners[index];

    if (!banner) return null;

    // Grid gap'i için style'ı güncelle
    const updatedStyle = {
      ...style,
      left: parseInt(style.left) + (columnIndex * dimensions.gap),
      top: parseInt(style.top) + (rowIndex * dimensions.gap),
      width: dimensions.columnWidth - dimensions.gap,
      padding: '12px'
    };

    return (
      <CellMeasurer
        cache={cache.current}
        columnIndex={columnIndex}
        key={key}
        parent={parent}
        rowIndex={rowIndex}
      >
        {({ registerChild }) => (
          <div ref={registerChild} style={updatedStyle}>
            <Card className="h-full">
              <CardHeader className="relative">
                <img
                  src={banner.image}
                  alt={banner.title}
                  className="w-full h-48 object-cover rounded-t-lg"
                  onLoad={() => {
                    // Resim yüklendiğinde grid'i güncelle
                    cache.current.clear(rowIndex, columnIndex);
                    parent.recomputeGridSize && parent.recomputeGridSize();
                  }}
                />
                <div className="absolute top-2 right-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEditClick(banner)}>
                        Düzenle
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => handleDeleteClick(banner)}
                        className="text-red-600"
                      >
                        Sil
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-start mb-2">
                  <CardTitle className="text-xl">{banner.title}</CardTitle>
                  <Badge variant={banner.is_active ? "success" : "secondary"}>
                    {banner.is_active ? "Aktif" : "Pasif"}
                  </Badge>
                </div>
                <CardDescription>
                  Oluşturulma: {new Date(banner.created_at).toLocaleDateString()}
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        )}
      </CellMeasurer>
    );
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Popup Listesi</h1>
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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Popup Listesi</h1>
      </div>

      <div style={{ height: 'calc(100vh - 200px)' }}>
        <AutoSizer>
          {({ width, height }) => {
            const dimensions = getGridDimensions(width);
            return (
              <Grid
                scrollToPosition={0}
                cellRenderer={({ columnIndex, key, rowIndex, style, parent }) => 
                  cellRenderer({ columnIndex, key, rowIndex, style, parent, width })}
                columnCount={dimensions.columnCount}
                columnWidth={dimensions.columnWidth}
                height={height}
                rowCount={dimensions.rowCount}
                rowHeight={cache.current.rowHeight}
                deferredMeasurementCache={cache.current}
                width={width}
                style={{ outline: 'none' }}
              />
            );
          }}
        </AutoSizer>
      </div>

      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Banner Düzenle</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Başlık</Label>
              <Input
                id="title"
                value={editedData.title}
                onChange={(e) => setEditedData({ ...editedData, title: e.target.value })}
              />
            </div>
            <div className="flex items-center gap-2">
              <Switch
                id="is_active"
                checked={editedData.is_active}
                onCheckedChange={(checked) => setEditedData({ ...editedData, is_active: checked })}
              />
              <Label htmlFor="is_active">
                {editedData.is_active ? "Aktif" : "Pasif"}
              </Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              İptal
            </Button>
            <Button onClick={handleSaveClick} disabled={isEditLoading}>
              {isEditLoading ? "Kaydediliyor..." : "Kaydet"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Banner'ı Sil</AlertDialogTitle>
            <AlertDialogDescription>
              Bu banner'ı silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>İptal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={isDeleteLoading}
              className="bg-red-500 hover:bg-red-700"
            >
              {isDeleteLoading ? "Siliniyor..." : "Sil"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
