// Rota haritası - her rotanın başlığını ve üst rotasını tanımlar
const routeMap = {
  '/': { title: 'Ana Sayfa', parent: null },
  '/notifications': { title: 'Bildirimler', parent: '/' },
  '/new-user': { title: 'Yeni Kullanıcı', parent: '/' },
  '/new-patient': { title: 'Yeni Hasta', parent: '/' },
  '/users': { title: 'Kullanıcı Listesi', parent: '/' },
  '/patients': { title: 'Hasta Listesi', parent: '/' },
  '/regions': { title: 'Bölge Listesi', parent: '/' },
  '/announcements': { title: 'Duyuru Listesi', parent: '/' },
};

export function generateBreadcrumbs(pathname) {
  const breadcrumbs = [];
  let currentPath = pathname;

  // Dinamik rotaları kontrol et (örn: /users/123)
  const dynamicRoute = Object.keys(routeMap).find(route => {
    const pattern = new RegExp(
      '^' + route.replace(/:\w+/g, '([^/]+)') + '(?:/|$)'
    );
    return pattern.test(currentPath);
  });

  if (dynamicRoute) {
    currentPath = dynamicRoute;
  }

  while (currentPath && routeMap[currentPath]) {
    breadcrumbs.unshift({
      path: currentPath,
      title: routeMap[currentPath].title,
    });
    currentPath = routeMap[currentPath].parent;
  }

  return breadcrumbs;
}
