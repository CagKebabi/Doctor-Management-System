import { useState, useRef, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { notificationService } from "@/services/notification.service";
import { List, AutoSizer, CellMeasurer, CellMeasurerCache } from 'react-virtualized';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const loaderRef = useRef(null);
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState("all");

  // CellMeasurer için cache oluştur
  const cache = useRef(
    new CellMeasurerCache({
      fixedWidth: true,
      defaultHeight: 200,
      minHeight: 150,
    })
  );

  async function getNotifications() {
    setLoading(true);
    try {
      const response = await notificationService.getNotifications();
      if (response && Array.isArray(response)) {
        setNotifications(response.reverse())      
        console.log('Bildirimler:', notifications);
      }
      return [];
    } catch (error) {
      console.error('Hata:', error);
      return [];
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getNotifications()
  }, [])

  // Card bileşeni render fonksiyonu
  const renderCard = ({ index, key, style, parent }) => {
    const notification = notifications[index];
    
    return (
      <CellMeasurer
        cache={cache.current}
        columnIndex={0}
        key={key}
        parent={parent}
        rowIndex={index}
      >
        {({ measure, registerChild }) => (
          <div ref={registerChild} style={style}>
            <Card
              className={`mb-4 ${notification.isRead ? "bg-gray-50 dark:bg-gray-800/50" : ""}`}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">{notification.content}</CardTitle>
                    <CardDescription className="text-sm text-gray-500">
                      {new Date(notification.created_at).toLocaleString()}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm">
                  <span className="font-semibold">Bölge:</span>{" "}
                  {notification.region_name}
                </p>
                <p className="text-sm">
                  <span className="font-semibold">Oluşturan:</span>{" "}
                  {notification.sender}
                </p>
              </CardContent>
            </Card>
          </div>
        )}
      </CellMeasurer>
    );
  };

  // Liste yüksekliğini pencere yüksekliğine göre ayarla
  const getListHeight = () => {
    if (typeof window !== 'undefined') {
      return window.innerHeight - 200; // Header ve diğer içerikler için boşluk bırak
    }
    return 600; // Varsayılan yükseklik
  };

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Bildirimler</h1>
        {/* <div className="flex items-center gap-4">
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filtrele" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tümü</SelectItem>
              <SelectItem value="unread">Okunmamış</SelectItem>
              <SelectItem value="read">Okunmuş</SelectItem>
            </SelectContent>
          </Select>
        </div> */}
      </div>

      <div style={{ height: getListHeight() }}>
        {notifications.length > 0 ? (
          <AutoSizer>
            {({ width, height }) => (
              <List
                width={width}
                height={height}
                rowCount={notifications.length}
                rowHeight={cache.current.rowHeight}
                rowRenderer={renderCard}
                overscanRowCount={3}
                deferredMeasurementCache={cache.current}
              />
            )}
          </AutoSizer>
        ) : (
          <div className="text-center py-4">
            {loading ? (
              <Loader2 className="h-6 w-6 animate-spin text-gray-500 mx-auto" />
            ) : (
              "Bildirim bulunamadı"
            )}
          </div>
        )}
      </div>
    </div>
  );
}
