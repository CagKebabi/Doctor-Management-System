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

export default function BannersPage() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
                      <DropdownMenuItem>
                        Düzenle
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">
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
      <div className="flex justify-center items-center h-full">
        <Loader2 className="h-8 w-8 animate-spin" />
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
        <h1 className="text-3xl font-bold">Banner Listesi</h1>
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
    </div>
  );
}
