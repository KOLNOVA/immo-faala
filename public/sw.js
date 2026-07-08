const CACHE_NAME = "immo-faala-v3";

self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.filter((name) => name !== CACHE_NAME).map((name) => caches.delete(name))
      );
    })
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(fetch(event.request).catch(() => caches.match(event.request)));
});

// Notifications push
self.addEventListener("push", (event) => {
  if (!event.data) return;
  const data = event.data.json();
  const options = {
    body: data.body || "",
    icon: "/images/logo-icon.jpg",
    badge: "/images/logo-icon.jpg",
    data: data.url || "/",
  };
  event.waitUntil(self.registration.showNotification(data.title || "Immo-Faala", options));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = event.notification.data || "/";
  event.waitUntil(clients.openWindow(url));
});
