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
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { notificationService } from "@/services/notification.service";

const PAGE_SIZE = 15;

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const loaderRef = useRef(null);
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState("all");

  async function getNotifications(pageNum) {
    setLoading(true);
    try {
      const response = await notificationService.getNotifications();
      if (response && Array.isArray(response)) {
        // Sayfalama için başlangıç ve bitiş indekslerini hesapla
        const startIndex = (pageNum - 1) * PAGE_SIZE;
        const endIndex = startIndex + PAGE_SIZE;
        const paginatedNotifications = response.slice(startIndex, endIndex);
        
        // Daha fazla bildirim var mı kontrol et
        setHasMore(endIndex < response.length);
        
        console.log('Bildirimler:', paginatedNotifications);
        return paginatedNotifications;
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
    getNotifications(1).then(newNotifications => {
      setNotifications(newNotifications);
      setPage(2);
    });
  }, []);
  // Simüle edilmiş API çağrısı
  // const fetchNotifications = async (pageNum) => {
  //   setLoading(true);
  //   try {
  //     // API çağrısını simüle ediyoruz
  //     await new Promise(resolve => setTimeout(resolve, 500));
      
  //     const newNotifications = Array.from(
  //       { length: PAGE_SIZE },
  //       (_, index) => ({
  //         id: (pageNum - 1) * PAGE_SIZE + index + 1,
  //         title: `Bildirim ${(pageNum - 1) * PAGE_SIZE + index + 1}`,
  //         description: `Bu bir örnek bildirim açıklamasıdır. #${(pageNum - 1) * PAGE_SIZE + index + 1}`,
  //         date: new Date(Date.now() - Math.random() * 10000000000).toLocaleDateString(),
  //         isRead: Math.random() > 0.3,
  //       })
  //     );

  //     // Toplam 100 bildirim olduğunu varsayalım
  //     if (pageNum * PAGE_SIZE >= 100) {
  //       setHasMore(false);
  //     }

  //     return newNotifications;
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // Filtreleme
  // const filteredNotifications = notifications.filter((notification) => {
  //   if (filter === "unread") return !notification.isRead;
  //   if (filter === "read") return notification.isRead;
  //   return true;
  // });

  // Intersection Observer ile sonsuz scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      async (entries) => {
        const target = entries[0];
        if (target.isIntersecting && hasMore && !loading) {
          const newNotifications = await getNotifications(page);
          setNotifications(prev => [...prev, ...newNotifications]);
          setPage(prev => prev + 1);
        }
      },
      {
        root: null,
        rootMargin: "20px",
        threshold: 0.1,
      }
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => observer.disconnect();
  }, [page, hasMore, loading]);

  // Filtre değiştiğinde sıfırla
  useEffect(() => {
    setNotifications([]);
    setPage(1);
    setHasMore(true);
    getNotifications(1).then(newNotifications => {
      setNotifications(newNotifications);
      setPage(2);
    });
  }, [filter]);

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Bildirimler</h1>
        <div className="flex items-center gap-4">
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
        </div>
      </div>

      <div className="grid gap-4">
        {notifications.map((notification, index) => (
          <Card
            key={`${notification.id}-${index}`}
            className={notification.isRead ? "bg-gray-50 dark:bg-gray-800/50" : ""}
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">{notification.content}</CardTitle>
                  <CardDescription className="text-sm text-gray-500">
                    {new Date(notification.created_at).toLocaleString()}
                  </CardDescription>
                </div>
                {/* {!notification.isRead && (
                  <span className="h-2 w-2 rounded-full bg-blue-500" />
                )} */}
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
        ))}

        {/* Loading indicator */}
        {hasMore && (
          <div
            ref={loaderRef}
            className="flex justify-center py-4"
          >
            {loading ? (
              <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
            ) : (
              <div className="h-6" />
            )}
          </div>
        )}

        {/* No more notifications message */}
        {!hasMore && notifications.length > 0 && (
          <p className="text-center text-gray-500">
            Tüm bildirimler yüklendi
          </p>
        )}

        {/* Empty state */}
        {notifications.length === 0 && !loading && (
          <div className="text-center text-gray-500">
            Bildirim bulunamadı
          </div>
        )}
      </div>
    </div>
  );
}
